const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    scrollPercent: 0,
    currentDate: 'DIM 23 FÉV 2025 - 10:30',
    dates: [
      'DIM 23 FÉV 2025 - 10:30',
      'LUN 24 FÉV 2025 - 10:30',
      'MAR 25 FÉV 2025 - 10:30',
      'MER 26 FÉV 2025 - 10:30',
      'JEU 27 FÉV 2025 - 10:30',
    ],
    currentDateIndex: 0
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onHeroCta() {
    wx.showToast({ title: 'Accéder au Club Cuisine', icon: 'none' });
  },

  onPrevDate() {
    const { currentDateIndex, dates } = this.data;
    if (currentDateIndex > 0) {
      const newIndex = currentDateIndex - 1;
      this.setData({ currentDateIndex: newIndex, currentDate: dates[newIndex] });
    }
  },

  onNextDate() {
    const { currentDateIndex, dates } = this.data;
    if (currentDateIndex < dates.length - 1) {
      const newIndex = currentDateIndex + 1;
      this.setData({ currentDateIndex: newIndex, currentDate: dates[newIndex] });
    }
  },

  onScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.detail;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) { this.setData({ scrollPercent: 0 }); return; }
    const scrollPercent = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
    this.setData({ scrollPercent });
  },

  onCardTap(e) {
    const type = e.currentTarget.dataset.type;
    const labels = { activites: 'Activités', communaute: 'Communauté', videos: 'Vidéos', coach: 'Coach' };
    wx.showToast({ title: labels[type] || type, icon: 'none' });
  },

  onProfileTap() {
    wx.navigateTo({ url: '../profile/profile' });
  }
});
