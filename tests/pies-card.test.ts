import { describe, it, expect, afterEach } from 'vitest';
import '../src/cards/pies-card';
import type { InvestmentPiesCard } from '../src/cards/pies-card';
import { entity, mockHass, mount, shadow, text } from './helpers/dom';

let mounted: InvestmentPiesCard[] = [];

afterEach(() => {
  mounted.forEach((el) => el.remove());
  mounted = [];
});

async function renderCard(states: Record<string, ReturnType<typeof entity>>) {
  const el = await mount<InvestmentPiesCard>('investment-pies-card', {
    hass: mockHass(states),
    config: {},
  });
  mounted.push(el);
  return shadow(el);
}

describe('investment-pies-card', () => {
  it('shows a warning when no pies are discovered', async () => {
    const root = await renderCard({});
    expect(text(root.querySelector('.warning'))).toContain('No pies found');
    expect(root.querySelector('investment-pie-row')).toBeNull();
  });

  it('renders one row per discovered pie', async () => {
    const root = await renderCard({
      'sensor.trading212_growth_pie_value': entity('2000'),
      'sensor.trading212_growth_pie_invested': entity('1800'),
      'sensor.trading212_income_pie_value': entity('1200'),
      'sensor.trading212_income_pie_invested': entity('1140'),
    });
    expect(root.querySelectorAll('investment-pie-row').length).toBe(2);
  });

  it('tracks expand state by id, not value — two pies with no value sensor expand independently', async () => {
    const root = await renderCard({
      'sensor.trading212_growth_pie_cash': entity('50'),
      'sensor.trading212_income_pie_cash': entity('30'),
    });
    const rows = root.querySelectorAll('investment-pie-row');
    expect(rows.length).toBe(2);

    const clickRow = (row: Element) => {
      const rowRoot = shadow(row);
      (rowRoot.querySelector('.list-item') as HTMLElement).click();
    };

    clickRow(rows[0]);
    await mounted[0].updateComplete;
    expect((rows[0] as unknown as { expanded: boolean }).expanded).toBe(true);
    expect((rows[1] as unknown as { expanded: boolean }).expanded).toBe(false);

    clickRow(rows[1]);
    await mounted[0].updateComplete;
    expect((rows[0] as unknown as { expanded: boolean }).expanded).toBe(false);
    expect((rows[1] as unknown as { expanded: boolean }).expanded).toBe(true);
  });
});
