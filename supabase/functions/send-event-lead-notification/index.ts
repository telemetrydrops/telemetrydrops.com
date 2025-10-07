import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EventLeadRequest {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message?: string;
  eventId: string;
  eventName: string;
  eventCity: string;
  eventStartDate: string;
  eventEndDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      name,
      email,
      company,
      role,
      message,
      eventId,
      eventName,
      eventCity,
      eventStartDate,
      eventEndDate,
    }: EventLeadRequest = await req.json();

    console.log(
      `Received event lead for ${name} (${email}) for event: ${eventName} (${eventCity})`
    );

    const formattedDateRange = eventEndDate
      ? `${eventStartDate} → ${eventEndDate}`
      : eventStartDate;

    const emailResponse = await resend.emails.send({
      from: "Dose de Telemetria <contact@dosedetelemetria.com>",
      to: ["contact@dosedetelemetria.com"],
      subject: `New event lead - ${eventName}`,
      html: `
        <h1>New event lead</h1>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Event ID:</strong> ${eventId}</p>
        <p><strong>Location:</strong> ${eventCity}</p>
        <p><strong>Date:</strong> ${formattedDateRange}</p>
        <hr />
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        ${role ? `<p><strong>Role:</strong> ${role}</p>` : ""}
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString("en-US")}</p>
      `,
    });

    console.log("Event lead email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-event-lead-notification function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
