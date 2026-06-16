const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

function mapSliderToDeal(slider) {
  const titre = slider.titre || '';
  const titreLower = titre.toLowerCase();
  
  let brandType = 'monarch';
  let logo = '/assets/bon11.png';
  let brandName = 'Monarch Travel';
  let titlePrefix = '';
  let titleSuffix = '';
  let subtitle = titre.toUpperCase();
  let image = slider.image;
  let bgColor = slider.color || '#EEC683';
  let color = '#E92E2A';

  if (titreLower.includes('hard auto') || titreLower.includes('batterie') || titreLower.includes('filtre') || titreLower.includes('frein') || titreLower.includes('pneu')) {
    brandType = 'hard-auto';
    logo = '/assets/bon13.png';
    brandName = 'HARD AUTO SERVICES';
    titlePrefix = '';
    titleSuffix = titreLower.includes('batterie') ? '-10%' : '-15%';
    if (titreLower.includes('pneu')) {
      titlePrefix = 'À PARTIR DE';
      titleSuffix = '690 MAD';
    }
  } else if (titreLower.includes('auditec') || titreLower.includes('auditif')) {
    brandType = 'auditec';
    logo = '/assets/bon12.png';
    brandName = 'auditec';
    titleSuffix = '-15%';
  } else if (titreLower.includes('nadari') || titreLower.includes('lunette')) {
    brandType = 'nadari';
    logo = '/assets/bon14.png';
    brandName = 'NADARI';
    titleSuffix = '-20%';
  } else if (titreLower.includes('istanbul')) {
    titlePrefix = 'À PARTIR DE';
    titleSuffix = '9 866 MAD';
  } else if (titreLower.includes('merzouga')) {
    titlePrefix = 'À PARTIR DE';
    titleSuffix = '5 850 MAD';
  } else if (titreLower.includes('safa') || titreLower.includes('boulaouane')) {
    titlePrefix = 'À PARTIR DE';
    titleSuffix = '2 150 MAD';
  }

  if (titreLower.includes('batterie')) {
    subtitle = 'BATTERIES BOSCH';
  } else if (titreLower.includes('filtre')) {
    subtitle = 'FILTRES BOSCH';
  } else if (titreLower.includes('frein')) {
    subtitle = 'FREINAGE BOSCH';
  } else if (titreLower.includes('pneu')) {
    subtitle = 'PNEUS BRIDGESTONE';
  } else if (titreLower.includes('appareil') || titreLower.includes('auditif')) {
    subtitle = 'APPAREILS AUDITIFS';
  } else if (titreLower.includes('istanbul')) {
    subtitle = 'VOYAGE ISTANBUL';
  } else if (titreLower.includes('merzouga')) {
    subtitle = 'MERZOUGA ET ERFOUD';
  } else if (titreLower.includes('safa') || titreLower.includes('boulaouane')) {
    subtitle = 'ÉCOLODGE SAFA BOULAOUANE';
  } else if (titreLower.includes('nadari')) {
    subtitle = 'SUR TOUTE LA GAMME';
  }

  return {
    id: slider.id,
    brandType,
    brandName,
    logo,
    titlePrefix,
    titleSuffix,
    subtitle,
    image,
    bgColor,
    color,
    description: slider.contenu || ''
  };
}

