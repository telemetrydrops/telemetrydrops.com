import React from "react";
import { Separator } from "@/components/ui/separator";
import SectionHeading from "@/components/SectionHeading";

const PrivacyPolicy = () => {
  return (
    <div className="bg-telemetria-dark min-h-screen">
      <div className="container-custom py-16 md:py-24 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        <Separator className="bg-telemetria-yellow/30 mb-8" />

        <div className="bg-telemetria-darker border border-white/5 rounded-xl p-6 md:p-8 max-w-4xl">
          <div className="space-y-10">
            <section>
              <SectionHeading 
                title="1. Introduction" 
                className="mb-4"
              />
              <p className="text-white/80">
                Telemetry Drops is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our services, including our website and digital products.
              </p>
            </section>

            <section>
              <SectionHeading 
                title="2. Information We Collect" 
                className="mb-4"
              />
              <p className="text-white/80 mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 text-white/80 space-y-2">
                <li><strong>Personal identification information:</strong> Name, email address, phone number, payment information, and address.</li>
                <li><strong>Usage information:</strong> How you interact with our website, products, and services.</li>
                <li><strong>Device information:</strong> Browser type, IP address, operating system, and other technologies on devices you use to access our site.</li>
                <li><strong>Cookies and similar technologies:</strong> We use cookies and similar technologies to collect information about your browsing on our site.</li>
              </ul>
            </section>

            <section>
              <SectionHeading 
                title="3. How We Use Your Information" 
                className="mb-4"
              />
              <p className="text-white/80 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-5 text-white/80 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related notifications</li>
                <li>Send marketing communications, when permitted</li>
                <li>Personalize your experience on our site</li>
                <li>Protect against, identify, and prevent fraud and other illegal activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <SectionHeading 
                title="4. Information Sharing" 
                className="mb-4"
              />
              <p className="text-white/80 mb-4">
                We may share your personal information with:
              </p>
              <ul className="list-disc pl-5 text-white/80 space-y-2">
                <li><strong>Service providers:</strong> Third parties that help us operate our business and provide services (payment processors, hosting services, etc.).</li>
                <li><strong>Business partners:</strong> Companies we collaborate with to offer products or services.</li>
                <li><strong>Legal compliance:</strong> When necessary to comply with a legal obligation, legal process, or government request.</li>
              </ul>
              <p className="text-white/80 mt-4">
                We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <SectionHeading 
                title="5. Data Security" 
                className="mb-4"
              />
              <p className="text-white/80">
                We implement technical and organizational security measures to protect your personal information against unauthorized access, accidental loss, or destruction. However, no data transmission over the Internet or storage system can guarantee 100% security.
              </p>
            </section>

            <section>
              <SectionHeading 
                title="6. Your Rights" 
                className="mb-4"
              />
              <p className="text-white/80 mb-4">
                Under the General Data Protection Regulation (GDPR) and other applicable laws, you have the following rights:
              </p>
              <ul className="list-disc pl-5 text-white/80 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete data</li>
                <li>Deletion of your personal data</li>
                <li>Restriction or objection to processing of your data</li>
                <li>Data portability</li>
                <li>Withdrawal of consent at any time</li>
              </ul>
              <p className="text-white/80 mt-4">
                To exercise these rights, contact us via email: contact@telemetrydrops.com
              </p>
            </section>

            <section>
              <SectionHeading 
                title="7. Data Retention" 
                className="mb-4"
              />
              <p className="text-white/80">
                We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section>
              <SectionHeading 
                title="8. Updates to This Policy" 
                className="mb-4"
              />
              <p className="text-white/80">
                We may update this Privacy Policy periodically. The most recent version will always be available on our website, with the date of the last update. We recommend that you review this policy regularly.
              </p>
            </section>

            <section>
              <SectionHeading 
                title="9. Contact" 
                className="mb-4"
              />
              <p className="text-white/80">
                If you have questions or concerns about this Privacy Policy or our privacy practices, contact us via email: contact@telemetrydrops.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;