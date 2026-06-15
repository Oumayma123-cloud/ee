const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    dateLine: 'Mardi 13 avril à 12h',
    adresse: '60, Avenue Hassan 2, Res Yasmine',
    montant: '150 Dhs',
    modePaiement: 'Espèces'
  },

  onLoad(options) {
    if (options.date) this.setData({ dateLine: decodeURIComponent(options.date) });
    if (options.adresse) this.setData({ adresse: decodeURIComponent(options.adresse) });
    if (options.montant) this.setData({ montant: decodeURIComponent(options.montant) });
    if (options.paiement) this.setData({ modePaiement: decodeURIComponent(options.paiement) });
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  /** Maquette : bouton vert — enchaîne vers un nouveau parcours RDV */
  onConfirmRdv() {
    wx.reLaunch({
      url: '/pages/medecin-domicile/medecin-domicile'
    });
  },

  /** Quitter vers l'accueil */
  onCancelExit() {
    wx.reLaunch({
      url: '/pages/home/home'
    });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onNavTap: defaultBottomNavTap
});
