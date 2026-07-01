import type { HassEntity, HomeAssistant } from '../../src/config/types';

export function entity(state: string, attributes: Record<string, unknown> = {}): HassEntity {
  return { entity_id: '', state, attributes };
}

export function mockHass(
  states: Record<string, HassEntity>,
  callApi: HomeAssistant['callApi'] = (async () => []) as HomeAssistant['callApi']
): HomeAssistant {
  return { states, callApi };
}

// Mounts a LitElement-based custom element with the given properties, waits
// for its first render, and returns it. Caller is responsible for calling
// `el.remove()` (or relying on afterEach cleanup) to unmount.
export async function mount<T extends HTMLElement & { updateComplete: Promise<boolean> }>(
  tagName: string,
  props: Record<string, unknown>
): Promise<T> {
  const el = document.createElement(tagName) as T;
  for (const [key, value] of Object.entries(props)) {
    (el as unknown as Record<string, unknown>)[key] = value;
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

export function shadow(el: Element): ShadowRoot {
  const root = (el as unknown as { shadowRoot: ShadowRoot | null }).shadowRoot;
  if (!root) throw new Error(`${el.tagName} has no shadow root`);
  return root;
}

export function text(el: Element | null | undefined): string {
  return (el?.textContent ?? '').trim();
}
