Page({
  data: {
    statusBarHeight: 20,
    day: '',
    month: '',
    year: '',
    timeIndex: '',
    address: '',
    type: '',
    payment: '',

    // Map 1: Rabat Agdal
    latAgdal: 33.9982,
    lonAgdal: -6.8480,
    markersAgdal: [
      {
        id: 1,
        latitude: 33.9982,
        longitude: -6.8480,
        iconPath: '/assets/tashilat_logo_blend.png',
        width: 36,
        height: 36
      }
    ],

    // Map 2: Al Irfane (near Cheikh Zaid Hospital)
    latIrfane: 33.9818,
    lonIrfane: -6.8641,
    markersIrfane: [
      {
        id: 2,
        latitude: 33.9818,
        longitude: -6.8641,
        iconPath: '/assets/tashilat_logo_blend.png',
        width: 36,
        height: 36
      }
    ]
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    const payment = options.payment ? decodeURIComponent(options.payment) : 'Tashilat';
    const isChaabi = payment.toLowerCase() === 'chaabi cash';
    const logoPath = isChaabi ? '/assets/chaabi_logo_blend.png' : '/assets/tashilat_logo_blend.png';
    
    const markersAgdal = [
      {
        id: 1,
        latitude: 33.9982,
        longitude: -6.8480,
        iconPath: logoPath,
        width: 36,
        height: 36
      }
    ];

    const markersIrfane = [
      {
        id: 2,
        latitude: 33.9818,
        longitude: -6.8641,
        iconPath: logoPath,
        width: 36,
        height: 36
      }
    ];

    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      day: options.day || '',
      month: options.month || '',
      year: options.year || '',
      timeIndex: options.timeIndex || '',
      address: options.address ? decodeURIComponent(options.address) : '',
      type: options.type || '',
      payment: payment,
      paymentLogo: logoPath,
      markersAgdal: markersAgdal,
      markersIrfane: markersIrfane
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onReturnToPayment() {
    const day = this.data.day || '';
    const month = this.data.month || '';
    const year = this.data.year || '';
    const timeIndex = this.data.timeIndex || '';
    const address = this.data.address || '';
    const type = this.data.type || '';
    const payment = this.data.payment || 'Tashilat';

    wx.navigateTo({
      url: `/pages/aide-menagere-tashilat/aide-menagere-tashilat?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&type=${type}&payment=${encodeURIComponent(payment)}`,
      fail: (err) => {
        console.warn("navigateTo failed, trying redirectTo:", err);
        wx.redirectTo({
          url: `/pages/aide-menagere-tashilat/aide-menagere-tashilat?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&type=${type}&payment=${encodeURIComponent(payment)}`
        });
      }
    });
  },

  onOpenAgdal() {
    wx.openLocation({
      latitude: 33.9982,
      longitude: -6.8480,
      name: 'Agence Tashilat Rabat Agdal',
      address: 'Rabat Agdal, Maroc',
      scale: 16
    });
  },

  onOpenIrfane() {
    wx.openLocation({
      latitude: 33.9818,
      longitude: -6.8641,
      name: 'Agence Tashilat Al Irfane',
      address: 'Madinat Al Irfane, Rabat, Maroc',
      scale: 16
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
