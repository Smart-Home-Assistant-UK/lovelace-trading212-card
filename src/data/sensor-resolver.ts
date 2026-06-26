import type {
  HassEntity,
  RawCardConfig,
  ResolvedAccountSensors,
  ResolvedConfig,
  ResolvedPie,
  ResolvedPosition,
} from '../config/types';

const DEFAULT_PREFIX = 'sensor.trading212_';
const DEFAULT_MAX_HEIGHT = '400px';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slugToName(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function resolveAccountSensors(prefix: string): ResolvedAccountSensors {
  return {
    total_value: `${prefix}total_value`,
    invested: `${prefix}invested`,
    unrealized_pnl: `${prefix}unrealized_pnl`,
    result_percent: `${prefix}result_percent`,
    daily_gain_loss: `${prefix}daily_gain_loss`,
    daily_gain_loss_percent: `${prefix}daily_gain_loss_percent`,
    cash_available: `${prefix}cash_available`,
    total_dividends: `${prefix}total_dividends`,
    top_daily_mover: `${prefix}top_daily_mover`,
    bottom_daily_mover: `${prefix}bottom_daily_mover`,
  };
}

function isAvailable(states: Record<string, HassEntity>, entityId: string): boolean {
  const s = states[entityId];
  return !!s && s.state !== 'unavailable' && s.state !== 'unknown';
}

function discoverPositions(
  prefix: string,
  states: Record<string, HassEntity>
): ResolvedPosition[] {
  const pattern = new RegExp(`^${escapeRegex(prefix)}(.+)_quantity$`);
  const slugs: string[] = [];
  for (const entityId of Object.keys(states)) {
    const match = entityId.match(pattern);
    if (match && isAvailable(states, `${prefix}${match[1]}_value`)) slugs.push(match[1]);
  }
  return slugs.map((slug) => ({
    name: slugToName(slug),
    ticker: slug.toUpperCase(),
    value: `${prefix}${slug}_value`,
    pnl: `${prefix}${slug}_pnl`,
    pnl_percent: `${prefix}${slug}_pnl_percent`,
    current_price: `${prefix}${slug}_current_price`,
    quantity: `${prefix}${slug}_quantity`,
    avg_price: `${prefix}${slug}_avg_price`,
    history_entity: `${prefix}${slug}_value`,
  }));
}

function discoverPies(
  prefix: string,
  states: Record<string, HassEntity>
): ResolvedPie[] {
  const pattern = new RegExp(`^${escapeRegex(prefix)}(.+)_invested$`);
  const slugs: string[] = [];
  for (const entityId of Object.keys(states)) {
    const match = entityId.match(pattern);
    if (match && match[1] && isAvailable(states, `${prefix}${match[1]}_value`)) slugs.push(match[1]);
  }
  return slugs.map((slug) => ({
    name: slugToName(slug),
    value: `${prefix}${slug}_value`,
    pnl: `${prefix}${slug}_pnl`,
    pnl_percent: `${prefix}${slug}_pnl_percent`,
    invested: `${prefix}${slug}_invested`,
    cash: `${prefix}${slug}_cash`,
    progress: `${prefix}${slug}_progress`,
    goal: `${prefix}${slug}_goal`,
    dividends_gained: `${prefix}${slug}_dividends_gained`,
    dividends_in_cash: `${prefix}${slug}_dividends_in_cash`,
    dividends_reinvested: `${prefix}${slug}_dividends_reinvested`,
  }));
}

export function resolveConfig(
  config: RawCardConfig | undefined,
  states: Record<string, HassEntity>
): ResolvedConfig {
  const cfg = config ?? {};
  const maxHeight = cfg.max_height ?? DEFAULT_MAX_HEIGHT;
  const showOverview = cfg.show_overview ?? true;
  const showPositions = cfg.show_positions ?? true;
  const showPies = cfg.show_pies ?? true;

  if (cfg.positions !== undefined || cfg.pies !== undefined) {
    const positions: ResolvedPosition[] = (cfg.positions ?? []).map((p) => ({
      name: p.name,
      value: p.value,
      pnl: p.pnl,
      pnl_percent: p.pnl_percent,
      current_price: p.current_price,
      quantity: p.quantity,
      avg_price: p.avg_price,
      history_entity: p.history_entity ?? p.value,
    }));
    const pies: ResolvedPie[] = (cfg.pies ?? []).map((p) => ({ ...p }));
    return {
      account: cfg.currency_sensor ? { total_value: cfg.currency_sensor } : {},
      positions,
      pies,
      maxHeight,
      showOverview,
      showPositions,
      showPies,
    };
  }

  const prefix = cfg.prefix ?? DEFAULT_PREFIX;
  return {
    account: resolveAccountSensors(prefix),
    positions: discoverPositions(prefix, states),
    pies: discoverPies(prefix, states),
    maxHeight,
    showOverview,
    showPositions,
    showPies,
  };
}
