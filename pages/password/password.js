const { register } = require('../../utils/api');

Page({

  data: {
    phoneNumber: '',
    maskedPhone: '',
    password: '',
    confirmPassword: ''
  },

  onLoad(options) {
    if (options.phone) {
      const phone = options.phone
      this.setData({
        phoneNumber: phone,
        maskedPhone: this.maskPhone(phone)
      })
    }
  },

  // Mask phone number (+212 6******75)
  maskPhone(phone) {
    if (phone.length < 4) return phone

    const start = phone.substring(0, 4)
    const end = phone.substring(phone.length - 2)
    return start + '******' + end
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },

  handleValidate() {
    if (!this.data.password || !this.data.confirmPassword) {
      wx.showToast({
        title: 'Veuillez remplir les champs',
        icon: 'none'
      })
      return
    }

    if (this.data.password !== this.data.confirmPassword) {
      wx.showToast({
        title: 'Les mots de passe ne correspondent pas',
        icon: 'none'
      })
      return
    }

    const signupData = wx.getStorageSync('signupData');
    if (!signupData) {
      wx.showToast({ title: 'Données manquantes', icon: 'none' });
      return;
    }

    signupData.password = this.data.password;

    wx.showLoading({ title: 'Inscription...' });
    register(signupData)
      .then(() => {
        wx.hideLoading();
        wx.removeStorageSync('signupData');
        wx.navigateTo({
          url: '/pages/success/success'
        });
      })
      .catch((error) => {
        wx.hideLoading();
        const msg = error.message || 'Inscription impossible';
        
        // If error is related to password, keep them on this page
        if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('mot de passe')) {
          wx.showToast({
            title: msg,
            icon: 'none'
          });
        } else {
          // For any other error (like "user already exists", "invalid phone"), redirect to Etape 1
          wx.showModal({
            title: 'Information',
            content: msg + '\nVeuillez vérifier ou modifier vos informations.',
            confirmText: 'Modifier',
            showCancel: false,
            success: () => {
               // delta: 2 goes back from password -> verify -> signup
               wx.navigateBack({ delta: 2 });
            }
          });
        }
      });
  }

})