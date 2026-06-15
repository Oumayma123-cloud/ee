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

  onBook(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/aide-menagere-calendar/aide-menagere-calendar?type=${type}`
    });
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
