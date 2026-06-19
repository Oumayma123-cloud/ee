const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    // Page data
  },

  onLoad: function (options) {
    // Lifecycle function--Called when page load
  },

  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  onPaiements: function () {
    wx.navigateTo({ url: '/pages/abonnement/abonnement' });
  },

  onMardy: function () {
    wx.navigateTo({ url: '/pages/avatar/avatar' });
  },

  onUrgences: function () {
    wx.navigateTo({ url: '/pages/urgence/urgence' });
  },

  onProfileTap: function () {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  onNavTap: defaultBottomNavTap
});
