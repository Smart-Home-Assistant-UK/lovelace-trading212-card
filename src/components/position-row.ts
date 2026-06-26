import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared';
import type { HomeAssistant, ResolvedPosition } from '../config/types';
import './sparkline';

function fmt(hass: HomeAssistant, entityId: string | undefined): string {
  if (!entityId) return '—';
  const s = hass.states[entityId]?.state;
  if (!s || s === 'unavailable' || s === 'unknown') return '—';
  const n = parseFloat(s);
  return isNaN(n) ? s : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function pnlCls(hass: HomeAssistant, entityId: string | undefined): string {
  if (!entityId) return '';
  const n = parseFloat(hass.states[entityId]?.state ?? '');
  if (isNaN(n)) return '';
  return n >= 0 ? 'positive' : 'negative';
}

@customElement('investment-position-row')
export class InvestmentPositionRow extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) position!: ResolvedPosition;
  @property({ type: Boolean }) expanded = false;

  static styles = [sharedStyles];

  private _toggle() {
    this.dispatchEvent(new CustomEvent('toggle-expand', { bubbles: true, composed: true }));
  }

  render() {
    const { position: p, hass } = this;
    return html`
      <div class="list-item" @click=${this._toggle}>
        <div>
          <div class="item-name">${p.name}</div>
          ${p.ticker ? html`<div class="item-ticker">${p.ticker}</div>` : nothing}
        </div>
        <div class="item-value">${fmt(hass, p.value)}</div>
        <div class="item-pnl ${pnlCls(hass, p.pnl)}">
          ${fmt(hass, p.pnl)}<br/>
          <span style="font-size:0.75rem">${fmt(hass, p.pnl_percent)}%</span>
        </div>
        <investment-sparkline .hass=${hass} entityId=${p.history_entity}></investment-sparkline>
      </div>
      ${this.expanded ? html`
        <div class="expand-panel">
          <div class="expand-stat">
            <span class="expand-label">Quantity</span>
            <span class="expand-value">${fmt(hass, p.quantity)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Avg Price</span>
            <span class="expand-value">${fmt(hass, p.avg_price)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Current Price</span>
            <span class="expand-value">${fmt(hass, p.current_price)}</span>
          </div>
          <investment-sparkline .hass=${hass} entityId=${p.history_entity} wide></investment-sparkline>
        </div>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'investment-position-row': InvestmentPositionRow;
  }
}
