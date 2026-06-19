const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {},

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onNotifTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: 'Notification ouverte',
      icon: 'none',
      duration: 1000
    });
  }
});
