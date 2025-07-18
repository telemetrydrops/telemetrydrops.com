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