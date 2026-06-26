import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared';
import { resolveConfig } from '../data/sensor-resolver';
import type { HomeAssistant, RawCardConfig } from '../config/types';
import '../components/sparkline';

function fmt(hass: HomeAssistant, entityId: string | undefined): string {
  if (!entityId) return '—';
  const raw = hass.states[entityId]?.state;
  if (!raw || raw === 'unavailable' || raw === 'unknown') return '—';
  const n = parseFloat(raw);
  if (isNaN(n)) return raw;
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function sign(hass: HomeAssistant, entityId: string | undefined): 'positive' | 'negative' | '' {
  if (!entityId) return '';
  const n = parseFloat(hass.states[entityId]?.state ?? '');
  if (isNaN(n)) return '';
  return n >= 0 ? 'positive' : 'negative';
}

@customElement('investment-health-card')
export class InvestmentHealthCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config: RawCardConfig = {};

  static styles = [
    sharedStyles,
    css`
      ha-card { padding: 20px; }

      .hero { margin-bottom: 4px; }

      .hero-label {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }

      .hero-value {
        font-size: 2.4rem;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -0.02em;
        margin-bottom: 4px;
      }

      .hero-sub {
        font-size: 0.85rem;
        color: var(--secondary-text-color);
        margin-bottom: 12px;
      }

      .sparkline-wrap {
        width: 100%;
        overflow: hidden;
        margin-bottom: 20px;
      }

      .sparkline-wrap investment-sparkline {
        width: 100%;
      }

      .divider {
        border: none;
        border-top: 1px solid var(--divider-color);
        margin: 0 0 16px;
      }

      .today-label {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }

      .today-row {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 16px;
      }

      .today-value {
        font-size: 1.6rem;
        font-weight: 700;
        line-height: 1;
      }

      .today-pct {
        font-size: 1rem;
        font-weight: 600;
      }

      .movers {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 16px;
      }

      .mover-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
      }

      .mover-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
        flex: 1;
      }

      .mover-arrow { margin-right: 4px; font-size: 0.75rem; }

      .mover-pct { font-weight: 600; white-space: nowrap; }

      .footer {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .footer-stat {
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .footer-label {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--secondary-text-color);
      }

      .footer-value {
        font-size: 0.85rem;
        font-weight: 600;
      }
    `,
  ];

  setConfig(config: RawCardConfig) { this.config = config; }
  getCardSize() { return 4; }

  render() {
    if (!this.hass) return nothing;
    const { account } = resolveConfig(this.config, this.hass.states);

    const totalRaw = account.total_value ? parseFloat(this.hass.states[account.total_value]?.state ?? '') : NaN;
    const totalDisplay = isNaN(totalRaw) ? '—'
      : totalRaw.toLocaleString(undefined, { maximumFractionDigits: 2 });

    const pnlCls = sign(this.hass, account.unrealized_pnl);
    const pnlVal = fmt(this.hass, account.unrealized_pnl);
    const pnlPct = fmt(this.hass, account.result_percent);
    const pnlPrefix = pnlCls === 'positive' ? '+' : '';

    const todayCls = sign(this.hass, account.daily_gain_loss);
    const todayVal = fmt(this.hass, account.daily_gain_loss);
    const todayPct = fmt(this.hass, account.daily_gain_loss_percent);
    const todayPrefix = todayCls === 'positive' ? '+' : '';

    const topEntity = account.top_daily_mover ? this.hass.states[account.top_daily_mover] : undefined;
    const botEntity = account.bottom_daily_mover ? this.hass.states[account.bottom_daily_mover] : undefined;
    const topPct = topEntity?.attributes?.change_pct as number | undefined;
    const botPct = botEntity?.attributes?.change_pct as number | undefined;
    const topCls = (topPct ?? 0) >= 0 ? 'positive' : 'negative';
    const botCls = (botPct ?? 0) >= 0 ? 'positive' : 'negative';

    return html`
      <ha-card>
        <div class="hero">
          <div class="hero-label">Portfolio Value</div>
          <div class="hero-value">${totalDisplay}</div>
          ${pnlVal !== '—' ? html`
            <div class="hero-sub ${pnlCls}">
              ${pnlPrefix}${pnlVal} · ${pnlPrefix}${pnlPct}% all time
            </div>` : nothing}
        </div>

        ${account.total_value ? html`
          <div class="sparkline-wrap">
            <investment-sparkline
              .hass=${this.hass}
              .entityId=${account.total_value}
              .width=${460}
              .height=${72}
            ></investment-sparkline>
          </div>` : nothing}

        <hr class="divider" />

        <div class="today-label">Today</div>
        <div class="today-row">
          <span class="today-value ${todayCls}">${todayPrefix}${todayVal}</span>
          <span class="today-pct ${todayCls}">${todayPrefix}${todayPct}%</span>
        </div>

        ${topEntity || botEntity ? html`
          <div class="movers">
            ${topEntity && topPct != null ? html`
              <div class="mover-line">
                <span class="mover-name ${topCls}">
                  <span class="mover-arrow">▲</span>${topEntity.state}
                </span>
                <span class="mover-pct ${topCls}">+${topPct.toFixed(2)}%</span>
              </div>` : nothing}
            ${botEntity && botPct != null ? html`
              <div class="mover-line">
                <span class="mover-name ${botCls}">
                  <span class="mover-arrow">▼</span>${botEntity.state}
                </span>
                <span class="mover-pct ${botCls}">${botPct.toFixed(2)}%</span>
              </div>` : nothing}
          </div>` : nothing}

        <hr class="divider" />

        <div class="footer">
          <div class="footer-stat">
            <span class="footer-label">Invested</span>
            <span class="footer-value">${fmt(this.hass, account.invested)}</span>
          </div>
          <div class="footer-stat">
            <span class="footer-label">Cash</span>
            <span class="footer-value">${fmt(this.hass, account.cash_available)}</span>
          </div>
          <div class="footer-stat">
            <span class="footer-label">Dividends</span>
            <span class="footer-value">${fmt(this.hass, account.total_dividends)}</span>
          </div>
        </div>
      </ha-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'investment-health-card': InvestmentHealthCard; }
}
