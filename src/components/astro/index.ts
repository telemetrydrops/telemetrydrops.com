// Pure Astro components for server-side rendering
// These components are written in .astro format and render on the server

// Layout components
export { default as Layout } from '../../layouts/Layout.astro';
export { default as SEO } from './SEO.astro';

// Navigation components
export { default as Navbar } from './Navbar.astro';
export { default as Footer } from './Footer.astro';

// Content components
export { default as SectionHeading } from './SectionHeading.astro';
export { default as Testimonial } from './Testimonial.astro';
export { default as ProductCard } from './ProductCard.astro';
export { default as VideoEmbed } from './VideoEmbed.astro';