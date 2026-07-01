import { describe, it, expect, afterEach } from 'vitest';
import '../src/cards/positions-card';
import type { InvestmentPositionsCard } from '../src/cards/positions-card';
import { entity, mockHass, mount, shadow, text } from './helpers/dom';

let mounted: InvestmentPositionsCard[] = [];

afterEach(() => {
  mounted.forEach((el) => el.remove());
  mounted = [];
});

async function renderCard(states: Record<string, ReturnType<typeof entity>>) {
  const el = await mount<InvestmentPositionsCard>('investment-positions-card', {
    hass: mockHass(states),
    config: {},
  });
  mounted.push(el);
  return shadow(el);
}

describe('investment-positions-card', () => {
  it('shows a warning when no positions are discovered', async () => {
    const root = await renderCard({});
    expect(text(root.querySelector('.warning'))).toContain('No positions found');
    expect(root.querySelector('investment-position-row')).toBeNull();
  });

  it('renders one row per discovered position', async () => {
    const root = await renderCard({
      'sensor.trading212_aapl_us_eq_value': entity('1750'),
      'sensor.trading212_aapl_us_eq_quantity': entity('10'),
      'sensor.trading212_msft_us_eq_value': entity('1400'),
      'sensor.trading212_msft_us_eq_quantity': entity('5'),
    });
    expect(root.querySelectorAll('investment-position-row').length).toBe(2);
  });

  it('tracks expand state by id, not value — two positions with no value sensor expand independently', async () => {
    // Neither position has a `value` sensor at all: this is exactly the
    // scenario that broke when expand state was tracked by `.value`'s
    // entity id (both would resolve to `undefined` and collide).
    const root = await renderCard({
      'sensor.trading212_aapl_us_eq_avg_price': entity('150'),
      'sensor.trading212_msft_us_eq_avg_price': entity('300'),
    });
    const rows = root.querySelectorAll('investment-position-row');
    expect(rows.length).toBe(2);

    const clickRow = (row: Element) => {
      const rowRoot = shadow(row);
      (rowRoot.querySelector('.list-item') as HTMLElement).click();
    };

    // Expand the first row only.
    clickRow(rows[0]);
    await mounted[0].updateComplete;
    expect((rows[0] as unknown as { expanded: boolean }).expanded).toBe(true);
    expect((rows[1] as unknown as { expanded: boolean }).expanded).toBe(false);

    // Expanding the second row should collapse the first, not double-expand both.
    clickRow(rows[1]);
    await mounted[0].updateComplete;
    expect((rows[0] as unknown as { expanded: boolean }).expanded).toBe(false);
    expect((rows[1] as unknown as { expanded: boolean }).expanded).toBe(true);

    // Clicking the same row again collapses it.
    clickRow(rows[1]);
    await mounted[0].updateComplete;
    expect((rows[1] as unknown as { expanded: boolean }).expanded).toBe(false);
  });
});
