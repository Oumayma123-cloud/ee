const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    tx: '',
    amount: '',
    pack: '',
    dateStr: '',
    clientName: 'Souad Thiufa'
  },

  onLoad: function (options) {
    const authUser = wx.getStorageSync('auth_user') || {};
    const savedProfile = wx.getStorageSync('userProfile') || {};
    const nom = savedProfile.nom || authUser.nom || 'Souad';
    const prenom = savedProfile.prenom || authUser.prenom || 'Thiufa';
    
    // Format current date
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateStr = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    this.setData({
      tx: options.tx || 'SUB-' + Math.floor(Math.random() * 1000000),
      amount: options.amount ? options.amount + ' MAD' : '199 MAD',
      pack: options.pack ? decodeURIComponent(options.pack) : 'Pack Premium 1 Mois',
      dateStr,
      clientName: `${nom} ${prenom}`
    });
  },

  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  onReturnHome: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  onProfileTap: function () {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  onNavTap: defaultBottomNavTap
});
