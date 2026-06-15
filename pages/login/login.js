const { login } = require('../../utils/api');

Page({
  data: {
    phone: '',
    password: '',
    showPassword: false
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword });
  },

  onForgotPassword() {
    wx.navigateTo({ url: '/pages/recovery/recovery' });
  },

  onLogin() {
    const { phone, password } = this.data;
    if (!phone || !password) {
      wx.showToast({ title: 'Remplissez tous les champs', icon: 'none' });
      return;
    }

    wx.showLoading({ title: 'Connexion...' });
    login(phone, password)
      .then((response) => {
        const data = response.data || {};
        if (data.access_token) {
          wx.setStorageSync('access_token', data.access_token);
        }
        if (data.refresh_token) {
          wx.setStorageSync('refresh_token', data.refresh_token);
        }
        wx.setStorageSync('auth_user', data.user || {});

        wx.hideLoading();
        wx.showToast({ title: 'Connexion reussie', icon: 'success' });
        setTimeout(() => {
          wx.reLaunch({ url: '/pages/essentiels/essentiels' });
        }, 400);
      })
      .catch((error) => {
        wx.hideLoading();
        wx.showToast({
          title: error.message || 'Echec de connexion',
          icon: 'none'
        });
      });
  },

  onSignUp() {
    wx.navigateTo({ url: '/pages/signup/signup' });
  }
});
