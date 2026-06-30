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

// Mirrors ALL_POSITION_SENSORS in custom_components/trading212/const.py, with the
// average_price -> avg_price entity-id slug applied (see _POSITION_ENTITY_SLUG in
// custom_components/trading212/sensor.py).
const POSITION_SUFFIXES = [
  'value',
  'pnl',
  'pnl_percent',
  'quantity',
  'avg_price',
  'current_price',
  'daily_gain_loss',
  'daily_gain_loss_percent',
] as const;

// Mirrors ALL_PIE_SENSORS in custom_components/trading212/const.py.
const PIE_SUFFIXES = [
  'value',
  'invested',
  'pnl',
  'pnl_percent',
  'cash',
  'progress',
  'goal',
  'dividends_gained',
  'dividends_in_cash',
  'dividends_reinvested',
] as const;

// Account-level entity names that should not be discovered as positions/pies.
// These are derived from the trading212 integration's account sensor field names.
const ACCOUNT_SENSOR_FIELDS = [
  'total_value',
  'unrealized_pnl',
  'daily_gain_loss_percent',
] as const;

// Build a set of slugs to exclude from position/pie discovery
function buildAccountSlugsToExclude(): Set<string> {
  const allSuffixes = [...POSITION_SUFFIXES, ...PIE_SUFFIXES];
  const accountSlugs = new Set<string>();
  for (const field of ACCOUNT_SENSOR_FIELDS) {
    for (const suffix of allSuffixes) {
      if (field.endsWith('_' + suffix)) {
        const slug = field.substring(0, field.length - suffix.length - 1);
        accountSlugs.add(slug);
        break;
      }
    }
  }
  return accountSlugs;
}

const ACCOUNT_SLUGS_TO_EXCLUDE = buildAccountSlugsToExclude();

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

function discoverSlugs(
  prefix: string,
  states: Record<string, HassEntity>,
  suffixes: readonly string[]
): string[] {
  // Sort suffixes by length (longest first) to ensure longest matches are tried first
  // Use non-greedy matching (.+?) to prevent over-matching in slugs with underscores
  // This prevents matching 'growth_pie_dividends_in' instead of 'growth_pie'
  // when the suffix 'dividends_in_cash' contains underscores
  const sortedSuffixes = [...suffixes].sort((a, b) => b.length - a.length);
  const suffixPattern = sortedSuffixes.map(escapeRegex).join('|');
  const pattern = new RegExp(`^${escapeRegex(prefix)}(.+?)_(${suffixPattern})$`);
  const slugs = new Set<string>();
  for (const entityId of Object.keys(states)) {
    const match = entityId.match(pattern);
    if (match) slugs.add(match[1]);
  }
  return [...slugs];
}

function discoverPositions(
  prefix: string,
  states: Record<string, HassEntity>
): ResolvedPosition[] {
  return discoverSlugs(prefix, states, POSITION_SUFFIXES)
    .filter((slug) => !ACCOUNT_SLUGS_TO_EXCLUDE.has(slug) && !slug.includes('_pie'))
    .map((slug) => ({
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

// Pie-specific suffixes that are unique to pies
const PIE_SPECIFIC_SUFFIXES = ['invested', 'cash', 'progress', 'goal', 'dividends_gained', 'dividends_in_cash', 'dividends_reinvested'] as const;

// Position-specific suffixes that are unique to positions
const POSITION_SPECIFIC_SUFFIXES = ['quantity', 'avg_price', 'current_price', 'daily_gain_loss', 'daily_gain_loss_percent'] as const;

function hasAnyPieSpecificSuffix(
  states: Record<string, HassEntity>,
  prefix: string,
  slug: string
): boolean {
  return PIE_SPECIFIC_SUFFIXES.some((suffix) => fieldIfExists(states, prefix, slug, suffix) !== undefined);
}

function hasAnyPositionSpecificSuffix(
  states: Record<string, HassEntity>,
  prefix: string,
  slug: string
): boolean {
  return POSITION_SPECIFIC_SUFFIXES.some((suffix) => fieldIfExists(states, prefix, slug, suffix) !== undefined);
}

function discoverPies(
  prefix: string,
  states: Record<string, HassEntity>
): ResolvedPie[] {
  return discoverSlugs(prefix, states, PIE_SUFFIXES)
    .filter((slug) => !ACCOUNT_SLUGS_TO_EXCLUDE.has(slug) && !hasAnyPositionSpecificSuffix(states, prefix, slug) && (slug.includes('_pie') || hasAnyPieSpecificSuffix(states, prefix, slug)))
    .map((slug) => ({
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
