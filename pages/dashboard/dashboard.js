const { getBottomNavStyle } = require('../../utils/bottomNav.js');

Page({
  data: {
    messageCount: 6,
    scrollIntoView: '',
    scrollViewHeight: 667,
    statusBarHeight: 20,
    headerPadLeft: 27,
    headerPadRight: 27,
    bottomNavStyle: '',
    heroCarouselStripStyle: '',
    carouselBtnPx: 28,
    carouselBtnRadiusPx: 14,
    topRowWidthPx: 336,
    logoSlotStyle: '',
    avatarSlotStyle: '',
    scrollTop: 0,
    scrollThumbTopPct: 0,
    scrollRailPositionStyle: '',
    scrollRailTrackStyle: '',
    headerMintStripStyle: '',
    navBandBottomPad: 0,
    backWrapStyle: '',
    dashboardTopStackStyle: '',
    headerGroupLayoutStyle: '',
    heroBlockStyle: '',
    // Local additions
    user: {
      name: 'Ahmed Salim',
      phone: '0611996095'
    },
    currentTab: 'home'
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    const statusBarHeight = sys.statusBarHeight || 20;
    const w = sys.windowWidth || 390;
    const side = Math.ceil((27 / 390) * w);
    let headerPadRight = side;
    try {
      const menu = wx.getMenuButtonBoundingClientRect();
      if (menu && menu.left > 0) {
        headerPadRight = Math.max(side, Math.ceil(w - menu.left) + 8);
      }
    } catch (e) {}
    const windowHeight = sys.windowHeight || 667;
    const scale = w / 390;
    const cardW = Math.min(w, 390);
    const bottomNavStyle = getBottomNavStyle(sys);
    const bottomNavHeightPx = Math.round(76 * scale);
    const FIGMA_CAROUSEL_STRIP_HEIGHT_PX = 40;
    const FIGMA_HEADER_STRIP_HEIGHT_PX = 22;
    const carouselStripH = Math.round(FIGMA_CAROUSEL_STRIP_HEIGHT_PX * scale);
    const headerStripH = Math.round(FIGMA_HEADER_STRIP_HEIGHT_PX * scale);
    const stripPadH = Math.round(14 * scale);
    const carouselBtnPx = Math.round(26 * scale);
    const carouselBtnRadiusPx = Math.round(13 * scale);
    const heroCarouselStripStyle = `width:${cardW}px;height:${carouselStripH}px;min-height:${carouselStripH}px;max-height:${carouselStripH}px;margin-left:0;padding-left:${stripPadH}px;padding-right:${stripPadH}px;box-sizing:border-box;background-color:#CDE6D0;border-radius:0;border-bottom:1px solid #b5d9c4;overflow:hidden;`;
    const headerMintStripStyle = [`height:${headerStripH}px`,`min-height:${headerStripH}px`,`max-height:${headerStripH}px`,'width:auto','background-color:#CDE6D0','border-bottom:1px solid #b5d9c4','box-sizing:border-box','position:absolute',`left:${-side}px`,`right:${-headerPadRight}px`,'bottom:0','z-index:1','pointer-events:none'].join(';');
    const headerSlotDownShiftPx = Math.round(18 * scale);
    const headerVisualLogoShiftPx = Math.round(10 * scale);
    const backWrapStyle = `transform: translate(${-Math.round(6 * scale)}px, ${headerSlotDownShiftPx - Math.round(16 * scale)}px);`;
    const navBandBottomPad = Math.max(0, Math.round(headerStripH + (26 / 750) * w - headerSlotDownShiftPx));
    const FIGMA_HERO_WIDTH_PX = 390;
    const FIGMA_HERO_HEIGHT_PX = 219;
    const FIGMA_HERO_TOP_PX = 100;
    const heroScale = cardW / 390;
    const heroWidthPx = Math.round(FIGMA_HERO_WIDTH_PX * heroScale);
    const heroHeightPx = Math.round(FIGMA_HERO_HEIGHT_PX * heroScale);
    const heroTopPx = Math.round(FIGMA_HERO_TOP_PX * heroScale);
    const dashboardTopStackHeightPx = heroTopPx + heroHeightPx;
    const dashboardTopStackStyle = ['position:relative','width:100%','box-sizing:border-box',`height:${dashboardTopStackHeightPx}px`,`min-height:${dashboardTopStackHeightPx}px`].join(';');
    const headerGroupLayoutStyle = ['position:absolute','left:0','top:0','right:0','width:100%','z-index:2','overflow:visible','box-sizing:border-box'].join(';');
    const heroBlockStyle = ['position:absolute','left:0',`top:${heroTopPx}px`,`width:${heroWidthPx}px`,'max-width:100%',`height:${heroHeightPx}px`,`min-height:${heroHeightPx}px`,`max-height:${heroHeightPx}px`,'opacity:1','box-sizing:border-box','padding:0','margin:0','z-index:1'].join(';');
    const navInnerW = Math.max(220, Math.round(cardW - side - headerPadRight));
    const logoWpx = Math.max(72, Math.round(86.75 * (cardW / 390)));
    let logoLeftPx = Math.round(cardW / 2 - logoWpx / 2 - side);
    logoLeftPx = Math.max(0, logoLeftPx);
    const avatarSlotWpx = Math.max(56, Math.round((120 * w) / 750));
    const avatarClearCapsulePx = Math.max(6, Math.round(10 * scale));
    const intoPaddingPx = Math.max(0, headerPadRight - avatarClearCapsulePx);
    const logoSlotStyle = ['position:absolute','top:0',`bottom:${navBandBottomPad}px`,`left:${logoLeftPx}px`,`width:${logoWpx}px`,`transform: translateY(${headerVisualLogoShiftPx}px)`,'display:flex','align-items:center','justify-content:center','z-index:6','pointer-events:none','box-sizing:border-box'].join(';');
    const avatarSlotStyle = ['position:absolute','top:0',`bottom:${navBandBottomPad}px`,`right:${-intoPaddingPx}px`,`width:${avatarSlotWpx}px`,`transform: translateY(${headerVisualLogoShiftPx}px)`,'display:flex','align-items:flex-end','justify-content:flex-end','z-index:7','overflow:visible','box-sizing:border-box'].join(';');
    const railRightPx = Math.max(8, Math.round((w - cardW) / 2 + 8));
    const safeBottom = (sys.safeAreaInsets && sys.safeAreaInsets.bottom) || 0;
    const railBottomPx = bottomNavHeightPx + safeBottom + Math.round(12 * scale);
    const railTopPx = Math.round(statusBarHeight + 262 * scale);
    const railWpx = Math.round(22 * scale);
    const scrollRailPositionStyle = ['position:fixed','z-index:45',`top:${railTopPx}px`,`bottom:${railBottomPx}px`,`right:${railRightPx}px`,`width:${railWpx}px`,'display:flex','flex-direction:column','align-items:center','justify-content:center','box-sizing:border-box'].join(';');
    const trackWpx = Math.round(14 * scale);
    const trackHpx = Math.round(122 * scale);
    const trackRadiusPx = Math.round(20 * scale);
    const shadowY = Math.round(4 * scale);
    const shadowBlur = Math.round(8 * scale);
    const scrollRailTrackStyle = [`width:${trackWpx}px`,`height:${trackHpx}px`,`min-height:${trackHpx}px`,`max-height:${trackHpx}px`,`border-radius:${trackRadiusPx}px`,'background-color:#ffffff',`box-shadow:0 ${shadowY}px ${shadowBlur}px 0 rgba(0,0,0,0.25)`,'box-sizing:border-box','position:relative','flex-shrink:0','overflow:hidden'].join(';');
    this._lastScrollTop = 0;
    this._scrollContentHeight = 0;
    this.setData({
      statusBarHeight,
      headerPadLeft: side,
      headerPadRight,
      scrollViewHeight: windowHeight,
      bottomNavStyle,
      heroCarouselStripStyle,
      carouselBtnPx,
      carouselBtnRadiusPx,
      topRowWidthPx: navInnerW,
      logoSlotStyle,
      avatarSlotStyle,
      scrollRailPositionStyle,
      scrollRailTrackStyle,
      headerMintStripStyle,
      navBandBottomPad,
      dashboardTopStackStyle,
      headerGroupLayoutStyle,
      heroBlockStyle,
      backWrapStyle
    });
  },

  onMainScroll(e) {
    const detail = e.detail || {};
    const scrollTop = detail.scrollTop || 0;
    const scrollHeight = detail.scrollHeight || 0;
    this._lastScrollTop = scrollTop;
    this._scrollContentHeight = scrollHeight;
    const viewH = this.data.scrollViewHeight || 1;
    const maxScroll = Math.max(1, scrollHeight - viewH);
    const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
    const thumbTravel = 72;
    const pct = Math.round(ratio * thumbTravel * 10) / 10;
    this.setData({ scrollTop, scrollThumbTopPct: pct });
  },

  onScrollRailUp() {
    const viewH = this.data.scrollViewHeight || 500;
    const step = Math.round(viewH * 0.4);
    const cur = typeof this._lastScrollTop === 'number' ? this._lastScrollTop : 0;
    const next = Math.max(0, cur - step);
    this.setData({ scrollTop: next });
    this._lastScrollTop = next;
  },

  onScrollRailDown() {
    const viewH = this.data.scrollViewHeight || 500;
    const step = Math.round(viewH * 0.4);
    const cur = typeof this._lastScrollTop === 'number' ? this._lastScrollTop : 0;
    const contentH = this._scrollContentHeight || viewH * 3;
    const maxScroll = Math.max(0, contentH - viewH);
    const next = Math.min(maxScroll, cur + step);
    this.setData({ scrollTop: next });
    this._lastScrollTop = next;
  },

  onBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.redirectTo({ url: '/pages/login/login' });
    }
  },

  onHeroCta() {
    this.setData({ scrollIntoView: 'ma-sante' });
    setTimeout(() => {
      this.setData({ scrollIntoView: '' });
    }, 500);
  },

  onCarouselPrev() {
    wx.navigateBack();
  },

  onCarouselNext() {
    wx.navigateTo({ url: '/pages/sante/sante' });
  },

  onServiceTap(e) {
    const { type } = e.currentTarget.dataset;
    if (type === 'home-doctor' || type === 'ma-sante') {
      wx.navigateTo({ url: '/pages/sante/sante' });
      return;
    }
    wx.showToast({ title: 'Bientôt disponible', icon: 'none' });
  },

  openSante() {
    wx.navigateTo({ url: '/pages/sante/sante' });
  },

  onNavTap(e) {
    const action =
      (e.detail && e.detail.action) ||
      (e.currentTarget.dataset && e.currentTarget.dataset.action);
    if (action === 'home') return;
    wx.showToast({ title: 'Bientôt disponible', icon: 'none' });
  },

  onProfileTap() {
    wx.navigateTo({
      url: '/pages/profile/profile',
    });
  },

  selectTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  }
});
