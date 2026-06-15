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

  onHomeReturn: function() {
    wx.reLaunch({ url: '../home/home' });
  },

  onCloseTap: function() {
    wx.navigateTo({
      url: '../urgence-success/urgence-success'
    });
  },

  onRedirectionTap: function() {
    wx.navigateTo({
      url: '../urgence-retour/urgence-retour'
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
