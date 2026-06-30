import '../src/index';

// Inject HA CSS custom properties globally so all shadow roots inherit them
const style = document.createElement('style');
style.textContent = `
  body {
    background: #111;
    --primary-text-color: #e5e5ea;
    --secondary-text-color: #8e8e93;
    --secondary-background-color: #2c2c2e;
    --divider-color: #3a3a3c;
    --success-color: #30d158;
    --error-color: #ff453a;
    --primary-color: #0a84ff;
    --paper-font-body1_-_font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
`;
document.head.appendChild(style);

// Minimal <ha-card> stub — just a styled block element.
//
// Defaults live in a `:host` rule inside the stub's own shadow root rather
// than as an inline `style` attribute. An inline style always wins over any
// stylesheet rule regardless of specificity, which silently defeated cards
// like health-card.ts that declare their own `ha-card { padding: 20px }`
// override. `:host` rules are the lowest-priority normal rule by design —
// exactly so an outer component's own stylesheet (selecting `ha-card` by
// tag, as health-card.ts does) can override the default, matching how real
// HA's `ha-card` behaves.
if (!customElements.get('ha-card')) {
  class HaCard extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          :host {
            display: block;
            box-sizing: border-box;
            background: #1c1c1e;
            border-radius: 12px;
            padding: 8px 0;
            max-width: 480px;
            margin: 16px auto;
          }
        </style>
        <slot></slot>
      `;
    }
  }
  customElements.define('ha-card', HaCard);
}
