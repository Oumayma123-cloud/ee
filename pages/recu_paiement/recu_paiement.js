const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {},

  onLoad: function (options) {
  },

  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  onReturnHome: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  onProfileTap: function () {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  onNavTap: defaultBottomNavTap
});
