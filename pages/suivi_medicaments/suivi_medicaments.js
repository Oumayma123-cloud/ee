const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

Page({
  data: {
    messageCount: 6,
    medications: [],
    // Scrollbar synchronisation
    scrollHandleTop: 0, // top en px relatif à `.scroll-track`
    trackHeight: 0,
    handleHeight: 0,
    maxScrollTop: 1,
    dragOffsetY: 0
  },

  onLoad: function (options) {
    this.loadMedications();
  },

  onShow: function () {
    this.loadMedications();
  },

  loadMedications: function() {
    const authUser = wx.getStorageSync('auth_user') || {};
    const parentId = authUser.id || 521;
    
    api.getMedicamentsSuivi(parentId)
      .then((res) => {
        const meds = res.data || [];
        this.setData({ medications: meds });
        setTimeout(() => {
          this.initScrollMetrics();
        }, 300);
      })
      .catch((err) => {
        console.error('Failed to load medications:', err);
      });
  },

  onBack: function () {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.redirectTo({
        url: '/pages/sante/sante'
      });
    }
  },

  onProfileTap: function () {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  onToggleSwitch: function (e) {
    const id = e.currentTarget.dataset.id;
    const med = this.data.medications.find(m => m.id === id);
    if (!med) return;

    const nextChecked = !med.checked;
    
    api.modifierMedicamentSuivi(id, { checked: nextChecked })
      .then((res) => {
        const medications = this.data.medications.map(m => {
          if (m.id === id) {
            return { ...m, checked: nextChecked };
          }
          return m;
        });
        this.setData({ medications });
      })
      .catch((err) => {
        wx.showToast({ title: 'Erreur mise à jour', icon: 'none' });
      });
  },

  // Scrollbar Methods
  initScrollMetrics() {
    const query = wx.createSelectorQuery();
    query.select('.scroll-track').boundingClientRect();
    query.select('.scroll-handle').boundingClientRect();
    query.select('.suivi-container').boundingClientRect(); // Scoped to suivi-container!
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

  onTrackTap(e) {
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

  onNavTap: defaultBottomNavTap,

  onAddMedicament: function() {
    wx.navigateTo({
      url: '/pages/ajouter_medicament/ajouter_medicament'
    });
  },

  onRappels: function() {
    const authUser = wx.getStorageSync('auth_user') || {};
    const parentId = authUser.id || 521;

    wx.showLoading({ title: 'Chargement...' });
    api.getMedicamentsSuivi(parentId)
      .then((res) => {
        wx.hideLoading();
        const activeMeds = (res.data || []).filter(m => m.checked);
        const names = activeMeds.map(m => m.name).join(', ');
        wx.showModal({
          title: 'Rappels du jour',
          content: activeMeds.length > 0 ? `Médicaments à prendre aujourd'hui : ${names}` : 'Aucun rappel aujourd\'hui.',
          showCancel: false,
          confirmText: 'OK',
          confirmColor: '#3c7d58'
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({ title: 'Erreur', icon: 'none' });
      });
  },

  onModify: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: 'Modification non supportée', icon: 'none' });
  },

  onPause: function(e) {
    const id = e.currentTarget.dataset.id;
    const med = this.data.medications.find(m => m.id === id);
    if (!med) return;

    const nextChecked = !med.checked;
    api.modifierMedicamentSuivi(id, { checked: nextChecked })
      .then((res) => {
        const medications = this.data.medications.map(m => {
          if (m.id === id) {
            return { ...m, checked: nextChecked };
          }
          return m;
        });
        this.setData({ medications });
        wx.showToast({ title: nextChecked ? 'Médicament activé' : 'Médicament mis en pause', icon: 'success' });
      })
      .catch((err) => {
        wx.showToast({ title: 'Erreur', icon: 'none' });
      });
  },

  onDelete: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: 'Supprimer',
      content: 'Voulez-vous vraiment supprimer ce médicament ?',
      cancelText: 'Annuler',
      confirmText: 'Supprimer',
      confirmColor: '#d9534f',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: 'Suppression...' });
          api.supprimerMedicamentSuivi(id)
            .then(() => {
              wx.hideLoading();
              const medications = this.data.medications.filter(med => med.id !== id);
              this.setData({ medications });
              wx.showToast({
                title: 'Supprimé',
                icon: 'success'
              });
              setTimeout(() => {
                this.initScrollMetrics();
              }, 300);
            })
            .catch((err) => {
              wx.hideLoading();
              wx.showToast({ title: 'Erreur suppression', icon: 'none' });
            });
        }
      }
    });
  }
});
