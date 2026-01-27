import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";

/**
 * Submit contact form to HubSpot
 * Uses unauthenticated endpoint (works on free accounts)
 */
export async function POST(request: Request) {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, 5, 15 * 60 * 1000); // 5 requests per 15 minutes

    if (rateLimit.limited) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          },
        }
      );
    }

    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formGuid = process.env.HUBSPOT_FORM_GUID;

    if (!portalId || !formGuid) {
      console.error("HubSpot configuration missing:", {
        hasPortalId: !!portalId,
        hasFormGuid: !!formGuid,
        portalIdLength: portalId?.length || 0,
        formGuidLength: formGuid?.length || 0,
        nodeEnv: process.env.NODE_ENV,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error. Please contact support.",
        },
        { status: 500 }
      );
    }
    
    console.log("HubSpot configuration loaded:", {
      portalId: portalId.substring(0, 4) + "...",
      formGuid: formGuid.substring(0, 4) + "...",
    });

    const body = await request.json();
    const { firstname, email, lastname, message } = body;

    // reCAPTCHA removed - using rate limiting and HubSpot's built-in spam protection instead

    // Validate required fields
    if (!firstname || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "First name and email are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    // Build HubSpot form submission payload
    // Using format that matches embedded forms
    // objectTypeId "0-1" is required for contact fields
    interface HubSpotField {
      name: string;
      value: string;
      objectTypeId?: string;
    }

    const fields: HubSpotField[] = [
      {
        name: "firstname",
        value: firstname.trim(),
        objectTypeId: "0-1",
      },
      {
        name: "email",
        value: email.trim(),
        objectTypeId: "0-1",
      },
    ];

    // Add optional fields if provided
    if (lastname && lastname.trim()) {
      fields.push({
        name: "lastname",
        value: lastname.trim(),
        objectTypeId: "0-1",
      });
    }

    if (message && message.trim()) {
      fields.push({
        name: "message",
        value: message.trim(),
        objectTypeId: "0-1",
      });
    }

    // Get referer from request headers for page URI
    const referer = request.headers.get("referer") || "https://artemdyachuk.com/contact";
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    
    console.log("Request headers:", {
      referer,
      origin,
      host,
      userAgent: request.headers.get("user-agent")?.substring(0, 50),
    });

    // HubSpot may reject submissions if context fields aren't configured as form fields
    // Try without context first - if that works, we know context is the issue
    const payload = {
      fields,
      // Temporarily removing context to test if it's causing silent rejection
      // context: {
      //   pageUri: referer,
      //   pageName: "Contact Page",
      // },
    };
    
    // Log field values (masked for privacy)
    console.log("Payload fields:", fields.map(f => ({
      name: f.name,
      valueLength: f.value?.length || 0,
      hasValue: !!f.value && f.value.trim() !== "",
      objectTypeId: f.objectTypeId,
    })));
    
    console.log("Full payload being sent:", JSON.stringify(payload, null, 2));

    // Submit to HubSpot using unauthenticated endpoint
    const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
    
    console.log("Submitting to HubSpot:", {
      url: hubspotUrl.replace(portalId, "PORTAL_ID").replace(formGuid, "FORM_GUID"),
      fieldsCount: fields.length,
      hasEmail: !!fields.find(f => f.name === "email"),
      hasFirstname: !!fields.find(f => f.name === "firstname"),
      payload: JSON.stringify(payload, null, 2),
    });

    const response = await fetch(hubspotUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    
    // Log full HubSpot response for debugging
    console.log("HubSpot API Response:", JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      hasErrors: !!responseData.errors,
      errors: responseData.errors,
      inlineMessage: responseData.inlineMessage,
      redirectUri: responseData.redirectUri,
      submittedAt: responseData.submittedAt,
      portalId: responseData.portalId,
      fullResponse: responseData,
    }, null, 2));

    if (!response.ok) {
      console.error("HubSpot API HTTP error:", {
        status: response.status,
        statusText: response.statusText,
        responseData,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Failed to submit form. Please try again later.",
        },
        { status: response.status }
      );
    }

    // Check if there are errors in the response
    if (responseData.errors && responseData.errors.length > 0) {
      console.error("HubSpot form validation errors:", responseData.errors);
      return NextResponse.json(
        {
          success: false,
          error: "Form submission failed. Please check your information and try again.",
        },
        { status: 400 }
      );
    }

    // HubSpot success indicators:
    // - redirectUri: present when form has redirect configured
    // - inlineMessage: can be empty string "" which means success but no custom message
    // - If inlineMessage is undefined (not present), that's different from empty string
    // Empty inlineMessage ("") = successful submission, just no custom message configured
    // undefined inlineMessage = might be an issue, but if no errors, still likely successful
    const hasRedirectUri = responseData.redirectUri && responseData.redirectUri.trim() !== "";
    const hasInlineMessage = responseData.inlineMessage !== undefined; // Empty string "" is valid success
    const hasSuccessIndicator = hasRedirectUri || hasInlineMessage;
    
    // If we got 200, no errors, and have success indicators (even empty inlineMessage), it's successful
    // If no indicators but also no errors, still consider successful (some forms don't configure messages)
    if (!hasSuccessIndicator) {
      // No success indicators at all - this is unusual but might still be OK if no errors
      // Log for investigation but don't fail if there are no errors
      if (isDevelopment) {
        console.warn("HubSpot returned 200 with no success indicators (inlineMessage/redirectUri), but no errors either. Assuming success:", {
          responseData,
          payload: { fields: fields.length, context: payload.context },
        });
      }
    }
    
    // If we got here, we have 200 status and no errors - submission is successful

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
        hubspotResponse: responseData,
      },
      {
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetTime.toString(),
        },
      }
    );
  } catch (error) {
    if (isDevelopment) {
      console.error("Form submission error:", error);
    }
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
