Page({
  data: {
    statusBarHeight: 20,
    messageCount: 6
  },

  onLoad: function() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
  },

  onBackTap: function() {
    wx.navigateBack();
  },

  onFinalConfirm: function() {
    wx.navigateTo({
      url: '../urgence-success/urgence-success'
    });
  },

  onActivateLoc: function() {
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        wx.showToast({
          title: 'Localisation activée',
          icon: 'success'
        });
      }
    });
  },

  onNavTap: function(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '../home/home' });
    } else if (action === 'emergency') {
      wx.redirectTo({ url: '../urgence/urgence' });
    }
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
