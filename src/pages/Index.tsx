
import { Link } from "react-router-dom";
import { ArrowRight, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import VideoEmbed from "@/components/VideoEmbed";

const Index = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-telemetria-darker">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-telemetria-dark">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.1),transparent_70%)]"></div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-telemetria-orange/30 to-transparent"></div>
        </div>

        <div className="container-custom relative z-10 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <div className="inline-block mb-4">
                <img 
                  src="/logo.svg" 
                  alt="Telemetry Drops Logo" 
                  className="h-24 w-24 animate-pulse-subtle"
                />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Become an <span className="bg-gradient-to-r from-telemetria-orange via-orange-400 to-yellow-400 bg-clip-text text-transparent">OpenTelemetry</span> expert in your company.
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Learn all aspects of OpenTelemetry, including the main semantic conventions, API, SDK, Collector, Operator, and much more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90"
                >
                  <Link to="/products">
                    Explore our products
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <a href="#products" className="text-white/50 hover:text-white transition-colors">
            <ArrowRight className="h-6 w-6 rotate-90" />
          </a>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeading
            title="Our Products"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            <div className="glass-morphism rounded-xl p-8 flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-4">OTel Specialization</h3>
              <div className="inline-block ml-0 mb-4 px-3 py-1 bg-telemetria-orange/10 border border-telemetria-orange/20 text-xs rounded-full text-telemetria-orange">
                Coming soon
              </div>
              <p className="text-white/80 mb-6">
                Intensive training with closed groups, live mentoring and practical projects. Develop 
                advanced skills in OpenTelemetry with specialized guidance.
              </p>
              <div className="mt-auto">
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full border-telemetria-orange/30 text-telemetria-orange hover:bg-telemetria-orange hover:text-telemetria-dark hover:border-telemetria-orange"
                >
                  <Link to="/products#specialization">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="glass-morphism rounded-xl p-8 flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-4">OTel Track</h3>
              <div className="inline-block ml-0 mb-4 px-3 py-1 bg-telemetria-orange/20 border border-telemetria-orange/30 text-xs rounded-full text-telemetria-orange">
                Available now
              </div>
              <p className="text-white/80 mb-6">
                Complete course available at your own pace, with recorded lessons, practical exercises and lifetime access. 
                From basic to advanced in observability and instrumentation.
              </p>
              <div className="mt-auto">
                <Button 
                  asChild
                  className="w-full bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90"
                >
                  <Link to="/products#track">
                    Explore course <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Channel */}
      <section className="section-padding bg-telemetria-dark">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="animate-fade-in-right">
                <SectionHeading
                  title="Our YouTube Channel"
                  subtitle="Live every second Friday, 15:00 CET / 9:00 AM EST."
                />
                <div className="space-y-6">
                  <p className="text-white/80">
                    Subscribe to our channel and receive notifications for new videos, with in-depth, updated content in English about Monitoring, Observability, Telemetry and OpenTelemetry.
                  </p>
                  <div className="flex space-x-4">
                    <Button 
                      asChild
                      className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white"
                    >
                      <a href="https://www.youtube.com/@TelemetryDrops" target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2 h-5 w-5" /> Subscribe
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <VideoEmbed 
                videoId="spdwPokz01w" 
                title="" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* LinkedIn */}
      <section className="section-padding bg-telemetria-darker border-t border-white/5">
        <div className="container-custom text-center">
          <SectionHeading
            title="Connect with Us"
            subtitle="Follow us on LinkedIn for updates, tips and opportunities"
            centered
          />
          <Button 
            asChild
            size="lg" 
            className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white"
          >
            <a href="https://www.linkedin.com/company/telemetrydrops" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
              <Linkedin className="mr-2 h-5 w-5" /> Follow on LinkedIn
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
