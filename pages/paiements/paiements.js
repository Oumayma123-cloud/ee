const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {},

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  async onPay(e) {
    const id = e.currentTarget.dataset.id;
    wx.showLoading({ title: 'Paiement en cours…' });
    try {
      const { creerPaiementUtilisateur } = require('../../utils/api.js');
      // Mock data for payment
      const res = await creerPaiementUtilisateur({
        utilisateur_id: 1,
        service_id: parseInt(id),
        montant: 200.00
      });
      wx.hideLoading();
      if (res && res.status === 'success') {
        wx.showToast({ title: 'Paiement réussi', icon: 'success' });
      } else {
        wx.showToast({ title: 'Erreur paiement', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: 'Erreur', icon: 'none' });
      console.error(err);
    }
  }
});
