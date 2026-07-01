// jsdom doesn't implement ResizeObserver. allocation-card.ts uses one purely
// as a resize signal (with an offsetWidth-based fallback for environments
// where it doesn't fire) — a no-op stub is sufficient for tests.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
