const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    payMethods: [
      { title: "TASHILAT", image: "/assets/tac.png" },
      { title: "CARTE BANCAIRE", image: "/assets/Group 10.png" },
      { title: "PAIEMENT PAR TIERCE", image: "/assets/Group 9.png" },
      { title: "CHAABI CASH", image: "/assets/chaabi cash.png" }
    ],
    handleTop: 0,
    scrollTop: 0,
    scrollTopVal: 0,
    scrollViewHeight: 0
  },

  onReady() {
    this.initScrollMetrics();
  },

  initScrollMetrics() {
    const query = wx.createSelectorQuery().in(this);
    
    query.select('.grid-scroll-view').boundingClientRect();
    query.select('.cards-grid').boundingClientRect();
    query.select('.scroll-track').boundingClientRect();
    query.select('.scroll-handle').boundingClientRect();
    
    query.exec((res) => {
      const scrollRect = res[0];
      const gridRect = res[1];
      const trackRect = res[2];
      const handleRect = res[3];
      
      let updates = {};
      if (scrollRect) updates.scrollViewHeight = scrollRect.height;
      if (scrollRect && gridRect) updates.maxScroll = Math.max(0, gridRect.height - scrollRect.height);
      if (trackRect) {
        updates.trackHeightPx = trackRect.height;
        updates.trackTopPx = trackRect.top;
      }
      if (handleRect) updates.handleHeightPx = handleRect.height;
      
      this.setData(updates);
    });
  },

  onGridScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const scrollHeight = e.detail.scrollHeight;
    const clientHeight = this.data.scrollViewHeight || e.detail.clientHeight || 300;
    const maxScroll = scrollHeight - clientHeight;
    
    if (maxScroll <= 0) return;

    const ratio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    
    const trackH = this.data.trackHeightPx || 160;
    const handleH = this.data.handleHeightPx || 60; 
    const maxTravel = Math.max(0, trackH - handleH);
    
    const handleTopPx = ratio * maxTravel;
    
    this.setData({
      handleTopPx: handleTopPx,
      scrollTopVal: scrollTop,
      maxScroll: maxScroll
    });
  },

  onScrollUp() {
    const current = this.data.scrollTopVal || 0;
    const next = Math.max(current - 150, 0);
    this.setData({
      scrollTopVal: next,
      scrollTop: next
    });
  },

  onScrollDown() {
    const current = this.data.scrollTopVal || 0;
    const maxScroll = this.data.maxScroll || 300;
    const next = Math.min(current + 150, maxScroll);
    this.setData({
      scrollTopVal: next,
      scrollTop: next
    });
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
    const scrollHandleTop = this.data.handleTopPx || 0;
    this.setData({
      dragOffsetY: touchY - (this.data.trackTopPx || 0) - scrollHandleTop
    });
  },

  onHandleTouchMove(e) {
    const touchY = e.touches && e.touches[0] && e.touches[0].clientY;
    if (typeof touchY !== 'number') return;
    this.scrollByTouchY(touchY, false);
  },

  scrollByTouchY(touchY, isTap) {
    const trackHeight = this.data.trackHeightPx || 160;
    const trackTop = this.data.trackTopPx || 0;
    const handleHeight = this.data.handleHeightPx || 60;
    const maxScrollTop = this.data.maxScroll || 300;
    const dragOffsetY = this.data.dragOffsetY || (handleHeight / 2);

    const maxHandleTop = Math.max(trackHeight - handleHeight, 1);
    const baseY = touchY - trackTop - (isTap ? handleHeight / 2 : dragOffsetY);
    const clampedTop = Math.max(0, Math.min(baseY, maxHandleTop));
    const ratio = clampedTop / maxHandleTop;
    const targetScrollTop = ratio * maxScrollTop;

    this.setData({
      handleTopPx: clampedTop,
      scrollTop: targetScrollTop,
      scrollTopVal: targetScrollTop
    });
  },

  onBack() {
    wx.navigateBack();
  },
  onNext() {
    wx.navigateTo({ url: '/pages/sante_paiement_detail/sante_paiement_detail' });
  },
  onPrev() {
    wx.navigateTo({ url: '/pages/sante_paymethod/sante_paymethod' });
  },

  onConfirm(e) {
    const title = e?.currentTarget?.dataset?.title || "Paiement";
    const booking = wx.getStorageSync('infirmier_booking') || {};
    booking.paymentMethod = title;
    wx.setStorageSync('infirmier_booking', booking);

    wx.navigateTo({
      url: `/pages/sante_paiement_detail/sante_paiement_detail?method=${title}`
    });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onNavTap: defaultBottomNavTap
});