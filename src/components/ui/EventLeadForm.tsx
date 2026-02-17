import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, User, Building2, Briefcase, MessageSquare, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EventLeadFormProps {
  eventId: string;
  eventName: string;
  eventCity: string;
  eventStartDate: string;
  eventEndDate?: string;
}

const EventLeadForm = ({
  eventId,
  eventName,
  eventCity,
  eventStartDate,
  eventEndDate,
}: EventLeadFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from("event_leads").insert({
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        role: formData.role || null,
        message: formData.message || null,
        event_id: eventId,
        event_name: eventName,
        event_city: eventCity,
        event_start_date: eventStartDate,
        event_end_date: eventEndDate ?? null,
      });

      if (dbError) throw dbError;

      const response = await supabase.functions.invoke(
        "send-event-lead-notification",
        {
          body: {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            role: formData.role,
            message: formData.message,
            eventId,
            eventName,
            eventCity,
            eventStartDate,
            eventEndDate,
          },
        }
      );

      if (response.error) throw new Error(response.error.message);

      setIsSubmitted(true);

      // Track successful event registration in PostHog
      window.posthog?.capture('event_registration_submitted', {
        event_id: eventId,
        event_name: eventName,
        event_city: eventCity,
        event_start_date: eventStartDate,
        has_company: !!formData.company,
        has_role: !!formData.role,
        has_message: !!formData.message,
      });

      // Identify user by email for future correlation
      window.posthog?.identify(formData.email, {
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        role: formData.role || undefined,
      });

      toast({
        title: "Thanks for your interest!",
        description: "We'll get in touch with workshop details shortly.",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while submitting your information. Please try again.";
      console.error("Error submitting event lead form:", err);
      setError(errorMessage);

      // Track error in PostHog
      window.posthog?.capture('event_registration_error', {
        event_id: eventId,
        event_name: eventName,
        event_city: eventCity,
        error_message: errorMessage,
      });

      // Capture exception for error tracking
      if (err instanceof Error) {
        window.posthog?.captureException(err, {
          event_id: eventId,
          event_name: eventName,
        });
      }

      toast({
        title: "Unable to submit",
        description:
          "We couldn't process your submission. Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-telemetria-dark/50 p-8 border border-white/10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Submission received!</h3>
        <p className="text-white/80 mb-4">
          Thank you for your interest in {eventName}. We’ll reach out with next
          steps soon.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-telemetria-dark/50 p-8 border border-white/10">
      <h3 className="text-xl font-semibold mb-2">Save your spot</h3>
      <p className="text-white/80 mb-6">
        Leave your details and we’ll follow up with registration information and
        early-bird updates for the workshop in {eventCity}.
      </p>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-white rounded-md p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-white/80 mb-1.5">
            Full name
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-white/80 mb-1.5">
            Email
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="company" className="text-white/80 mb-1.5">
            Company (optional)
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Building2 className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Where you work"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="role" className="text-white/80 mb-1.5">
            Role (optional)
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Briefcase className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="What you do"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="text-white/80 mb-1.5">
            Message (optional)
          </Label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </div>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Share goals or questions for the workshop"
              className="pl-10 min-h-[100px]"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Notify me"}
        </Button>

        <p className="text-xs text-white/60 text-center mt-4">
          By submitting, you agree to occasional emails about this workshop and
          related Telemetria training. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
};

export default EventLeadForm;
