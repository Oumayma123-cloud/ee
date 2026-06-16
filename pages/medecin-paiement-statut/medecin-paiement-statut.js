const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

function makePaymentCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}

Page({
  data: {
    showAgencyModal: false,
    paymentCode: 'XXXX'
  },

  onLoad(options) {
    if (options.showModal === 'true') {
      this.setData({ 
        showAgencyModal: true,
        paymentCode: makePaymentCode()
      });
    }
  },

  onBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.reLaunch({ url: '/pages/sante/sante' });
    }
  },

  onModifierRdv() {
    wx.reLaunch({
      url: '/pages/medecin_calendar/medecin_calendar'
    });
  },

  onAnnulerRemboursement() {
    wx.navigateTo({
      url: '/pages/medecin-rdv-annule/medecin-rdv-annule'
    });
  },

  onCloseAgencyModal() {
    this.setData({ showAgencyModal: false });
  },

  noop() {},

  onNavTap: defaultBottomNavTap,

  onHeroCta() {
    wx.showToast({ title: 'Accéder bientôt', icon: 'none' });
  }
});
