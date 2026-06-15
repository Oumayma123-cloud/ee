const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    selectedPlan: '1_mois'
  },

  onLoad: function (options) {
    // Lifecycle function--Called when page load
  },

  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  selectPlan: function(e) {
    const plan = e.currentTarget.dataset.plan;
    this.setData({
      selectedPlan: plan
    });
  },

  onContinue: function () {
    wx.navigateTo({ url: '/pages/recu_paiement/recu_paiement' });
  },

  onProfileTap: function () {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  onNavTap: defaultBottomNavTap
});
