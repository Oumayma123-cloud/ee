const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

Page({
  data: {
    messageCount: 0,
    statusBarHeight: 20,
    showUrgenceModal: false,
    showDoctorVisitModal: false,
    showActionModal: false,
    countdown: 30, // Modifié à 30 secondes (0.5 min) pour les tests
    countdownText: '10:00',
    scrollMaxTop: 0,
    scrollThumbTop: 0,
    scrollStep: 260,
    scrollToId: 'video-1',
    scrollIndex: 1,
    totalScrollItems: 4
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 20
    });

    // Si on vient de la page Appel Entrant → afficher le modal automatiquement
    if (options && options.showModal === 'true') {
      this.setData({ showUrgenceModal: true });
      return; // Pas de timer si on revient avec le modal
    }

    // Démarrer le compte à rebours de 10 minutes
    this.startCountdown();
  },

  // Timer : compte à rebours avant l'appel entrant
  startCountdown() {
    this.timer = setInterval(() => {
      let remaining = this.data.countdown - 1;

      if (remaining <= 0) {
        clearInterval(this.timer);
        // 10 minutes écoulées → page Appel Entrant
        wx.navigateTo({
          url: '/pages/medecin-garde-appel/medecin-garde-appel'
        });
        return;
      }

      const min = Math.floor(remaining / 60);
      const sec = remaining % 60;
      const txt = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);

      this.setData({
        countdown: remaining,
        countdownText: txt
      });
    }, 1000);
  },

  onUnload() {
    // Nettoyer le timer quand on quitte la page
    if (this.timer) clearInterval(this.timer);
  },

  onBack() {
    if (this.timer) clearInterval(this.timer);
    wx.navigateBack({ delta: 1 });
  },

  onVideoTap(e) {
    const id = e.currentTarget.dataset.id;
    console.log('Vidéo sélectionnée:', id);
  },

  // Fermer le modal (clic sur overlay)
  onHideUrgence() {
    this.setData({ showUrgenceModal: false });
  },

  // Confirmer l'envoi de l'ambulance
  onConfirmAmbulance() {
    this.setData({
      showUrgenceModal: false,
      showDoctorVisitModal: true
    });
  },

  // Fermer le modal de visite médecin au clic sur l'overlay
  onHideDoctorVisit() {
    this.setData({ showDoctorVisitModal: false });
  },

  // Confirmer la visite de médecin à domicile
  onConfirmDoctorVisit() {
    this.setData({
      showDoctorVisitModal: false,
      showActionModal: true
    });
  },

  // Fermer le modal d'action
  onCloseActionModal() {
    this.setData({ showActionModal: false });
  },

  // Lancer l'action de respiration
  onDoBreathingExercises() {
    this.setData({ showActionModal: false });
    wx.showToast({ title: 'Exercices lancés', icon: 'success' });
  },

  // Annuler la visite de médecin à domicile
  onCancelDoctorVisit() {
    this.setData({ showDoctorVisitModal: false });
    if (this.timer) clearInterval(this.timer);

    const currentPrestation = wx.getStorageSync('current_medecin_garde_prestation') || {};
    const authUser = wx.getStorageSync('auth_user') || {};
    const parentId = authUser.id || currentPrestation.utilisateur_id || 521;
    const id = currentPrestation.id || 798;

    console.log('[Medecin de Garde] Cancelling doctor visit, prestationId:', id, 'parentId:', parentId);
    wx.showLoading({ title: 'Annulation...' });
    api.cloturerMedecinGarde(id, parentId)
      .then((res) => {
        wx.hideLoading();
        console.log('[Medecin de Garde] Doctor visit cancelled successfully, response:', res);
        wx.removeStorageSync('current_medecin_garde_prestation');
        wx.showToast({ title: 'Demande annulée', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack({ delta: 1 });
        }, 500);
      })
      .catch((err) => {
        wx.hideLoading();
        console.error('[Medecin de Garde] Failed to cancel doctor visit:', err);
        wx.showToast({ title: err.message || 'Erreur lors de l\'annulation', icon: 'none' });
      });
  },

  // Annuler la demande
  onCancelDemande() {
    this.setData({ showUrgenceModal: false });
    if (this.timer) clearInterval(this.timer);

    const currentPrestation = wx.getStorageSync('current_medecin_garde_prestation') || {};
    const authUser = wx.getStorageSync('auth_user') || {};
    const parentId = authUser.id || currentPrestation.utilisateur_id || 521;
    const id = currentPrestation.id || 798;

    console.log('[Medecin de Garde] Cancelling demand, prestationId:', id, 'parentId:', parentId);
    wx.showLoading({ title: 'Annulation...' });
    api.cloturerMedecinGarde(id, parentId)
      .then((res) => {
        wx.hideLoading();
        console.log('[Medecin de Garde] Demand cancelled successfully, response:', res);
        wx.removeStorageSync('current_medecin_garde_prestation');
        wx.showToast({ title: 'Demande annulée', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack({ delta: 1 });
        }, 500);
      })
      .catch((err) => {
        wx.hideLoading();
        console.error('[Medecin de Garde] Failed to cancel demand:', err);
        wx.showToast({ title: err.message || 'Erreur lors de l\'annulation', icon: 'none' });
      });
  },

  onNavTap(e) {
    defaultBottomNavTap(e.detail.action);
  },

  onReady() {
    this.computeScrollDimensions();
    setTimeout(() => {
      this.computeScrollDimensions();
    }, 300);
  },

  computeScrollDimensions() {
    const query = wx.createSelectorQuery().in(this);
    query.select('.scroll-content').boundingClientRect();
    query.select('.scroll-inner').boundingClientRect();
    query.exec((res) => {
      if (!res || !res[0] || !res[1]) return;
      const viewportHeight = res[0].height;
      const contentHeight = res[1].height;
      const maxTop = Math.max(0, contentHeight - viewportHeight);
      this.setData({
        scrollMaxTop: maxTop
      });
      this.updateThumbTop(0);
    });
  },

  onScroll(e) {
    const top = e.detail.scrollTop || 0;
    this.updateThumbTop(top);
  },

  updateThumbTop(scrollTop = 0) {
    const trackHeight = 320;
    const thumbHeight = 90;
    const maxTop = this.data.scrollMaxTop || 1;
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    const ratio = maxTop > 0 ? scrollTop / maxTop : 0;
    const thumbTop = Math.min(maxThumbTop, Math.max(0, ratio * maxThumbTop));
    this.setData({ scrollThumbTop: thumbTop });
  },

  updateScroll(target) {
    const clamped = Math.max(0, Math.min(this.data.scrollMaxTop, target));
    this.setData({ scrollTop: clamped }, () => {
      this.updateThumbTop(clamped);
    });
  },

  onScrollUp() {
    const newIndex = Math.max(1, this.data.scrollIndex - 1);
    this.setScrollIndex(newIndex);
  },

  onScrollDown() {
    const newIndex = Math.min(this.data.totalScrollItems, this.data.scrollIndex + 1);
    this.setScrollIndex(newIndex);
  },

  setScrollIndex(index) {
    const bounded = Math.max(1, Math.min(this.data.totalScrollItems, index));
    const ratio = this.data.totalScrollItems > 1 ? (bounded - 1) / (this.data.totalScrollItems - 1) : 0;
    const trackHeight = 320;
    const thumbHeight = 90;
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    this.setData({
      scrollIndex: bounded,
      scrollToId: `video-${bounded}`,
      scrollThumbTop: Math.round(ratio * maxThumbTop)
    });
  }
});
