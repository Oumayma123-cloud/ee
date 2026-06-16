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
    const { selectedCardId, cguChecked } = this.data;

    if (!cguChecked) {
      wx.showToast({
        title: 'Veuillez accepter les CGU',
        icon: 'none'
      });
      return;
    }

    const { day, month, year, timeIndex, address, payment, type } = this.data;

    if (selectedCardId === 'new') {
      const { cardNumber, expiryDate, cvc, billingAddress } = this.data;
      if (!cardNumber || !expiryDate || !cvc || !billingAddress) {
        wx.showToast({
          title: 'Veuillez remplir tous les champs',
          icon: 'none'
        });
        return;
      }

      wx.showLoading({ title: 'Génération du Token...' });
      
      const last_4 = cardNumber.replace(/\s/g, '').slice(-4);
      
      api.genererTokenCarte({
        card_brand: 'Visa',
        last_4: last_4
      })
      .then(res => {
        wx.hideLoading();
        const token = res.data?.token || 'mocked-token-xyz';
        
        // Add new card to local mock store
        const newCard = {
          id: Date.now(),
          brand: 'Visa',
          last4: last_4,
          expMonth: expiryDate.split('/')[0] || '12',
          expYear: expiryDate.split('/')[1] || '2030',
          token: token
        };
        const currentCards = wx.getStorageSync('mock_saved_cards') || [];
        currentCards.push(newCard);
        wx.setStorageSync('mock_saved_cards', currentCards);

        wx.showToast({ title: 'Carte Tokenisée', icon: 'success' });
        
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/aide-menagere-confirm/aide-menagere-confirm?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&payment=${encodeURIComponent(payment + ' (Carte Enregistrée)')}&type=${type}`
          });
        }, 800);
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({ title: 'Erreur de tokenisation', icon: 'none' });
      });

    } else {
      // Using existing card
      const selectedCard = this.data.savedCards.find(c => c.id === selectedCardId);
      const cardLabel = selectedCard ? `${selectedCard.brand} (**** ${selectedCard.last4})` : 'Carte enregistrée';
      
      wx.showLoading({ title: 'Validation du paiement...' });
      setTimeout(() => {
        wx.hideLoading();
        wx.navigateTo({
          url: `/pages/aide-menagere-confirm/aide-menagere-confirm?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&payment=${encodeURIComponent(payment + ' (' + cardLabel + ')')}&type=${type}`
        });
      }, 800);
    }
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
