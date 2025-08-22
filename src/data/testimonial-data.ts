export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
  productIds?: string[]; // For linking testimonials to specific products
}

export const testimonialData: Testimonial[] = [
  {
    id: "willian",
    quote: "I've been an SRE for 6 years, the immersion was phenomenal. Juraci is one of the minds behind OpenTelemetry, very detailed, he breaks down point by point. Being one of the creators, he can really go deep. Expectations successfully exceeded!",
    author: "Willian Saavedra",
    role: "Site Reliability Engineer",
    company: "Itaú",
    avatarUrl: "/testimonials/willian.webp",
    productIds: ["track", "specialization"]
  },
  {
    id: "claudio",
    quote: "Very instructive, well aligned with my future perspectives, both technically and managerially. The future of observability has matured into a standard, and this standard is OpenTelemetry.",
    author: "Cláudio Bastos",
    role: "CTO",
    company: "Mensis Tecnologia",
    avatarUrl: "/testimonials/claudio.webp",
    productIds: ["specialization"]
  },
  {
    id: "mateus",
    quote: "I was able to go deeper and ask questions, it exceeded my expectations, I had several insights from what Juraci brought.",
    author: "Mateus Santos",
    role: "CTO",
    company: "Vericode",
    avatarUrl: "/testimonials/mateus.webp",
    productIds: ["track", "specialization"]
  },
  {
    id: "rafael",
    quote: "I already had experience with OpenTelemetry, more specific to the Collector, but it was interesting to be able to deepen my knowledge in the instrumentation part. I'm leaving with much more knowledge than I expected.",
    author: "Rafael Gumiero",
    role: "Principal Engineer",
    company: "PicPay",
    avatarUrl: "/testimonials/rafael.webp",
    productIds: ["track"]
  },
  {
    id: "ezequiel",
    quote: "The course goes far beyond theory. From observability fundamentals to advanced topics like manual instrumentation, OpenTelemetry Operator, and understanding the OTel API - each module has direct application in my daily work. Every day I use something I learned, whether implementing the Collector at scale, adjusting telemetry pipelines, or helping other teams with instrumentation. This course is transforming my mindset about observability and how to apply it practically for real-world results.",
    author: "Ezequiel de Souza Barros",
    role: "Observability Specialist",
    company: "PagBank",
    avatarUrl: "/testimonials/ezequiel.webp",
    productIds: ["track"]
  },
  {
    id: "kaio",
    quote: "Working in AIOps, I needed deep OpenTelemetry knowledge for our implementation. After taking several courses that only scratched the surface, I discovered Dose de Telemetria on YouTube. Just one video showed me the content was far richer than any course I'd taken. When I found out about your course, I knew immediately I'd found exactly what I was looking for. The content is incredible!",
    author: "Kaio Fonseca",
    role: "AIOps Specialist",
    company: "Bradesco",
    avatarUrl: "/testimonials/kaio.webp",
    productIds: ["track"]
  },
  {
    id: "diogo",
    quote: "The specialization course made a total difference in advancing my career to an international company with OpenTelemetry at its core. The deep technical content goes beyond the surface level - I'm now the Technical Reference for OpenTelemetry at my company. Having direct access to knowledge from someone connected to the OpenTelemetry source has transformed my ability to solve complex problems and be a reference for others. This course directly enabled my international career move.",
    author: "Diogo Amaral",
    role: "Site Reliability Engineer",
    company: "dLocal",
    avatarUrl: "/testimonials/diogo.webp",
    productIds: ["track", "specialization"]
  },
  {
    id: "marcos",
    quote: "Searching for deep, practical OpenTelemetry content in Portuguese led me to this course. The well-structured curriculum progresses from fundamentals through API, SDK, Collector, and Operator with clear examples and real applications. I'm implementing OpenTelemetry at work, and being able to ask specific questions on the platform - which often generate additional content - is a true differentiator. I'm applying the new knowledge immediately and evolving significantly.",
    author: "Marcos Muniz",
    role: "Software Engineer",
    productIds: ["track"]
  }
];

// Helper functions to get testimonials
export const getProductTestimonials = (productId: string, limit?: number): Testimonial[] => {
  const filtered = testimonialData.filter(t => !t.productIds || t.productIds.includes(productId));
  return limit ? filtered.slice(0, limit) : filtered;
};

export const getRandomTestimonials = (limit: number): Testimonial[] => {
  const shuffled = [...testimonialData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};