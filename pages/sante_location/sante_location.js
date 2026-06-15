const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    date: '',
    slot: '',
    address: '350 B....',
    latitude: 33.5731,
    longitude: -7.5898,
    markers: [
      {
        id: 1,
        latitude: 33.5731,
        longitude: -7.5898
      }
    ]
  },

  onLoad(options) {
    if (options.date) this.setData({ date: decodeURIComponent(options.date) });
    if (options.slot) this.setData({ slot: decodeURIComponent(options.slot) });
  },

  onAddressInput(e) {
    this.setData({ address: e.detail.value });
  },

  onLocate() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        this.setData({
          latitude,
          longitude,
          markers: [{ id: 1, latitude, longitude }]
        });
        wx.showToast({ title: 'Localisation activée', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: 'Localisation refusée', icon: 'none' });
      }
    });
  },

  onFinalConfirm() {
    const booking = wx.getStorageSync('infirmier_booking') || {};
    booking.address = this.data.address;
    booking.latitude = this.data.latitude;
    booking.longitude = this.data.longitude;
    wx.setStorageSync('infirmier_booking', booking);

    const query = `date=${encodeURIComponent(this.data.date)}&slot=${encodeURIComponent(this.data.slot)}&address=${encodeURIComponent(this.data.address)}`;
    wx.navigateTo({ url: `/pages/sante_paymethod/sante_paymethod?${query}` });
  },

  onBack() {
    wx.navigateBack();
  },
  onNext() {
    this.onFinalConfirm();
  },
  onPrev() {
    wx.navigateTo({ url: '/pages/sante_horaire/sante_horaire' });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onNavTap: defaultBottomNavTap
});