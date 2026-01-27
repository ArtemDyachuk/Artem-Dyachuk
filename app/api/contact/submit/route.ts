import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";

/**
 * Verify reCAPTCHA v3 token with Google
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not set, skipping verification");
    return true; // Allow submission if reCAPTCHA not configured
  }

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();
    
    // Log for debugging
    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data);
      
      // In development, allow browser-error (localhost issues)
      if (isDevelopment && data["error-codes"]?.includes("browser-error")) {
        console.warn("reCAPTCHA browser-error in development - allowing submission");
        return true;
      }
    }
    
    // reCAPTCHA v3 returns a score (0.0 to 1.0), 0.3 is the threshold
    const score = data.score || 0;
    const isValid = data.success === true && score >= 0.3;
    
    if (!isValid && data.success) {
      console.warn("reCAPTCHA score too low:", score, "Threshold: 0.3");
    }
    
    return isValid;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    // In development, allow on network errors
    if (isDevelopment) {
      console.warn("reCAPTCHA network error in development - allowing submission");
      return true;
    }
    return false;
  }
}

/**
 * Submit contact form to HubSpot
 * Uses unauthenticated endpoint (works on free accounts)
 */
export async function POST(request: Request) {
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
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error. Please contact support.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { firstname, email, lastname, message, recaptchaToken } = body;

    // Verify reCAPTCHA (skip in development if browser-error occurs)
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!recaptchaToken) {
        // In development, allow without token (for testing)
        if (isDevelopment) {
          console.warn("reCAPTCHA token missing in development - allowing submission");
        } else {
          return NextResponse.json(
            {
              success: false,
              error: "reCAPTCHA verification failed. Please refresh the page and try again.",
            },
            { status: 400 }
          );
        }
      } else {
        const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
        if (!isValidRecaptcha) {
          // In development with browser-error, we already handled it in verifyRecaptcha
          // But if it's a real failure, still block it
          return NextResponse.json(
            {
              success: false,
              error: "reCAPTCHA verification failed. Please try again.",
            },
            { status: 400 }
          );
        }
      }
    }

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
    interface HubSpotField {
      name: string;
      value: string;
    }

    const fields: HubSpotField[] = [
      {
        name: "firstname",
        value: firstname.trim(),
      },
      {
        name: "email",
        value: email.trim(),
      },
    ];

    // Add optional fields if provided
    if (lastname && lastname.trim()) {
      fields.push({
        name: "lastname",
        value: lastname.trim(),
      });
    }

    if (message && message.trim()) {
      fields.push({
        name: "message",
        value: message.trim(),
      });
    }

    // Get referer from request headers for page URI
    const referer = request.headers.get("referer") || "https://artemdyachuk.com/contact";

    const payload = {
      fields,
      context: {
        pageUri: referer,
        pageName: "Contact Page",
      },
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

    if (!response.ok) {
      console.error("HubSpot API error:", responseData);
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
      console.error("HubSpot form errors:", responseData.errors);
      return NextResponse.json(
        {
          success: false,
          error: "Form submission failed. Please check your information and try again.",
        },
        { status: 400 }
      );
    }

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
    console.error("Form submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
