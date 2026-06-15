const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    date: '',
    slots: [
      { start: '08:00', end: '10:00', label: '08:00 - 10:00' },
      { start: '10:00', end: '12:00', label: '10:00 - 12:00' },
      { start: '12:00', end: '14:00', label: '12:00 - 14:00' },
      { start: '14:00', end: '16:00', label: '14:00 - 16:00' },
      { start: '16:00', end: '18:00', label: '16:00 - 18:00' },
      { start: '18:00', end: '20:00', label: '18:00 - 20:00' }
    ],
    selectedIndex: 1,
    selectedSlot: '10:00 - 12:00',
    scrollIntoView: 'slot-1'
  },

  onLoad(options) {
    if (options.date) this.setData({ date: decodeURIComponent(options.date) });
  },

  onSelectSlot(e) {
    const index = Number(e.currentTarget.dataset.index || 0);
    const slot = this.data.slots[index];
    if (!slot) return;
    this.setData({
      selectedIndex: index,
      selectedSlot: slot.label,
      scrollIntoView: `slot-${index}`
    });
  },

  onNext() {
    if (!this.data.selectedSlot) {
      wx.showToast({ title: 'Choisissez un horaire', icon: 'none' });
      return;
    }
    const booking = wx.getStorageSync('infirmier_booking') || {};
    booking.slot = this.data.selectedSlot;
    wx.setStorageSync('infirmier_booking', booking);

    const query = `date=${encodeURIComponent(this.data.date)}&slot=${encodeURIComponent(this.data.selectedSlot)}`;
    wx.navigateTo({ url: `/pages/sante_location/sante_location?${query}` });
  },

  onNavTap: defaultBottomNavTap,

  onBack() {
    wx.navigateBack();
  },
  onPrev() {
    wx.navigateTo({ url: '/pages/sante_calendar/sante_calendar' });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
