const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    date: '11/07/2024',
    heure: '10:00',
    lieu: '350 Boulevard Al massira, Casablanca',
    tarif: '150 MAD',
    tempsRestant: '2h00'
  },

  onLoad() {},

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onConfirm() {
    wx.navigateTo({ url: '/pages/medecin-paiement/medecin-paiement' });
  },

  onNavTap: defaultBottomNavTap,

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
