import './cards/overview-card';
import './cards/positions-card';
import './cards/pies-card';
import './cards/portfolio-card';
import './cards/health-card';
import './cards/allocation-card';

(window as any).customCards = (window as any).customCards ?? [];
(window as any).customCards.push(
  { type: 'investment-allocation-card', name: 'Investment Allocation',
    description: 'Treemap showing portfolio weight and P&L per position' },
  { type: 'investment-health-card', name: 'Investment Health',
    description: 'Portfolio value, 7-day trend, today\'s P&L, and movers at a glance' },
  { type: 'investment-portfolio-card', name: 'Investment Portfolio',
    description: 'Full portfolio view: overview, positions, and pies' },
  { type: 'investment-overview-card', name: 'Investment Overview',
    description: 'Account summary and daily movers' },
  { type: 'investment-positions-card', name: 'Investment Positions',
    description: 'Scrollable positions list with sparklines' },
  { type: 'investment-pies-card', name: 'Investment Pies',
    description: 'Scrollable pies / buckets list' }
);
