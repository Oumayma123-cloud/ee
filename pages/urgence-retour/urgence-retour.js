Page({
  data: {
    statusBarHeight: 20,
    messageCount: 6,
    showModal: false,
    modalMessage: '',
    messages: {
      oui: "Nous avons bien pris en compte votre requête. Un de nos conseillers vous contactera prochainement pour coordonner les détails.",
      non: "Nous avons bien noté que vous n'avez pas besoin d'une ambulance pour le retour. Nous vous souhaitons un trajet en toute tranquillité et restons à votre disposition si vous en avez finalement besoin.",
      later: "Merci pour votre réponse. Nous avons bien pris note que vous préférez demander une ambulance plus tard. Vous pourrez à tout moment en faire la demande si besoin."
    }
  },

  onLoad: function() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
  },

  onBackTap: function() {
    wx.navigateBack();
  },

  onActionTap: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      showModal: true,
      modalMessage: this.data.messages[type]
    });
    if (wx.vibrateShort) wx.vibrateShort();
  },

  closeModal: function() {
    this.setData({ showModal: false });
  },

  onModalOk: function() {
    this.setData({ showModal: false });
    // Optionnel : Retour à l'accueil après confirmation
    // wx.reLaunch({ url: '../home/home' });
  },

  onNavTap: function(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '../home/home' });
    } else if (action === 'emergency') {
      wx.redirectTo({ url: '../urgence/urgence' });
    }
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
