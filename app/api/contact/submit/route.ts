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
    
    // Configuration loaded successfully (no need to log in production)

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
    // objectTypeId "0-1" is required for contact fields
    interface HubSpotField {
      name: string;
      value: string;
      objectTypeId: string;
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

    // HubSpot rejects submissions if context fields (pageUri, pageName) are included
    // but not configured as form fields. Only send fields array.
    const payload = {
      fields,
    };

    // Submit to HubSpot using unauthenticated endpoint
    const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    const response = await fetch(hubspotUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    // Handle errors
    if (!response.ok) {
      console.error("HubSpot API HTTP error:", {
        status: response.status,
        statusText: response.statusText,
        errors: responseData.errors,
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

    // HubSpot returns 200 with empty inlineMessage ("") for successful submissions
    // If we got here with 200 and no errors, submission was successful

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
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
