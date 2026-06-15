const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

Page({
  data: {
    messageCount: 6,
    statusBarHeight: 20
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 20
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onDemandeTap() {
    const authUser = wx.getStorageSync('auth_user') || {};
    const userProfile = wx.getStorageSync('userProfile') || {};

    const telephone = authUser.telephone || userProfile.phone || '0666666666';
    const ville = userProfile.ville || authUser.ville || 'Casablanca';
    const adresse = userProfile.adresse || authUser.adresse || 'Casablanca';
    const parent_id = authUser.id || 521;

    const payload = {
      latitude_lieu_beneficiaire: 0,
      longitude_lieu_beneficiaire: 0,
      ville_beneficiaire: ville,
      adresse_beneficiaire: adresse,
      numero_telephone_beneficiaire: telephone,
      canal: 'mobile',
      parent_id: String(parent_id)
    };

    console.log('[Medecin de Garde] Sending demand payload:', payload);
    wx.showLoading({ title: 'Demande en cours...' });

    api.creerDemandeMedecinGarde(payload)
    .then((res) => {
      wx.hideLoading();
      console.log('[Medecin de Garde] Demand created successfully, response:', res);
      const prestation = res.data || {};
      wx.setStorageSync('current_medecin_garde_prestation', prestation);
      wx.navigateTo({
        url: '/pages/medecin-garde-attente/medecin-garde-attente'
      });
    })
    .catch((err) => {
      wx.hideLoading();
      console.error('[Medecin de Garde] Failed to create demand:', err);
      wx.showToast({
        title: err.message || 'Erreur lors de la demande',
        icon: 'none'
      });
    });
  },

  onNavTap: defaultBottomNavTap
});
