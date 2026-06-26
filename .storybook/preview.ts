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

// Minimal <ha-card> stub — just a styled block element
if (!customElements.get('ha-card')) {
  class HaCard extends HTMLElement {
    connectedCallback() {
      this.style.cssText = `
        display: block; background: #1c1c1e; border-radius: 12px;
        padding: 8px 0; max-width: 480px; margin: 16px auto;
      `;
    }
  }
  customElements.define('ha-card', HaCard);
}
