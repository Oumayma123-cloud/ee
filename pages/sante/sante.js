const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    scrollHandleTop: 0, // top en px relatif à `.scroll-track`
    trackHeight: 0,
    handleHeight: 0,
    maxScrollTop: 1,
    dragOffsetY: 0
  },

  onLoad: function() {
    console.log("Dashboard Sante chargé");
  },

  onBack() {
    wx.navigateBack();
  },

  onReady() {
    this.initScrollMetrics();
  },

  onPageScroll(e) {
    // Synchronise la position de la poignée avec le défilement de la page
    this.updateHandleFromScroll(e.scrollTop);
  },

  onResize() {
    this.initScrollMetrics();
  },

  // Exemple de fonction pour naviguer
  goToService: function(e) {
    const service = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/service-detail/index?type=${service}`
    });
  },

  // Flèche droite du bandeau "santé" -> page calendrier
  goToSanteCalendar() {
    wx.navigateTo({
      url: '/pages/sante_calendar/sante_calendar'
    });
  },

  // Navigation vers Médecin à domicile
  goToMedecinHoraire() {
    wx.navigateTo({
      url: '/pages/medecin_calendar/medecin_calendar'
    });
  },

  // Navigation vers Médecin de garde
  goToMedecinGarde() {
    wx.navigateTo({
      url: '/pages/medecin-garde/medecin-garde'
    });
  },

  // Navigation vers Urgence
  goToUrgence() {
    wx.navigateTo({
      url: '/pages/essentiels/essentiels'
    });
  },

  // Navigation vers Suivi Médicaments
  goToSuiviMedicaments() {
    wx.navigateTo({
      url: '/pages/suivi_medicaments/suivi_medicaments'
    });
  },

  initScrollMetrics() {
    const query = wx.createSelectorQuery();
    query.select('.scroll-track').boundingClientRect();
    query.select('.scroll-handle').boundingClientRect();
    query.select('.container').boundingClientRect();
    query.exec((res) => {
      const trackRect = res && res[0];
      const handleRect = res && res[1];
      const containerRect = res && res[2];
      if (!trackRect || !containerRect) return;

      wx.getSystemInfo({
        success: ({ windowHeight }) => {
          const handleHeight = (handleRect && handleRect.height) || 0;
          const maxScrollTop = Math.max(containerRect.height - windowHeight, 1);
          const maxHandleTop = Math.max(trackRect.height - handleHeight, 0);

          this.setData({
            trackHeight: trackRect.height,
            trackTop: trackRect.top,
            handleHeight,
            maxScrollTop,
            scrollHandleTop: Math.min(this.data.scrollHandleTop, maxHandleTop)
          });
        }
      });
    });
  },

  updateHandleFromScroll(scrollTop) {
    const { maxScrollTop, trackHeight, handleHeight } = this.data;
    if (!trackHeight || !handleHeight) return;
    const maxHandleTop = Math.max(trackHeight - handleHeight, 0);
    const ratio = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
    this.setData({ scrollHandleTop: ratio * maxHandleTop });
  },

  // Clic sur la piste ou la poignée
  onTrackTap(e) {
    // e.detail.y marche souvent sur bindtap; fallback sur touches pour bindtouch*
    const touchY =
      (e && e.detail && typeof e.detail.y === 'number' && e.detail.y) ||
      (e && e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY) ||
      (e && e.touches && e.touches[0] && e.touches[0].clientY);
    if (typeof touchY !== 'number') return;

    this.scrollByTouchY(touchY, true);
  },

  onHandleTouchStart(e) {
    const touchY = e.touches && e.touches[0] && e.touches[0].clientY;
    if (typeof touchY !== 'number') return;

    const { trackTop, scrollHandleTop } = this.data;
    // dragOffsetY = distance entre le point de contact et le haut de la poignée
    this.setData({
      dragOffsetY: touchY - (this.data.trackTop || 0) - scrollHandleTop
    });
  },

  onHandleTouchMove(e) {
    const touchY = e.touches && e.touches[0] && e.touches[0].clientY;
    if (typeof touchY !== 'number') return;
    this.scrollByTouchY(touchY, false);
  },

  scrollByTouchY(touchY, withAnimation) {
    const { trackHeight, handleHeight, dragOffsetY, maxScrollTop, trackTop } = this.data;
    if (!trackHeight || !handleHeight) return;

    const maxHandleTop = Math.max(trackHeight - handleHeight, 1);
    const baseY = touchY - (trackTop || 0) - (withAnimation ? handleHeight / 2 : dragOffsetY);
    const clampedTop = Math.max(0, Math.min(baseY, maxHandleTop));
    const ratio = clampedTop / maxHandleTop;
    const targetScrollTop = ratio * maxScrollTop;

    this.setData({ scrollHandleTop: clampedTop });
    wx.pageScrollTo({
      scrollTop: targetScrollTop,
      duration: withAnimation ? 180 : 0
    });
  },

  scrollUp() {
    wx.pageScrollTo({ scrollTop: 0, duration: 180 });
  },

  scrollDown() {
    const { maxScrollTop } = this.data;
    wx.pageScrollTo({ scrollTop: maxScrollTop, duration: 180 });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  showUnavailable() {
    wx.showToast({ title: 'Bientôt disponible', icon: 'none' });
  },

  onNavTap: defaultBottomNavTap
})