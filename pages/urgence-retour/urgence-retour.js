const api = require('../../utils/api.js');

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
      modalMessage: this.data.messages[type],
      tappedType: type
    });
    if (wx.vibrateShort) wx.vibrateShort();
  },

  closeModal: function() {
    this.setData({ showModal: false });
  },

  onModalOk: function() {
    this.setData({ showModal: false });
    const type = this.data.tappedType;
    if (type === 'oui') {
      const authUser = wx.getStorageSync('auth_user') || {};
      const parentId = authUser.id || 521;
      const currentPrestation = wx.getStorageSync('mock_ambulance_prestation') || { id: 489 };
      const id = currentPrestation.id || 489;

      wx.showLoading({ title: 'Demande en cours...' });
      api.demanderRetourAmbulance(id, {
        parent_id: String(parentId),
        type: 'retour'
      })
      .then((res) => {
        wx.hideLoading();
        wx.navigateTo({
          url: '../urgence-success/urgence-success?type=retour'
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({ title: 'Erreur demande', icon: 'none' });
      });
    } else if (type === 'later') {
      wx.navigateTo({
        url: '../urgence-success/urgence-success?type=retour'
      });
    } else {
      wx.reLaunch({
        url: '/pages/sante/sante'
      });
    }
  },

  onNavTap: function(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '/pages/sante/sante' });
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
