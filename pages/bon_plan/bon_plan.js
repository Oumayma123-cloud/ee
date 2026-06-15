const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    scrollPercent: 0,
    deals: [
      {
        id: 1,
        brandType: 'hard-auto',
        brandName: 'HARD AUTO SERVICES',
        logo: '/assets/bon13.png',
        titlePrefix: '',
        titleSuffix: '-10%',
        subtitle: 'BATTERIES BOSCH',
        image: '/assets/bon4.png',
        bgColor: '#F7DC7C',
        color: '#E92E2A'
      },
      {
        id: 2,
        brandType: 'hard-auto',
        brandName: 'HARD AUTO SERVICES',
        logo: '/assets/bon13.png',
        titlePrefix: '',
        titleSuffix: '-15%',
        subtitle: 'FILTRES BOSCH',
        image: '/assets/bon3.png',
        bgColor: '#FAEAB0',
        color: '#E92E2A'
      },
      {
        id: 3,
        brandType: 'hard-auto',
        brandName: 'HARD AUTO SERVICES',
        logo: '/assets/bon13.png',
        titlePrefix: '',
        titleSuffix: '-15%',
        subtitle: 'FREINAGE BOSCH',
        image: '/assets/bon5.png',
        bgColor: '#EEC683',
        color: '#E92E2A'
      },
      {
        id: 4,
        brandType: 'hard-auto',
        brandName: 'HARD AUTO SERVICES',
        logo: '/assets/bon13.png',
        titlePrefix: 'À PARTIR DE',
        titleSuffix: '690 MAD',
        subtitle: 'PNEUS BRIDGESTONE',
        image: '/assets/bon6.png',
        bgColor: '#F7DC7C',
        color: '#E92E2A'
      },
      {
        id: 5,
        brandType: 'auditec',
        brandName: 'auditec',
        logo: '/assets/bon12.png',
        titlePrefix: '',
        titleSuffix: '-15%',
        subtitle: 'APPAREILS AUDITIFS',
        image: '/assets/bon2.png',
        bgColor: '#FAEAB0',
        color: '#E92E2A'
      },
      {
        id: 6,
        brandType: 'monarch',
        brandName: 'Monarch Travel',
        logo: '/assets/bon11.png',
        titlePrefix: 'À PARTIR DE',
        titleSuffix: '9 866 MAD',
        subtitle: 'VOYAGE ISTANBUL',
        image: '/assets/bon9.png',
        bgColor: '#EEC683',
        color: '#E92E2A'
      },
      {
        id: 7,
        brandType: 'monarch',
        brandName: 'Monarch Travel',
        logo: '/assets/bon11.png',
        titlePrefix: 'À PARTIR DE',
        titleSuffix: '5 850 MAD',
        subtitle: 'MERZOUGA ET ERFOUD',
        image: '/assets/bon8.png',
        bgColor: '#FAEAB0',
        color: '#E92E2A'
      },
      {
        id: 8,
        brandType: 'monarch',
        brandName: 'Monarch Travel',
        logo: '/assets/bon11.png',
        titlePrefix: 'À PARTIR DE',
        titleSuffix: '2 150 MAD',
        subtitle: 'ÉCOLODGE SAFA BOULAOUANE',
        image: '/assets/bon7.png',
        bgColor: '#EEC683',
        color: '#E92E2A'
      },
      {
        id: 9,
        brandType: 'nadari',
        brandName: 'NADARI',
        logo: '/assets/bon14.png',
        titlePrefix: '',
        titleSuffix: '-20%',
        subtitle: 'SUR TOUTE LA GAMME',
        image: '/assets/bon1.png',
        bgColor: '#F7DC7C',
        color: '#E92E2A'
      }
    ]
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onHeroCta() {
    wx.showToast({ title: 'Profiter des offres', icon: 'none' });
  },

  onScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.detail;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      this.setData({ scrollPercent: 0 });
      return;
    }
    const ratio = scrollTop / maxScroll;
    const scrollPercent = Math.min(100, Math.max(0, ratio * 100));
    this.setData({
      scrollPercent: scrollPercent
    });
  },

  onDealTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/bon_plan_detail/bon_plan_detail?id=${id}`
    });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
