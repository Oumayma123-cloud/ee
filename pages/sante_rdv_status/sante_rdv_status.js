const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

Page({
  data: {
    dateStr: "Mardi 13 avril à 12h",
    address: "60, Avenue Hassan 2, Res Yasmine",
    amount: "150 Dhs",
    paymentMethod: "Espèces",
    status: "RENDEZ VOUS ANNULÉ",
    prestation: null
  },

  onLoad() {
    const prestation = wx.getStorageSync('current_infirmier_prestation') || {};
    this.setData({
      prestation: prestation,
      dateStr: prestation.date_prestation || "Mardi 13 avril à 12h",
      address: prestation.adresse_beneficiaire || "60, Avenue Hassan 2, Res Yasmine",
      status: prestation.status || "en_attente"
    });
  },

  onBack() {
    wx.navigateBack();
  },
  onPrev() {
    wx.navigateTo({ url: '/pages/sante_paiement_detail/sante_paiement_detail' });
  },
  onNext() {
    wx.showToast({ title: 'Fin du parcours', icon: 'none' });
  },
  onModify() {
    const prestation = this.data.prestation || wx.getStorageSync('current_infirmier_prestation') || {};
    if (prestation.id) {
      wx.setStorageSync('modify_prestation_id', prestation.id);
    } else {
      wx.removeStorageSync('modify_prestation_id');
    }
    wx.reLaunch({ url: '/pages/sante_calendar/sante_calendar' });
  },

  onCancelRemboursement() {
    const prestation = this.data.prestation || wx.getStorageSync('current_infirmier_prestation') || {};
    const id = prestation.id;
    if (!id) {
      wx.showToast({ title: 'Aucune demande active', icon: 'none' });
      return;
    }
    const authUser = wx.getStorageSync('auth_user') || {};
    const parentId = authUser.id || prestation.utilisateur_id || 521;

    wx.showLoading({ title: 'Annulation...' });
    api.cloturerDemandeInfirmier(id, parentId)
      .then((res) => {
        wx.hideLoading();
        wx.showToast({ title: 'Rendez-vous annulé', icon: 'success' });
        wx.removeStorageSync('current_infirmier_prestation');
        setTimeout(() => {
          wx.navigateBack({ delta: 2 });
        }, 1500);
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({ title: err.message || 'Erreur lors de l\'annulation', icon: 'none' });
      });
  },

  onConfirm() {
    wx.showToast({ title: "RDV confirmé", icon: "success" });
  },
  onCancel() {
    wx.showToast({ title: "RDV annulé", icon: "none" });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onNavTap: defaultBottomNavTap
});
