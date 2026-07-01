import { describe, it, expect, afterEach } from 'vitest';
import '../src/cards/allocation-card';
import {
  computeTreemap,
  pnlBg,
  avatarColor,
  displayTicker,
  type InvestmentAllocationCard,
} from '../src/cards/allocation-card';
import { entity, mockHass, mount, shadow, text } from './helpers/dom';

describe('computeTreemap', () => {
  it('returns an empty array for no values or a zero-size container', () => {
    expect(computeTreemap([], 400, 400)).toEqual([]);
    expect(computeTreemap([100], 0, 400)).toEqual([]);
    expect(computeTreemap([100], 400, 0)).toEqual([]);
  });

  it('gives a single value the entire rect', () => {
    const [rect] = computeTreemap([500], 400, 300);
    expect(rect).toEqual({ x: 0, y: 0, w: 400, h: 300 });
  });

  it('conserves total area across all cells regardless of value distribution', () => {
    const values = [500, 300, 150, 50, 25, 10];
    const rects = computeTreemap(values, 400, 300);
    const totalArea = 400 * 300;
    const summedArea = rects.reduce((s, r) => s + r.w * r.h, 0);
    expect(summedArea).toBeCloseTo(totalArea, 0);
  });

  it('gives every value a strictly positive area (nothing collapses to zero)', () => {
    const rects = computeTreemap([1000, 1, 1, 1], 400, 300);
    for (const r of rects) {
      expect(r.w).toBeGreaterThan(0);
      expect(r.h).toBeGreaterThan(0);
    }
  });

  it('sizes cells proportionally to their share of the total value', () => {
    const rects = computeTreemap([300, 100], 400, 300);
    const totalArea = 400 * 300;
    const area0 = rects[0].w * rects[0].h;
    const area1 = rects[1].w * rects[1].h;
    // 300:100 split -> 75%:25% of total area, within squarify's rounding.
    expect(area0 / totalArea).toBeCloseTo(0.75, 1);
    expect(area1 / totalArea).toBeCloseTo(0.25, 1);
  });

  it('treats an all-zero value set as a degenerate empty layout rather than dividing by zero', () => {
    const rects = computeTreemap([0, 0], 400, 300);
    expect(rects).toEqual([{ x: 0, y: 0, w: 0, h: 0 }, { x: 0, y: 0, w: 0, h: 0 }]);
  });
});

