Page({
  data: {
    statusBarHeight: 20,
    paymentVal: '',
    orderDate: '',
    dateVal: '',
    addressVal: '',
    amountVal: '200 MAD', // Default to 200 MAD (appartement)
    confirmImage: '/assets/aide-menagere-woman-transparent-v2.png',
    day: '',
    month: '',
    year: '',
    timeIndex: '',
    type: '',
    currentSlide: 0
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    const payment = options.payment ? decodeURIComponent(options.payment) : 'Espèces';
    const address = options.address ? decodeURIComponent(options.address) : 'Rue melouiya, immeuble 68...';
    
    // Determine amount based on type if passed, or default to 350 MAD if it looks like a villa flow (e.g. if we can store it, or default to 200 MAD otherwise)
    let amount = '200 MAD';
    if (options.type === 'villa') {
      amount = '350 MAD';
    }

    // Format dynamic date labels
    const shortMonths = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
    const shortDays = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
    
    let dateStr = 'SAM 22 FÉV 2025 - 14:30';
    let rawOrderDate = '22/02/2025';

    if (options.day && options.month && options.year) {
      try {
        const d = new Date(parseInt(options.year), parseInt(options.month) - 1, parseInt(options.day));
        const dayName = shortDays[d.getDay()];
        const monthName = shortMonths[d.getMonth()];
        const times = ['10:00', '11:00', '12:00', '14:30', '15:00', '16:00'];
        const tIndex = parseInt(options.timeIndex) || 3;
        const timeStr = times[tIndex] || '14:30';
        
        dateStr = `${dayName} ${options.day} ${monthName} ${options.year} - ${timeStr}`.toUpperCase();
        
        const dd = String(options.day).padStart(2, '0');
        const mm = String(options.month).padStart(2, '0');
        rawOrderDate = `${dd}/${mm}/${options.year}`;
      } catch (e) {
        console.error("Error formatting date in confirm page:", e);
      }
    }

    // Determine confirmation image based on payment method
    let confirmImage = '/assets/aide-menagere-woman-transparent-v2.png';
    if (payment === 'Paiement par un tierce' || payment === 'Carte bancaire') {
      confirmImage = '/assets/payment_tierce_user.png';
    }

    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      paymentVal: payment,
      addressVal: address,
      amountVal: amount,
      dateVal: dateStr,
      orderDate: rawOrderDate,
      confirmImage: confirmImage,
      day: options.day || '',
      month: options.month || '',
      year: options.year || '',
      timeIndex: options.timeIndex || '',
      type: options.type || ''
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onShareCode() {
    const { day, month, year, timeIndex, addressVal, type, paymentVal } = this.data;
    wx.showToast({
      title: 'Code partagé !',
      icon: 'success',
      duration: 1000
    });
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/aide-menagere-agences/aide-menagere-agences?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(addressVal)}&type=${type}&payment=${encodeURIComponent(paymentVal)}`
      });
    }, 1000);
  },

  onCancelOrder() {
    wx.showModal({
      title: 'Annuler la commande',
      content: 'Êtes-vous sûr de vouloir annuler cette commande ?',
      success: (res) => {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/services/services'
          });
        }
      }
    });
  },

  onModify() {
    const { day, month, year, timeIndex, addressVal, type } = this.data;
    wx.navigateTo({
      url: `/pages/aide-menagere-payment/aide-menagere-payment?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(addressVal)}&type=${type}`
    });
  },

  onCancel() {
    wx.showModal({
      title: 'Annuler le RDV',
      content: 'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
      success: (res) => {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/services/services'
          });
        }
      }
    });
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
    const { day, month, year, timeIndex, addressVal, type } = this.data;
    wx.navigateTo({
      url: `/pages/aide-menagere-agences/aide-menagere-agences?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(addressVal)}&type=${type}`
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