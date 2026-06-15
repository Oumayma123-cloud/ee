const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    // Current avatar and info
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onHeroCta() {
    wx.showToast({ title: 'Accéder bientôt', icon: 'none' });
  },

  onCardTap(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'sante') {
      wx.navigateTo({ url: '/pages/sante/sante' });
    } else if (type === 'clubs') {
      wx.navigateTo({ url: '/pages/clubs/clubs' });
    } else if (type === 'services') {
      wx.navigateTo({ url: '/pages/services/services' });
    } else if (type === 'plans') {
      wx.navigateTo({ url: '/pages/bon_plan/bon_plan' });
    } else {
      wx.showToast({ title: 'Bientôt disponible', icon: 'none' });
    }
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
