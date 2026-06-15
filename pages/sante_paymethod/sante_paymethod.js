const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    date: '',
    slot: '',
    address: '',
    tarif: '150 MAD',
    remaining: '2h00'
  },

  onLoad(options) {
    const nextData = {};

    if (options.date) nextData.date = decodeURIComponent(options.date);
    if (options.slot) nextData.slot = decodeURIComponent(options.slot);
    if (options.address) nextData.address = decodeURIComponent(options.address);
    if (options.tarif) nextData.tarif = decodeURIComponent(options.tarif);
    if (options.remaining) nextData.remaining = decodeURIComponent(options.remaining);

    if (!nextData.date) nextData.date = '11/07/2024';
    if (!nextData.slot) nextData.slot = '10:00';
    if (!nextData.address) nextData.address = '350 Boulevard Al massira, Casablanca';

    this.setData(nextData);
  },

  onConfirm() {
    const { date, slot, address, tarif, remaining } = this.data;
    const query = `date=${encodeURIComponent(date)}&slot=${encodeURIComponent(slot)}&address=${encodeURIComponent(address)}&tarif=${encodeURIComponent(tarif)}&remaining=${encodeURIComponent(remaining)}`;
    wx.navigateTo({
      url: `/pages/sante_carte/sante_carte?${query}`
    });
  },

  onBack() {
    wx.navigateBack();
  },
  onNext() {
    this.onConfirm();
  },
  onPrev() {
    wx.navigateTo({ url: '/pages/sante_location/sante_location' });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onNavTap: defaultBottomNavTap
});
