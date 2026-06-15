Page({
  data: {
    successMessage: 'Votre mot de passe a été créé avec succès'
  },

  onLoad(options) {
    if (options && options.type === 'recovery') {
      this.setData({ successMessage: 'Votre mot de passe a été modifié avec succès' });
    }
  },

  goToHome() {
    wx.reLaunch({
      url: '/pages/login/login'
    });
  }
});
