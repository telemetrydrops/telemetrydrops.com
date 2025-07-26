
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import Testimonial from "@/components/Testimonial";
import { useEffect, useState } from "react";
import { productData } from "@/data/product-data";
import { getProductTestimonials } from "@/data/testimonial-data";
import LeadCaptureForm from "@/components/LeadCaptureForm";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  
  useEffect(() => {
    const foundProduct = productData.find(p => p.slug === slug);
    setProduct(foundProduct);
    
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="container-custom py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button asChild variant="outline">
          <Link to="/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  // Get three specific testimonials for this product
  const testimonials = getProductTestimonials(product.id, 3);

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

        <div className="container-custom relative z-10 py-16 md:py-20">
          <Link 
            to="/products" 
            className="inline-flex items-center text-white/70 hover:text-telemetria-orange transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to products
          </Link>

          <div className="max-w-4xl">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                {product.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-6 max-w-3xl">
                {product.fullDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <div className="text-3xl font-bold">{product.price}</div>
                {product.available ? (
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90 font-medium"
                  >
                    <a href={product.ctaLink} target="_blank" rel="noopener noreferrer">
                      {product.ctaText}
                    </a>
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="bg-white/20 text-white hover:bg-telemetria-orange/90 hover:text-telemetria-dark font-medium"
                    disabled={false}
                    onClick={() => {
                      const waitlistSection = document.querySelector('.section-padding.bg-telemetria-darker');
                      if (waitlistSection) {
                        waitlistSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {product.ctaText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeading
            title="What you'll learn"
            subtitle="Discover the complete course content and skills you'll develop"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.detailedFeatures?.map((feature: any, index: number) => (
              <div key={index} className="bg-telemetria-dark/50 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form (only for unavailable products) */}
      {!product.available && (
        <section className="section-padding bg-telemetria-darker">
          <div className="container-custom">
            <div className="max-w-lg mx-auto">
              <LeadCaptureForm productId={product.id} productName={product.title} />
            </div>
          </div>
        </section>
      )}

      {/* Depoimentos */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeading
            title="What our students say"
            subtitle="Real experiences from those who have already learned with us"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <Testimonial
                key={testimonial.id}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                company={testimonial.company}
                avatarUrl={testimonial.avatarUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section-padding bg-telemetria-dark">
        <div className="container-custom">
          <SectionHeading
            title="Course modules"
            subtitle="Content organized progressively to facilitate your learning"
            centered
          />

          <div className="max-w-3xl mx-auto space-y-6">
            {product.curriculum?.map((module: any, index: number) => (
              <div key={index} className="bg-telemetria-darker/70 rounded-lg border border-white/10 overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <h3 className="text-xl font-bold flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-telemetria-orange/20 text-telemetria-orange mr-3 text-sm">
                      {index + 1}
                    </span>
                    {module.title}
                  </h3>
                </div>
                <div className="p-5 space-y-3">
                  {module.lessons.map((lesson: any, idx: number) => (
                    <div key={idx} className="flex items-start">
                      <span className="mr-3 w-6 h-6 flex-shrink-0 bg-secondary/50 rounded-full flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      <span className="text-white/80">{lesson}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to start your <span className="bg-gradient-to-r from-telemetria-orange via-orange-400 to-yellow-400 bg-clip-text text-transparent">OpenTelemetry</span> journey?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Master observability and OpenTelemetry and stand out in the market with skills that are in high demand.
            </p>
            {product.available ? (
              <Button 
                asChild
                size="lg" 
                className="bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90 font-medium"
              >
                <a href={product.ctaLink} target="_blank" rel="noopener noreferrer">
                  {product.ctaText}
                </a>
              </Button>
            ) : (
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="bg-white/20 text-white hover:bg-telemetria-orange/90 hover:text-telemetria-dark font-medium"
                  disabled={false}
                  onClick={() => {
                    const waitlistSection = document.querySelector('.section-padding.bg-telemetria-darker');
                    if (waitlistSection) {
                      waitlistSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {product.ctaText}
                </Button>
                {!product.available && (
                  <div className="pt-2">
                    <p className="text-sm text-white/70">
                      This course is not yet available for purchase. Sign up for the waitlist above to be notified when we open new spots.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
