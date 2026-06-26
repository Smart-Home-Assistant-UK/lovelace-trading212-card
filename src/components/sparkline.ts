import { LitElement, html, svg, css, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../config/types';

interface HistoryPoint {
  state: string;
  last_changed: string;
}

@customElement('investment-sparkline')
export class InvestmentSparkline extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: String }) entityId = '';
  @property({ type: Boolean }) wide = false;
  @property({ type: Number }) width = 0;
  @property({ type: Number }) height = 0;

  @state() private _points: number[] = [];
  private _timer: ReturnType<typeof setInterval> | null = null;

  static styles = css`
    :host { display: block; }
    svg { display: block; }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._timer = setInterval(() => this._fetchHistory(), 3600000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timer !== null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  updated(changed: PropertyValues) {
    if (changed.has('entityId')) {
      this._fetchHistory();
    }
  }

  private async _fetchHistory() {
    if (!this.hass || !this.entityId) return;
    const end = new Date();
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    try {
      const raw = await this.hass.callApi<HistoryPoint[][]>(
        'GET',
        `history/period/${start.toISOString()}?filter_entity_id=${this.entityId}&end_time=${end.toISOString()}&minimal_response=true&no_attributes=true`
      );
      this._points = (raw?.[0] ?? [])
        .map((p) => parseFloat(p.state))
        .filter((v) => !isNaN(v));
    } catch {
      this._points = [];
    }
  }

  private _buildPath(w: number, h: number): string {
    const pts = this._points;
    if (pts.length < 2) return '';
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const range = max - min || 1;
    const pad = h * 0.1;
    const coords = pts.map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${coords.join(' L ')}`;
  }

  render() {
    if (this._points.length < 2) return nothing;
    const w = this.width || (this.wide ? 200 : 60);
    const h = this.height || (this.wide ? 60 : 28);
    const path = this._buildPath(w, h);
    const up = this._points[this._points.length - 1] >= this._points[0];
    const stroke = up ? 'var(--success-color, #4caf50)' : 'var(--error-color, #f44336)';
    return html`${svg`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <path d="${path}" fill="none" stroke="${stroke}" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'investment-sparkline': InvestmentSparkline;
  }
}
