Page({
  data: {
    statusBarHeight: 20,
    dateTimeStr: "SAM 22 FÉV 2025 - 14:30",
    day: null,
    month: null,
    year: null,
    timeIndex: null,
    address: "",
    tierceLabel: "Paiement par\nun tierce",
    chaabiLabel: "CHAABI\nCASH",
    type: '',
    currentSlide: 0
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      day: options.day || '',
      month: options.month || '',
      year: options.year || '',
      timeIndex: options.timeIndex || '',
      address: options.address ? decodeURIComponent(options.address) : '',
      type: options.type || ''
    });

    // Format dynamic date label
    const shortMonths = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
    const shortDays = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];

    if (options.day && options.month && options.year) {
      try {
        const d = new Date(parseInt(options.year), parseInt(options.month) - 1, parseInt(options.day));
        const dayName = shortDays[d.getDay()];
        const monthName = shortMonths[d.getMonth()];
        const times = ['10:00', '11:00', '12:00', '14:30', '15:00', '16:00'];
        const tIndex = parseInt(options.timeIndex) || 3;
        const timeStr = times[tIndex] || '14:30';
        
        this.setData({
          dateTimeStr: `${dayName} ${options.day} ${monthName} ${options.year} - ${timeStr}`.toUpperCase()
        });
      } catch (e) {
        console.error("Error building date string", e);
      }
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onConfirmPayment(e) {
    const method = e.currentTarget.dataset.method;
    const { day, month, year, timeIndex, address, type } = this.data;
    
    wx.showLoading({ title: 'Confirmation...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.navigateTo({
        url: `/pages/aide-menagere-credit-card/aide-menagere-credit-card?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&payment=${encodeURIComponent(method)}&type=${type}`
      });
    }, 800);
  },

  onPrevSlide() {
    this.setData({
      currentSlide: this.data.currentSlide === 0 ? 1 : 0
    });
  },

  onNextSlide() {
    this.setData({
      currentSlide: this.data.currentSlide === 0 ? 1 : 0
    });
  },

  onSetSlide(e) {
    const idx = parseInt(e.currentTarget.dataset.index) || 0;
    this.setData({
      currentSlide: idx > 0 ? 1 : 0
    });
  },

  onFindAgency() {
    const { day, month, year, timeIndex, address, type } = this.data;
    wx.navigateTo({
      url: `/pages/aide-menagere-agences/aide-menagere-agences?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&type=${type}`
    });
  },

  onNavTap(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '/pages/services/services' });
    } else if (action === 'emergency') {
      wx.navigateTo({ url: '/pages/urgence/urgence' });
    }
  }
});
