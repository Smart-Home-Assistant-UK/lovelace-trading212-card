/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = globalThis, vt = st.ShadowRoot && (st.ShadyCSS === void 0 || st.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ft = Symbol(), xt = /* @__PURE__ */ new WeakMap();
let Mt = class {
  constructor(t, s, n) {
    if (this._$cssResult$ = !0, n !== ft) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (vt && t === void 0) {
      const n = s !== void 0 && s.length === 1;
      n && (t = xt.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && xt.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Kt = (e) => new Mt(typeof e == "string" ? e : e + "", void 0, ft), tt = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((n, i, r) => n + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + e[r + 1], e[0]);
  return new Mt(s, e, ft);
}, Qt = (e, t) => {
  if (vt) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const n = document.createElement("style"), i = st.litNonce;
    i !== void 0 && n.setAttribute("nonce", i), n.textContent = s.cssText, e.appendChild(n);
  }
}, wt = vt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const n of t.cssRules) s += n.cssText;
  return Kt(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Xt, defineProperty: Yt, getOwnPropertyDescriptor: te, getOwnPropertyNames: ee, getOwnPropertySymbols: se, getPrototypeOf: ie } = Object, E = globalThis, At = E.trustedTypes, ne = At ? At.emptyScript : "", re = E.reactiveElementPolyfillSupport, W = (e, t) => e, it = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ne : null;
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
} }, $t = (e, t) => !Xt(e, t), Pt = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: $t };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), E.litPropertyMetadata ?? (E.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let M = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = Pt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const n = Symbol(), i = this.getPropertyDescriptor(t, n, s);
      i !== void 0 && Yt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, s, n) {
    const { get: i, set: r } = te(this.prototype, t) ?? { get() {
      return this[s];
    }, set(a) {
      this[s] = a;
    } };
    return { get: i, set(a) {
      const c = i?.call(this);
      r?.call(this, a), this.requestUpdate(t, c, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const t = ie(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const s = this.properties, n = [...ee(s), ...se(s)];
      for (const i of n) this.createProperty(i, s[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [n, i] of s) this.elementProperties.set(n, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, n] of this.elementProperties) {
      const i = this._$Eu(s, n);
      i !== void 0 && this._$Eh.set(i, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const i of n) s.unshift(wt(i));
    } else t !== void 0 && s.push(wt(t));
    return s;
  }
  static _$Eu(t, s) {
    const n = s.attribute;
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
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const n of s.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Qt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, n) {
    this._$AK(t, n);
  }
  _$ET(t, s) {
    const n = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, n);
    if (i !== void 0 && n.reflect === !0) {
      const r = (n.converter?.toAttribute !== void 0 ? n.converter : it).toAttribute(s, n.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const n = this.constructor, i = n._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const r = n.getPropertyOptions(i), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : it;
      this._$Em = i;
      const c = a.fromAttribute(s, r.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, s, n, i = !1, r) {
    if (t !== void 0) {
      const a = this.constructor;
      if (i === !1 && (r = this[t]), n ?? (n = a.getPropertyOptions(t)), !((n.hasChanged ?? $t)(r, s) || n.useDefault && n.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, n)))) return;
      this.C(t, s, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: n, reflect: i, wrapped: r }, a) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? s ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (s = void 0), this._$AL.set(t, s)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [i, r] of n) {
        const { wrapped: a } = r, c = this[i];
        a !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, r, c);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((n) => n.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
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
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[W("elementProperties")] = /* @__PURE__ */ new Map(), M[W("finalized")] = /* @__PURE__ */ new Map(), re?.({ ReactiveElement: M }), (E.reactiveElementVersions ?? (E.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, Ct = (e) => e, nt = V.trustedTypes, Et = nt ? nt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ht = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, Rt = "?" + C, ae = `<${Rt}>`, D = document, Z = () => D.createComment(""), J = (e) => e === null || typeof e != "object" && typeof e != "function", mt = Array.isArray, oe = (e) => mt(e) || typeof e?.[Symbol.iterator] == "function", ht = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, St = /-->/g, Ot = />/g, O = RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Nt = /'/g, zt = /"/g, jt = /^(?:script|style|textarea|title)$/i, kt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), u = kt(1), le = kt(2), H = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Ut = /* @__PURE__ */ new WeakMap(), U = D.createTreeWalker(D, 129);
function It(e, t) {
  if (!mt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Et !== void 0 ? Et.createHTML(t) : t;
}
const ce = (e, t) => {
  const s = e.length - 1, n = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = q;
  for (let c = 0; c < s; c++) {
    const o = e[c];
    let h, p, l = -1, f = 0;
    for (; f < o.length && (a.lastIndex = f, p = a.exec(o), p !== null); ) f = a.lastIndex, a === q ? p[1] === "!--" ? a = St : p[1] !== void 0 ? a = Ot : p[2] !== void 0 ? (jt.test(p[2]) && (i = RegExp("</" + p[2], "g")), a = O) : p[3] !== void 0 && (a = O) : a === O ? p[0] === ">" ? (a = i ?? q, l = -1) : p[1] === void 0 ? l = -2 : (l = a.lastIndex - p[2].length, h = p[1], a = p[3] === void 0 ? O : p[3] === '"' ? zt : Nt) : a === zt || a === Nt ? a = O : a === St || a === Ot ? a = q : (a = O, i = void 0);
    const v = a === O && e[c + 1].startsWith("/>") ? " " : "";
    r += a === q ? o + ae : l >= 0 ? (n.push(h), o.slice(0, l) + Ht + o.slice(l) + C + v) : o + C + (l === -2 ? c : v);
  }
  return [It(e, r + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class K {
  constructor({ strings: t, _$litType$: s }, n) {
    let i;
    this.parts = [];
    let r = 0, a = 0;
    const c = t.length - 1, o = this.parts, [h, p] = ce(t, s);
    if (this.el = K.createElement(h, n), U.currentNode = this.el.content, s === 2 || s === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (i = U.nextNode()) !== null && o.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const l of i.getAttributeNames()) if (l.endsWith(Ht)) {
          const f = p[a++], v = i.getAttribute(l).split(C), $ = /([.?@])?(.*)/.exec(f);
          o.push({ type: 1, index: r, name: $[2], strings: v, ctor: $[1] === "." ? de : $[1] === "?" ? he : $[1] === "@" ? ue : rt }), i.removeAttribute(l);
        } else l.startsWith(C) && (o.push({ type: 6, index: r }), i.removeAttribute(l));
        if (jt.test(i.tagName)) {
          const l = i.textContent.split(C), f = l.length - 1;
          if (f > 0) {
            i.textContent = nt ? nt.emptyScript : "";
            for (let v = 0; v < f; v++) i.append(l[v], Z()), U.nextNode(), o.push({ type: 2, index: ++r });
            i.append(l[f], Z());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Rt) o.push({ type: 2, index: r });
      else {
        let l = -1;
        for (; (l = i.data.indexOf(C, l + 1)) !== -1; ) o.push({ type: 7, index: r }), l += C.length - 1;
      }
      r++;
    }
  }
  static createElement(t, s) {
    const n = D.createElement("template");
    return n.innerHTML = t, n;
  }
}
function R(e, t, s = e, n) {
  if (t === H) return t;
  let i = n !== void 0 ? s._$Co?.[n] : s._$Cl;
  const r = J(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(e), i._$AT(e, s, n)), n !== void 0 ? (s._$Co ?? (s._$Co = []))[n] = i : s._$Cl = i), i !== void 0 && (t = R(e, i._$AS(e, t.values), i, n)), t;
}
class pe {
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
    const { el: { content: s }, parts: n } = this._$AD, i = (t?.creationScope ?? D).importNode(s, !0);
    U.currentNode = i;
    let r = U.nextNode(), a = 0, c = 0, o = n[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let h;
        o.type === 2 ? h = new et(r, r.nextSibling, this, t) : o.type === 1 ? h = new o.ctor(r, o.name, o.strings, this, t) : o.type === 6 && (h = new ve(r, this, t)), this._$AV.push(h), o = n[++c];
      }
      a !== o?.index && (r = U.nextNode(), a++);
    }
    return U.currentNode = D, i;
  }
  p(t) {
    let s = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, s), s += n.strings.length - 2) : n._$AI(t[s])), s++;
  }
}
class et {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, n, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = n, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = R(this, t, s), J(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== H && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : oe(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && J(this._$AH) ? this._$AA.nextSibling.data = t : this.T(D.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: n } = t, i = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = K.createElement(It(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === i) this._$AH.p(s);
    else {
      const r = new pe(i, this), a = r.u(this.options);
      r.p(s), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let s = Ut.get(t.strings);
    return s === void 0 && Ut.set(t.strings, s = new K(t)), s;
  }
  k(t) {
    mt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let n, i = 0;
    for (const r of t) i === s.length ? s.push(n = new et(this.O(Z()), this.O(Z()), this, this.options)) : n = s[i], n._$AI(r), i++;
    i < s.length && (this._$AR(n && n._$AB.nextSibling, i), s.length = i);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const n = Ct(t).nextSibling;
      Ct(t).remove(), t = n;
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
  constructor(t, s, n, i, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = s, this._$AM = i, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = d;
  }
  _$AI(t, s = this, n, i) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = R(this, t, s, 0), a = !J(t) || t !== this._$AH && t !== H, a && (this._$AH = t);
    else {
      const c = t;
      let o, h;
      for (t = r[0], o = 0; o < r.length - 1; o++) h = R(this, c[n + o], s, o), h === H && (h = this._$AH[o]), a || (a = !J(h) || h !== this._$AH[o]), h === d ? t = d : t !== d && (t += (h ?? "") + r[o + 1]), this._$AH[o] = h;
    }
    a && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class de extends rt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class he extends rt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class ue extends rt {
  constructor(t, s, n, i, r) {
    super(t, s, n, i, r), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = R(this, t, s, 0) ?? d) === H) return;
    const n = this._$AH, i = t === d && n !== d || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, r = t !== d && (n === d || i);
    i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ve {
  constructor(t, s, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const fe = V.litHtmlPolyfillSupport;
fe?.(K, et), (V.litHtmlVersions ?? (V.litHtmlVersions = [])).push("3.3.3");
const $e = (e, t, s) => {
  const n = s?.renderBefore ?? t;
  let i = n._$litPart$;
  if (i === void 0) {
    const r = s?.renderBefore ?? null;
    n._$litPart$ = i = new et(t.insertBefore(Z(), r), r, void 0, s ?? {});
  }
  return i._$AI(e), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis;
class y extends M {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = $e(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return H;
  }
}
y._$litElement$ = !0, y.finalized = !0, G.litElementHydrateSupport?.({ LitElement: y });
const me = G.litElementPolyfillSupport;
me?.({ LitElement: y });
(G.litElementVersions ?? (G.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _e = { attribute: !0, type: String, converter: it, reflect: !1, hasChanged: $t }, ge = (e = _e, t, s) => {
  const { kind: n, metadata: i } = s;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(s.name, e), n === "accessor") {
    const { name: a } = s;
    return { set(c) {
      const o = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(a, o, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, e, c), c;
    } };
  }
  if (n === "setter") {
    const { name: a } = s;
    return function(c) {
      const o = this[a];
      t.call(this, c), this.requestUpdate(a, o, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function _(e) {
  return (t, s) => typeof s == "object" ? ge(e, t, s) : ((n, i, r) => {
    const a = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, n), a ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function at(e) {
  return _({ ...e, state: !0, attribute: !1 });
}
const S = tt`
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
`, ye = "sensor.trading212_", be = "400px";
function Lt(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ft(e) {
  return e.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
}
function xe(e) {
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
function Bt(e, t) {
  const s = e[t];
  return !!s && s.state !== "unavailable" && s.state !== "unknown";
}
function we(e, t) {
  const s = new RegExp(`^${Lt(e)}(.+)_quantity$`), n = [];
  for (const i of Object.keys(t)) {
    const r = i.match(s);
    r && Bt(t, `${e}${r[1]}_value`) && n.push(r[1]);
  }
  return n.map((i) => ({
    name: Ft(i),
    ticker: i.toUpperCase(),
    value: `${e}${i}_value`,
    pnl: `${e}${i}_pnl`,
    pnl_percent: `${e}${i}_pnl_percent`,
    current_price: `${e}${i}_current_price`,
    quantity: `${e}${i}_quantity`,
    avg_price: `${e}${i}_avg_price`,
    history_entity: `${e}${i}_value`
  }));
}
function Ae(e, t) {
  const s = new RegExp(`^${Lt(e)}(.+)_invested$`), n = [];
  for (const i of Object.keys(t)) {
    const r = i.match(s);
    r && r[1] && Bt(t, `${e}${r[1]}_value`) && n.push(r[1]);
  }
  return n.map((i) => ({
    name: Ft(i),
    value: `${e}${i}_value`,
    pnl: `${e}${i}_pnl`,
    pnl_percent: `${e}${i}_pnl_percent`,
    invested: `${e}${i}_invested`,
    cash: `${e}${i}_cash`,
    progress: `${e}${i}_progress`,
    goal: `${e}${i}_goal`,
    dividends_gained: `${e}${i}_dividends_gained`,
    dividends_in_cash: `${e}${i}_dividends_in_cash`,
    dividends_reinvested: `${e}${i}_dividends_reinvested`
  }));
}
function B(e, t) {
  const s = e ?? {}, n = s.max_height ?? be, i = s.show_overview ?? !0, r = s.show_positions ?? !0, a = s.show_pies ?? !0;
  if (s.positions !== void 0 || s.pies !== void 0) {
    const o = (s.positions ?? []).map((p) => ({
      name: p.name,
      value: p.value,
      pnl: p.pnl,
      pnl_percent: p.pnl_percent,
      current_price: p.current_price,
      quantity: p.quantity,
      avg_price: p.avg_price,
      history_entity: p.history_entity ?? p.value
    })), h = (s.pies ?? []).map((p) => ({ ...p }));
    return {
      account: s.currency_sensor ? { total_value: s.currency_sensor } : {},
      positions: o,
      pies: h,
      maxHeight: n,
      showOverview: i,
      showPositions: r,
      showPies: a
    };
  }
  const c = s.prefix ?? ye;
  return {
    account: xe(c),
    positions: we(c, t),
    pies: Ae(c, t),
    maxHeight: n,
    showOverview: i,
    showPositions: r,
    showPies: a
  };
}
var Pe = Object.defineProperty, Ce = Object.getOwnPropertyDescriptor, _t = (e, t, s, n) => {
  for (var i = n > 1 ? void 0 : n ? Ce(t, s) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (i = (n ? a(t, s, i) : a(i)) || i);
  return n && i && Pe(t, s, i), i;
};
function P(e, t, s, n = !1) {
  if (!t) return d;
  const i = e.states[t]?.state ?? "unavailable", r = i === "unavailable" || i === "unknown", a = parseFloat(i), c = n && !isNaN(a) ? a >= 0 ? "positive" : "negative" : "", o = r ? "—" : isNaN(a) ? i : a.toLocaleString(void 0, { maximumFractionDigits: 2 });
  return u`
    <div class="stat-chip">
      <span class="stat-label">${s}</span>
      <span class="stat-value ${c}">${o}</span>
    </div>`;
}
let Q = class extends y {
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
    if (!this.hass) return d;
    const { account: e } = B(this.config, this.hass.states), t = e.top_daily_mover ? this.hass.states[e.top_daily_mover] : void 0, s = e.bottom_daily_mover ? this.hass.states[e.bottom_daily_mover] : void 0, n = t?.attributes?.change_value, i = t?.attributes?.change_pct, r = s?.attributes?.change_value, a = s?.attributes?.change_pct, c = n == null ? "" : n >= 0 ? "positive" : "negative", o = r == null ? "" : r >= 0 ? "positive" : "negative", h = n != null && n >= 0 ? "+" : "", p = r != null && r >= 0 ? "+" : "";
    return u`
      <ha-card>
        <div class="stat-grid">
          ${P(this.hass, e.total_value, "Total Value")}
          ${P(this.hass, e.invested, "Invested")}
          ${P(this.hass, e.unrealized_pnl, "Unrealised P&L", !0)}
          ${P(this.hass, e.result_percent, "Return %", !0)}
          ${P(this.hass, e.daily_gain_loss, "Today's P&L", !0)}
          ${P(this.hass, e.daily_gain_loss_percent, "Today %", !0)}
          ${P(this.hass, e.cash_available, "Cash")}
          ${P(this.hass, e.total_dividends, "Dividends")}
        </div>
        <div class="mover-row">
          <div class="mover-chip">
            <div class="mover-label">Top Mover</div>
            <div class="mover-name ${c}">${t?.state ?? "—"}</div>
            ${n != null && i != null ? u`<div class="mover-change ${c}">
              ${h}${n.toFixed(2)} (${i.toFixed(2)}%)</div>` : d}
          </div>
          <div class="mover-chip">
            <div class="mover-label">Bottom Mover</div>
            <div class="mover-name ${o}">${s?.state ?? "—"}</div>
            ${r != null && a != null ? u`<div class="mover-change ${o}">
              ${p}${r.toFixed(2)} (${a.toFixed(2)}%)</div>` : d}
          </div>
        </div>
      </ha-card>`;
  }
};
Q.styles = [S];
_t([
  _({ attribute: !1 })
], Q.prototype, "hass", 2);
_t([
  _({ attribute: !1 })
], Q.prototype, "config", 2);
Q = _t([
  w("investment-overview-card")
], Q);
var Ee = Object.defineProperty, Se = Object.getOwnPropertyDescriptor, T = (e, t, s, n) => {
  for (var i = n > 1 ? void 0 : n ? Se(t, s) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (i = (n ? a(t, s, i) : a(i)) || i);
  return n && i && Ee(t, s, i), i;
};
let x = class extends y {
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
      this._points = (s?.[0] ?? []).map((n) => parseFloat(n.state)).filter((n) => !isNaN(n));
    } catch {
      this._points = [];
    }
  }
  _buildPath(e, t) {
    const s = this._points;
    if (s.length < 2) return "";
    const n = Math.min(...s), r = Math.max(...s) - n || 1, a = t * 0.1;
    return `M ${s.map((o, h) => {
      const p = h / (s.length - 1) * e, l = t - a - (o - n) / r * (t - a * 2);
      return `${p.toFixed(1)},${l.toFixed(1)}`;
    }).join(" L ")}`;
  }
  render() {
    if (this._points.length < 2) return d;
    const e = this.width || (this.wide ? 200 : 60), t = this.height || (this.wide ? 60 : 28), s = this._buildPath(e, t), i = this._points[this._points.length - 1] >= this._points[0] ? "var(--success-color, #4caf50)" : "var(--error-color, #f44336)";
    return u`${le`<svg width="${e}" height="${t}" viewBox="0 0 ${e} ${t}">
      <path d="${s}" fill="none" stroke="${i}" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`}`;
  }
};
x.styles = tt`
    :host { display: block; }
    svg { display: block; }
  `;
T([
  _({ attribute: !1 })
], x.prototype, "hass", 2);
T([
  _({ type: String })
], x.prototype, "entityId", 2);
T([
  _({ type: Boolean })
], x.prototype, "wide", 2);
T([
  _({ type: Number })
], x.prototype, "width", 2);
T([
  _({ type: Number })
], x.prototype, "height", 2);
T([
  at()
], x.prototype, "_points", 2);
x = T([
  w("investment-sparkline")
], x);
var Oe = Object.defineProperty, Ne = Object.getOwnPropertyDescriptor, ot = (e, t, s, n) => {
  for (var i = n > 1 ? void 0 : n ? Ne(t, s) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (i = (n ? a(t, s, i) : a(i)) || i);
  return n && i && Oe(t, s, i), i;
};
function N(e, t) {
  if (!t) return "—";
  const s = e.states[t]?.state;
  if (!s || s === "unavailable" || s === "unknown") return "—";
  const n = parseFloat(s);
  return isNaN(n) ? s : n.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function ze(e, t) {
  if (!t) return "";
  const s = parseFloat(e.states[t]?.state ?? "");
  return isNaN(s) ? "" : s >= 0 ? "positive" : "negative";
}
let j = class extends y {
  constructor() {
    super(...arguments), this.expanded = !1;
  }
  _toggle() {
    this.dispatchEvent(new CustomEvent("toggle-expand", { bubbles: !0, composed: !0 }));
  }
  render() {
    const { position: e, hass: t } = this;
    return u`
      <div class="list-item" @click=${this._toggle}>
        <div>
          <div class="item-name">${e.name}</div>
          ${e.ticker ? u`<div class="item-ticker">${e.ticker}</div>` : d}
        </div>
        <div class="item-value">${N(t, e.value)}</div>
        <div class="item-pnl ${ze(t, e.pnl)}">
          ${N(t, e.pnl)}<br/>
          <span style="font-size:0.75rem">${N(t, e.pnl_percent) === "—" ? "—" : `${N(t, e.pnl_percent)}%`}</span>
        </div>
        <investment-sparkline .hass=${t} .entityId=${e.history_entity}></investment-sparkline>
      </div>
      ${this.expanded ? u`
        <div class="expand-panel">
          <div class="expand-stat">
            <span class="expand-label">Quantity</span>
            <span class="expand-value">${N(t, e.quantity)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Avg Price</span>
            <span class="expand-value">${N(t, e.avg_price)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Current Price</span>
            <span class="expand-value">${N(t, e.current_price)}</span>
          </div>
          <investment-sparkline .hass=${t} .entityId=${e.history_entity} wide></investment-sparkline>
        </div>` : d}
    `;
  }
};
j.styles = [S];
ot([
  _({ attribute: !1 })
], j.prototype, "hass", 2);
ot([
  _({ attribute: !1 })
], j.prototype, "position", 2);
ot([
  _({ type: Boolean })
], j.prototype, "expanded", 2);
j = ot([
  w("investment-position-row")
], j);
var Ue = Object.defineProperty, De = Object.getOwnPropertyDescriptor, lt = (e, t, s, n) => {
  for (var i = n > 1 ? void 0 : n ? De(t, s) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (i = (n ? a(t, s, i) : a(i)) || i);
  return n && i && Ue(t, s, i), i;
};
let k = class extends y {
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
    if (!this.hass) return d;
    const { positions: e, maxHeight: t } = B(this.config, this.hass.states);
    return e.length === 0 ? u`<ha-card><div class="warning">
        No positions found. Check your sensor prefix or mapping.
      </div></ha-card>` : u`
      <ha-card>
        <div class="list-container" style="max-height:${t}">
          ${e.map((s) => u`
            <investment-position-row
              .hass=${this.hass}
              .position=${s}
              .expanded=${this._expanded === s.value}
              @toggle-expand=${() => {
      this._expanded = this._expanded === s.value ? null : s.value;
    }}
            ></investment-position-row>`)}
        </div>
      </ha-card>`;
  }
};
k.styles = [S];
lt([
  _({ attribute: !1 })
], k.prototype, "hass", 2);
lt([
  _({ attribute: !1 })
], k.prototype, "config", 2);
lt([
  at()
], k.prototype, "_expanded", 2);
k = lt([
  w("investment-positions-card")
], k);
var Te = Object.defineProperty, Me = Object.getOwnPropertyDescriptor, ct = (e, t, s, n) => {
  for (var i = n > 1 ? void 0 : n ? Me(t, s) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (i = (n ? a(t, s, i) : a(i)) || i);
  return n && i && Te(t, s, i), i;
};
function b(e, t) {
  if (!t) return "—";
  const s = e.states[t]?.state;
  if (!s || s === "unavailable" || s === "unknown") return "—";
  const n = parseFloat(s);
  return isNaN(n) ? s : n.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function He(e, t) {
  if (!t) return "";
  const s = parseFloat(e.states[t]?.state ?? "");
  return isNaN(s) ? "" : s >= 0 ? "positive" : "negative";
}
function Re(e, t) {
  return t ? Math.min(100, Math.max(0, parseFloat(e.states[t]?.state ?? "0") || 0)) : 0;
}
let I = class extends y {
  constructor() {
    super(...arguments), this.expanded = !1;
  }
  _toggle() {
    this.dispatchEvent(new CustomEvent("toggle-expand", { bubbles: !0, composed: !0 }));
  }
  render() {
    const { pie: e, hass: t } = this, s = Re(t, e.progress);
    return u`
      <div class="list-item" @click=${this._toggle}>
        <div>
          <div class="item-name">${e.name}</div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${s}%"></div>
          </div>
        </div>
        <div class="item-value">${b(t, e.value)}</div>
        <div class="item-pnl ${He(t, e.pnl_percent)}">${b(t, e.pnl_percent) === "—" ? "—" : `${b(t, e.pnl_percent)}%`}</div>
      </div>
      ${this.expanded ? u`
        <div class="expand-panel">
          <div class="expand-stat">
            <span class="expand-label">Invested</span>
            <span class="expand-value">${b(t, e.invested)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Cash</span>
            <span class="expand-value">${b(t, e.cash)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Goal</span>
            <span class="expand-value">${b(t, e.goal)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Progress</span>
            <span class="expand-value">${s.toFixed(1)}%</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Dividends Gained</span>
            <span class="expand-value">${b(t, e.dividends_gained)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Dividends Reinvested</span>
            <span class="expand-value">${b(t, e.dividends_reinvested)}</span>
          </div>
          <div class="expand-stat">
            <span class="expand-label">Dividends in Cash</span>
            <span class="expand-value">${b(t, e.dividends_in_cash)}</span>
          </div>
        </div>` : d}
    `;
  }
};
I.styles = [S, tt`
    :host .list-item {
      grid-template-columns: 1fr auto auto;
    }
  `];
ct([
  _({ attribute: !1 })
], I.prototype, "hass", 2);
ct([
  _({ attribute: !1 })
], I.prototype, "pie", 2);
ct([
  _({ type: Boolean })
], I.prototype, "expanded", 2);
I = ct([
  w("investment-pie-row")
], I);
var je = Object.defineProperty, ke = Object.getOwnPropertyDescriptor, pt = (e, t, s, n) => {
  for (var i = n > 1 ? void 0 : n ? ke(t, s) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (i = (n ? a(t, s, i) : a(i)) || i);
  return n && i && je(t, s, i), i;
};
let L = class extends y {
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
    if (!this.hass) return d;
    const { pies: e, maxHeight: t } = B(this.config, this.hass.states);
    return e.length === 0 ? u`<ha-card><div class="warning">
        No pies found. Check your sensor prefix or mapping.
      </div></ha-card>` : u`
      <ha-card>
        <div class="list-container" style="max-height:${t}">
          ${e.map((s) => u`
            <investment-pie-row
              .hass=${this.hass}
              .pie=${s}
              .expanded=${this._expanded === s.value}
              @toggle-expand=${() => {
      this._expanded = this._expanded === s.value ? null : s.value;
    }}
            ></investment-pie-row>`)}
        </div>
      </ha-card>`;
  }
};
L.styles = [S];
pt([
  _({ attribute: !1 })
], L.prototype, "hass", 2);
pt([
  _({ attribute: !1 })
], L.prototype, "config", 2);
pt([
  at()
], L.prototype, "_expanded", 2);
L = pt([
  w("investment-pies-card")
], L);
var Ie = Object.defineProperty, Le = Object.getOwnPropertyDescriptor, gt = (e, t, s, n) => {
  for (var i = n > 1 ? void 0 : n ? Le(t, s) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (i = (n ? a(t, s, i) : a(i)) || i);
  return n && i && Ie(t, s, i), i;
};
let X = class extends y {
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
    if (!this.hass) return d;
    const { showOverview: e, showPositions: t, showPies: s } = B(this.config, this.hass.states);
    return u`
      ${e ? u`<investment-overview-card
        .hass=${this.hass} .config=${this.config}></investment-overview-card>` : d}
      ${t ? u`<investment-positions-card
        .hass=${this.hass} .config=${this.config}></investment-positions-card>` : d}
      ${s ? u`<investment-pies-card
        .hass=${this.hass} .config=${this.config}></investment-pies-card>` : d}`;
  }
};
X.styles = [S];
gt([
  _({ attribute: !1 })
], X.prototype, "hass", 2);
gt([
  _({ attribute: !1 })
], X.prototype, "config", 2);
X = gt([
  w("investment-portfolio-card")
], X);
var Fe = Object.defineProperty, Be = Object.getOwnPropertyDescriptor, yt = (e, t, s, n) => {
  for (var i = n > 1 ? void 0 : n ? Be(t, s) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (i = (n ? a(t, s, i) : a(i)) || i);
  return n && i && Fe(t, s, i), i;
};
function z(e, t) {
  if (!t) return "—";
  const s = e.states[t]?.state;
  if (!s || s === "unavailable" || s === "unknown") return "—";
  const n = parseFloat(s);
  return isNaN(n) ? s : n.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function Dt(e, t) {
  if (!t) return "";
  const s = parseFloat(e.states[t]?.state ?? "");
  return isNaN(s) ? "" : s >= 0 ? "positive" : "negative";
}
let Y = class extends y {
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
    if (!this.hass) return d;
    const { account: e } = B(this.config, this.hass.states), t = e.total_value ? parseFloat(this.hass.states[e.total_value]?.state ?? "") : NaN, s = isNaN(t) ? "—" : t.toLocaleString(void 0, { maximumFractionDigits: 2 }), n = Dt(this.hass, e.unrealized_pnl), i = z(this.hass, e.unrealized_pnl), r = z(this.hass, e.result_percent), a = n === "positive" ? "+" : "", c = Dt(this.hass, e.daily_gain_loss), o = z(this.hass, e.daily_gain_loss), h = z(this.hass, e.daily_gain_loss_percent), p = c === "positive" ? "+" : "", l = e.top_daily_mover ? this.hass.states[e.top_daily_mover] : void 0, f = e.bottom_daily_mover ? this.hass.states[e.bottom_daily_mover] : void 0, v = l?.attributes?.change_pct, $ = f?.attributes?.change_pct, m = (v ?? 0) >= 0 ? "positive" : "negative", g = ($ ?? 0) >= 0 ? "positive" : "negative";
    return u`
      <ha-card>
        <div class="hero">
          <div class="hero-label">Portfolio Value</div>
          <div class="hero-value">${s}</div>
          ${i !== "—" ? u`
            <div class="hero-sub ${n}">
              ${a}${i} · ${a}${r}% all time
            </div>` : d}
        </div>

        ${e.total_value ? u`
          <div class="sparkline-wrap">
            <investment-sparkline
              .hass=${this.hass}
              .entityId=${e.total_value}
              .width=${460}
              .height=${72}
            ></investment-sparkline>
          </div>` : d}

        <hr class="divider" />

        <div class="today-label">Today</div>
        <div class="today-row">
          <span class="today-value ${c}">${p}${o}</span>
          <span class="today-pct ${c}">${p}${h}%</span>
        </div>

        ${l || f ? u`
          <div class="movers">
            ${l && v != null ? u`
              <div class="mover-line">
                <span class="mover-name ${m}">
                  <span class="mover-arrow">▲</span>${l.state}
                </span>
                <span class="mover-pct ${m}">+${v.toFixed(2)}%</span>
              </div>` : d}
            ${f && $ != null ? u`
              <div class="mover-line">
                <span class="mover-name ${g}">
                  <span class="mover-arrow">▼</span>${f.state}
                </span>
                <span class="mover-pct ${g}">${$.toFixed(2)}%</span>
              </div>` : d}
          </div>` : d}

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
Y.styles = [
  S,
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
yt([
  _({ attribute: !1 })
], Y.prototype, "hass", 2);
yt([
  _({ attribute: !1 })
], Y.prototype, "config", 2);
Y = yt([
  w("investment-health-card")
], Y);
var qe = Object.defineProperty, We = Object.getOwnPropertyDescriptor, dt = (e, t, s, n) => {
  for (var i = n > 1 ? void 0 : n ? We(t, s) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (i = (n ? a(t, s, i) : a(i)) || i);
  return n && i && qe(t, s, i), i;
};
function Tt(e, t, s) {
  let n = 0;
  for (const i of e) {
    const r = Math.max(
      s * s * i / (t * t),
      t * t / (s * s * i)
    );
    r > n && (n = r);
  }
  return n;
}
function ut(e, t, s, n, i, r, a) {
  if (!e.length || i <= 0 || r <= 0) return;
  if (e.length === 1) {
    a[e[0].idx] = { x: s, y: n, w: i, h: r };
    return;
  }
  const c = Math.min(i, r);
  let o = [], h = 0, p = 0;
  for (let $ = 0; $ < e.length; $++) {
    const m = e[$].value, g = [...o, m], A = h + m;
    if (o.length === 0 || Tt(g, A, c) <= Tt(o, h, c))
      o = g, h = A, p = $ + 1;
    else break;
  }
  const l = i >= r, f = l ? i : r, v = h / t * f;
  if (l) {
    let $ = n;
    for (let m = 0; m < p; m++)
      a[e[m].idx] = { x: s, y: $, w: v, h: r * (e[m].value / h) }, $ += r * (e[m].value / h);
    ut(e.slice(p), t - h, s + v, n, i - v, r, a);
  } else {
    let $ = s;
    for (let m = 0; m < p; m++)
      a[e[m].idx] = { x: $, y: n, w: i * (e[m].value / h), h: v }, $ += i * (e[m].value / h);
    ut(e.slice(p), t - h, s, n + v, i, r - v, a);
  }
}
function Ve(e, t, s) {
  if (!e.length || t <= 0 || s <= 0) return [];
  const n = e.reduce((c, o) => c + o, 0);
  if (n === 0) return e.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  const i = t * s, r = e.map((c, o) => ({ idx: o, value: c / n * i })).sort((c, o) => o.value - c.value), a = new Array(e.length);
  return ut(r, i, 0, 0, t, s, a), a;
}
function Ge(e) {
  const s = (0.12 + Math.min(Math.abs(e) / 10, 1) * 0.22).toFixed(2);
  return e >= 0 ? `rgba(76,175,80,${s})` : `rgba(244,67,54,${s})`;
}
function Ze(e) {
  let t = 0;
  for (let s = 0; s < e.length; s++) t = t * 31 + e.charCodeAt(s) & 65535;
  return `hsl(${t * 137 % 360},50%,38%)`;
}
function Je(e) {
  return e.replace(/[_\s]+(US[_\s]*)?EQ$/i, "").replace(/[_\s]+L$/i, "");
}
let F = class extends y {
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
    if (!this.hass) return d;
    const e = this.config, t = e.mode ?? "positions", s = e.pie, n = e.treemap_height ?? 420, { positions: i, pies: r } = B(this.config, this.hass.states);
    let a;
    if (t === "pies")
      a = r.map((l) => {
        const f = this.hass.states[l.value]?.state, v = l.pnl_percent ? this.hass.states[l.pnl_percent]?.state : void 0, $ = parseFloat(f ?? ""), m = parseFloat(v ?? "");
        return {
          label: l.name,
          value: isNaN($) || $ <= 0 ? 0 : $,
          pnlPct: isNaN(m) ? 0 : m
        };
      }).filter((l) => l.value > 0);
    else {
      let l = i;
      if (s) {
        const v = `${e.prefix ?? "sensor.trading212_"}${s}_value`, $ = this.hass.states[v]?.attributes?.tickers ?? [];
        if ($.length > 0) {
          const m = new Set($.map((g) => g.toLowerCase()));
          l = i.filter((g) => m.has((g.ticker ?? "").toLowerCase()));
        }
      }
      a = l.map((f) => {
        const v = this.hass.states[f.value]?.state, $ = this.hass.states[f.pnl_percent]?.state, m = parseFloat(v ?? ""), g = parseFloat($ ?? "");
        return {
          label: Je(f.ticker ?? f.name),
          value: isNaN(m) || m <= 0 ? 0 : m,
          pnlPct: isNaN(g) ? 0 : g
        };
      }).filter((f) => f.value > 0);
    }
    if (a.length === 0)
      return u`<ha-card><div class="warning">No ${t} data available.</div></ha-card>`;
    s && (r.find((l) => {
      const f = e.prefix ?? "sensor.trading212_";
      return l.value === `${f}${s}_value`;
    })?.name ?? s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));
    const c = t === "pies" ? "Each pie in your portfolio weighted by value and coloured by overall P&L" : s ? "Each position in this pie weighted by value and coloured by overall P&L" : "Each position in your portfolio weighted by value and coloured by P&L", o = this._containerW, h = o > 0 ? Ve(a.map((l) => l.value), o, n) : [], p = 3;
    return u`
      <ha-card>
        <div class="alloc-header">
          <div class="alloc-title">Asset Allocation</div>
          <div class="alloc-subtitle">${c}</div>
        </div>
        <div class="treemap-wrap" style="height:${n}px">
          ${a.map((l, f) => {
      const v = h[f];
      if (!v) return d;
      const $ = v.x + p / 2, m = v.y + p / 2, g = v.w - p, A = v.h - p;
      if (g < 2 || A < 2) return d;
      const qt = Ge(l.pnlPct), Wt = l.pnlPct >= 0 ? "positive" : "negative", bt = `${l.pnlPct >= 0 ? "+" : ""}${l.pnlPct.toFixed(2)}%`, Vt = g >= 52 && A >= 72, Gt = g >= 28 && A >= 36, Zt = g >= 36 && A >= 54, Jt = l.label.charAt(0).toUpperCase();
      return u`
              <div
                class="treemap-cell"
                style="left:${$}px;top:${m}px;width:${g}px;height:${A}px;background:${qt}"
                title="${l.label}: ${bt} P&L"
              >
                ${Vt ? u`
                  <div class="cell-avatar" style="background:${Ze(l.label)}">${Jt}</div>
                ` : d}
                ${Gt ? u`<div class="cell-ticker">${l.label}</div>` : d}
                ${Zt ? u`<div class="cell-pct ${Wt}">${bt}</div>` : d}
              </div>`;
    })}
        </div>
      </ha-card>`;
  }
};
F.styles = [
  S,
  tt`
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
dt([
  _({ attribute: !1 })
], F.prototype, "hass", 2);
dt([
  _({ attribute: !1 })
], F.prototype, "config", 2);
dt([
  at()
], F.prototype, "_containerW", 2);
F = dt([
  w("investment-allocation-card")
], F);
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
