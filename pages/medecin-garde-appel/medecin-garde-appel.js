const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    messageCount: 1
  },

  onLoad() {},

  onAccept() {
    wx.navigateTo({
      url: '/pages/medecin-garde-attente/medecin-garde-attente?showModal=true'
    });
  },

  onRefuse() {
    wx.showToast({
      title: 'Appel refusé',
      icon: 'none'
    });
    setTimeout(() => {
      wx.navigateBack({ delta: 2 });
    }, 1000);
  },

  onNavTap: defaultBottomNavTap
});
