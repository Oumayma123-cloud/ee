const METHOD_CONFIG = {
  tashilat: {
    label: 'Tashilate',
    iconSrc: '/assets/tashilat-pill-icon.png',
    details: [
      { label: 'Numéro de carte', value: '0598 550 993 34' },
      { label: "Date d'expiration", value: '21/06/2030' },
      { label: 'CVC', value: '435' },
      { label: 'Adresse facturation', value: 'Espèces' }
    ]
  },
  carte: {
    label: 'Carte bancaire',
    iconSrc: '/assets/payment-tiers.png',
    details: [
      { label: 'Numéro de carte', value: '4532 **** **** 9012' },
      { label: "Date d'expiration", value: '12/28' },
      { label: 'CVC', value: '***' },
      { label: 'Adresse facturation', value: 'Casablanca, Maroc' }
    ]
  },
  tiers: {
    label: 'Paiement par tierce',
    iconSrc: '/assets/payment-carte-bancaire.png',
    details: [
      { label: 'Bénéficiaire', value: 'Assurance / tiers payant' },
      { label: 'Référence', value: 'TP-2025-88421' },
      { label: 'Statut', value: 'À valider' },
      { label: 'Note', value: 'Pièce jointe sur demande' }
    ]
  },
  chaaib: {
    label: 'Chaabi Cash',
    iconSrc: '/assets/payment-chaabi-cash.png',
    details: [
      { label: 'Compte', value: '06 ** ** ** 44' },
      { label: 'Référence', value: 'CHB-992103' },
      { label: 'Montant', value: 'Selon devis' },
      { label: 'Adresse facturation', value: 'Espace client Chaabi' }
    ]
  }
};

function makePaymentCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}

/** Ordre des modes pour les flèches ← → sur la carte */
const METHOD_ORDER = ['tashilat', 'carte', 'tiers', 'chaaib'];
const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    methodKey: 'tashilat',
    label: 'Tashilate',
    iconSrc: '/assets/tashilat-pill-icon.png',
    details: [],
    cguAccepted: false,
    showAgencyModal: false,
    paymentCode: ''
  },

  applyMethodKey(key) {
    if (!METHOD_CONFIG[key]) return;
    const cfg = METHOD_CONFIG[key];
    this.setData({
      methodKey: key,
      label: cfg.label,
      iconSrc: cfg.iconSrc,
      details: cfg.details
    });
  },

  onLoad(options) {
    const key = options.key && METHOD_CONFIG[options.key] ? options.key : 'tashilat';
    this.applyMethodKey(key);
  },

  onCardNavPrev() {
    let i = METHOD_ORDER.indexOf(this.data.methodKey);
    if (i < 0) i = 0;
    const prev = METHOD_ORDER[(i - 1 + METHOD_ORDER.length) % METHOD_ORDER.length];
    this.applyMethodKey(prev);
  },

  onCardNavNext() {
    let i = METHOD_ORDER.indexOf(this.data.methodKey);
    if (i < 0) i = 0;
    const next = METHOD_ORDER[(i + 1) % METHOD_ORDER.length];
    this.applyMethodKey(next);
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onToggleCgu() {
    this.setData({ cguAccepted: !this.data.cguAccepted });
  },

  onConfirm() {
    if (!this.data.cguAccepted) {
      wx.showToast({ title: 'Veuillez accepter les CGU', icon: 'none' });
      return;
    }
    // Afficher la boîte d'alerte (modal) pour tous les modes comme demandé
    this.setData({
      paymentCode: makePaymentCode(),
      showAgencyModal: true
    });
  },

  onCloseAgencyModal() {
    this.setData({ showAgencyModal: false });
    wx.redirectTo({
      url: '/pages/medecin-paiement-statut/medecin-paiement-statut'
    });
  },

  noop() {},

  onNavTap: defaultBottomNavTap,

  onHeroCta() {
    wx.showToast({ title: 'Accéder bientôt', icon: 'none' });
  }
});
