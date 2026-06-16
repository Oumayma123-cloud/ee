const api = require('../../utils/api.js');

Page({
  data: {
    statusBarHeight: 20,
    messageCount: 6
  },

  onLoad: function() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
  },

  onBackTap: function() {
    wx.navigateBack();
  },

  onFinalCancel: function() {
    const authUser = wx.getStorageSync('auth_user') || {};
    const parentId = authUser.id || 521;
    const currentPrestation = wx.getStorageSync('mock_ambulance_prestation') || {};
    const id = currentPrestation.id || 489;

    wx.showLoading({ title: 'Annulation...' });
    api.cloturerDemandeAmbulance(id, parentId)
      .then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: 'Action annulée',
          icon: 'none'
        });
        setTimeout(() => {
          wx.reLaunch({ url: '/pages/sante/sante' });
        }, 1500);
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: 'Erreur lors de l\'annulation',
          icon: 'none'
        });
      });
  },

  onNavTap: function(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '/pages/sante/sante' });
    } else if (action === 'emergency') {
      wx.redirectTo({ url: '../urgence/urgence' });
    }
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
