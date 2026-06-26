export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callApi<T>(
    method: 'GET' | 'POST',
    path: string,
    parameters?: Record<string, unknown>
  ): Promise<T>;
}

export interface PositionSensorMap {
  name: string;
  value: string;
  pnl: string;
  pnl_percent: string;
  current_price?: string;
  quantity?: string;
  avg_price?: string;
  history_entity?: string;
}

export interface PieSensorMap {
  name: string;
  value: string;
  pnl?: string;
  pnl_percent?: string;
  invested?: string;
  cash?: string;
  progress?: string;
  goal?: string;
  dividends_gained?: string;
  dividends_in_cash?: string;
  dividends_reinvested?: string;
}

export interface RawCardConfig {
  type?: string;
  prefix?: string;
  currency_sensor?: string;
  positions?: PositionSensorMap[];
  pies?: PieSensorMap[];
  max_height?: string;
  show_overview?: boolean;
  show_positions?: boolean;
  show_pies?: boolean;
}

export interface ResolvedAccountSensors {
  total_value?: string;
  invested?: string;
  unrealized_pnl?: string;
  result_percent?: string;
  daily_gain_loss?: string;
  daily_gain_loss_percent?: string;
  cash_available?: string;
  total_dividends?: string;
  top_daily_mover?: string;
  bottom_daily_mover?: string;
}

export interface ResolvedPosition {
  name: string;
  ticker?: string;
  value: string;
  pnl: string;
  pnl_percent: string;
  current_price?: string;
  quantity?: string;
  avg_price?: string;
  history_entity: string;
}

export interface ResolvedPie {
  name: string;
  value: string;
  pnl?: string;
  pnl_percent?: string;
  invested?: string;
  cash?: string;
  progress?: string;
  goal?: string;
  dividends_gained?: string;
  dividends_in_cash?: string;
  dividends_reinvested?: string;
}

export interface ResolvedConfig {
  account: ResolvedAccountSensors;
  positions: ResolvedPosition[];
  pies: ResolvedPie[];
  maxHeight: string;
  showOverview: boolean;
  showPositions: boolean;
  showPies: boolean;
}
