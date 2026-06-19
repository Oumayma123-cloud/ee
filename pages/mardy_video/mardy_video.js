const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    avatarImage: '/assets/profile2.png',
    avatarName: "L'MARDY",
    showModal: true,
    showAlert: false,
    alertMessage: "",
    alertConfirmBtn: "Oui",
    alertCancelBtn: "Non"
  },

  onLoad() {
    const saved = wx.getStorageSync('selectedAvatar');
    if (saved === 'elmardya') {
      this.setData({
        avatarImage: '/assets/photo-re.png',
        avatarName: "L'MARDYA"
      });
    } else {
      this.setData({
        avatarImage: '/assets/profile2.png',
        avatarName: "L'MARDY"
      });
    }
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap(e) {
    const index = e.detail.index;
    if (index === 4) { // Ambulance Icon
      this.setData({
        showAlert: true,
        alertMessage: "Êtes-vous sûr de vouloir déclencher l'appel d'urgence ?",
        alertConfirmBtn: "Confirmer",
        alertCancelBtn: "Annuler"
      });
    } else {
      defaultBottomNavTap.call(this, e);
    }
  },

  onProfileTap() {
    wx.navigateTo({ url: '../profile/profile' });
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  toggleModal() {
    this.setData({ showModal: !this.data.showModal });
  },

  onMicClick() {
    this.setData({
      showAlert: true,
      alertMessage: "Souhaitez-vous être mis en relation avec un médecin de garde ?",
      alertConfirmBtn: "Oui",
      alertCancelBtn: "Non"
    });
  },

  onCrossClick() {
    this.setData({
      showAlert: true,
      alertMessage: "Souhaitez-vous vraiment annuler ce rendez-vous ?",
      alertConfirmBtn: "Oui",
      alertCancelBtn: "Non"
    });
  },

  onUrgenceClick() {
    this.setData({
      showAlert: true,
      alertMessage: "Êtes-vous sûr de vouloir déclencher l'appel d'urgence ?",
      alertConfirmBtn: "Confirmer",
      alertCancelBtn: "Annuler"
    });
  },

  closeAlert() {
    this.setData({ showAlert: false });
  },

  onConfirmAlert() {
    this.setData({ showAlert: false });
    wx.showToast({ title: 'Action confirmée', icon: 'success' });
  }
});
