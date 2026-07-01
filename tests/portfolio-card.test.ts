import { describe, it, expect, afterEach } from 'vitest';
import '../src/cards/portfolio-card';
import type { InvestmentPortfolioCard } from '../src/cards/portfolio-card';
import { entity, mockHass, mount, shadow } from './helpers/dom';

const states = {
  'sensor.trading212_total_value': entity('15690.00'),
  'sensor.trading212_aapl_us_eq_value': entity('1750'),
  'sensor.trading212_aapl_us_eq_quantity': entity('10'),
  'sensor.trading212_growth_pie_value': entity('2000'),
  'sensor.trading212_growth_pie_invested': entity('1800'),
};

let mounted: InvestmentPortfolioCard[] = [];

afterEach(() => {
  mounted.forEach((el) => el.remove());
  mounted = [];
});

async function renderCard(config: Record<string, unknown> = {}) {
  const el = await mount<InvestmentPortfolioCard>('investment-portfolio-card', {
    hass: mockHass(states),
    config,
  });
  mounted.push(el);
  return shadow(el);
}

describe('investment-portfolio-card', () => {
  it('renders all three sub-cards by default', async () => {
    const root = await renderCard();
    expect(root.querySelector('investment-overview-card')).not.toBeNull();
    expect(root.querySelector('investment-positions-card')).not.toBeNull();
    expect(root.querySelector('investment-pies-card')).not.toBeNull();
  });

  it('omits the overview sub-card when show_overview is false', async () => {
    const root = await renderCard({ show_overview: false });
    expect(root.querySelector('investment-overview-card')).toBeNull();
    expect(root.querySelector('investment-positions-card')).not.toBeNull();
    expect(root.querySelector('investment-pies-card')).not.toBeNull();
  });

  it('renders only positions when overview and pies are both disabled', async () => {
    const root = await renderCard({ show_overview: false, show_pies: false });
    expect(root.querySelector('investment-overview-card')).toBeNull();
    expect(root.querySelector('investment-positions-card')).not.toBeNull();
    expect(root.querySelector('investment-pies-card')).toBeNull();
  });
});
