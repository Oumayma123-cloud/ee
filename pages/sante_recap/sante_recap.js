const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    title: "Recapitulatif",
    showModal: false
  },

  onBack() {
    wx.navigateBack();
  },
  onConfirm() {
    this.setData({ showModal: true });
  },

  onCancel() {
    this.setData({ showModal: true });
  },

  closeModal() {
    this.setData({ showModal: false });
    // Naviguer vers la page de statut après avoir fermé l'alerte
    wx.navigateTo({
      url: '/pages/sante_rdv_status/sante_rdv_status'
    });
  },

  onGoPaymethod() {
    wx.navigateTo({
      url: "/pages/sante_carte/sante_carte"
    });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onNavTap: defaultBottomNavTap
});
