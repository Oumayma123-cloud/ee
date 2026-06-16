Page({
  data: {
    statusBarHeight: 20,
    day: '',
    month: '',
    year: '',
    timeIndex: '',
    address: '',
    payment: '',
    type: '',
    
    // Initial pre-filled values matching mockup
    cardNumber: '0598 550 993 34',
    expiryDate: '21/06/2030',
    cvc: '435',
    billingAddress: 'Espèces',
    cguChecked: true
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    const payment = options.payment ? decodeURIComponent(options.payment) : 'Carte bancaire';
    
    let paymentIcon = '/assets/payment_credit_card.png';
    let paymentLabel = 'Carte de crédit';
    
    if (payment === 'Tashilat') {
      paymentIcon = '/assets/tashilat_logo_blend.png';
      paymentLabel = 'Tashilat';
    } else if (payment === 'Paiement par un tierce') {
      paymentIcon = '/assets/payment_tierce_user.png';
      paymentLabel = 'Paiement par un tierce';
    } else if (payment === 'Chaabi Cash') {
      paymentIcon = '/assets/chaabi_logo_blend.png';
      paymentLabel = 'Chaabi Cash';
    }

    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      day: options.day || '',
      month: options.month || '',
      year: options.year || '',
      timeIndex: options.timeIndex || '',
      address: options.address ? decodeURIComponent(options.address) : '',
      payment: payment,
      paymentIcon: paymentIcon,
      paymentLabel: paymentLabel,
      type: options.type || ''
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onCardNumberInput(e) {
    this.setData({ cardNumber: e.detail.value });
  },

  onExpiryDateInput(e) {
    this.setData({ expiryDate: e.detail.value });
  },

  onCvcInput(e) {
    this.setData({ cvc: e.detail.value });
  },

  onBillingAddressInput(e) {
    this.setData({ billingAddress: e.detail.value });
  },

  onToggleCheckbox() {
    this.setData({ cguChecked: !this.data.cguChecked });
  },

  onSubmit() {
    const { cardNumber, expiryDate, cvc, billingAddress, cguChecked } = this.data;

    if (!cardNumber || !expiryDate || !cvc || !billingAddress) {
      wx.showToast({
        title: 'Veuillez remplir tous les champs',
        icon: 'none'
      });
      return;
    }

    if (!cguChecked) {
      wx.showToast({
        title: 'Veuillez accepter les CGU',
        icon: 'none'
      });
      return;
    }

    const { day, month, year, timeIndex, address, payment, type } = this.data;

    wx.showLoading({ title: 'Validation du paiement...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.navigateTo({
        url: `/pages/aide-menagere-confirm/aide-menagere-confirm?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&payment=${encodeURIComponent(payment)}&type=${type}`
      });
    }, 1200);
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
