import { ajouterFamille } from '../../utils/api';

Page({
  data: {
    nom: '',
    prenom: '',
    phone: '',
    cin: '',
    loading: false,
    showSuccessModal: false
  },

  onLoad: function (options) {},

  onBack: function () {
    wx.navigateBack();
  },

  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  onAjouter: function () {
    const { nom, prenom, phone, cin } = this.data;
    if (!nom || !prenom || !phone) {
      wx.showToast({ title: 'Veuillez remplir nom, prenom et telephone', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    ajouterFamille({ nom, prenom, phone, cin })
    .then((res) => {
      this.setData({ loading: false });
      if (res.status === 'success') {
        this.setData({ showSuccessModal: true });
      } else {
        wx.showToast({ title: 'Erreur lors de l\'ajout', icon: 'none' });
      }
    })
    .catch((err) => {
      this.setData({ loading: false });
      wx.showToast({ title: 'Erreur réseau', icon: 'none' });
    });
  },

  closeModal: function () {
    this.setData({ showSuccessModal: false });
    wx.navigateBack(); 
  }
});
