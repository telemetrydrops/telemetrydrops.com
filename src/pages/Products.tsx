
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import Testimonial from "@/components/Testimonial";
import { productData } from "@/data/product-data";
import { getRandomTestimonials } from "@/data/testimonial-data";
import { SEO } from "@/components/SEO";
import { seoData } from "@/data/seo-data";

const Products = () => {
  // Get two random testimonials
  const testimonials = getRandomTestimonials(2);
  
  return (
    <>
      <SEO 
        title={seoData.products.title}
        description={seoData.products.description}
        keywords={seoData.products.keywords}
        canonical="/products"
        jsonLd={seoData.products.jsonLd}
      />
      <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-telemetria-darker">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-telemetria-dark">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.1),transparent_70%)]"></div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-telemetria-orange/30 to-transparent"></div>
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Our <span className="bg-gradient-to-r from-telemetria-orange via-orange-400 to-yellow-400 bg-clip-text text-transparent">Products</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                High-quality courses and specializations in OpenTelemetry (OTel) to boost your career in observability
              </p>
              <div className="mt-8 flex justify-center">
                <a href="#products" className="text-white/70 hover:text-telemetria-orange transition-colors animate-bounce">
                  <ArrowDown className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="products" className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeading
            title="Discover our products"
            subtitle="Developed by experts to meet your learning needs"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch">
            {productData.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                description={product.description}
                features={product.features}
                price={product.price}
                ctaText={product.available ? "View details" : "Join waitlist"}
                ctaLink={`/products/${product.slug}`}
                available={true} // Always true since we're linking to product detail
                popular={product.popular}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="section-padding bg-telemetria-darker">
        <div className="container-custom">
          <SectionHeading
            title="What our students say"
            subtitle="See how our courses are transforming careers"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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

      {/* Comparativo */}
      <section className="section-padding bg-telemetria-dark">
        <div className="container-custom">
          <SectionHeading
            title="Which course is right for you?"
            subtitle="Compare our offerings and choose the one that best meets your needs"
            centered
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-spacing-0 max-w-4xl mx-auto">
              <thead>
                <tr>
                  <th className="py-4 px-6 text-left"></th>
                  <th className="py-4 px-6 text-center text-lg font-semibold">OTel Specialization</th>
                  <th className="py-4 px-6 text-center text-lg font-semibold">OTel Track</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="bg-telemetria-dark/50">
                  <td className="py-4 px-6 text-white">Format</td>
                  <td className="py-4 px-6 text-center text-white/80">Cohort with defined dates</td>
                  <td className="py-4 px-6 text-center text-white/80">Self-study</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-white">Duration</td>
                  <td className="py-4 px-6 text-center text-white/80">8 weeks</td>
                  <td className="py-4 px-6 text-center text-white/80">Your pace</td>
                </tr>
                <tr className="bg-telemetria-dark/50">
                  <td className="py-4 px-6 text-white">Mentoring</td>
                  <td className="py-4 px-6 text-center text-white/80">Yes, weekly</td>
                  <td className="py-4 px-6 text-center text-white/80">No</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-white">Practical projects</td>
                  <td className="py-4 px-6 text-center text-white/80">Yes, with feedback</td>
                  <td className="py-4 px-6 text-center text-white/80">Yes, guided</td>
                </tr>
                <tr className="bg-telemetria-dark/50">
                  <td className="py-4 px-6 text-white">Certificate</td>
                  <td className="py-4 px-6 text-center text-white/80">Yes</td>
                  <td className="py-4 px-6 text-center text-white/80">Yes</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-white">Price</td>
                  <td className="py-4 px-6 text-center font-semibold text-white">€2,497</td>
                  <td className="py-4 px-6 text-center font-semibold text-white">€597</td>
                </tr>
                <tr className="bg-telemetria-dark/50">
                  <td className="py-4 px-6 text-white">Availability</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      Coming soon
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      Available
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6">Still have questions?</h3>
            <p className="text-white/80 mb-8">
              Contact us and we'll be happy to help you choose the most suitable product for your current situation and goals.
            </p>
            <Button 
              asChild
              size="lg" 
              className="bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90"
            >
              <a href="mailto:contact@telemetrydrops.com">
                Contact us
              </a>
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Products;
