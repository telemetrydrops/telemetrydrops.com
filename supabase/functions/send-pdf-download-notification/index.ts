import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PDFDownloadRequest {
  name: string;
  email: string;
  resourceName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, resourceName }: PDFDownloadRequest = await req.json();

    // Validate required fields
    if (!name || !email || !resourceName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, resourceName" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`PDF download notification for ${name} (${email}) - Resource: ${resourceName}`);

    // Send email notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Dose de Telemetria <contact@dosedetelemetria.com>",
      to: ["contact@dosedetelemetria.com"],
      subject: `New PDF download - ${resourceName}`,
      html: `
        <h1>New PDF download</h1>
        <p><strong>Resource:</strong> ${resourceName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString('en-US')}</p>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Send thank you email to user
    const userEmailResponse = await resend.emails.send({
      from: "Dose de Telemetria <contact@dosedetelemetria.com>",
      to: [email],
      subject: `Thank you for downloading ${resourceName}`,
      html: `
        <h1>Thank you for downloading the ${resourceName}!</h1>

        <p>Dear ${name},</p>

        <p>Thank you for downloading the <strong>${resourceName}</strong>!</p>

        <p>This comprehensive reference guide will help you master OpenTelemetry Transformation Language (OTTL) with:</p>
        <ul>
          <li>Core syntax and data types</li>
          <li>15+ essential functions</li>
          <li>Common patterns and snippets</li>
          <li>Regex patterns for OTTL</li>
          <li>Troubleshooting checklist</li>
          <li>Performance best practices</li>
        </ul>

        <p>We hope this resource proves valuable in your OpenTelemetry journey.</p>

        <p>If you have any questions or feedback, please don't hesitate to reach out to us at <a href="mailto:contact@telemetrydrops.com">contact@telemetrydrops.com</a>.</p>

        <p>Best regards,<br>
        The TelemetryDrops Team</p>

        <hr>
        <p><small>TelemetryDrops - OpenTelemetry Training & Resources<br>
        <a href="https://telemetrydrops.com">https://telemetrydrops.com</a></small></p>
      `,
    });

    console.log("User thank you email sent:", userEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        adminEmail: adminEmailResponse,
        userEmail: userEmailResponse,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-pdf-download-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);