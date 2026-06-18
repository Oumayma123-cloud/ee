const api = require('../../utils/api.js');

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
    
    // Cards list
    savedCards: [],
    selectedCardId: 'new',

    // New card fields
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    billingAddress: '',
    cguChecked: false
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

    this.loadSavedCards();
  },

  loadSavedCards() {
    api.getCartesEnregistrees()
      .then(res => {
        const cards = res.data || [];
        this.setData({
          savedCards: cards,
          selectedCardId: cards.length > 0 ? cards[0].id : 'new'
        });
      })
      .catch(err => {
        console.error('Failed to load saved cards:', err);
      });
  },

  onSelectSavedCard(e) {
    const cardId = e.currentTarget.dataset.cardId;
    this.setData({ selectedCardId: cardId });
  },

  onSelectNewCard() {
    this.setData({ selectedCardId: 'new' });
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
    const { cguChecked } = this.data;

    if (!cguChecked) {
      wx.showToast({
        title: 'Veuillez accepter les CGU',
        icon: 'none'
      });
      return;
    }

    const { day, month, year, timeIndex, address, type } = this.data;

    wx.showLoading({ title: 'Validation du paiement...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.navigateTo({
        url: `/pages/aide-menagere-confirm/aide-menagere-confirm?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&payment=${encodeURIComponent('Carte bancaire')}&type=${type}`
      });
    }, 800);
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
