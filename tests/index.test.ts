import { describe, it, expect, beforeAll } from 'vitest';

declare global {
  interface Window { customCards?: Array<{ type: string; name: string; description: string }>; }
}

const EXPECTED_TYPES = [
  'investment-overview-card',
  'investment-positions-card',
  'investment-pies-card',
  'investment-portfolio-card',
  'investment-health-card',
  'investment-allocation-card',
];

beforeAll(async () => {
  await import('../src/index');
});

describe('src/index.ts — HA card-picker registration', () => {
  it('registers a customElements definition for every card it imports', () => {
    for (const type of EXPECTED_TYPES) {
      expect(customElements.get(type), `${type} should be a registered custom element`).toBeDefined();
    }
  });

  it('lists every registered card in window.customCards with a matching type, name, and description', () => {
    expect(window.customCards).toBeDefined();
    const types = window.customCards!.map((c) => c.type).sort();
    expect(types).toEqual([...EXPECTED_TYPES].sort());
    for (const card of window.customCards!) {
      expect(card.name.length).toBeGreaterThan(0);
      expect(card.description.length).toBeGreaterThan(0);
    }
  });
});
