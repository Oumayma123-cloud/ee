/* Course max. du pouce (%) — piste 234.615rpx, pouce 124rpx */
const THUMB_TRAVEL = 47;
const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    scrollViewInnerPx: 400,
    scrollTop: 0,
    scrollIntoView: '',
    scrollThumbTopPct: 0,
    cards: [
      { key: 'tashilat', title: 'TASHILAT', iconSrc: '/assets/payment-tashilat.png' },
      { key: 'carte', title: 'CARTE BANCAIRE', iconSrc: '/assets/payment-tiers.png' },
      { key: 'tiers', title: 'PAIEMENT PAR TIERCHE', iconSrc: '/assets/payment-carte-bancaire.png' },
      { key: 'chaaib', title: 'CHAAIB CASH', iconSrc: '/assets/payment-chaabi-cash.png' }
    ]
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    const w = sys.windowWidth || 375;
    const wh = sys.windowHeight || 667;
    const rpx = w / 750;
    const safeB = (sys.safeAreaInsets && sys.safeAreaInsets.bottom) || 0;
    const pageVPad = 16 * rpx + 20 * rpx + safeB;
    const navH = 168 * rpx;
    const scrollViewInnerPx = Math.max(280, Math.floor(wh - pageVPad - navH));
    this._scrollViewHeightPx = scrollViewInnerPx;
    this._lastScrollTop = 0;
    this._scrollContentHeight = 0;
    this.setData({ scrollViewInnerPx });
  },

  measurePayScrollHeight() {
    const q = wx.createSelectorQuery().in(this);
    q.select('.mobile-card--figma').boundingClientRect();
    q.select('.bottom-nav.bottom-nav--in-card').boundingClientRect();
    q.exec((res) => {
      const card = res && res[0];
      const nav = res && res[1];
      if (card && card.height > 80) {
        const navH = nav && nav.height ? nav.height : 0;
        const h = Math.max(240, Math.round(card.height - navH));
        this._scrollViewHeightPx = h;
        if (h !== this.data.scrollViewInnerPx) {
          this.setData({ scrollViewInnerPx: h });
        }
      }
    });
  },

  onReady() {
    setTimeout(() => this.measurePayScrollHeight(), 80);
  },

  onShow() {
    setTimeout(() => this.measurePayScrollHeight(), 0);
  },

  getPayScrollCtx() {
    try {
      return this.selectComponent('#payContentScroll');
    } catch (e) {
      return null;
    }
  },

  thumbPct(scrollTop, scrollHeight, viewH) {
    if (!viewH || scrollHeight <= viewH) {
      return null;
    }
    const maxScroll = scrollHeight - viewH;
    const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
    return Math.round(ratio * THUMB_TRAVEL * 10) / 10;
  },

  /**
   * Même idée que dashboard + bump si WeChat ignore une valeur identique.
   */
  applyScrollTop(targetPx) {
    const t = Math.max(0, Math.round(targetPx));
    this.setData({ scrollIntoView: '' });
    const ctx = this.getPayScrollCtx();
    if (ctx && typeof ctx.scrollTo === 'function') {
      try {
        ctx.scrollTo({ top: t, animated: false });
      } catch (e) {
        /* ignore */
      }
    }
    if (t === this.data.scrollTop) {
      const bump = t > 0 ? t - 1 : 1;
      this.setData({ scrollTop: bump }, () => {
        setTimeout(() => {
          this.setData({ scrollTop: t });
          this._lastScrollTop = t;
        }, 50);
      });
    } else {
      this.setData({ scrollTop: t });
      this._lastScrollTop = t;
    }
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onConfirmCard(e) {
    const key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: `/pages/medecin-paiement-detail/medecin-paiement-detail?key=${key}`
    });
  },

  onNavTap: defaultBottomNavTap,

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onHeroCta() {
    wx.showToast({ title: 'Accéder bientôt', icon: 'none' });
  },

  /**
   * IMPORTANT : si scrollHeight <= viewH, ne pas remettre le curseur à 0
   * (sinon les clics flèches semblent « annulés » visuellement).
   */
  onContentScroll(e) {
    const detail = e.detail || {};
    const scrollTop = detail.scrollTop || 0;
    const scrollHeight = detail.scrollHeight || 0;
    this._lastScrollTop = scrollTop;
    this._scrollContentHeight = scrollHeight;
    const viewH = this.data.scrollViewInnerPx || this._scrollViewHeightPx || 1;
    if (scrollHeight <= viewH) {
      return;
    }
    const pct = this.thumbPct(scrollTop, scrollHeight, viewH);
    if (pct !== null && pct !== this.data.scrollThumbTopPct) {
      this.setData({ scrollTop, scrollThumbTopPct: pct });
    } else {
      this.setData({ scrollTop });
    }
  },

  onScrollRailUp() {
    const viewH = this.data.scrollViewInnerPx || this._scrollViewHeightPx || 500;
    const step = Math.round(viewH * 0.22);
    const cur =
      typeof this._lastScrollTop === 'number'
        ? this._lastScrollTop
        : this.data.scrollTop || 0;
    const next = Math.max(0, cur - step);
    if (next === cur) {
      return;
    }
    const contentH = this._scrollContentHeight || viewH * 4;
    const maxScroll = Math.max(0, contentH - viewH);
    const pct = this.thumbPct(next, contentH, viewH);
    if (pct !== null) {
      this.setData({ scrollThumbTopPct: pct });
    }
    this.applyScrollTop(Math.min(next, maxScroll));
  },

  onScrollRailDown() {
    const viewH = this.data.scrollViewInnerPx || this._scrollViewHeightPx || 500;
    const step = Math.round(viewH * 0.22);
    const cur =
      typeof this._lastScrollTop === 'number'
        ? this._lastScrollTop
        : this.data.scrollTop || 0;
    const contentH = this._scrollContentHeight || viewH * 4;
    const maxScroll = Math.max(0, contentH - viewH);
    const next = Math.min(maxScroll, cur + step);
    if (next === cur) {
      return;
    }
    const pct = this.thumbPct(next, contentH, viewH);
    if (pct !== null) {
      this.setData({ scrollThumbTopPct: pct });
    }
    this.applyScrollTop(next);
  }
});
