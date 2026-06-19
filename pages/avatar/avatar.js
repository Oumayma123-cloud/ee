const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    selectedAvatar: ''
  },

  onLoad() {
    // Check if user already has an avatar selected
    const savedAvatar = wx.getStorageSync('selectedAvatar');
    if (savedAvatar) {
      this.setData({ selectedAvatar: savedAvatar });
    }
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  selectAvatar(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      selectedAvatar: id
    });
    
    // Save preference
    wx.setStorageSync('selectedAvatar', id);
    
    wx.showToast({
      title: 'Avatar sélectionné',
      icon: 'success',
      duration: 1000
    });

    // Navigate to the video page after a short delay
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/mardy_video/mardy_video'
      });
    }, 1000);
  }
});
