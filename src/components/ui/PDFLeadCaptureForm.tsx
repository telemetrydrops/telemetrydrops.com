import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Download, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PDFLeadCaptureFormProps {
  resourceName: string;
  resourceDescription: string;
}

const PDFLeadCaptureForm = ({ resourceName, resourceDescription }: PDFLeadCaptureFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);
    setError(null);

    try {
      // Store lead capture in Supabase using the pdf_leads table
      const { error: dbError } = await supabase
        .from("pdf_leads")
        .insert({
          name: formData.name,
          email: formData.email,
          resource_name: resourceName,
          resource_type: "cheatsheet",
          source: "website",
        });

      if (dbError) throw dbError;

      // Send email notification (optional - can be implemented later)
      try {
        await supabase.functions.invoke('send-pdf-download-notification', {
          body: {
            name: formData.name,
            email: formData.email,
            resourceName,
          },
        });
      } catch (emailError) {
        // Email notification is optional, don't fail the whole process
        console.warn("Email notification failed:", emailError);
      }

      // Trigger PDF download immediately
      const link = document.createElement('a');
      link.href = '/ottl-cheatsheet.pdf';
      link.download = 'OTTL-Quick-Reference-Cheatsheet.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success state
      setIsSubmitted(true);

      toast({
        title: "Success!",
        description: "Your OTTL cheatsheet is downloading now!",
      });

    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || "An error occurred while processing your request. Please try again.");
      toast({
        title: "Error",
        description: "An error occurred while processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-telemetria-dark/50 p-8 border border-white/10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold mb-4">Download Started!</h3>
        <p className="text-white/80 mb-6">
          Thank you for downloading the {resourceName}. Your download should start automatically. If it doesn't, you can{' '}
          <a href="/ottl-cheatsheet.pdf" download="OTTL-Quick-Reference-Cheatsheet.pdf" className="text-telemetria-orange hover:underline">
            click here to download
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-telemetria-dark/50 p-8 border border-white/10">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-telemetria-orange/10 border border-telemetria-orange/20">
            <Download className="h-8 w-8 text-telemetria-orange" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-2">Download Your Free Cheatsheet</h3>
        <p className="text-white/80">
          {resourceDescription}
        </p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-white rounded-md p-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-white/80 mb-2 block">
            Full Name
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="pl-12 h-12 bg-telemetria-darker border-white/20 text-white placeholder:text-white/50 focus:border-telemetria-orange"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-white/80 mb-2 block">
            Email Address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              className="pl-12 h-12 bg-telemetria-darker border-white/20 text-white placeholder:text-white/50 focus:border-telemetria-orange"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90 font-semibold text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-telemetria-dark"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Get My Free Cheatsheet
            </div>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-white/60">
            By downloading, you agree to receive emails about OpenTelemetry resources and training.
            <br />
            You can unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </form>
    </div>
  );
};

export default PDFLeadCaptureForm;