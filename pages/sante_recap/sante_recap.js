const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

function formatPrestationDate(dateStr, slotStr) {
  try {
    const dateParts = dateStr.split('/');
    const day = String(dateParts[0]).padStart(2, '0');
    const month = String(dateParts[1]).padStart(2, '0');
    const year = dateParts[2];
    
    let timeStr = '12:00:00';
    if (slotStr) {
      const timePart = slotStr.split('-')[0].trim();
      if (timePart.includes(':')) {
        timeStr = timePart + ':00';
      }
    }
    return `${year}-${month}-${day} ${timeStr}`;
  } catch (e) {
    return '2026-03-02 16:30:00';
  }
}

Page({
  data: {
    title: "Recapitulatif",
    bookingDate: '14/09/2025',
    bookingSlot: '10:00 - 12:00',
    bookingAddress: '350 Boulevard Al massira, Casablanca',
    bookingAmount: '150 Dhs',
    bookingPaymentMethod: 'Espèces',
    showModal: false,
    modalText: 'Votre demande a été enregistrée avec succès.'
  },

  onLoad() {
    const booking = wx.getStorageSync('infirmier_booking') || {};
    this.setData({
      bookingDate: booking.date || '14/09/2025',
      bookingSlot: booking.slot || '10:00 - 12:00',
      bookingAddress: booking.address || '350 Boulevard Al massira, Casablanca',
      bookingAmount: booking.amount || '150 Dhs',
      bookingPaymentMethod: booking.paymentMethod || 'Espèces'
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onConfirm() {
    const authUser = wx.getStorageSync('auth_user') || {};
    const userProfile = wx.getStorageSync('userProfile') || {};

    const date_prestation = formatPrestationDate(this.data.bookingDate, this.data.bookingSlot);
    const ville_beneficiaire = userProfile.ville || authUser.ville || 'Casablanca';
    const adresse_beneficiaire = this.data.bookingAddress;
    const numero_telephone_beneficiaire = authUser.telephone || userProfile.phone || '0666666666';
    const parent_id = authUser.id || 521;

    const payload = {
      date_prestation,
      latitude_lieu_beneficiaire: 0,
      longitude_lieu_beneficiaire: 0,
      ville_beneficiaire,
      adresse_beneficiaire,
      numero_telephone_beneficiaire,
      parent_id: String(parent_id)
    };

    const modifyId = wx.getStorageSync('modify_prestation_id');

    console.log('[Infirmier] Sending demand payload:', payload);
    wx.showLoading({ title: 'Enregistrement...' });

    const apiCall = modifyId 
      ? api.modifierDemandeInfirmier(modifyId, payload)
      : api.creerDemandeInfirmier(payload);

    apiCall
      .then((res) => {
        wx.hideLoading();
        console.log('[Infirmier] Demand resolved successfully:', res);
        const prestation = res.data || {};
        wx.setStorageSync('current_infirmier_prestation', prestation);
        wx.removeStorageSync('infirmier_booking');
        wx.removeStorageSync('modify_prestation_id');

        let text = 'Votre demande de rendez-vous a bien été enregistrée. Statut : En attente.';
        const methodUpper = String(this.data.bookingPaymentMethod).toUpperCase();
        if (methodUpper.includes('TASHILAT') || methodUpper.includes('TASSHILAT')) {
          text = `Rendez-vous dans l'agence Tashilat la plus proche avec votre code de paiement pour finaliser la réservation. Veuillez vous y présenter muni(e) de ce code : ${prestation.id || '800'}`;
        }

        this.setData({
          modalText: text,
          showModal: true
        });
      })
      .catch((err) => {
        wx.hideLoading();
        console.error('[Infirmier] Failed to resolve demand:', err);
        wx.showToast({
          title: err.message || 'Erreur lors de la réservation',
          icon: 'none'
        });
      });
  },

  onCancel() {
    wx.showToast({
      title: 'Demande annulée',
      icon: 'none'
    });
    setTimeout(() => {
      wx.navigateBack({ delta: 2 });
    }, 1000);
  },

  closeModal() {
    this.setData({ showModal: false });
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
