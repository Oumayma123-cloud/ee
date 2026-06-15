Page({
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 44
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sys.statusBarHeight || 44 });
  },

  onBack() {
    wx.navigateBack();
  },

  onOperatorTap(e) {
    const id = e.currentTarget.dataset.id;
    console.log('Operator tapped:', id);
    // Future: navigate to operator payment form
    wx.showToast({ title: 'Bientôt disponible', icon: 'none' });
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
