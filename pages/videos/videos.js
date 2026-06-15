const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {},

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onCardTap(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({ url: `/pages/video_detail/video_detail?id=${type}` });
  },

  onProfileTap() {
    wx.navigateTo({ url: '../profile/profile' });
  }
});
