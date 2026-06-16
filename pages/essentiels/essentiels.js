const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    heroCurrent: 0,
    heroImagesCount: 2
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onHeroPrev() {
    let current = this.data.heroCurrent;
    current = current > 0 ? current - 1 : this.data.heroImagesCount - 1;
    this.setData({ heroCurrent: current });
  },

  onHeroNext() {
    let current = this.data.heroCurrent;
    current = current < this.data.heroImagesCount - 1 ? current + 1 : 0;
    this.setData({ heroCurrent: current });
  },

  onHeroChange(e) {
    this.setData({ heroCurrent: e.detail.current });
  },

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
