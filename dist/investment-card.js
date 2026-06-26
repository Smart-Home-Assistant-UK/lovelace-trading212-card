/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, ot = X.ShadowRoot && (X.ShadyCSS === void 0 || X.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lt = Symbol(), _t = /* @__PURE__ */ new WeakMap();
let Ot = class {
  constructor(t, e, n) {
    if (this._$cssResult$ = !0, n !== lt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ot && t === void 0) {
      const n = e !== void 0 && e.length === 1;
      n && (t = _t.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && _t.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const jt = (s) => new Ot(typeof s == "string" ? s : s + "", void 0, lt), tt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((n, i, r) => n + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[r + 1], s[0]);
  return new Ot(e, s, lt);
}, It = (s, t) => {
  if (ot) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const n = document.createElement("style"), i = X.litNonce;
    i !== void 0 && n.setAttribute("nonce", i), n.textContent = e.cssText, s.appendChild(n);
  }
}, ft = ot ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const n of t.cssRules) e += n.cssText;
  return jt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: kt, defineProperty: Ft, getOwnPropertyDescriptor: Lt, getOwnPropertyNames: Bt, getOwnPropertySymbols: qt, getPrototypeOf: Vt } = Object, w = globalThis, gt = w.trustedTypes, Wt = gt ? gt.emptyScript : "", Gt = w.reactiveElementPolyfillSupport, k = (s, t) => s, Q = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Wt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, ct = (s, t) => !kt(s, t), yt = { attribute: !0, type: String, converter: Q, reflect: !1, useDefault: !1, hasChanged: ct };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let z = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = yt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const n = Symbol(), i = this.getPropertyDescriptor(t, n, e);
      i !== void 0 && Ft(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: i, set: r } = Lt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: i, set(a) {
      const l = i?.call(this);
      r?.call(this, a), this.requestUpdate(t, l, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? yt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const t = Vt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const e = this.properties, n = [...Bt(e), ...qt(e)];
      for (const i of n) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [n, i] of e) this.elementProperties.set(n, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, n] of this.elementProperties) {
      const i = this._$Eu(e, n);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const i of n) e.unshift(ft(i));
    } else t !== void 0 && e.push(ft(t));
    return e;
  }
  static _$Eu(t, e) {
    const n = e.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const n of e.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return It(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, n) {
    this._$AK(t, n);
  }
  _$ET(t, e) {
    const n = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, n);
    if (i !== void 0 && n.reflect === !0) {
      const r = (n.converter?.toAttribute !== void 0 ? n.converter : Q).toAttribute(e, n.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const n = this.constructor, i = n._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const r = n.getPropertyOptions(i), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Q;
      this._$Em = i;
      const l = a.fromAttribute(e, r.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, n, i = !1, r) {
    if (t !== void 0) {
      const a = this.constructor;
      if (i === !1 && (r = this[t]), n ?? (n = a.getPropertyOptions(t)), !((n.hasChanged ?? ct)(r, e) || n.useDefault && n.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, n)))) return;
      this.C(t, e, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: n, reflect: i, wrapped: r }, a) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
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
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [i, r] of n) {
        const { wrapped: a } = r, l = this[i];
        a !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, r, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((n) => n.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[k("elementProperties")] = /* @__PURE__ */ new Map(), z[k("finalized")] = /* @__PURE__ */ new Map(), Gt?.({ ReactiveElement: z }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, bt = (s) => s, Y = F.trustedTypes, xt = Y ? Y.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Nt = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, Ut = "?" + x, Zt = `<${Ut}>`, O = document, B = () => O.createComment(""), q = (s) => s === null || typeof s != "object" && typeof s != "function", pt = Array.isArray, Jt = (s) => pt(s) || typeof s?.[Symbol.iterator] == "function", at = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, wt = /-->/g, At = />/g, P = RegExp(`>|${at}(?:([^\\s"'>=/]+)(${at}*=${at}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Pt = /'/g, Ct = /"/g, zt = /^(?:script|style|textarea|title)$/i, Dt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), u = Dt(1), Kt = Dt(2), D = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), Et = /* @__PURE__ */ new WeakMap(), S = O.createTreeWalker(O, 129);
function Ht(s, t) {
  if (!pt(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return xt !== void 0 ? xt.createHTML(t) : t;
}
const Xt = (s, t) => {
  const e = s.length - 1, n = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = I;
  for (let l = 0; l < e; l++) {
    const o = s[l];
    let h, p, d = -1, $ = 0;
    for (; $ < o.length && (a.lastIndex = $, p = a.exec(o), p !== null); ) $ = a.lastIndex, a === I ? p[1] === "!--" ? a = wt : p[1] !== void 0 ? a = At : p[2] !== void 0 ? (zt.test(p[2]) && (i = RegExp("</" + p[2], "g")), a = P) : p[3] !== void 0 && (a = P) : a === P ? p[0] === ">" ? (a = i ?? I, d = -1) : p[1] === void 0 ? d = -2 : (d = a.lastIndex - p[2].length, h = p[1], a = p[3] === void 0 ? P : p[3] === '"' ? Ct : Pt) : a === Ct || a === Pt ? a = P : a === wt || a === At ? a = I : (a = P, i = void 0);
    const m = a === P && s[l + 1].startsWith("/>") ? " " : "";
    r += a === I ? o + Zt : d >= 0 ? (n.push(h), o.slice(0, d) + Nt + o.slice(d) + x + m) : o + x + (d === -2 ? l : m);
  }
  return [Ht(s, r + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class V {
  constructor({ strings: t, _$litType$: e }, n) {
    let i;
    this.parts = [];
    let r = 0, a = 0;
    const l = t.length - 1, o = this.parts, [h, p] = Xt(t, e);
    if (this.el = V.createElement(h, n), S.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = S.nextNode()) !== null && o.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(Nt)) {
          const $ = p[a++], m = i.getAttribute(d).split(x), y = /([.?@])?(.*)/.exec($);
          o.push({ type: 1, index: r, name: y[2], strings: m, ctor: y[1] === "." ? Yt : y[1] === "?" ? te : y[1] === "@" ? ee : et }), i.removeAttribute(d);
        } else d.startsWith(x) && (o.push({ type: 6, index: r }), i.removeAttribute(d));
        if (zt.test(i.tagName)) {
          const d = i.textContent.split(x), $ = d.length - 1;
          if ($ > 0) {
            i.textContent = Y ? Y.emptyScript : "";
            for (let m = 0; m < $; m++) i.append(d[m], B()), S.nextNode(), o.push({ type: 2, index: ++r });
            i.append(d[$], B());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ut) o.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(x, d + 1)) !== -1; ) o.push({ type: 7, index: r }), d += x.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const n = O.createElement("template");
    return n.innerHTML = t, n;
  }
}
function H(s, t, e = s, n) {
  if (t === D) return t;
  let i = n !== void 0 ? e._$Co?.[n] : e._$Cl;
  const r = q(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(s), i._$AT(s, e, n)), n !== void 0 ? (e._$Co ?? (e._$Co = []))[n] = i : e._$Cl = i), i !== void 0 && (t = H(s, i._$AS(s, t.values), i, n)), t;
}
class Qt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: n } = this._$AD, i = (t?.creationScope ?? O).importNode(e, !0);
    S.currentNode = i;
    let r = S.nextNode(), a = 0, l = 0, o = n[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let h;
        o.type === 2 ? h = new J(r, r.nextSibling, this, t) : o.type === 1 ? h = new o.ctor(r, o.name, o.strings, this, t) : o.type === 6 && (h = new se(r, this, t)), this._$AV.push(h), o = n[++l];
      }
      a !== o?.index && (r = S.nextNode(), a++);
    }
    return S.currentNode = O, i;
  }
  p(t) {
    let e = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, e), e += n.strings.length - 2) : n._$AI(t[e])), e++;
  }
}
class J {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, n, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = n, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = H(this, t, e), q(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== D && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Jt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(O.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: n } = t, i = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = V.createElement(Ht(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const r = new Qt(i, this), a = r.u(this.options);
      r.p(e), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = Et.get(t.strings);
    return e === void 0 && Et.set(t.strings, e = new V(t)), e;
  }
  k(t) {
    pt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let n, i = 0;
    for (const r of t) i === e.length ? e.push(n = new J(this.O(B()), this.O(B()), this, this.options)) : n = e[i], n._$AI(r), i++;
    i < e.length && (this._$AR(n && n._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const n = bt(t).nextSibling;
      bt(t).remove(), t = n;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class et {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, n, i, r) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = c;
  }
  _$AI(t, e = this, n, i) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = H(this, t, e, 0), a = !q(t) || t !== this._$AH && t !== D, a && (this._$AH = t);
    else {
      const l = t;
      let o, h;
      for (t = r[0], o = 0; o < r.length - 1; o++) h = H(this, l[n + o], e, o), h === D && (h = this._$AH[o]), a || (a = !q(h) || h !== this._$AH[o]), h === c ? t = c : t !== c && (t += (h ?? "") + r[o + 1]), this._$AH[o] = h;
    }
    a && !i && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Yt extends et {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class te extends et {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class ee extends et {
  constructor(t, e, n, i, r) {
    super(t, e, n, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = H(this, t, e, 0) ?? c) === D) return;
    const n = this._$AH, i = t === c && n !== c || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, r = t !== c && (n === c || i);
    i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class se {
  constructor(t, e, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    H(this, t);
  }
}
const ie = F.litHtmlPolyfillSupport;
ie?.(V, J), (F.litHtmlVersions ?? (F.litHtmlVersions = [])).push("3.3.3");
const ne = (s, t, e) => {
  const n = e?.renderBefore ?? t;
  let i = n._$litPart$;
  if (i === void 0) {
    const r = e?.renderBefore ?? null;
    n._$litPart$ = i = new J(t.insertBefore(B(), r), r, void 0, e ?? {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis;
class _ extends z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ne(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return D;
  }
}
_._$litElement$ = !0, _.finalized = !0, L.litElementHydrateSupport?.({ LitElement: _ });
const re = L.litElementPolyfillSupport;
re?.({ LitElement: _ });
(L.litElementVersions ?? (L.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ae = { attribute: !0, type: String, converter: Q, reflect: !1, hasChanged: ct }, oe = (s = ae, t, e) => {
  const { kind: n, metadata: i } = e;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), n === "setter" && ((s = Object.create(s)).wrapped = !0), r.set(e.name, s), n === "accessor") {
    const { name: a } = e;
    return { set(l) {
      const o = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(a, o, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, s, l), l;
    } };
  }
  if (n === "setter") {
    const { name: a } = e;
    return function(l) {
      const o = this[a];
      t.call(this, l), this.requestUpdate(a, o, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function v(s) {
  return (t, e) => typeof e == "object" ? oe(s, t, e) : ((n, i, r) => {
    const a = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, n), a ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function dt(s) {
  return v({ ...s, state: !0, attribute: !1 });
}
const N = tt`
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
    display: grid;
    grid-template-columns: 1fr auto auto 60px;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--divider-color);
    cursor: pointer;
    user-select: none;
  }

  .list-item:last-child { border-bottom: none; }

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
  }

  .item-pnl {
    font-size: 0.8rem;
    text-align: right;
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
`, le = "sensor.trading212_", ce = "400px";
function Tt(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Mt(s) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
}
function pe(s) {
  return {
    total_value: `${s}total_value`,
    invested: `${s}invested`,
    unrealized_pnl: `${s}unrealized_pnl`,
    result_percent: `${s}result_percent`,
    daily_gain_loss: `${s}daily_gain_loss`,
    daily_gain_loss_percent: `${s}daily_gain_loss_percent`,
    cash_available: `${s}cash_available`,
    total_dividends: `${s}total_dividends`,
    top_daily_mover: `${s}top_daily_mover`,
    bottom_daily_mover: `${s}bottom_daily_mover`
  };
}
function Rt(s, t) {
  const e = s[t];
  return !!e && e.state !== "unavailable" && e.state !== "unknown";
}
function de(s, t) {
  const e = new RegExp(`^${Tt(s)}(.+)_quantity$`), n = [];
  for (const i of Object.keys(t)) {
    const r = i.match(e);
    r && Rt(t, `${s}${r[1]}_value`) && n.push(r[1]);
  }
  return n.map((i) => ({
    name: Mt(i),
    ticker: i.toUpperCase(),
    value: `${s}${i}_value`,
    pnl: `${s}${i}_pnl`,
    pnl_percent: `${s}${i}_pnl_percent`,
    current_price: `${s}${i}_current_price`,
    quantity: `${s}${i}_quantity`,
    avg_price: `${s}${i}_avg_price`,
    history_entity: `${s}${i}_value`
  }));
}
function he(s, t) {
  const e = new RegExp(`^${Tt(s)}(.+)_invested$`), n = [];
  for (const i of Object.keys(t)) {
    const r = i.match(e);
    r && r[1] && Rt(t, `${s}${r[1]}_value`) && n.push(r[1]);
  }
  return n.map((i) => ({
    name: Mt(i),
    value: `${s}${i}_value`,
    pnl: `${s}${i}_pnl`,
    pnl_percent: `${s}${i}_pnl_percent`,
    invested: `${s}${i}_invested`,
    cash: `${s}${i}_cash`,
    progress: `${s}${i}_progress`,
    goal: `${s}${i}_goal`,
    dividends_gained: `${s}${i}_dividends_gained`,
    dividends_in_cash: `${s}${i}_dividends_in_cash`,
    dividends_reinvested: `${s}${i}_dividends_reinvested`
  }));
}
function K(s, t) {
  const e = s ?? {}, n = e.max_height ?? ce, i = e.show_overview ?? !0, r = e.show_positions ?? !0, a = e.show_pies ?? !0;
  if (e.positions !== void 0 || e.pies !== void 0) {
    const o = (e.positions ?? []).map((p) => ({
      name: p.name,
      value: p.value,
      pnl: p.pnl,
      pnl_percent: p.pnl_percent,
      current_price: p.current_price,
      quantity: p.quantity,
      avg_price: p.avg_price,
      history_entity: p.history_entity ?? p.value
    })), h = (e.pies ?? []).map((p) => ({ ...p }));
    return {
      account: e.currency_sensor ? { total_value: e.currency_sensor } : {},
      positions: o,
      pies: h,
      maxHeight: n,
      showOverview: i,
      showPositions: r,
      showPies: a
    };
  }
  const l = e.prefix ?? le;
  return {
    account: pe(l),
    positions: de(l, t),
    pies: he(l, t),
    maxHeight: n,
    showOverview: i,
    showPositions: r,
    showPies: a
  };
}
var ue = Object.defineProperty, ve = Object.getOwnPropertyDescriptor, ht = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? ve(t, e) : t, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (i = (n ? a(t, e, i) : a(i)) || i);
  return n && i && ue(t, e, i), i;
};
function b(s, t, e, n = !1) {
  if (!t) return c;
  const i = s.states[t]?.state ?? "unavailable", r = i === "unavailable" || i === "unknown", a = parseFloat(i), l = n && !isNaN(a) ? a >= 0 ? "positive" : "negative" : "", o = r ? "—" : isNaN(a) ? i : a.toLocaleString(void 0, { maximumFractionDigits: 2 });
  return u`
    <div class="stat-chip">
      <span class="stat-label">${e}</span>
      <span class="stat-value ${l}">${o}</span>
    </div>`;
}
let W = class extends _ {
  constructor() {
    super(...arguments), this.config = {};
  }
  setConfig(s) {
    this.config = s;
  }
  getCardSize() {
    return 4;
  }
  render() {
    if (!this.hass) return c;
    const { account: s } = K(this.config, this.hass.states), t = s.top_daily_mover ? this.hass.states[s.top_daily_mover] : void 0, e = s.bottom_daily_mover ? this.hass.states[s.bottom_daily_mover] : void 0, n = t?.attributes?.change_value, i = t?.attributes?.change_pct, r = e?.attributes?.change_value, a = e?.attributes?.change_pct, l = n == null ? "" : n >= 0 ? "positive" : "negative", o = r == null ? "" : r >= 0 ? "positive" : "negative", h = n != null && n >= 0 ? "+" : "", p = r != null && r >= 0 ? "+" : "";
    return u`
      <ha-card>
        <div class="stat-grid">
          ${b(this.hass, s.total_value, "Total Value")}
          ${b(this.hass, s.invested, "Invested")}
          ${b(this.hass, s.unrealized_pnl, "Unrealised P&L", !0)}
          ${b(this.hass, s.result_percent, "Return %", !0)}
          ${b(this.hass, s.daily_gain_loss, "Today's P&L", !0)}
          ${b(this.hass, s.daily_gain_loss_percent, "Today %", !0)}
          ${b(this.hass, s.cash_available, "Cash")}
          ${b(this.hass, s.total_dividends, "Dividends")}
        </div>
        <div class="mover-row">
          <div class="mover-chip">
            <div class="mover-label">Top Mover</div>
            <div class="mover-name ${l}">${t?.state ?? "—"}</div>
            ${n != null && i != null ? u`<div class="mover-change ${l}">
              ${h}${n.toFixed(2)} (${i.toFixed(2)}%)</div>` : c}
          </div>
          <div class="mover-chip">
            <div class="mover-label">Bottom Mover</div>
            <div class="mover-name ${o}">${e?.state ?? "—"}</div>
            ${r != null && a != null ? u`<div class="mover-change ${o}">
              ${p}${r.toFixed(2)} (${a.toFixed(2)}%)</div>` : c}
          </div>
        </div>
      </ha-card>`;
  }
};
W.styles = [N];
ht([
  v({ attribute: !1 })
], W.prototype, "hass", 2);
ht([
  v({ attribute: !1 })
], W.prototype, "config", 2);
W = ht([
  A("investment-overview-card")
], W);
var $e = Object.defineProperty, me = Object.getOwnPropertyDescriptor, U = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? me(t, e) : t, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (i = (n ? a(t, e, i) : a(i)) || i);
  return n && i && $e(t, e, i), i;
};
let g = class extends _ {
  constructor() {
    super(...arguments), this.entityId = "", this.wide = !1, this.width = 0, this.height = 0, this._points = [], this._timer = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = setInterval(() => this._fetchHistory(), 36e5);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._timer !== null && (clearInterval(this._timer), this._timer = null);
  }
  updated(s) {
    s.has("entityId") && this._fetchHistory();
  }
  async _fetchHistory() {
    if (!this.hass || !this.entityId) return;
    const s = /* @__PURE__ */ new Date(), t = new Date(s.getTime() - 7 * 24 * 60 * 60 * 1e3);
    try {
      const e = await this.hass.callApi(
        "GET",
        `history/period/${t.toISOString()}?filter_entity_id=${this.entityId}&end_time=${s.toISOString()}&minimal_response=true&no_attributes=true`
      );
      this._points = (e?.[0] ?? []).map((n) => parseFloat(n.state)).filter((n) => !isNaN(n));
    } catch {
      this._points = [];
    }
  }
  _buildPath(s, t) {
    const e = this._points;
    if (e.length < 2) return "";
    const n = Math.min(...e), r = Math.max(...e) - n || 1, a = t * 0.1;
    return `M ${e.map((o, h) => {
      const p = h / (e.length - 1) * s, d = t - a - (o - n) / r * (t - a * 2);
      return `${p.toFixed(1)},${d.toFixed(1)}`;
    }).join(" L ")}`;
  }
  render() {
    if (this._points.length < 2) return c;
    const s = this.width || (this.wide ? 200 : 60), t = this.height || (this.wide ? 60 : 28), e = this._buildPath(s, t), i = this._points[this._points.length - 1] >= this._points[0] ? "var(--success-color, #4caf50)" : "var(--error-color, #f44336)";
    return u`${Kt`<svg width="${s}" height="${t}" viewBox="0 0 ${s} ${t}">
      <path d="${e}" fill="none" stroke="${i}" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`}`;
  }
};
g.styles = tt`
    :host { display: block; }
    svg { display: block; }
  `;
U([
  v({ attribute: !1 })
], g.prototype, "hass", 2);
U([
  v({ type: String })
], g.prototype, "entityId", 2);
U([
  v({ type: Boolean })
], g.prototype, "wide", 2);
U([
  v({ type: Number })
], g.prototype, "width", 2);
U([
  v({ type: Number })
], g.prototype, "height", 2);
U([
  dt()
], g.prototype, "_points", 2);
g = U([
  A("investment-sparkline")
], g);
var _e = Object.defineProperty, fe = Object.getOwnPropertyDescriptor, st = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? fe(t, e) : t, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (i = (n ? a(t, e, i) : a(i)) || i);
  return n && i && _e(t, e, i), i;
};
function C(s, t) {
  if (!t) return "—";
  const e = s.states[t]?.state;
  if (!e || e === "unavailable" || e === "unknown") return "—";
  const n = parseFloat(e);
  return isNaN(n) ? e : n.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function ge(s, t) {
  if (!t) return "";
  const e = parseFloat(s.states[t]?.state ?? "");
  return isNaN(e) ? "" : e >= 0 ? "positive" : "negative";
}
let T = class extends _ {
  constructor() {
    super(...arguments), this.expanded = !1;
  }
  _toggle() {
    this.dispatchEvent(new CustomEvent("toggle-expand", { bubbles: !0, composed: !0 }));
  }
  render() {
    const { position: s, hass: t } = this;
    return u`
      <div class="list-item" @click=${this._toggle}>
        <div>
          <div class="item-name">${s.name}</div>
          ${s.ticker ? u`<div class="item-ticker">${s.ticker}</div>` : c}
        </div>
        <div class="item-value">${C(t, s.value)}</div>
        <div class="item-pnl ${ge(t, s.pnl)}">
          ${C(t, s.pnl)}<br/>
          <span style="font-size:0.75rem">${C(t, s.pnl_percent) === "—" ? "—" : `${C(t, s.pnl_percent)}%`}</span>
        </div>
        <investment-sparkline .hass=${t} .entityId=${s.history_entity}></investment-sparkline>
      </div>
      ${this.expanded ? u`
        <div class="expand-panel">
          <div class="expand-stat">
            <span class="expand-label">Quantity</span>
            <span class="expand-value">${C(t, s.quantity)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Avg Price</span>
            <span class="expand-value">${C(t, s.avg_price)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Current Price</span>
            <span class="expand-value">${C(t, s.current_price)}</span>
          </div>
          <investment-sparkline .hass=${t} .entityId=${s.history_entity} wide></investment-sparkline>
        </div>` : c}
    `;
  }
};
T.styles = [N];
st([
  v({ attribute: !1 })
], T.prototype, "hass", 2);
st([
  v({ attribute: !1 })
], T.prototype, "position", 2);
st([
  v({ type: Boolean })
], T.prototype, "expanded", 2);
T = st([
  A("investment-position-row")
], T);
var ye = Object.defineProperty, be = Object.getOwnPropertyDescriptor, it = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? be(t, e) : t, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (i = (n ? a(t, e, i) : a(i)) || i);
  return n && i && ye(t, e, i), i;
};
let M = class extends _ {
  constructor() {
    super(...arguments), this.config = {}, this._expanded = null;
  }
  setConfig(s) {
    this.config = s;
  }
  getCardSize() {
    return 5;
  }
  render() {
    if (!this.hass) return c;
    const { positions: s, maxHeight: t } = K(this.config, this.hass.states);
    return s.length === 0 ? u`<ha-card><div class="warning">
        No positions found. Check your sensor prefix or mapping.
      </div></ha-card>` : u`
      <ha-card>
        <div class="list-container" style="max-height:${t}">
          ${s.map((e) => u`
            <investment-position-row
              .hass=${this.hass}
              .position=${e}
              .expanded=${this._expanded === e.value}
              @toggle-expand=${() => {
      this._expanded = this._expanded === e.value ? null : e.value;
    }}
            ></investment-position-row>`)}
        </div>
      </ha-card>`;
  }
};
M.styles = [N];
it([
  v({ attribute: !1 })
], M.prototype, "hass", 2);
it([
  v({ attribute: !1 })
], M.prototype, "config", 2);
it([
  dt()
], M.prototype, "_expanded", 2);
M = it([
  A("investment-positions-card")
], M);
var xe = Object.defineProperty, we = Object.getOwnPropertyDescriptor, nt = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? we(t, e) : t, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (i = (n ? a(t, e, i) : a(i)) || i);
  return n && i && xe(t, e, i), i;
};
function f(s, t) {
  if (!t) return "—";
  const e = s.states[t]?.state;
  if (!e || e === "unavailable" || e === "unknown") return "—";
  const n = parseFloat(e);
  return isNaN(n) ? e : n.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function Ae(s, t) {
  if (!t) return "";
  const e = parseFloat(s.states[t]?.state ?? "");
  return isNaN(e) ? "" : e >= 0 ? "positive" : "negative";
}
function Pe(s, t) {
  return t ? Math.min(100, Math.max(0, parseFloat(s.states[t]?.state ?? "0") || 0)) : 0;
}
let R = class extends _ {
  constructor() {
    super(...arguments), this.expanded = !1;
  }
  _toggle() {
    this.dispatchEvent(new CustomEvent("toggle-expand", { bubbles: !0, composed: !0 }));
  }
  render() {
    const { pie: s, hass: t } = this, e = Pe(t, s.progress);
    return u`
      <div class="list-item" @click=${this._toggle}>
        <div>
          <div class="item-name">${s.name}</div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${e}%"></div>
          </div>
        </div>
        <div class="item-value">${f(t, s.value)}</div>
        <div class="item-pnl ${Ae(t, s.pnl_percent)}">${f(t, s.pnl_percent) === "—" ? "—" : `${f(t, s.pnl_percent)}%`}</div>
      </div>
      ${this.expanded ? u`
        <div class="expand-panel">
          <div class="expand-stat">
            <span class="expand-label">Invested</span>
            <span class="expand-value">${f(t, s.invested)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Cash</span>
            <span class="expand-value">${f(t, s.cash)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Goal</span>
            <span class="expand-value">${f(t, s.goal)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Progress</span>
            <span class="expand-value">${e.toFixed(1)}%</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Dividends Gained</span>
            <span class="expand-value">${f(t, s.dividends_gained)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Dividends Reinvested</span>
            <span class="expand-value">${f(t, s.dividends_reinvested)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Dividends in Cash</span>
            <span class="expand-value">${f(t, s.dividends_in_cash)}</span>
          </div>
        </div>` : c}
    `;
  }
};
R.styles = [N, tt`
    :host .list-item {
      grid-template-columns: 1fr auto auto;
    }
  `];
nt([
  v({ attribute: !1 })
], R.prototype, "hass", 2);
nt([
  v({ attribute: !1 })
], R.prototype, "pie", 2);
nt([
  v({ type: Boolean })
], R.prototype, "expanded", 2);
R = nt([
  A("investment-pie-row")
], R);
var Ce = Object.defineProperty, Ee = Object.getOwnPropertyDescriptor, rt = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? Ee(t, e) : t, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (i = (n ? a(t, e, i) : a(i)) || i);
  return n && i && Ce(t, e, i), i;
};
let j = class extends _ {
  constructor() {
    super(...arguments), this.config = {}, this._expanded = null;
  }
  setConfig(s) {
    this.config = s;
  }
  getCardSize() {
    return 4;
  }
  render() {
    if (!this.hass) return c;
    const { pies: s, maxHeight: t } = K(this.config, this.hass.states);
    return s.length === 0 ? u`<ha-card><div class="warning">
        No pies found. Check your sensor prefix or mapping.
      </div></ha-card>` : u`
      <ha-card>
        <div class="list-container" style="max-height:${t}">
          ${s.map((e) => u`
            <investment-pie-row
              .hass=${this.hass}
              .pie=${e}
              .expanded=${this._expanded === e.value}
              @toggle-expand=${() => {
      this._expanded = this._expanded === e.value ? null : e.value;
    }}
            ></investment-pie-row>`)}
        </div>
      </ha-card>`;
  }
};
j.styles = [N];
rt([
  v({ attribute: !1 })
], j.prototype, "hass", 2);
rt([
  v({ attribute: !1 })
], j.prototype, "config", 2);
rt([
  dt()
], j.prototype, "_expanded", 2);
j = rt([
  A("investment-pies-card")
], j);
var Se = Object.defineProperty, Oe = Object.getOwnPropertyDescriptor, ut = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? Oe(t, e) : t, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (i = (n ? a(t, e, i) : a(i)) || i);
  return n && i && Se(t, e, i), i;
};
let G = class extends _ {
  constructor() {
    super(...arguments), this.config = {};
  }
  setConfig(s) {
    this.config = s;
  }
  getCardSize() {
    return 12;
  }
  render() {
    if (!this.hass) return c;
    const { showOverview: s, showPositions: t, showPies: e } = K(this.config, this.hass.states);
    return u`
      ${s ? u`<investment-overview-card
        .hass=${this.hass} .config=${this.config}></investment-overview-card>` : c}
      ${t ? u`<investment-positions-card
        .hass=${this.hass} .config=${this.config}></investment-positions-card>` : c}
      ${e ? u`<investment-pies-card
        .hass=${this.hass} .config=${this.config}></investment-pies-card>` : c}`;
  }
};
G.styles = [N];
ut([
  v({ attribute: !1 })
], G.prototype, "hass", 2);
ut([
  v({ attribute: !1 })
], G.prototype, "config", 2);
G = ut([
  A("investment-portfolio-card")
], G);
var Ne = Object.defineProperty, Ue = Object.getOwnPropertyDescriptor, vt = (s, t, e, n) => {
  for (var i = n > 1 ? void 0 : n ? Ue(t, e) : t, r = s.length - 1, a; r >= 0; r--)
    (a = s[r]) && (i = (n ? a(t, e, i) : a(i)) || i);
  return n && i && Ne(t, e, i), i;
};
function E(s, t) {
  if (!t) return "—";
  const e = s.states[t]?.state;
  if (!e || e === "unavailable" || e === "unknown") return "—";
  const n = parseFloat(e);
  return isNaN(n) ? e : n.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function St(s, t) {
  if (!t) return "";
  const e = parseFloat(s.states[t]?.state ?? "");
  return isNaN(e) ? "" : e >= 0 ? "positive" : "negative";
}
let Z = class extends _ {
  constructor() {
    super(...arguments), this.config = {};
  }
  setConfig(s) {
    this.config = s;
  }
  getCardSize() {
    return 4;
  }
  render() {
    if (!this.hass) return c;
    const { account: s } = K(this.config, this.hass.states), t = s.total_value ? parseFloat(this.hass.states[s.total_value]?.state ?? "") : NaN, e = isNaN(t) ? "—" : t.toLocaleString(void 0, { maximumFractionDigits: 2 }), n = St(this.hass, s.unrealized_pnl), i = E(this.hass, s.unrealized_pnl), r = E(this.hass, s.result_percent), a = n === "positive" ? "+" : "", l = St(this.hass, s.daily_gain_loss), o = E(this.hass, s.daily_gain_loss), h = E(this.hass, s.daily_gain_loss_percent), p = l === "positive" ? "+" : "", d = s.top_daily_mover ? this.hass.states[s.top_daily_mover] : void 0, $ = s.bottom_daily_mover ? this.hass.states[s.bottom_daily_mover] : void 0, m = d?.attributes?.change_pct, y = $?.attributes?.change_pct, $t = (m ?? 0) >= 0 ? "positive" : "negative", mt = (y ?? 0) >= 0 ? "positive" : "negative";
    return u`
      <ha-card>
        <div class="hero">
          <div class="hero-label">Portfolio Value</div>
          <div class="hero-value">${e}</div>
          ${i !== "—" ? u`
            <div class="hero-sub ${n}">
              ${a}${i} · ${a}${r}% all time
            </div>` : c}
        </div>

        ${s.total_value ? u`
          <div class="sparkline-wrap">
            <investment-sparkline
              .hass=${this.hass}
              .entityId=${s.total_value}
              .width=${460}
              .height=${72}
            ></investment-sparkline>
          </div>` : c}

        <hr class="divider" />

        <div class="today-label">Today</div>
        <div class="today-row">
          <span class="today-value ${l}">${p}${o}</span>
          <span class="today-pct ${l}">${p}${h}%</span>
        </div>

        ${d || $ ? u`
          <div class="movers">
            ${d && m != null ? u`
              <div class="mover-line">
                <span class="mover-name ${$t}">
                  <span class="mover-arrow">▲</span>${d.state}
                </span>
                <span class="mover-pct ${$t}">+${m.toFixed(2)}%</span>
              </div>` : c}
            ${$ && y != null ? u`
              <div class="mover-line">
                <span class="mover-name ${mt}">
                  <span class="mover-arrow">▼</span>${$.state}
                </span>
                <span class="mover-pct ${mt}">${y.toFixed(2)}%</span>
              </div>` : c}
          </div>` : c}

        <hr class="divider" />

        <div class="footer">
          <div class="footer-stat">
            <span class="footer-label">Invested</span>
            <span class="footer-value">${E(this.hass, s.invested)}</span>
          </div>
          <div class="footer-stat">
            <span class="footer-label">Cash</span>
            <span class="footer-value">${E(this.hass, s.cash_available)}</span>
          </div>
          <div class="footer-stat">
            <span class="footer-label">Dividends</span>
            <span class="footer-value">${E(this.hass, s.total_dividends)}</span>
          </div>
        </div>
      </ha-card>`;
  }
};
Z.styles = [
  N,
  tt`
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
vt([
  v({ attribute: !1 })
], Z.prototype, "hass", 2);
vt([
  v({ attribute: !1 })
], Z.prototype, "config", 2);
Z = vt([
  A("investment-health-card")
], Z);
window.customCards = window.customCards ?? [];
window.customCards.push(
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
