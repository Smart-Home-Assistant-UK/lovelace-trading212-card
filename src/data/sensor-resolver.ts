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

// Suffixes that only ever belong to a position (never a pie) — used to
// disambiguate a discovered slug's type.
const POSITION_EXCLUSIVE_SUFFIXES = [
  'quantity',
  'avg_price',
  'current_price',
  'daily_gain_loss',
  'daily_gain_loss_percent',
] as const;

// Suffixes that only ever belong to a pie (never a position).
const PIE_EXCLUSIVE_SUFFIXES = [
  'invested',
  'cash',
  'progress',
  'goal',
  'dividends_gained',
  'dividends_in_cash',
  'dividends_reinvested',
] as const;

// Suffixes both positions and pies can have — cannot disambiguate type on
// their own.
const SHARED_SUFFIXES = ['value', 'pnl', 'pnl_percent'] as const;

const POSITION_SUFFIXES = [...POSITION_EXCLUSIVE_SUFFIXES, ...SHARED_SUFFIXES];
const PIE_SUFFIXES = [...PIE_EXCLUSIVE_SUFFIXES, ...SHARED_SUFFIXES];

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

function exists(states: Record<string, HassEntity>, entityId: string): boolean {
  return entityId in states;
}

function fieldIfExists(
  states: Record<string, HassEntity>,
  prefix: string,
  slug: string,
  suffix: string
): string | undefined {
  const entityId = `${prefix}${slug}_${suffix}`;
  return exists(states, entityId) ? entityId : undefined;
}

// Account-level sensor entity ids (e.g. "sensor.trading212_total_value")
// collide with the per-slug suffix regex below (slug "total", suffix
// "value"). Excluding them by exact entity id — derived from the single
// resolveAccountSensors() source of truth — means any future account
// sensor is automatically excluded too, with no separate list to maintain.
function discoverSlugs(
  prefix: string,
  states: Record<string, HassEntity>,
  suffixes: readonly string[],
  excludeEntityIds: ReadonlySet<string>
): Set<string> {
  // Sort suffixes by length (longest first) and use non-greedy slug matching
  // (.+?) so multi-underscore suffixes like "dividends_in_cash" aren't
  // mis-split into a shorter suffix (e.g. "cash") with the rest of the
  // suffix left dangling on the slug.
  const sortedSuffixes = [...suffixes].sort((a, b) => b.length - a.length);
  const suffixPattern = sortedSuffixes.map(escapeRegex).join('|');
  const pattern = new RegExp(`^${escapeRegex(prefix)}(.+?)_(${suffixPattern})$`);
  const slugs = new Set<string>();
  for (const entityId of Object.keys(states)) {
    if (excludeEntityIds.has(entityId)) continue;
    const match = entityId.match(pattern);
    if (match) slugs.add(match[1]);
  }
  return slugs;
}

function discoverPositions(
  prefix: string,
  states: Record<string, HassEntity>,
  excludeEntityIds: ReadonlySet<string>
): ResolvedPosition[] {
  const positionExclusiveSlugs = discoverSlugs(prefix, states, POSITION_EXCLUSIVE_SUFFIXES, excludeEntityIds);
  const candidateSlugs = discoverSlugs(prefix, states, POSITION_SUFFIXES, excludeEntityIds);

  // A slug is only classified as a position if it has at least one
  // position-exclusive sensor. A slug with only shared value/pnl/pnl_percent
  // sensors enabled (no exclusive evidence either way) can't be told apart
  // from a pie in the same situation — omit it rather than guess.
  const slugs = [...candidateSlugs].filter((slug) => positionExclusiveSlugs.has(slug));

  return slugs.map((slug) => ({
    id: slug,
    name: slugToName(slug),
    ticker: slug.toUpperCase(),
    value: fieldIfExists(states, prefix, slug, 'value'),
    pnl: fieldIfExists(states, prefix, slug, 'pnl'),
    pnl_percent: fieldIfExists(states, prefix, slug, 'pnl_percent'),
    current_price: fieldIfExists(states, prefix, slug, 'current_price'),
    quantity: fieldIfExists(states, prefix, slug, 'quantity'),
    avg_price: fieldIfExists(states, prefix, slug, 'avg_price'),
    daily_gain_loss: fieldIfExists(states, prefix, slug, 'daily_gain_loss'),
    daily_gain_loss_percent: fieldIfExists(states, prefix, slug, 'daily_gain_loss_percent'),
    history_entity: fieldIfExists(states, prefix, slug, 'value'),
  }));
}

function discoverPies(
  prefix: string,
  states: Record<string, HassEntity>,
  excludeEntityIds: ReadonlySet<string>
): ResolvedPie[] {
  const pieExclusiveSlugs = discoverSlugs(prefix, states, PIE_EXCLUSIVE_SUFFIXES, excludeEntityIds);
  const candidateSlugs = discoverSlugs(prefix, states, PIE_SUFFIXES, excludeEntityIds);

  // A slug is only classified as a pie if it has at least one pie-exclusive
  // sensor. A slug with only shared value/pnl/pnl_percent sensors enabled
  // (no exclusive evidence either way) can't be told apart from a position
  // in the same situation — omit it rather than guess.
  const slugs = [...candidateSlugs].filter((slug) => pieExclusiveSlugs.has(slug));

  return slugs.map((slug) => ({
    id: slug,
    name: slugToName(slug),
    value: fieldIfExists(states, prefix, slug, 'value'),
    pnl: fieldIfExists(states, prefix, slug, 'pnl'),
    pnl_percent: fieldIfExists(states, prefix, slug, 'pnl_percent'),
    invested: fieldIfExists(states, prefix, slug, 'invested'),
    cash: fieldIfExists(states, prefix, slug, 'cash'),
    progress: fieldIfExists(states, prefix, slug, 'progress'),
    goal: fieldIfExists(states, prefix, slug, 'goal'),
    dividends_gained: fieldIfExists(states, prefix, slug, 'dividends_gained'),
    dividends_in_cash: fieldIfExists(states, prefix, slug, 'dividends_in_cash'),
    dividends_reinvested: fieldIfExists(states, prefix, slug, 'dividends_reinvested'),
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
    const positions: ResolvedPosition[] = (cfg.positions ?? []).map((p, index) => ({
      id: p.value || p.name || String(index),
      name: p.name,
      value: p.value,
      pnl: p.pnl,
      pnl_percent: p.pnl_percent,
      current_price: p.current_price,
      quantity: p.quantity,
      avg_price: p.avg_price,
      daily_gain_loss: p.daily_gain_loss,
      daily_gain_loss_percent: p.daily_gain_loss_percent,
      history_entity: p.history_entity ?? p.value,
    }));
    const pies: ResolvedPie[] = (cfg.pies ?? []).map((p, index) => ({
      id: p.value || p.name || String(index),
      ...p,
    }));
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
  const account = resolveAccountSensors(prefix);
  const accountEntityIds = new Set(Object.values(account));
  return {
    account,
    positions: discoverPositions(prefix, states, accountEntityIds),
    pies: discoverPies(prefix, states, accountEntityIds),
    maxHeight,
    showOverview,
    showPositions,
    showPies,
  };
}
