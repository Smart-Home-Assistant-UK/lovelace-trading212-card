/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = globalThis, mt = st.ShadowRoot && (st.ShadyCSS === void 0 || st.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $t = Symbol(), Pt = /* @__PURE__ */ new WeakMap();
let Rt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== $t) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (mt && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = Pt.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Pt.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ee = (e) => new Rt(typeof e == "string" ? e : e + "", void 0, $t), ot = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, n, o) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[o + 1], e[0]);
  return new Rt(s, e, $t);
}, se = (e, t) => {
  if (mt) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), n = st.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = s.cssText, e.appendChild(i);
  }
}, St = mt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return ee(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ie, defineProperty: ne, getOwnPropertyDescriptor: ae, getOwnPropertyNames: oe, getOwnPropertySymbols: re, getPrototypeOf: le } = Object, O = globalThis, Ct = O.trustedTypes, ce = Ct ? Ct.emptyScript : "", de = O.reactiveElementPolyfillSupport, W = (e, t) => e, it = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ce : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let s = e;
  switch (t) {
    case Boolean:
      s = e !== null;
      break;
    case Number:
      s = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(e);
      } catch {
        s = null;
      }
  }
  return s;
} }, gt = (e, t) => !ie(e, t), Et = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: gt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), O.litPropertyMetadata ?? (O.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let H = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = Et) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, s);
      n !== void 0 && ne(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: n, set: o } = ae(this.prototype, t) ?? { get() {
      return this[s];
    }, set(a) {
      this[s] = a;
    } };
    return { get: n, set(a) {
      const d = n?.call(this);
      o?.call(this, a), this.requestUpdate(t, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Et;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const t = le(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const s = this.properties, i = [...oe(s), ...re(s)];
      for (const n of i) this.createProperty(n, s[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, n] of s) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const n = this._$Eu(s, i);
      n !== void 0 && this._$Eh.set(n, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i) s.unshift(St(n));
    } else t !== void 0 && s.push(St(t));
    return s;
  }
  static _$Eu(t, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return se(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, i) {
    this._$AK(t, i);
  }
  _$ET(t, s) {
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : it).toAttribute(s, i.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = i.getPropertyOptions(n), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : it;
      this._$Em = n;
      const d = a.fromAttribute(s, o.type);
      this[n] = d ?? this._$Ej?.get(n) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, n = !1, o) {
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (o = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? gt)(o, s) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: n, wrapped: o }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? s ?? this[t]), o !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: a } = o, d = this[n];
        a !== !0 || this._$AL.has(n) || d === void 0 || this.C(n, void 0, o, d);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((s) => this._$ET(s, this[s]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
H.elementStyles = [], H.shadowRootOptions = { mode: "open" }, H[W("elementProperties")] = /* @__PURE__ */ new Map(), H[W("finalized")] = /* @__PURE__ */ new Map(), de?.({ ReactiveElement: H }), (O.reactiveElementVersions ?? (O.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, Ot = (e) => e, nt = X.trustedTypes, Nt = nt ? nt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, jt = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, Lt = "?" + E, pe = `<${Lt}>`, I = document, Z = () => I.createComment(""), J = (e) => e === null || typeof e != "object" && typeof e != "function", yt = Array.isArray, he = (e) => yt(e) || typeof e?.[Symbol.iterator] == "function", ut = `[ 	
\f\r]`, V = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ut = /-->/g, zt = />/g, U = RegExp(`>|${ut}(?:([^\\s"'>=/]+)(${ut}*=${ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Tt = /'/g, It = /"/g, kt = /^(?:script|style|textarea|title)$/i, Bt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), p = Bt(1), ve = Bt(2), M = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), Dt = /* @__PURE__ */ new WeakMap(), T = I.createTreeWalker(I, 129);
function qt(e, t) {
  if (!yt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Nt !== void 0 ? Nt.createHTML(t) : t;
}
const ue = (e, t) => {
  const s = e.length - 1, i = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = V;
  for (let d = 0; d < s; d++) {
    const r = e[d];
    let v, u, c = -1, h = 0;
    for (; h < r.length && (a.lastIndex = h, u = a.exec(r), u !== null); ) h = a.lastIndex, a === V ? u[1] === "!--" ? a = Ut : u[1] !== void 0 ? a = zt : u[2] !== void 0 ? (kt.test(u[2]) && (n = RegExp("</" + u[2], "g")), a = U) : u[3] !== void 0 && (a = U) : a === U ? u[0] === ">" ? (a = n ?? V, c = -1) : u[1] === void 0 ? c = -2 : (c = a.lastIndex - u[2].length, v = u[1], a = u[3] === void 0 ? U : u[3] === '"' ? It : Tt) : a === It || a === Tt ? a = U : a === Ut || a === zt ? a = V : (a = U, n = void 0);
    const f = a === U && e[d + 1].startsWith("/>") ? " " : "";
    o += a === V ? r + pe : c >= 0 ? (i.push(v), r.slice(0, c) + jt + r.slice(c) + E + f) : r + E + (c === -2 ? d : f);
  }
  return [qt(e, o + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class K {
  constructor({ strings: t, _$litType$: s }, i) {
    let n;
    this.parts = [];
    let o = 0, a = 0;
    const d = t.length - 1, r = this.parts, [v, u] = ue(t, s);
    if (this.el = K.createElement(v, i), T.currentNode = this.el.content, s === 2 || s === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (n = T.nextNode()) !== null && r.length < d; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const c of n.getAttributeNames()) if (c.endsWith(jt)) {
          const h = u[a++], f = n.getAttribute(c).split(E), _ = /([.?@])?(.*)/.exec(h);
          r.push({ type: 1, index: o, name: _[2], strings: f, ctor: _[1] === "." ? _e : _[1] === "?" ? me : _[1] === "@" ? $e : rt }), n.removeAttribute(c);
        } else c.startsWith(E) && (r.push({ type: 6, index: o }), n.removeAttribute(c));
        if (kt.test(n.tagName)) {
          const c = n.textContent.split(E), h = c.length - 1;
          if (h > 0) {
            n.textContent = nt ? nt.emptyScript : "";
            for (let f = 0; f < h; f++) n.append(c[f], Z()), T.nextNode(), r.push({ type: 2, index: ++o });
            n.append(c[h], Z());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Lt) r.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = n.data.indexOf(E, c + 1)) !== -1; ) r.push({ type: 7, index: o }), c += E.length - 1;
      }
      o++;
    }
  }
  static createElement(t, s) {
    const i = I.createElement("template");
    return i.innerHTML = t, i;
  }
}
function F(e, t, s = e, i) {
  if (t === M) return t;
  let n = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const o = J(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(e), n._$AT(e, s, i)), i !== void 0 ? (s._$Co ?? (s._$Co = []))[i] = n : s._$Cl = n), n !== void 0 && (t = F(e, n._$AS(e, t.values), n, i)), t;
}
class fe {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: i } = this._$AD, n = (t?.creationScope ?? I).importNode(s, !0);
    T.currentNode = n;
    let o = T.nextNode(), a = 0, d = 0, r = i[0];
    for (; r !== void 0; ) {
      if (a === r.index) {
        let v;
        r.type === 2 ? v = new et(o, o.nextSibling, this, t) : r.type === 1 ? v = new r.ctor(o, r.name, r.strings, this, t) : r.type === 6 && (v = new ge(o, this, t)), this._$AV.push(v), r = i[++d];
      }
      a !== r?.index && (o = T.nextNode(), a++);
    }
    return T.currentNode = I, n;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class et {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, n) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && t?.nodeType === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = F(this, t, s), J(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : he(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && J(this._$AH) ? this._$AA.nextSibling.data = t : this.T(I.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = K.createElement(qt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(s);
    else {
      const o = new fe(n, this), a = o.u(this.options);
      o.p(s), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let s = Dt.get(t.strings);
    return s === void 0 && Dt.set(t.strings, s = new K(t)), s;
  }
  k(t) {
    yt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, n = 0;
    for (const o of t) n === s.length ? s.push(i = new et(this.O(Z()), this.O(Z()), this, this.options)) : i = s[n], i._$AI(o), n++;
    n < s.length && (this._$AR(i && i._$AB.nextSibling, n), s.length = n);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = Ot(t).nextSibling;
      Ot(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class rt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, n, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = s, this._$AM = n, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = l;
  }
  _$AI(t, s = this, i, n) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = F(this, t, s, 0), a = !J(t) || t !== this._$AH && t !== M, a && (this._$AH = t);
    else {
      const d = t;
      let r, v;
      for (t = o[0], r = 0; r < o.length - 1; r++) v = F(this, d[i + r], s, r), v === M && (v = this._$AH[r]), a || (a = !J(v) || v !== this._$AH[r]), v === l ? t = l : t !== l && (t += (v ?? "") + o[r + 1]), this._$AH[r] = v;
    }
    a && !n && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class _e extends rt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class me extends rt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class $e extends rt {
  constructor(t, s, i, n, o) {
    super(t, s, i, n, o), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = F(this, t, s, 0) ?? l) === M) return;
    const i = this._$AH, n = t === l && i !== l || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== l && (i === l || n);
    n && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ge {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    F(this, t);
  }
}
const ye = X.litHtmlPolyfillSupport;
ye?.(K, et), (X.litHtmlVersions ?? (X.litHtmlVersions = [])).push("3.3.3");
const be = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const o = s?.renderBefore ?? null;
    i._$litPart$ = n = new et(t.insertBefore(Z(), o), o, void 0, s ?? {});
  }
  return n._$AI(e), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis;
class b extends H {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var s;
    const t = super.createRenderRoot();
    return (s = this.renderOptions).renderBefore ?? (s.renderBefore = t.firstChild), t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = be(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return M;
  }
}
b._$litElement$ = !0, b.finalized = !0, G.litElementHydrateSupport?.({ LitElement: b });
const xe = G.litElementPolyfillSupport;
xe?.({ LitElement: b });
(G.litElementVersions ?? (G.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const we = { attribute: !0, type: String, converter: it, reflect: !1, hasChanged: gt }, Ae = (e = we, t, s) => {
  const { kind: i, metadata: n } = s;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(s.name, e), i === "accessor") {
    const { name: a } = s;
    return { set(d) {
      const r = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(a, r, e, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(a, void 0, e, d), d;
    } };
  }
  if (i === "setter") {
    const { name: a } = s;
    return function(d) {
      const r = this[a];
      t.call(this, d), this.requestUpdate(a, r, e, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function $(e) {
  return (t, s) => typeof s == "object" ? Ae(e, t, s) : ((i, n, o) => {
    const a = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, i), a ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function lt(e) {
  return $({ ...e, state: !0, attribute: !1 });
}
const N = ot`
  :host {
    display: block;
    font-family: var(--paper-font-body1_-_font-family, sans-serif);
    color: var(--primary-text-color);
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
    padding: 16px;
  }

  .stat-chip {
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-label {
    font-size: 0.72rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 600;
  }

  .positive { color: var(--success-color, #4caf50); }
  .negative { color: var(--error-color, #f44336); }

  .mover-row {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
  }

  .mover-chip {
    flex: 1;
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 10px 12px;
    min-width: 0;
  }

  .mover-label {
    font-size: 0.72rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .mover-name {
    font-weight: 600;
    font-size: 0.9rem;
    margin: 2px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mover-change { font-size: 0.8rem; }

  .list-container {
    overflow-y: auto;
    padding: 0 16px 16px;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--divider-color);
    cursor: pointer;
    user-select: none;
  }

  .list-item:last-child { border-bottom: none; }

  .item-main {
    flex: 1 1 auto;
    min-width: 0;
  }

  .item-name {
    font-weight: 500;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-ticker {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  .item-value {
    font-weight: 600;
    font-size: 0.9rem;
    text-align: right;
    flex-shrink: 0;
  }

  .item-pnl {
    font-size: 0.8rem;
    text-align: right;
    flex-shrink: 0;
  }

  .expand-panel {
    padding: 12px 0;
    border-bottom: 1px solid var(--divider-color);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
  }

  .expand-stat { display: flex; flex-direction: column; gap: 2px; }

  .expand-label {
    font-size: 0.72rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
  }

  .expand-value { font-size: 0.85rem; font-weight: 500; }

  .progress-bar-track {
    height: 4px;
    background: var(--divider-color);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 4px;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--primary-color);
    border-radius: 2px;
  }

  .warning {
    padding: 16px;
    color: var(--secondary-text-color);
    font-size: 0.85rem;
    font-style: italic;
  }
`, Pe = "sensor.trading212_", Se = "400px", Vt = [
  "quantity",
  "avg_price",
  "current_price",
  "daily_gain_loss",
  "daily_gain_loss_percent"
], Wt = [
  "invested",
  "cash",
  "progress",
  "goal",
  "dividends_gained",
  "dividends_in_cash",
  "dividends_reinvested"
], Xt = ["value", "pnl", "pnl_percent"], Ce = [...Vt, ...Xt], Ee = [...Wt, ...Xt];
function Ht(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Gt(e) {
  return e.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
}
function Oe(e) {
  return {
    total_value: `${e}total_value`,
    invested: `${e}invested`,
    unrealized_pnl: `${e}unrealized_pnl`,
    result_percent: `${e}result_percent`,
    daily_gain_loss: `${e}daily_gain_loss`,
    daily_gain_loss_percent: `${e}daily_gain_loss_percent`,
    cash_available: `${e}cash_available`,
    total_dividends: `${e}total_dividends`,
    top_daily_mover: `${e}top_daily_mover`,
    bottom_daily_mover: `${e}bottom_daily_mover`
  };
}
function Ne(e, t) {
  return t in e;
}
function g(e, t, s, i) {
  const n = `${t}${s}_${i}`;
  return Ne(e, n) ? n : void 0;
}
function at(e, t, s, i) {
  const o = [...s].sort((r, v) => v.length - r.length).map(Ht).join("|"), a = new RegExp(`^${Ht(e)}(.+?)_(${o})$`), d = /* @__PURE__ */ new Set();
  for (const r of Object.keys(t)) {
    if (i.has(r)) continue;
    const v = r.match(a);
    v && d.add(v[1]);
  }
  return d;
}
function Ue(e, t, s) {
  const i = at(e, t, Vt, s);
  return [...at(e, t, Ce, s)].filter((a) => i.has(a)).map((a) => ({
    id: a,
    name: Gt(a),
    ticker: a.toUpperCase(),
    value: g(t, e, a, "value"),
    pnl: g(t, e, a, "pnl"),
    pnl_percent: g(t, e, a, "pnl_percent"),
    current_price: g(t, e, a, "current_price"),
    quantity: g(t, e, a, "quantity"),
    avg_price: g(t, e, a, "avg_price"),
    daily_gain_loss: g(t, e, a, "daily_gain_loss"),
    daily_gain_loss_percent: g(t, e, a, "daily_gain_loss_percent"),
    history_entity: g(t, e, a, "value")
  }));
}
function ze(e, t, s) {
  const i = at(e, t, Wt, s);
  return [...at(e, t, Ee, s)].filter((a) => i.has(a)).map((a) => ({
    id: a,
    name: Gt(a),
    value: g(t, e, a, "value"),
    pnl: g(t, e, a, "pnl"),
    pnl_percent: g(t, e, a, "pnl_percent"),
    invested: g(t, e, a, "invested"),
    cash: g(t, e, a, "cash"),
    progress: g(t, e, a, "progress"),
    goal: g(t, e, a, "goal"),
    dividends_gained: g(t, e, a, "dividends_gained"),
    dividends_in_cash: g(t, e, a, "dividends_in_cash"),
    dividends_reinvested: g(t, e, a, "dividends_reinvested")
  }));
}
function q(e, t) {
  const s = e ?? {}, i = s.max_height ?? Se, n = s.show_overview ?? !0, o = s.show_positions ?? !0, a = s.show_pies ?? !0;
  if (s.positions !== void 0 || s.pies !== void 0) {
    const u = (s.positions ?? []).map((h, f) => ({
      id: h.value || h.name || String(f),
      name: h.name,
      value: h.value,
      pnl: h.pnl,
      pnl_percent: h.pnl_percent,
      current_price: h.current_price,
      quantity: h.quantity,
      avg_price: h.avg_price,
      daily_gain_loss: h.daily_gain_loss,
      daily_gain_loss_percent: h.daily_gain_loss_percent,
      history_entity: h.history_entity ?? h.value
    })), c = (s.pies ?? []).map((h, f) => ({
      id: h.value || h.name || String(f),
      ...h
    }));
    return {
      account: s.currency_sensor ? { total_value: s.currency_sensor } : {},
      positions: u,
      pies: c,
      maxHeight: i,
      showOverview: n,
      showPositions: o,
      showPies: a
    };
  }
  const d = s.prefix ?? Pe, r = Oe(d), v = new Set(Object.values(r));
  return {
    account: r,
    positions: Ue(d, t, v),
    pies: ze(d, t, v),
    maxHeight: i,
    showOverview: n,
    showPositions: o,
    showPies: a
  };
}
var Te = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, bt = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Ie(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (i ? a(t, s, n) : a(n)) || n);
  return i && n && Te(t, s, n), n;
};
function C(e, t, s, i = !1) {
  if (!t) return l;
  const n = e.states[t]?.state ?? "unavailable", o = n === "unavailable" || n === "unknown", a = parseFloat(n), d = i && !isNaN(a) ? a >= 0 ? "positive" : "negative" : "", r = o ? "—" : isNaN(a) ? n : a.toLocaleString(void 0, { maximumFractionDigits: 2 });
  return p`
    <div class="stat-chip">
      <span class="stat-label">${s}</span>
      <span class="stat-value ${d}">${r}</span>
    </div>`;
}
let Q = class extends b {
  constructor() {
    super(...arguments), this.config = {};
  }
  setConfig(e) {
    this.config = e;
  }
  getCardSize() {
    return 4;
  }
  render() {
    if (!this.hass) return l;
    const { account: e } = q(this.config, this.hass.states), t = e.top_daily_mover ? this.hass.states[e.top_daily_mover] : void 0, s = e.bottom_daily_mover ? this.hass.states[e.bottom_daily_mover] : void 0, i = t?.attributes?.change_value, n = t?.attributes?.change_pct, o = s?.attributes?.change_value, a = s?.attributes?.change_pct, d = i == null ? "" : i >= 0 ? "positive" : "negative", r = o == null ? "" : o >= 0 ? "positive" : "negative", v = i != null && i >= 0 ? "+" : "", u = o != null && o >= 0 ? "+" : "";
    return p`
      <ha-card>
        <div class="stat-grid">
          ${C(this.hass, e.total_value, "Total Value")}
          ${C(this.hass, e.invested, "Invested")}
          ${C(this.hass, e.unrealized_pnl, "Unrealised P&L", !0)}
          ${C(this.hass, e.result_percent, "Return %", !0)}
          ${C(this.hass, e.daily_gain_loss, "Today's P&L", !0)}
          ${C(this.hass, e.daily_gain_loss_percent, "Today %", !0)}
          ${C(this.hass, e.cash_available, "Cash")}
          ${C(this.hass, e.total_dividends, "Dividends")}
        </div>
        <div class="mover-row">
          <div class="mover-chip">
            <div class="mover-label">Top Mover</div>
            <div class="mover-name ${d}">${t?.state ?? "—"}</div>
            ${i != null && n != null ? p`<div class="mover-change ${d}">
              ${v}${i.toFixed(2)} (${n.toFixed(2)}%)</div>` : l}
          </div>
          <div class="mover-chip">
            <div class="mover-label">Bottom Mover</div>
            <div class="mover-name ${r}">${s?.state ?? "—"}</div>
            ${o != null && a != null ? p`<div class="mover-change ${r}">
              ${u}${o.toFixed(2)} (${a.toFixed(2)}%)</div>` : l}
          </div>
        </div>
      </ha-card>`;
  }
};
Q.styles = [N];
bt([
  $({ attribute: !1 })
], Q.prototype, "hass", 2);
bt([
  $({ attribute: !1 })
], Q.prototype, "config", 2);
Q = bt([
  P("investment-overview-card")
], Q);
var De = Object.defineProperty, He = Object.getOwnPropertyDescriptor, D = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? He(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (i ? a(t, s, n) : a(n)) || n);
  return i && n && De(t, s, n), n;
};
let A = class extends b {
  constructor() {
    super(...arguments), this.entityId = "", this.wide = !1, this.width = 0, this.height = 0, this._points = [], this._timer = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = setInterval(() => this._fetchHistory(), 36e5);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._timer !== null && (clearInterval(this._timer), this._timer = null);
  }
  updated(e) {
    e.has("entityId") && this._fetchHistory();
  }
  async _fetchHistory() {
    if (!this.hass || !this.entityId) return;
    const e = /* @__PURE__ */ new Date(), t = new Date(e.getTime() - 7 * 24 * 60 * 60 * 1e3);
    try {
      const s = await this.hass.callApi(
        "GET",
        `history/period/${t.toISOString()}?filter_entity_id=${this.entityId}&end_time=${e.toISOString()}&minimal_response=true&no_attributes=true`
      );
      this._points = (s?.[0] ?? []).map((i) => parseFloat(i.state)).filter((i) => !isNaN(i));
    } catch {
      this._points = [];
    }
  }
  _buildPath(e, t) {
    const s = this._points;
    if (s.length < 2) return "";
    const i = Math.min(...s), o = Math.max(...s) - i || 1, a = t * 0.1;
    return `M ${s.map((r, v) => {
      const u = v / (s.length - 1) * e, c = t - a - (r - i) / o * (t - a * 2);
      return `${u.toFixed(1)},${c.toFixed(1)}`;
    }).join(" L ")}`;
  }
  render() {
    if (this._points.length < 2) return l;
    const e = this.width || (this.wide ? 200 : 60), t = this.height || (this.wide ? 60 : 28), s = this._buildPath(e, t), n = this._points[this._points.length - 1] >= this._points[0] ? "var(--success-color, #4caf50)" : "var(--error-color, #f44336)";
    return p`${ve`<svg width="${e}" height="${t}" viewBox="0 0 ${e} ${t}">
      <path d="${s}" fill="none" stroke="${n}" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`}`;
  }
};
A.styles = ot`
    :host { display: block; }
    svg { display: block; }
  `;
D([
  $({ attribute: !1 })
], A.prototype, "hass", 2);
D([
  $({ type: String })
], A.prototype, "entityId", 2);
D([
  $({ type: Boolean })
], A.prototype, "wide", 2);
D([
  $({ type: Number })
], A.prototype, "width", 2);
D([
  $({ type: Number })
], A.prototype, "height", 2);
D([
  lt()
], A.prototype, "_points", 2);
A = D([
  P("investment-sparkline")
], A);
var Me = Object.defineProperty, Fe = Object.getOwnPropertyDescriptor, ct = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Fe(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (i ? a(t, s, n) : a(n)) || n);
  return i && n && Me(t, s, n), n;
};
function x(e, t) {
  if (!t) return "—";
  const s = e.states[t]?.state;
  if (!s || s === "unavailable" || s === "unknown") return "—";
  const i = parseFloat(s);
  return isNaN(i) ? s : i.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function ft(e, t) {
  if (!t) return "";
  const s = parseFloat(e.states[t]?.state ?? "");
  return isNaN(s) ? "" : s >= 0 ? "positive" : "negative";
}
let R = class extends b {
  constructor() {
    super(...arguments), this.expanded = !1;
  }
  _toggle() {
    this.dispatchEvent(new CustomEvent("toggle-expand", { bubbles: !0, composed: !0 }));
  }
  render() {
    const { position: e, hass: t } = this, s = e.pnl !== void 0 || e.pnl_percent !== void 0, i = e.pnl ?? e.pnl_percent;
    return p`
      <div class="list-item" @click=${this._toggle}>
        <div class="item-main">
          <div class="item-name">${e.name}</div>
          ${e.ticker ? p`<div class="item-ticker">${e.ticker}</div>` : l}
        </div>
        ${e.value !== void 0 ? p`<div class="item-value">${x(t, e.value)}</div>` : l}
        ${s ? p`
            <div class="item-pnl ${ft(t, i)}">
              ${e.pnl !== void 0 ? p`${x(t, e.pnl)}` : l}
              ${e.pnl !== void 0 && e.pnl_percent !== void 0 ? p`<br/>` : l}
              ${e.pnl_percent !== void 0 ? p`<span style="font-size:0.75rem">${x(t, e.pnl_percent) === "—" ? "—" : `${x(t, e.pnl_percent)}%`}</span>` : l}
            </div>` : l}
        ${e.history_entity ? p`<investment-sparkline .hass=${t} .entityId=${e.history_entity}></investment-sparkline>` : l}
      </div>
      ${this.expanded ? p`
        <div class="expand-panel">
          ${e.quantity !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Quantity</span>
              <span class="expand-value">${x(t, e.quantity)}</span>
            </div>` : l}
          ${e.avg_price !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Avg Price</span>
              <span class="expand-value">${x(t, e.avg_price)}</span>
            </div>` : l}
          ${e.current_price !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Current Price</span>
              <span class="expand-value">${x(t, e.current_price)}</span>
            </div>` : l}
          ${e.daily_gain_loss !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Today's P&L</span>
              <span class="expand-value ${ft(t, e.daily_gain_loss)}">${x(t, e.daily_gain_loss)}</span>
            </div>` : l}
          ${e.daily_gain_loss_percent !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Today's P&L %</span>
              <span class="expand-value ${ft(t, e.daily_gain_loss_percent)}">${x(t, e.daily_gain_loss_percent)}%</span>
            </div>` : l}
          ${e.history_entity ? p`<investment-sparkline .hass=${t} .entityId=${e.history_entity} wide></investment-sparkline>` : l}
        </div>` : l}
    `;
  }
};
R.styles = [N];
ct([
  $({ attribute: !1 })
], R.prototype, "hass", 2);
ct([
  $({ attribute: !1 })
], R.prototype, "position", 2);
ct([
  $({ type: Boolean })
], R.prototype, "expanded", 2);
R = ct([
  P("investment-position-row")
], R);
var Re = Object.defineProperty, je = Object.getOwnPropertyDescriptor, dt = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? je(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (i ? a(t, s, n) : a(n)) || n);
  return i && n && Re(t, s, n), n;
};
let j = class extends b {
  constructor() {
    super(...arguments), this.config = {}, this._expanded = null;
  }
  setConfig(e) {
    this.config = e;
  }
  getCardSize() {
    return 5;
  }
  render() {
    if (!this.hass) return l;
    const { positions: e, maxHeight: t } = q(this.config, this.hass.states);
    return e.length === 0 ? p`<ha-card><div class="warning">
        No positions found. Check your sensor prefix or mapping.
      </div></ha-card>` : p`
      <ha-card>
        <div class="list-container" style="max-height:${t}">
          ${e.map((s) => p`
            <investment-position-row
              .hass=${this.hass}
              .position=${s}
              .expanded=${this._expanded === s.id}
              @toggle-expand=${() => {
      this._expanded = this._expanded === s.id ? null : s.id;
    }}
            ></investment-position-row>`)}
        </div>
      </ha-card>`;
  }
};
j.styles = [N];
dt([
  $({ attribute: !1 })
], j.prototype, "hass", 2);
dt([
  $({ attribute: !1 })
], j.prototype, "config", 2);
dt([
  lt()
], j.prototype, "_expanded", 2);
j = dt([
  P("investment-positions-card")
], j);
var Le = Object.defineProperty, ke = Object.getOwnPropertyDescriptor, pt = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? ke(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (i ? a(t, s, n) : a(n)) || n);
  return i && n && Le(t, s, n), n;
};
function w(e, t) {
  if (!t) return "—";
  const s = e.states[t]?.state;
  if (!s || s === "unavailable" || s === "unknown") return "—";
  const i = parseFloat(s);
  return isNaN(i) ? s : i.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function Be(e, t) {
  if (!t) return "";
  const s = parseFloat(e.states[t]?.state ?? "");
  return isNaN(s) ? "" : s >= 0 ? "positive" : "negative";
}
function qe(e, t) {
  return t ? Math.min(100, Math.max(0, parseFloat(e.states[t]?.state ?? "0") || 0)) : 0;
}
let L = class extends b {
  constructor() {
    super(...arguments), this.expanded = !1;
  }
  _toggle() {
    this.dispatchEvent(new CustomEvent("toggle-expand", { bubbles: !0, composed: !0 }));
  }
  render() {
    const { pie: e, hass: t } = this, s = qe(t, e.progress);
    return p`
      <div class="list-item" @click=${this._toggle}>
        <div class="item-main">
          <div class="item-name">${e.name}</div>
          ${e.progress !== void 0 ? p`
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${s}%"></div>
            </div>` : l}
        </div>
        ${e.value !== void 0 ? p`<div class="item-value">${w(t, e.value)}</div>` : l}
        ${e.pnl_percent !== void 0 ? p`
            <div class="item-pnl ${Be(t, e.pnl_percent)}">${w(t, e.pnl_percent) === "—" ? "—" : `${w(t, e.pnl_percent)}%`}</div>` : l}
      </div>
      ${this.expanded ? p`
        <div class="expand-panel">
          ${e.invested !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Invested</span>
              <span class="expand-value">${w(t, e.invested)}</span>
            </div>` : l}
          ${e.cash !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Cash</span>
              <span class="expand-value">${w(t, e.cash)}</span>
            </div>` : l}
          ${e.goal !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Goal</span>
              <span class="expand-value">${w(t, e.goal)}</span>
            </div>` : l}
          ${e.progress !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Progress</span>
              <span class="expand-value">${s.toFixed(1)}%</span>
            </div>` : l}
          ${e.dividends_gained !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Dividends Gained</span>
              <span class="expand-value">${w(t, e.dividends_gained)}</span>
            </div>` : l}
          ${e.dividends_reinvested !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Dividends Reinvested</span>
              <span class="expand-value">${w(t, e.dividends_reinvested)}</span>
            </div>` : l}
          ${e.dividends_in_cash !== void 0 ? p`
            <div class="expand-stat">
              <span class="expand-label">Dividends in Cash</span>
              <span class="expand-value">${w(t, e.dividends_in_cash)}</span>
            </div>` : l}
        </div>` : l}
    `;
  }
};
L.styles = [N];
pt([
  $({ attribute: !1 })
], L.prototype, "hass", 2);
pt([
  $({ attribute: !1 })
], L.prototype, "pie", 2);
pt([
  $({ type: Boolean })
], L.prototype, "expanded", 2);
L = pt([
  P("investment-pie-row")
], L);
var Ve = Object.defineProperty, We = Object.getOwnPropertyDescriptor, ht = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? We(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (i ? a(t, s, n) : a(n)) || n);
  return i && n && Ve(t, s, n), n;
};
let k = class extends b {
  constructor() {
    super(...arguments), this.config = {}, this._expanded = null;
  }
  setConfig(e) {
    this.config = e;
  }
  getCardSize() {
    return 4;
  }
  render() {
    if (!this.hass) return l;
    const { pies: e, maxHeight: t } = q(this.config, this.hass.states);
    return e.length === 0 ? p`<ha-card><div class="warning">
        No pies found. Check your sensor prefix or mapping.
      </div></ha-card>` : p`
      <ha-card>
        <div class="list-container" style="max-height:${t}">
          ${e.map((s) => p`
            <investment-pie-row
              .hass=${this.hass}
              .pie=${s}
              .expanded=${this._expanded === s.id}
              @toggle-expand=${() => {
      this._expanded = this._expanded === s.id ? null : s.id;
    }}
            ></investment-pie-row>`)}
        </div>
      </ha-card>`;
  }
};
k.styles = [N];
ht([
  $({ attribute: !1 })
], k.prototype, "hass", 2);
ht([
  $({ attribute: !1 })
], k.prototype, "config", 2);
ht([
  lt()
], k.prototype, "_expanded", 2);
k = ht([
  P("investment-pies-card")
], k);
var Xe = Object.defineProperty, Ge = Object.getOwnPropertyDescriptor, xt = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Ge(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (i ? a(t, s, n) : a(n)) || n);
  return i && n && Xe(t, s, n), n;
};
let Y = class extends b {
  constructor() {
    super(...arguments), this.config = {};
  }
  setConfig(e) {
    this.config = e;
  }
  getCardSize() {
    return 12;
  }
  render() {
    if (!this.hass) return l;
    const { showOverview: e, showPositions: t, showPies: s } = q(this.config, this.hass.states);
    return p`
      ${e ? p`<investment-overview-card
        .hass=${this.hass} .config=${this.config}></investment-overview-card>` : l}
      ${t ? p`<investment-positions-card
        .hass=${this.hass} .config=${this.config}></investment-positions-card>` : l}
      ${s ? p`<investment-pies-card
        .hass=${this.hass} .config=${this.config}></investment-pies-card>` : l}`;
  }
};
Y.styles = [N];
xt([
  $({ attribute: !1 })
], Y.prototype, "hass", 2);
xt([
  $({ attribute: !1 })
], Y.prototype, "config", 2);
Y = xt([
  P("investment-portfolio-card")
], Y);
var Ze = Object.defineProperty, Je = Object.getOwnPropertyDescriptor, wt = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Je(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (i ? a(t, s, n) : a(n)) || n);
  return i && n && Ze(t, s, n), n;
};
function z(e, t) {
  if (!t) return "—";
  const s = e.states[t]?.state;
  if (!s || s === "unavailable" || s === "unknown") return "—";
  const i = parseFloat(s);
  return isNaN(i) ? s : i.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function Mt(e, t) {
  if (!t) return "";
  const s = parseFloat(e.states[t]?.state ?? "");
  return isNaN(s) ? "" : s >= 0 ? "positive" : "negative";
}
let tt = class extends b {
  constructor() {
    super(...arguments), this.config = {};
  }
  setConfig(e) {
    this.config = e;
  }
  getCardSize() {
    return 4;
  }
  render() {
    if (!this.hass) return l;
    const { account: e } = q(this.config, this.hass.states), t = e.total_value ? parseFloat(this.hass.states[e.total_value]?.state ?? "") : NaN, s = isNaN(t) ? "—" : t.toLocaleString(void 0, { maximumFractionDigits: 2 }), i = Mt(this.hass, e.unrealized_pnl), n = z(this.hass, e.unrealized_pnl), o = z(this.hass, e.result_percent), a = i === "positive" ? "+" : "", d = Mt(this.hass, e.daily_gain_loss), r = z(this.hass, e.daily_gain_loss), v = z(this.hass, e.daily_gain_loss_percent), u = d === "positive" ? "+" : "", c = e.top_daily_mover ? this.hass.states[e.top_daily_mover] : void 0, h = e.bottom_daily_mover ? this.hass.states[e.bottom_daily_mover] : void 0, f = c?.attributes?.change_pct, _ = h?.attributes?.change_pct, m = (f ?? 0) >= 0 ? "positive" : "negative", y = (_ ?? 0) >= 0 ? "positive" : "negative";
    return p`
      <ha-card>
        <div class="hero">
          <div class="hero-label">Portfolio Value</div>
          <div class="hero-value">${s}</div>
          ${n !== "—" ? p`
            <div class="hero-sub ${i}">
              ${a}${n} · ${a}${o}% all time
            </div>` : l}
        </div>

        ${e.total_value ? p`
          <div class="sparkline-wrap">
            <investment-sparkline
              .hass=${this.hass}
              .entityId=${e.total_value}
              .width=${460}
              .height=${72}
            ></investment-sparkline>
          </div>` : l}

        <hr class="divider" />

        <div class="today-label">Today</div>
        <div class="today-row">
          <span class="today-value ${d}">${u}${r}</span>
          <span class="today-pct ${d}">${u}${v}%</span>
        </div>

        ${c || h ? p`
          <div class="movers">
            ${c && f != null ? p`
              <div class="mover-line">
                <span class="mover-name ${m}">
                  <span class="mover-arrow">▲</span>${c.state}
                </span>
                <span class="mover-pct ${m}">+${f.toFixed(2)}%</span>
              </div>` : l}
            ${h && _ != null ? p`
              <div class="mover-line">
                <span class="mover-name ${y}">
                  <span class="mover-arrow">▼</span>${h.state}
                </span>
                <span class="mover-pct ${y}">${_.toFixed(2)}%</span>
              </div>` : l}
          </div>` : l}

        <hr class="divider" />

        <div class="footer">
          <div class="footer-stat">
            <span class="footer-label">Invested</span>
            <span class="footer-value">${z(this.hass, e.invested)}</span>
          </div>
          <div class="footer-stat">
            <span class="footer-label">Cash</span>
            <span class="footer-value">${z(this.hass, e.cash_available)}</span>
          </div>
          <div class="footer-stat">
            <span class="footer-label">Dividends</span>
            <span class="footer-value">${z(this.hass, e.total_dividends)}</span>
          </div>
        </div>
      </ha-card>`;
  }
};
tt.styles = [
  N,
  ot`
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
    `
];
wt([
  $({ attribute: !1 })
], tt.prototype, "hass", 2);
wt([
  $({ attribute: !1 })
], tt.prototype, "config", 2);
tt = wt([
  P("investment-health-card")
], tt);
var Ke = Object.defineProperty, Qe = Object.getOwnPropertyDescriptor, vt = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Qe(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (i ? a(t, s, n) : a(n)) || n);
  return i && n && Ke(t, s, n), n;
};
function Ft(e, t, s) {
  let i = 0;
  for (const n of e) {
    const o = Math.max(
      s * s * n / (t * t),
      t * t / (s * s * n)
    );
    o > i && (i = o);
  }
  return i;
}
function _t(e, t, s, i, n, o, a) {
  if (!e.length || n <= 0 || o <= 0) return;
  if (e.length === 1) {
    a[e[0].idx] = { x: s, y: i, w: n, h: o };
    return;
  }
  const d = Math.min(n, o);
  let r = [], v = 0, u = 0;
  for (let _ = 0; _ < e.length; _++) {
    const m = e[_].value, y = [...r, m], S = v + m;
    if (r.length === 0 || Ft(y, S, d) <= Ft(r, v, d))
      r = y, v = S, u = _ + 1;
    else break;
  }
  const c = n >= o, h = c ? n : o, f = v / t * h;
  if (c) {
    let _ = i;
    for (let m = 0; m < u; m++)
      a[e[m].idx] = { x: s, y: _, w: f, h: o * (e[m].value / v) }, _ += o * (e[m].value / v);
    _t(e.slice(u), t - v, s + f, i, n - f, o, a);
  } else {
    let _ = s;
    for (let m = 0; m < u; m++)
      a[e[m].idx] = { x: _, y: i, w: n * (e[m].value / v), h: f }, _ += n * (e[m].value / v);
    _t(e.slice(u), t - v, s, i + f, n, o - f, a);
  }
}
function Ye(e, t, s) {
  if (!e.length || t <= 0 || s <= 0) return [];
  const i = e.reduce((d, r) => d + r, 0);
  if (i === 0) return e.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  const n = t * s, o = e.map((d, r) => ({ idx: r, value: d / i * n })).sort((d, r) => r.value - d.value), a = new Array(e.length);
  return _t(o, n, 0, 0, t, s, a), a;
}
function ts(e) {
  const s = (0.12 + Math.min(Math.abs(e) / 10, 1) * 0.22).toFixed(2);
  return e >= 0 ? `rgba(76,175,80,${s})` : `rgba(244,67,54,${s})`;
}
function es(e) {
  let t = 0;
  for (let s = 0; s < e.length; s++) t = t * 31 + e.charCodeAt(s) & 65535;
  return `hsl(${t * 137 % 360},50%,38%)`;
}
function ss(e) {
  return e.replace(/[_\s]+(US[_\s]*)?EQ$/i, "").replace(/[_\s]+L$/i, "");
}
let B = class extends b {
  constructor() {
    super(...arguments), this.config = {}, this._containerW = 0;
  }
  setConfig(e) {
    this.config = e;
  }
  getCardSize() {
    return 5;
  }
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver((e) => {
      this._containerW = e[0].contentRect.width;
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect(), this._ro = void 0;
  }
  firstUpdated() {
    const e = this.shadowRoot?.querySelector(".treemap-wrap");
    e && (this._wrapEl = e, this._ro?.observe(e));
  }
  updated() {
    const e = this._wrapEl ?? this.shadowRoot?.querySelector(".treemap-wrap");
    if (e) {
      const t = e.offsetWidth;
      t > 0 && t !== this._containerW && (this._containerW = t);
    }
  }
  render() {
    if (!this.hass) return l;
    const e = this.config, t = e.mode ?? "positions", s = e.pie, i = e.treemap_height ?? 420, { positions: n, pies: o } = q(this.config, this.hass.states);
    let a;
    if (t === "pies")
      a = o.map((c) => {
        const h = c.value ? this.hass.states[c.value]?.state : void 0, f = c.pnl_percent ? this.hass.states[c.pnl_percent]?.state : void 0, _ = parseFloat(h ?? ""), m = parseFloat(f ?? "");
        return {
          label: c.name,
          value: isNaN(_) || _ <= 0 ? 0 : _,
          pnlPct: isNaN(m) ? 0 : m
        };
      }).filter((c) => c.value > 0);
    else {
      let c = n;
      if (s) {
        const f = `${e.prefix ?? "sensor.trading212_"}${s}_value`, _ = this.hass.states[f]?.attributes?.tickers ?? [];
        if (_.length > 0) {
          const m = new Set(_.map((y) => y.toLowerCase()));
          c = n.filter((y) => m.has((y.ticker ?? "").toLowerCase()));
        }
      }
      a = c.map((h) => {
        const f = h.value ? this.hass.states[h.value]?.state : void 0, _ = h.pnl_percent ? this.hass.states[h.pnl_percent]?.state : void 0, m = parseFloat(f ?? ""), y = parseFloat(_ ?? "");
        return {
          label: ss(h.ticker ?? h.name),
          value: isNaN(m) || m <= 0 ? 0 : m,
          pnlPct: isNaN(y) ? 0 : y
        };
      }).filter((h) => h.value > 0);
    }
    if (a.length === 0)
      return p`<ha-card><div class="warning">No ${t} data available.</div></ha-card>`;
    s && (o.find((c) => {
      const h = e.prefix ?? "sensor.trading212_";
      return c.value === `${h}${s}_value`;
    })?.name ?? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
    const d = t === "pies" ? "Each pie in your portfolio weighted by value and coloured by overall P&L" : s ? "Each position in this pie weighted by value and coloured by overall P&L" : "Each position in your portfolio weighted by value and coloured by P&L", r = this._containerW, v = r > 0 ? Ye(a.map((c) => c.value), r, i) : [], u = 3;
    return p`
      <ha-card>
        <div class="alloc-header">
          <div class="alloc-title">Asset Allocation</div>
          <div class="alloc-subtitle">${d}</div>
        </div>
        <div class="treemap-wrap" style="height:${i}px">
          ${a.map((c, h) => {
      const f = v[h];
      if (!f) return l;
      const _ = f.x + u / 2, m = f.y + u / 2, y = f.w - u, S = f.h - u;
      if (y < 2 || S < 2) return l;
      const Zt = ts(c.pnlPct), Jt = c.pnlPct >= 0 ? "positive" : "negative", At = `${c.pnlPct >= 0 ? "+" : ""}${c.pnlPct.toFixed(2)}%`, Kt = y >= 52 && S >= 72, Qt = y >= 28 && S >= 36, Yt = y >= 36 && S >= 54, te = c.label.charAt(0).toUpperCase();
      return p`
              <div
                class="treemap-cell"
                style="left:${_}px;top:${m}px;width:${y}px;height:${S}px;background:${Zt}"
                title="${c.label}: ${At} P&L"
              >
                ${Kt ? p`
                  <div class="cell-avatar" style="background:${es(c.label)}">${te}</div>
                ` : l}
                ${Qt ? p`<div class="cell-ticker">${c.label}</div>` : l}
                ${Yt ? p`<div class="cell-pct ${Jt}">${At}</div>` : l}
              </div>`;
    })}
        </div>
      </ha-card>`;
  }
};
B.styles = [
  N,
  ot`
      .alloc-header {
        padding: 16px 16px 4px;
      }
      .alloc-title {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--secondary-text-color);
      }
      .alloc-subtitle {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        margin-top: 2px;
        line-height: 1.4;
        min-height: 2.8em;
      }
      .treemap-wrap {
        margin: 12px;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
      }
      .treemap-cell {
        position: absolute;
        box-sizing: border-box;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: filter 0.12s;
      }
      .treemap-cell:hover { filter: brightness(0.9); }
      .cell-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: white;
        flex-shrink: 0;
        margin-bottom: 2px;
      }
      .cell-ticker {
        font-weight: 600;
        font-size: 0.78rem;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 90%;
        color: var(--primary-text-color);
        line-height: 1.2;
      }
      .cell-pct {
        font-size: 0.68rem;
        font-weight: 500;
        margin-top: 1px;
        text-align: center;
        line-height: 1.2;
      }
      .cell-pct.positive { color: var(--success-color, #4caf50); }
      .cell-pct.negative { color: var(--error-color, #f44336); }
    `
];
vt([
  $({ attribute: !1 })
], B.prototype, "hass", 2);
vt([
  $({ attribute: !1 })
], B.prototype, "config", 2);
vt([
  lt()
], B.prototype, "_containerW", 2);
B = vt([
  P("investment-allocation-card")
], B);
window.customCards = window.customCards ?? [];
window.customCards.push(
  {
    type: "investment-allocation-card",
    name: "Investment Allocation",
    description: "Treemap showing portfolio weight and P&L per position"
  },
  {
    type: "investment-health-card",
    name: "Investment Health",
    description: "Portfolio value, 7-day trend, today's P&L, and movers at a glance"
  },
  {
    type: "investment-portfolio-card",
    name: "Investment Portfolio",
    description: "Full portfolio view: overview, positions, and pies"
  },
  {
    type: "investment-overview-card",
    name: "Investment Overview",
    description: "Account summary and daily movers"
  },
  {
    type: "investment-positions-card",
    name: "Investment Positions",
    description: "Scrollable positions list with sparklines"
  },
  {
    type: "investment-pies-card",
    name: "Investment Pies",
    description: "Scrollable pies / buckets list"
  }
);
