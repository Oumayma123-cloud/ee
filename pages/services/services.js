const app = getApp();

Page({
  data: {
    statusBarHeight: 20,
    scrollThumbTop: 0,
    scrollTopValue: 0,
    currentScrollTop: 0
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight || 20
    });
  },

  onBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.reLaunch({ url: '/pages/essentiels/essentiels' });
    }
  },

  onHeroCta() {
    // Action when hero banner is tapped
  },

  onServiceTap(e) {
    const type = e.currentTarget.dataset.type;
    console.log('Service tapped:', type);
    // Navigate to the appropriate service page
    if (type === 'aide-menagere') {
      wx.navigateTo({ url: '/pages/aide-menagere/aide-menagere' });
    } else if (type === 'paiement-factures') {
      wx.navigateTo({ url: '/pages/paiement-factures/paiement-factures' });
    } else if (type === 'demarches-admin') {
      wx.navigateTo({ url: '/pages/demarches-admin/demarches-admin' });
    } else if (type === 'medecin-garde') {
      wx.navigateTo({ url: '/pages/medecin-garde/medecin-garde' });
    }
  },

  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    this.data.currentScrollTop = scrollTop;
    const maxScroll = 600;
    const maxThumbTop = 120;
    const thumbTop = Math.min((scrollTop / maxScroll) * maxThumbTop, maxThumbTop);
    this.setData({ scrollThumbTop: thumbTop });
  },

  onScrollUp() {
    this.setData({ 
      scrollTopValue: Math.max(0, this.data.currentScrollTop - 300)
    });
  },

  onScrollDown() {
    this.setData({ 
      scrollTopValue: this.data.currentScrollTop + 300
    });
  },

  onNavTap(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '/pages/dashboard/dashboard' });
    } else if (action === 'emergency') {
      wx.navigateTo({ url: '/pages/urgence/urgence' });
    }
  }
});