describe('pnlBg', () => {
  it('uses a green-family color for non-negative percentages', () => {
    expect(pnlBg(5)).toMatch(/^rgba\(76,175,80,/);
    expect(pnlBg(0)).toMatch(/^rgba\(76,175,80,/);
  });

  it('uses a red-family color for negative percentages', () => {
    expect(pnlBg(-5)).toMatch(/^rgba\(244,67,54,/);
  });

  it('increases opacity with magnitude, capped at a max', () => {
    const near = pnlBg(1);
    const far = pnlBg(9);
    const capped = pnlBg(50);
    const alphaOf = (s: string) => parseFloat(s.split(',')[3]);
    expect(alphaOf(far)).toBeGreaterThan(alphaOf(near));
    expect(alphaOf(capped)).toBeCloseTo(0.34, 2);
  });
});

describe('avatarColor', () => {
  it('is deterministic for the same input', () => {
    expect(avatarColor('AAPL')).toBe(avatarColor('AAPL'));
  });

  it('differs for different tickers (not a constant)', () => {
    expect(avatarColor('AAPL')).not.toBe(avatarColor('MSFT'));
  });
});

describe('displayTicker', () => {
  it('strips a trailing _US_EQ suffix', () => {
    expect(displayTicker('AAPL_US_EQ')).toBe('AAPL');
  });

  it('strips a trailing _EQ suffix without a US infix', () => {
    expect(displayTicker('VOD_EQ')).toBe('VOD');
  });

  it('strips a trailing _L suffix', () => {
    expect(displayTicker('BARC_L')).toBe('BARC');
  });

  it('leaves a ticker with no known suffix untouched', () => {
    expect(displayTicker('BRK')).toBe('BRK');
  });
});

let mounted: InvestmentAllocationCard[] = [];

afterEach(() => {
  mounted.forEach((el) => el.remove());
  mounted = [];
});

async function renderCard(
  states: Record<string, ReturnType<typeof entity>>,
  config: Record<string, unknown> = {},
  containerWidth = 400
) {
  const el = await mount<InvestmentAllocationCard>('investment-allocation-card', {
    hass: mockHass(states),
    config,
  });
  mounted.push(el);
  // jsdom performs no layout, so offsetWidth is always 0 and the
  // ResizeObserver stub never fires — force a container width so the
  // treemap actually computes cells, matching a real browser.
  (el as unknown as { _containerW: number })._containerW = containerWidth;
  el.requestUpdate();
  await el.updateComplete;
  return shadow(el);
}

describe('investment-allocation-card', () => {
  it('shows a warning when there is no positive-value data to plot', async () => {
    const root = await renderCard({});
    expect(text(root.querySelector('.warning'))).toContain('No positions data available');
  });

  it('renders one cell per position by default', async () => {
    const root = await renderCard({
      'sensor.trading212_aapl_us_eq_value': entity('1750'),
      'sensor.trading212_aapl_us_eq_quantity': entity('10'),
      'sensor.trading212_msft_us_eq_value': entity('1400'),
      'sensor.trading212_msft_us_eq_quantity': entity('5'),
    });
    expect(root.querySelectorAll('.treemap-cell').length).toBe(2);
  });

  it('excludes a position with no value sensor from the treemap entirely', async () => {
    const root = await renderCard({
      'sensor.trading212_aapl_us_eq_value': entity('1750'),
      'sensor.trading212_aapl_us_eq_quantity': entity('10'),
      // MSFT has quantity but no value — can't size a cell without a value.
      'sensor.trading212_msft_us_eq_quantity': entity('5'),
    });
    expect(root.querySelectorAll('.treemap-cell').length).toBe(1);
    expect(text(root.querySelector('.cell-ticker'))).toBe('AAPL');
  });

  it('switches to pies when mode: pies is configured', async () => {
    const root = await renderCard(
      {
        'sensor.trading212_growth_pie_value': entity('2000'),
        'sensor.trading212_growth_pie_invested': entity('1800'),
      },
      { mode: 'pies' }
    );
    expect(root.querySelectorAll('.treemap-cell').length).toBe(1);
    expect(text(root.querySelector('.cell-ticker'))).toBe('Growth Pie');
  });

  it('filters positions to a single pie via the tickers attribute', async () => {
    const root = await renderCard(
      {
        'sensor.trading212_aapl_us_eq_value': entity('1750'),
        'sensor.trading212_aapl_us_eq_quantity': entity('10'),
        'sensor.trading212_msft_us_eq_value': entity('1400'),
        'sensor.trading212_msft_us_eq_quantity': entity('5'),
        'sensor.trading212_growth_pie_value': entity('2000', { tickers: ['AAPL_US_EQ'] }),
      },
      { pie: 'growth_pie' }
    );
    const tickers = Array.from(root.querySelectorAll('.cell-ticker')).map((n) => text(n));
    expect(tickers).toEqual(['AAPL']);
  });

  it('does not render a misleading 0% badge when pnl_percent is not selected', async () => {
    const root = await renderCard({
      'sensor.trading212_aapl_us_eq_value': entity('1750'),
      'sensor.trading212_aapl_us_eq_quantity': entity('10'),
      // No pnl_percent sensor at all.
    });
    expect(root.querySelector('.cell-pct')).toBeNull();
    const cell = root.querySelector('.treemap-cell') as HTMLElement;
    expect(cell.style.background).toBe('var(--secondary-background-color)');
    expect(cell.getAttribute('title')).toBe('AAPL');
  });

  it('renders the pnl badge and a P&L-tinted background when pnl_percent is known', async () => {
    const root = await renderCard({
      'sensor.trading212_aapl_us_eq_value': entity('1750'),
      'sensor.trading212_aapl_us_eq_quantity': entity('10'),
      'sensor.trading212_aapl_us_eq_pnl_percent': entity('16.67'),
    });
    const badge = root.querySelector('.cell-pct');
    expect(text(badge)).toBe('+16.67%');
    expect(badge!.classList.contains('positive')).toBe(true);
    const cell = root.querySelector('.treemap-cell') as HTMLElement;
    expect(cell.getAttribute('title')).toBe('AAPL: +16.67% P&L');
  });
});