Page({
  data: {
    scrollPercent: 0,
    scrollTopValue: 0,
    thumbTopStyle: '0rpx',
    scrollViewHeight: 0,
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
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.reLaunch({ url: '/pages/essentiels/essentiels' });
    }
  },

  onNavTap: defaultBottomNavTap,

  onHeroCta() {
    wx.showToast({ title: 'Profiter des offres', icon: 'none' });
  },

  onReady() {
    wx.createSelectorQuery().in(this).select('.content-scroll').boundingClientRect(rect => {
      if (rect) {
        this.setData({ scrollViewHeight: rect.height });
      }
    }).exec();
    wx.createSelectorQuery().in(this).select('.ess-grid').boundingClientRect(rect => {
      if (rect) {
        this.scrollViewContentHeight = rect.height;
      }
    }).exec();
  },

  onScroll(e) {
    const { scrollTop, scrollHeight } = e.detail;
    this.currentScrollTop = scrollTop;
    this.scrollHeight = scrollHeight;

    const clientHeight = this.data.scrollViewHeight || 400;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      this.setData({ scrollPercent: 0, thumbTopStyle: '0rpx' });
      return;
    }
    const ratio = scrollTop / maxScroll;
    const scrollPercent = Math.min(100, Math.max(0, ratio * 100));
    this.setData({
      scrollPercent: scrollPercent,
      thumbTopStyle: `calc(${scrollPercent}% - ${(scrollPercent * 0.8).toFixed(2)}rpx)`
    });
  },

  scrollTo(target) {
    const rounded = Math.round(target);
    if (this.data.scrollTopValue === rounded) {
      this.setData({
        scrollTopValue: rounded + (rounded === 0 ? 0.1 : -0.1)
      });
    } else {
      this.setData({
        scrollTopValue: rounded
      });
    }
  },

  scrollUp() {
    const current = this.currentScrollTop || 0;
    this.scrollTo(Math.max(0, current - 150));
  },

  scrollDown() {
    const current = this.currentScrollTop || 0;
    const scrollHeight = this.scrollHeight || this.scrollViewContentHeight || 800;
    const clientHeight = this.data.scrollViewHeight || 400;
    const maxScroll = scrollHeight - clientHeight;
    this.scrollTo(Math.min(maxScroll, current + 150));
  },

  onTrackTap(e) {
    const query = wx.createSelectorQuery();
    query.select('.ess-scroll-track').boundingClientRect();
    query.exec((res) => {
      const rect = res[0];
      if (!rect) return;
      const touchY = e.detail.y - rect.top;
      const ratio = Math.max(0, Math.min(1, touchY / rect.height));
      const scrollHeight = this.scrollHeight || this.scrollViewContentHeight || 800;
      const clientHeight = this.data.scrollViewHeight || 400;
      const maxScroll = scrollHeight - clientHeight;
      this.scrollTo(ratio * maxScroll);
    });
  },

  onTouchStart(e) {
    this.startY = e.touches[0].clientY;
    const query = wx.createSelectorQuery();
    query.select('.ess-scroll-track').boundingClientRect();
    query.exec((res) => {
      const rect = res[0];
      if (rect) {
        this.trackHeight = rect.height;
        this.startScrollTop = this.currentScrollTop || 0;
      }
    });
  },

  onTouchMove(e) {
    if (!this.trackHeight) return;
    const deltaY = e.touches[0].clientY - this.startY;
    const deltaRatio = deltaY / this.trackHeight;
    const scrollHeight = this.scrollHeight || this.scrollViewContentHeight || 800;
    const clientHeight = this.data.scrollViewHeight || 400;
    const maxScroll = scrollHeight - clientHeight;
    const targetScrollTop = Math.max(0, Math.min(maxScroll, this.startScrollTop + deltaRatio * maxScroll));
    this.scrollTo(targetScrollTop);
  },

  onDealTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/bon_plan_detail/bon_plan_detail?id=${id}`
    });
  },

  onLoad() {
    this.loadDeals();
  },

  loadDeals() {
    wx.showLoading({ title: 'Chargement...' });
    api.getSliders(1, 200, true)
      .then(res => {
        wx.hideLoading();
        if (res && res.status === 'success' && Array.isArray(res.data)) {
          const sliders = res.data.filter(item => item.type === 'bons_plans');
          if (sliders.length > 0) {
            const mappedDeals = sliders.map(mapSliderToDeal);
            this.setData({ deals: mappedDeals }, () => {
              // Re-query height of the grid content
              setTimeout(() => {
                wx.createSelectorQuery().in(this).select('.ess-grid').boundingClientRect(rect => {
                  if (rect) {
                    this.scrollViewContentHeight = rect.height;
                  }
                }).exec();
              }, 300);
            });
            wx.setStorageSync('active_deals', mappedDeals);
            return;
          }
        }
        wx.setStorageSync('active_deals', this.data.deals);
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Failed to load dynamic deals:', err);
        wx.setStorageSync('active_deals', this.data.deals);
      });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
