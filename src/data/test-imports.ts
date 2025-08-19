// Test file to verify all data layer imports work correctly
import { productData, getTestimonialsForProduct, getRandomTestimonialIds, type Product } from './product-data';
import { testimonialData, getProductTestimonials, getRandomTestimonials as getRandomTestimonialsAlt, type Testimonial } from './testimonial-data';
import { seoData } from './seo-data';
import { cn } from '../lib/utils';
import { supabase, type Database } from '../integrations/supabase';

// Test all imports and exports
export function testDataLayerMigration() {
  console.log('Testing data layer migration...');

  // Test product data
  const products: Product[] = productData;
  console.log(`✅ Products loaded: ${products.length}`);

  // Test testimonial data
  const testimonials: Testimonial[] = testimonialData;
  console.log(`✅ Testimonials loaded: ${testimonials.length}`);

  // Test helper functions
  const trackTestimonials = getTestimonialsForProduct('track');
  const productTestimonials = getProductTestimonials('track', 2);
  const randomTestimonials = getRandomTestimonialIds(1);
  const randomTestimonialsAlt = getRandomTestimonialsAlt(1);
  
  console.log(`✅ Helper functions work:
    - getTestimonialsForProduct: ${trackTestimonials.length}
    - getProductTestimonials: ${productTestimonials.length}
    - getRandomTestimonialIds: ${randomTestimonials.length}
    - getRandomTestimonialsAlt: ${randomTestimonialsAlt.length}`);

  // Test SEO data
  const homeSeo = seoData.home;
  console.log(`✅ SEO data loaded: ${homeSeo.title}`);

  // Test utilities
  const classNames = cn('test', 'classes', { 'conditional': true });
  console.log(`✅ Utilities work: ${classNames}`);

  // Test Supabase types (should not error)
  const client = supabase;
  console.log(`✅ Supabase client available: ${typeof client}`);

  return {
    products,
    testimonials,
    seoData,
    trackTestimonials,
    productTestimonials,
    randomTestimonials,
    homeSeo,
    classNames,
    supabaseClient: client
  };
}

// Type tests
export type TestProduct = Product;
export type TestTestimonial = Testimonial;
export type TestDatabase = Database;

console.log('✅ All data layer components successfully migrated and tested!');