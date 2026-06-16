Page({
  data: {
    statusBarHeight: 20,
    day: '',
    month: '',
    year: '',
    timeIndex: '',
    address: '',
    type: '',
    amountVal: 180,
    paymentName: 'Tashilat',
    paymentLogo: '/assets/tashilat_logo_blend.png',
    paymentDesc: 'Veuillez vous adresser à l\'agence Tasshilate la plus proche',
    paymentMethod: 'Tashilat',
    paymentCode: '355193488',
    paymentMode: 'Espèces',
    paymentTime: '2h',
    cguChecked: true,
    showModal: false,
    showSuccessModal: false
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    const type = options.type || '';
    const amount = type.toLowerCase() === 'villa' ? 250 : 180;
    
    const payment = options.payment ? decodeURIComponent(options.payment) : 'Tashilat';
    const isChaabi = payment.toLowerCase() === 'chaabi cash';
    const isTierce = payment === 'Paiement par un tierce';

    let pName = 'Tashilat';
    let pLogo = '/assets/tashilat_logo_blend.png';
    let pDesc = 'Veuillez vous adresser à l\'agence Tasshilate la plus proche';
    let pCode = '355193488';
    let pMode = 'Espèces';
    let pTime = '2h';

    if (isChaabi) {
      pName = 'Chaabi Cash';
      pLogo = '/assets/chaabi_logo_blend.png';
      pDesc = 'Veuillez vous adresser à l\'agence Chaabi Cash la plus proche';
    } else if (isTierce) {
      pName = 'Paiement par un tierce';
      pLogo = '/assets/payment_tierce_user.png';
      pDesc = 'Veuillez partager ce code avec votre tiers pour effectuer le paiement';
      pCode = 'AZ44LK5578';
      pMode = 'En ligne / Par un tiers';
      pTime = '1J 23H';
    }

    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      day: options.day || '',
      month: options.month || '',
      year: options.year || '',
      timeIndex: options.timeIndex || '',
      address: options.address ? decodeURIComponent(options.address) : '',
      type: type,
      amountVal: amount,
      paymentName: pName,
      paymentLogo: pLogo,
      paymentDesc: pDesc,
      paymentMethod: payment,
      paymentCode: pCode,
      paymentMode: pMode,
      paymentTime: pTime
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onFindAgency() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    if (prevPage && prevPage.route && prevPage.route.indexOf('aide-menagere-agences') !== -1) {
      wx.navigateBack();
    } else {
      const { day, month, year, timeIndex, address, type, paymentMethod } = this.data;
      wx.navigateTo({
        url: `/pages/aide-menagere-agences/aide-menagere-agences?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&type=${type}&payment=${encodeURIComponent(paymentMethod)}`
      });
    }
  },

  onToggleCheckbox() {
    this.setData({
      cguChecked: !this.data.cguChecked
    });
  },

  onProceedPayment() {
    const { cguChecked } = this.data;

    if (!cguChecked) {
      wx.showToast({
        title: 'Veuillez accepter les CGU',
        icon: 'none'
      });
      return;
    }

    this.setData({
      showSuccessModal: true
    });
  },

  onCloseModal() {
    this.setData({
      showSuccessModal: false
    });
    const { day, month, year, timeIndex, address, type, paymentMethod } = this.data;
    wx.navigateTo({
      url: `/pages/aide-menagere-recap/aide-menagere-recap?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&type=${type}&payment=${encodeURIComponent(paymentMethod)}`
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
