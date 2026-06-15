const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    // No specific data needed for this static page yet
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onPrev() {
    wx.showToast({ title: 'Précédent', icon: 'none' });
  },

  onNext() {
    wx.showToast({ title: 'Suivant', icon: 'none' });
  },

  onCardTap(e) {
    const type = e.currentTarget.dataset.type;
    const labels = { inspecteur: 'Enquêtes', spider: 'Spider Solitaire', echecs: 'Échecs', dames: 'Dames' };
    wx.showToast({ title: labels[type] || type, icon: 'none' });
  },

  onProfileTap() {
    wx.navigateTo({ url: '../profile/profile' });
  }
});
