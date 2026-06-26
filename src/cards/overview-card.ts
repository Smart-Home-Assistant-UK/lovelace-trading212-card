import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared';
import { resolveConfig } from '../data/sensor-resolver';
import type { HomeAssistant, RawCardConfig } from '../config/types';

function statChip(
  hass: HomeAssistant,
  entityId: string | undefined,
  label: string,
  signed = false
) {
  if (!entityId) return nothing;
  const raw = hass.states[entityId]?.state ?? 'unavailable';
  const unavailable = raw === 'unavailable' || raw === 'unknown';
  const n = parseFloat(raw);
  const cls = signed && !isNaN(n) ? (n >= 0 ? 'positive' : 'negative') : '';
  const display = unavailable ? '—' : isNaN(n) ? raw
    : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return html`
    <div class="stat-chip">
      <span class="stat-label">${label}</span>
      <span class="stat-value ${cls}">${display}</span>
    </div>`;
}

@customElement('investment-overview-card')
export class InvestmentOverviewCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config: RawCardConfig = {};

  static styles = [sharedStyles];

  setConfig(config: RawCardConfig) { this.config = config; }
  getCardSize() { return 4; }

  render() {
    if (!this.hass) return nothing;
    const { account } = resolveConfig(this.config, this.hass.states);

    const topEntity = account.top_daily_mover ? this.hass.states[account.top_daily_mover] : undefined;
    const botEntity = account.bottom_daily_mover ? this.hass.states[account.bottom_daily_mover] : undefined;
    const topVal = topEntity?.attributes?.change_value as number | undefined;
    const topPct = topEntity?.attributes?.change_pct as number | undefined;
    const botVal = botEntity?.attributes?.change_value as number | undefined;
    const botPct = botEntity?.attributes?.change_pct as number | undefined;

    // Compute CSS classes based on actual sign of change values
    const topChangeClass = topVal == null ? '' : topVal >= 0 ? 'positive' : 'negative';
    const botChangeClass = botVal == null ? '' : botVal >= 0 ? 'positive' : 'negative';

    // Compute sign prefixes: '+' only for positive values
    const topSignPrefix = topVal != null && topVal >= 0 ? '+' : '';
    const botSignPrefix = botVal != null && botVal >= 0 ? '+' : '';

    return html`
      <ha-card>
        <div class="stat-grid">
          ${statChip(this.hass, account.total_value, 'Total Value')}
          ${statChip(this.hass, account.invested, 'Invested')}
          ${statChip(this.hass, account.unrealized_pnl, 'Unrealised P&L', true)}
          ${statChip(this.hass, account.result_percent, 'Return %', true)}
          ${statChip(this.hass, account.daily_gain_loss, "Today's P&L", true)}
          ${statChip(this.hass, account.daily_gain_loss_percent, 'Today %', true)}
          ${statChip(this.hass, account.cash_available, 'Cash')}
          ${statChip(this.hass, account.total_dividends, 'Dividends')}
        </div>
        <div class="mover-row">
          <div class="mover-chip">
            <div class="mover-label">Top Mover</div>
            <div class="mover-name ${topChangeClass}">${topEntity?.state ?? '—'}</div>
            ${topVal != null && topPct != null ? html`<div class="mover-change ${topChangeClass}">
              ${topSignPrefix}${topVal.toFixed(2)} (${topPct.toFixed(2)}%)</div>` : nothing}
          </div>
          <div class="mover-chip">
            <div class="mover-label">Bottom Mover</div>
            <div class="mover-name ${botChangeClass}">${botEntity?.state ?? '—'}</div>
            ${botVal != null && botPct != null ? html`<div class="mover-change ${botChangeClass}">
              ${botSignPrefix}${botVal.toFixed(2)} (${botPct.toFixed(2)}%)</div>` : nothing}
          </div>
        </div>
      </ha-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'investment-overview-card': InvestmentOverviewCard; }
}
