const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    messageCount: 6,
    medications: [
      {
        id: 1,
        name: 'DOLIPRANE',
        checked: true,
        frequency: '2 fois/jour',
        nextDose: '8h00'
      },
      {
        id: 2,
        name: 'DIFAL',
        checked: true,
        frequency: '3 fois/jour',
        nextDose: '9h00'
      }
    ],
    // Scrollbar synchronisation
    scrollHandleTop: 0, // top en px relatif à `.scroll-track`
    trackHeight: 0,
    handleHeight: 0,
    maxScrollTop: 1,
    dragOffsetY: 0
  },

  onLoad: function (options) {
    let meds = wx.getStorageSync('medications');
    if (!meds) {
      meds = [
        {
          id: 1,
          name: 'DOLIPRANE',
          checked: true,
          frequency: '2 fois/jour',
          nextDose: '8h00'
        },
        {
          id: 2,
          name: 'DIFAL',
          checked: true,
          frequency: '3 fois/jour',
          nextDose: '9h00'
        }
      ];
      wx.setStorageSync('medications', meds);
    }
    this.setData({ medications: meds });
  },

  onShow: function () {
    const meds = wx.getStorageSync('medications');
    if (meds) {
      this.setData({ medications: meds });
      // Re-initialize scroll metrics since the list height might have changed
      setTimeout(() => {
        this.initScrollMetrics();
      }, 300);
    }
  },

  onReady() {
    this.initScrollMetrics();
  },

  onPageScroll(e) {
    this.updateHandleFromScroll(e.scrollTop);
  },

  onResize() {
    this.initScrollMetrics();
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
    const medications = this.data.medications.map(med => {
      if (med.id === id) {
        return { ...med, checked: !med.checked };
      }
      return med;
    });
    this.setData({ medications });
    wx.setStorageSync('medications', medications);
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
    wx.showToast({ title: 'Mes rappels du jour', icon: 'none' });
  },

  onModify: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: 'Modifier Doliprane/Difal', icon: 'none' });
  },

  onPause: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: 'Médicament mis en pause', icon: 'none' });
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
          const medications = this.data.medications.filter(med => med.id !== id);
          this.setData({ medications });
          wx.setStorageSync('medications', medications);
          wx.showToast({
            title: 'Supprimé',
            icon: 'success'
          });
          setTimeout(() => {
            this.initScrollMetrics();
          }, 300);
        }
      }
    });
  }
});
