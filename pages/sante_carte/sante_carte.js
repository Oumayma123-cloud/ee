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
    wx.createSelectorQuery().in(this).select('.grid-scroll-view').boundingClientRect(rect => {
      if (rect) {
        this.setData({ scrollViewHeight: rect.height });
      }
    }).exec();
  },

  onGridScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const scrollHeight = e.detail.scrollHeight;
    const clientHeight = this.data.scrollViewHeight || 290;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) return;

    const ratio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    // Track height is 272rpx, thumb height is 100rpx.
    // Max travel = 272 - 100 = 172rpx.
    const handleTop = ratio * 172;
    this.setData({
      handleTop: handleTop,
      scrollTopVal: scrollTop
    });
  },

  onScrollUp() {
    const current = this.data.scrollTopVal || 0;
    const next = Math.max(current - 60, 0);
    this.setData({
      scrollTopVal: next,
      scrollTop: next
    });
  },

  onScrollDown() {
    const current = this.data.scrollTopVal || 0;
    const next = current + 60;
    this.setData({
      scrollTopVal: next,
      scrollTop: next
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