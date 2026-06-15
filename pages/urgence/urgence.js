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

  onAmbulanceTap: function() {
    wx.navigateTo({
      url: '../urgence-confirm/urgence-confirm'
    });
  },

  onCancelTap: function() {
    wx.navigateTo({
      url: '../urgence-cancel/urgence-cancel'
    });
  },

  onNavTap: function(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '../home/home' });
    }
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
