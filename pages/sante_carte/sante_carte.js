const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    payMethods: [
      { title: "TASHILAT", image: "/assets/tac.png" },
      { title: "CARTE BANCAIRE", image: "/assets/Group 10.png" },
      { title: "PAIEMENT PAR TIERCE", image: "/assets/Group 9.png" },
      { title: "CHAABI CASH", image: "/assets/chaabi cash.png" }
    ]
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