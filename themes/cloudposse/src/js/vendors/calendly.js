(function () {
  this.Calendly = {}
}).call(this), Calendly.domReady = function (t) {
    var e = !1,
      n = function () {
        document.addEventListener ? (document.removeEventListener("DOMContentLoaded", o), window.removeEventListener("load", o)) : (document.detachEvent("onreadystatechange", o), window.detachEvent("onload", o))
      },
      o = function () {
        e || !document.addEventListener && "load" !== event.type && "complete" !== document.readyState || (e = !0, n(), t())
      };
    if ("complete" === document.readyState) t();
    else if (document.addEventListener) document.addEventListener("DOMContentLoaded", o), window.addEventListener("load", o);
    else {
      document.attachEvent("onreadystatechange", o), window.attachEvent("onload", o);
      var i = !1;
      try {
        i = null == window.frameElement && document.documentElement
      } catch (r) {}
      i && i.doScroll && ! function l() {
        if (!e) {
          try {
            i.doScroll("left")
          } catch (o) {
            return setTimeout(l, 50)
          }
          e = !0, n(), t()
        }
      }()
    }
  },
  function () {
    Calendly.initInlineWidgets = function () {
      return Calendly.domReady(function () {
        return Calendly.createInlineWidgets()
      })
    }, Calendly.initBadgeWidget = function (t) {
      return Calendly.domReady(function () {
        return Calendly.createBadgeWidget(t)
      })
    }, Calendly.createInlineWidgets = function () {
      var t, e, n, o, i;
      for (e = document.querySelectorAll(".calendly-inline-widget"), i = [], n = 0, o = e.length; o > n; n++) t = e[n], t.getAttribute("data-processed") ? i.push(void 0) : (t.setAttribute("data-processed", !0), i.push(new Calendly.Iframe(t, !0, "Inline")));
      return i
    }, Calendly.createBadgeWidget = function (t) {
      return this.destroyBadgeWiget(), Calendly.badgeWidget = new Calendly.BadgeWidget({
        color: t.color,
        text: t.text,
        branding: t.branding,
        onClick: function () {
          return Calendly.showPopupWidget(t.url, "PopupWidget")
        }
      })
    }, Calendly.destroyBadgeWiget = function () {
      return Calendly.badgeWidget ? (Calendly.badgeWidget.destroy(), delete Calendly.badgeWidget) : void 0
    }, Calendly.showPopupWidget = function (t, e) {
      return null == e && (e = "PopupText"), this.closePopupWidget(), Calendly.popupWidget = new Calendly.PopupWidget(t, function () {
        return delete Calendly.popupWidget
      }, e), Calendly.popupWidget.show()
    }, Calendly.closePopupWidget = function () {
      return Calendly.popupWidget ? Calendly.popupWidget.close() : void 0
    }
  }.call(this),
  function () {
    var t = [].indexOf || function (t) {
      for (var e = 0, n = this.length; n > e; e++)
        if (e in this && this[e] === t) return e;
      return -1
    };
    Calendly.Iframe = function () {
      function e(t, e, n) {
        this.parent = t, this.inlineStyles = null != e ? e : !1, this.embedType = n, this.build(), this.inject()
      }
      return e.prototype.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), e.prototype.build = function () {
        return this.node = document.createElement("iframe"), this.node.src = this.getSource(), this.node.width = "100%", this.node.height = "100%", this.node.frameBorder = "0"
      }, e.prototype.inject = function () {
        return this.format(), this.parent.appendChild(this.buildSpinner()), this.parent.appendChild(this.node)
      }, e.prototype.getSource = function () {
        var t;
        return t = "" + this.getUrl() + this.getDivider() + this.getParams(), this.filterConsentParam(t)
      }, e.prototype.getUrl = function () {
        return null != this.url ? this.url : this.url = this.parent.getAttribute("data-url").split("#")[0]
      }, e.prototype.getDivider = function () {
        return -1 === this.getUrl().indexOf("?") ? "?" : "&"
      }, e.prototype.getParams = function () {
        var t, e, n, o;
        e = "embed_domain=" + this.getDomain() + "&embed_type=" + this.embedType, n = this.getHostUtmParams();
        for (t in n) o = n[t], t in this.getBookingUtmParams() || (e += "&" + t + "=" + o);
        return e
      }, e.prototype.getUrlParams = function (t) {
        var e, n, o, i, r, l, a, d, s, u;
        for (a = document.createElement("a"), a.href = t, r = a.search.substr(1), l = {}, d = r.split("&"), e = 0, o = d.length; o > e; e++) i = d[e], s = i.split("="), n = s[0], u = s[1], void 0 !== u && (l[n.toLowerCase()] = u);
        return l
      }, e.prototype.getUtmUrlParams = function (e) {
        var n, o, i, r, l;
        r = ["utm_campaign", "utm_source", "utm_medium", "utm_content", "utm_term"], o = {}, i = this.getUrlParams(e);
        for (n in i) l = i[n], t.call(r, n) >= 0 && (o[n] = l);
        return o
      }, e.prototype.getHostUtmParams = function () {
        return this.getUtmUrlParams(window.location.href)
      }, e.prototype.getBookingUtmParams = function () {
        return this.getUtmUrlParams(this.getUrl())
      }, e.prototype.getDomain = function () {
        return encodeURIComponent(document.location.host)
      }, e.prototype.filterConsentParam = function (t) {
        return t.replace(/consent_accept=1&?/g, "")
      }, e.prototype.format = function () {
        return this.isMobile ? this.formatMobile() : this.formatDesktop()
      }, e.prototype.formatDesktop = function () {
        return this.inlineStyles ? this.parent.setAttribute("style", "position: relative;" + this.parent.getAttribute("style")) : void 0
      }, e.prototype.formatMobile = function () {
        return this.inlineStyles ? this.parent.setAttribute("style", "position: relative;overflow-y:auto;-webkit-overflow-scrolling:touch;" + this.parent.getAttribute("style")) : this.parent.className += " mobile"
      }, e.prototype.buildSpinner = function () {
        var t;
        return t = document.createElement("div"), t.className = "spinner", t.appendChild(this.buildBounce(1)), t.appendChild(this.buildBounce(2)), t.appendChild(this.buildBounce(3)), t
      }, e.prototype.buildBounce = function (t) {
        var e;
        return e = document.createElement("div"), e.className = "bounce" + t, e
      }, e
    }()
  }.call(this),
  function () {
    var t = function (t, e) {
      return function () {
        return t.apply(e, arguments)
      }
    };
    Calendly.PopupWidget = function () {
      function e(e, n, o) {
        this.url = e, this.onClose = n, this.embedType = o, this.close = t(this.close, this), this.pageRoot = document.getElementsByTagName("html")[0]
      }
      return e.prototype.show = function () {
        return this.buildOverlay(), this.insertOverlay(), this.lockPageScroll()
      }, e.prototype.close = function () {
        return this.destroyOverlay(), this.onClose(), this.unlockPageScroll()
      }, e.prototype.buildOverlay = function () {
        return this.overlay = document.createElement("div"), this.overlay.className = "calendly-overlay", this.overlay.appendChild(this.buildCloseOverlay()), this.overlay.appendChild(this.buildPopup())
      }, e.prototype.insertOverlay = function () {
        return document.body.insertBefore(this.overlay, document.body.firstChild)
      }, e.prototype.buildCloseOverlay = function () {
        var t;
        return t = document.createElement("div"), t.className = "calendly-close-overlay", t.onclick = this.close, t
      }, e.prototype.buildPopup = function () {
        var t;
        return t = document.createElement("div"), t.className = "calendly-popup", t.appendChild(this.buildPopupContent()), t.appendChild(this.buildCloseButton()), t
      }, e.prototype.buildPopupContent = function () {
        var t;
        return t = document.createElement("div"), t.className = "calendly-popup-content", t.setAttribute("data-url", this.url), new Calendly.Iframe(t, !1, this.embedType), t
      }, e.prototype.buildCloseButton = function () {
        var t;
        return t = document.createElement("div"), t.className = "calendly-popup-close", t.onclick = this.close, t
      }, e.prototype.destroyOverlay = function () {
        return this.overlay.parentNode.removeChild(this.overlay)
      }, e.prototype.lockPageScroll = function () {
        return this.pageRoot.className += " calendly-page-scroll-locked"
      }, e.prototype.unlockPageScroll = function () {
        return this.pageRoot.className = this.pageRoot.className.replace(" calendly-page-scroll-locked", "")
      }, e
    }()
  }.call(this),
  function () {
    Calendly.BadgeWidget = function () {
      function t(t) {
        this.options = t, this.buildWidget(), this.insertWidget()
      }
      return t.prototype.destroy = function () {
        return this.widget.parentNode.removeChild(this.widget)
      }, t.prototype.buildWidget = function () {
        return this.widget = document.createElement("div"), this.widget.className = "calendly-badge-widget", this.widget.appendChild(this.buildContent())
      }, t.prototype.insertWidget = function () {
        return document.body.insertBefore(this.widget, document.body.firstChild)
      }, t.prototype.buildContent = function () {
        var t;
        return t = document.createElement("div"), t.className = "calendly-badge-content", "#ffffff" === this.options.color && (t.className += " white"), t.onclick = this.options.onClick, t.innerHTML = this.options.text, t.style.background = this.options.color, this.options.branding && t.appendChild(this.buildBranding()), t
      }, t.prototype.buildBranding = function () {
        var t;
        return t = document.createElement("span"), t.innerHTML = "powered by Calendly", t
      }, t
    }()
  }.call(this), Calendly.initInlineWidgets();
