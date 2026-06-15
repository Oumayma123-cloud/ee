const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

const VIDEO_DATA = {
  video1: {
    heroImage: '/assets/P1.png',
    heroName: 'TARIK HAJJI',
    heroRole: 'CO-FONDATEUR DE TIQQA'
  },
  video2: {
    heroImage: '/assets/P2.png',
    heroName: 'FARIDA BENCHEKROUN',
    heroRole: 'MAMAN'
  },
  video3: {
    heroImage: '/assets/P3.png',
    heroName: 'TARIK HAJJI',
    heroRole: 'CO-FONDATEUR DE TIQQA'
  },
  video4: {
    heroImage: '/assets/P4.png',
    heroName: 'ILHAM',
    heroRole: 'BELLE FILLE'
  },
  video5: {
    heroImage: '/assets/P5.png',
    heroName: 'ATIKA BOUCETTA',
    heroRole: 'MAMAN'
  }
};

Page({
  data: {
    heroImage: '/assets/P1.png',
    heroName: 'TARIK HAJJI',
    heroRole: 'CO-FONDATEUR DE TIQQA'
  },

  onLoad(options) {
    const id = options.id || 'video1';
    if (VIDEO_DATA[id]) {
      this.setData(VIDEO_DATA[id]);
    }
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onActionTap(e) {
    const action = e.currentTarget.dataset.action;
    wx.showToast({ title: 'Action: ' + action, icon: 'none' });
  },

  onProfileTap() {
    wx.navigateTo({ url: '../profile/profile' });
  }
});
