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

  onFinalCancel: function() {
    wx.showToast({
      title: 'Action annulée',
      icon: 'none'
    });
    setTimeout(() => {
      wx.reLaunch({ url: '../home/home' });
    }, 1500);
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
