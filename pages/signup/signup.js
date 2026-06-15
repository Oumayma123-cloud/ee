const { register } = require('../../utils/api');

Page({
  data: {
    firstName: '',
    lastName: '',
    phone: '',
    cin: '',
    email: '',
    password: '',
    operatorLogo: '/assets/icons/logo-maroc-telecom.png',
    selectedOperator: 'IAM',
    acceptTerms: false
  },

  onFirstNameInput(e) {
    this.setData({ firstName: e.detail.value });
  },

  onLastNameInput(e) {
    this.setData({ lastName: e.detail.value });
  },

  onPhoneInput(e) {
    const value = e.detail.value;
    let logo = '/assets/icons/logo-maroc-telecom.png';
    let operator = '';

    if (value.startsWith('06') || value.startsWith('07')) {
      logo = '/assets/icons/logo-maroc-telecom.png';
      operator = 'IAM';
    } else if (value.startsWith('05')) {
      logo = '/assets/icons/logo-orange.png';
      operator = 'Orange';
    } else if (value.startsWith('08')) {
      logo = '/assets/icons/logo-inwi.png';
      operator = 'Inwi';
    }

    this.setData({
      phone: value,
      operatorLogo: logo,
      selectedOperator: operator
    });
  },

  onCinInput(e) {
    this.setData({ cin: e.detail.value });
  },

  onEmailInput(e) {
    this.setData({ email: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onTermsChange(e) {
    const values = e.detail.value || [];
    this.setData({ acceptTerms: values.includes('accepted') });
  },

  openSimSelector() {
    wx.showActionSheet({
      itemList: ['IAM', 'Orange', 'Inwi'],
      success: (res) => {
        let logo = '/assets/icons/logo-maroc-telecom.png';
        let operator = '';

        if (res.tapIndex === 0) {
          logo = '/assets/icons/logo-maroc-telecom.png';
          operator = 'IAM';
        } else if (res.tapIndex === 1) {
          logo = '/assets/icons/logo-orange.png';
          operator = 'Orange';
        } else if (res.tapIndex === 2) {
          logo = '/assets/icons/logo-inwi.png';
          operator = 'Inwi';
        }

        this.setData({
          operatorLogo: logo,
          selectedOperator: operator
        });
      }
    });
  },

  goToVerification() {
    const {
      firstName,
      lastName,
      phone,
      cin,
      email,
      selectedOperator,
      acceptTerms
    } = this.data;

    if (!firstName || !lastName || !phone || !cin || !email) {
      wx.showToast({
        title: 'Veuillez remplir tous les champs',
        icon: 'none'
      });
      return;
    }

    if (!acceptTerms) {
      wx.showToast({
        title: 'Veuillez accepter les conditions',
        icon: 'none'
      });
      return;
    }

    // Save data for later API call
    const signupData = {
      username: phone,
      email,
      nom: lastName,
      prenom: firstName,
      telephone: phone,
      operateur: (selectedOperator || '').toLowerCase(),
      cin,
      date_naissance: '1950-01-01', // Required by API (must be 60+ years old)
      ville: 'Rabat' // Required by API
    };
    wx.setStorageSync('signupData', signupData);

    wx.redirectTo({
      url: `/pages/verify/verify?phone=${phone}`
    });
  }
});
