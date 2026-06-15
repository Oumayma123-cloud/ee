Page({
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 44,
    scrollThumbTop: 0,
    showImage2: false
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 44
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onScroll(e) {
    const { scrollTop, scrollHeight } = e.detail;
    const trackHeight = 600; // updated from wxss
    const thumbHeight = 100; // updated from wxss
    const windowHeight = wx.getSystemInfoSync().windowHeight;
    const maxScroll = scrollHeight - windowHeight;
    
    if (maxScroll > 0) {
      let ratio = scrollTop / maxScroll;
      let top = ratio * (trackHeight - thumbHeight);
      this.setData({ scrollThumbTop: top });
    }
  },

  onScrollUp() {
    this.setData({ scrollThumbTop: 0 });
  },

  onShowImage2() {
    this.setData({ showImage2: true });
  },
  onHideImage2() {
    this.setData({ showImage2: false });
  },

  onCategoryTap(e) {
    const type = e.currentTarget.dataset.type;
    const routes = {
      'eau-electricite': '/pages/eau-electricite/eau-electricite',
      'telephone-internet': '/pages/telephone-internet/telephone-internet',
      'transport': '/pages/transport/transport',
    };
    const url = routes[type];
    if (url) {
      wx.navigateTo({ url });
    } else {
      wx.showToast({ title: 'Bientôt disponible', icon: 'none' });
    }
  },

  onNavTap(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '/pages/services/services' });
    } else if (action === 'emergency') {
      wx.navigateTo({ url: '/pages/urgence/urgence' });
    }
  }
});
