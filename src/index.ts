import './cards/overview-card';
import './cards/positions-card';
import './cards/pies-card';
import './cards/portfolio-card';

(window as any).customCards = (window as any).customCards ?? [];
(window as any).customCards.push(
  { type: 'investment-portfolio-card', name: 'Investment Portfolio',
    description: 'Full portfolio view: overview, positions, and pies' },
  { type: 'investment-overview-card', name: 'Investment Overview',
    description: 'Account summary and daily movers' },
  { type: 'investment-positions-card', name: 'Investment Positions',
    description: 'Scrollable positions list with sparklines' },
  { type: 'investment-pies-card', name: 'Investment Pies',
    description: 'Scrollable pies / buckets list' }
);
