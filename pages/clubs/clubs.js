const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    scrollPercent: 0,
    scrollTopValue: 0,
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
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.reLaunch({ url: '/pages/essentiels/essentiels' });
    }
  },

  onNavTap: defaultBottomNavTap,

  onHeroCta() {
    wx.showToast({ title: 'Bienvenue dans les Clubs Tiqqa', icon: 'none' });
  },

  onPrevDate() {
    const { currentDateIndex, dates } = this.data;
    if (currentDateIndex > 0) {
      const newIndex = currentDateIndex - 1;
      this.setData({
        currentDateIndex: newIndex,
        currentDate: dates[newIndex]
      });
    }
  },

  onNextDate() {
    const { currentDateIndex, dates } = this.data;
    if (currentDateIndex < dates.length - 1) {
      const newIndex = currentDateIndex + 1;
      this.setData({
        currentDateIndex: newIndex,
        currentDate: dates[newIndex]
      });
    }
  },

  scrollUp() {
    let newScroll = this.data.scrollTopValue - 300;
    if (newScroll < 0) newScroll = 0;
    this.setData({ scrollTopValue: newScroll });
  },

  scrollDown() {
    let newScroll = this.data.scrollTopValue + 300;
    this.setData({ scrollTopValue: newScroll });
  },

  onScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.detail;
    const maxScroll = scrollHeight - clientHeight;
    
    // Track the internal scroll top so the arrows work smoothly
    this.data.scrollTopValue = scrollTop;

    if (maxScroll <= 0) {
      this.setData({ scrollPercent: 0 });
      return;
    }
    const ratio = scrollTop / maxScroll;
    const scrollPercent = Math.min(100, Math.max(0, ratio * 100));
    this.setData({ scrollPercent });
  },

  onClubTap(e) {
    const type = e.currentTarget.dataset.type;
    const labels = {
      sport: 'Club Sport',
      cuisine: 'Club Cuisine',
      finances: 'Club Finances',
      jardinage: 'Club Jardinage',
      beaute: 'Club Beauté',
      culture: 'Club Culture',
      nutrition: 'Club Nutrition',
      voyages: 'Club Voyages',
      sante: 'Club Santé',
      bienetre: 'Club Bien-être',
      religion: 'Club Religion',
      solidarite: 'Club Solidarité'
    };
    if (type === 'bienetre') {
      wx.navigateTo({ url: '/pages/bienetre/bienetre' });
      return;
    }
    if (type === 'sante') {
      wx.navigateTo({ url: '/pages/club_sante/club_sante' });
      return;
    }
    if (type === 'religion') {
      wx.navigateTo({ url: '/pages/club_religion/club_religion' });
      return;
    }
    if (type === 'solidarite') {
      wx.navigateTo({ url: '/pages/club_solidarite/club_solidarite' });
      return;
    }
    if (type === 'technologie') {
      wx.navigateTo({ url: '/pages/club_technologie/club_technologie' });
      return;
    }
    if (type === 'voyages') {
      wx.navigateTo({ url: '/pages/club_voyages/club_voyages' });
      return;
    }
    if (type === 'beaute') {
      wx.navigateTo({ url: '/pages/club_beaute/club_beaute' });
      return;
    }
    if (type === 'nutrition') {
      wx.navigateTo({ url: '/pages/club_nutrition/club_nutrition' });
      return;
    }
    if (type === 'culture') {
      wx.navigateTo({ url: '/pages/club_culture/club_culture' });
      return;
    }
    if (type === 'jardinage') {
      wx.navigateTo({ url: '/pages/club_jardinage/club_jardinage' });
      return;
    }
    if (type === 'finances') {
      wx.navigateTo({ url: '/pages/club_finance/club_finance' });
      return;
    }
    if (type === 'artisanat') {
      wx.navigateTo({ url: '/pages/club_artisanat/club_artisanat' });
      return;
    }
    if (type === 'cuisine') {
      wx.navigateTo({ url: '/pages/club_cuisine/club_cuisine' });
      return;
    }
    if (type === 'sport') {
      wx.navigateTo({ url: '/pages/club_sport/club_sport' });
      return;
    }

    wx.showToast({
      title: labels[type] || type,
      icon: 'none'
    });
  },

  onProfileTap() {
    wx.navigateTo({ url: '../profile/profile' });
  }
});
