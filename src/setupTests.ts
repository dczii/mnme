import "@testing-library/jest-dom";

// Mocking IntersectionObserver globally
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
    // You can store the callback and options if needed for tests
  }

  observe() {
    // Mock behavior
  }

  unobserve() {
    // Mock behavior
  }

  disconnect() {
    // Mock behavior
  }

  takeRecords() {
    return [];
  }
} as unknown as typeof IntersectionObserver; // Using 'any' type to prevent TypeScript errors
