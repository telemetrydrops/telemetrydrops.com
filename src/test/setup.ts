import "@testing-library/jest-dom";
import { beforeEach } from "vitest";

// Global test setup for Vitest
// This file is automatically imported before each test file

// Mock window.scrollTo for JSDOM
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});

// Setup DOM environment before each test
beforeEach(() => {
  // Reset document head for SEO tests
  if (typeof document !== "undefined") {
    document.head.innerHTML = "";
  }
});