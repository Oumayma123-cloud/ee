Page({
  data: {
    seconds: 56,
    timer: null,
    phoneNumber: '+212 *******75',
    password: '',
    confirmPassword: ''
  },

  onLoad() {
    this.startTimer();
  },

  onBack() {
    wx.navigateBack();
  },

  onUnload() {
    clearInterval(this.data.timer);
  },

  startTimer() {
    const timer = setInterval(() => {
      let s = this.data.seconds;
      if (s > 0) {
        this.setData({ seconds: s - 1 });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    this.setData({ timer });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  handleValidate() {
    const { password, confirmPassword } = this.data;

    if (!password || password.length < 4) {
      wx.showToast({ title: 'Mot de passe trop court', icon: 'none' });
      return;
    }
    if (password !== confirmPassword) {
      wx.showToast({ title: 'Les mots de passe ne correspondent pas', icon: 'none' });
      return;
    }

    wx.navigateTo({
      url: '/pages/success/success?type=recovery'   
    });
  }
})