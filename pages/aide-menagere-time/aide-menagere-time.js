const MONTHS_FR = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
];

Page({
  data: {
    statusBarHeight: 20,
    day: null,
    month: null,
    year: null,
    timeSlots: [
      { start: '10h00', end: '10h30' },
      { start: '11h00', end: '11h30' },
      { start: '12h00', end: '12h30' },
      { start: '14h00', end: '14h30' },
      { start: '15h00', end: '15h30' },
      { start: '16h00', end: '16h30' }
    ],
    selectedIndex: 3, // Default selected is 14h00 - 14h30 as in Image
    timelineDotTop: 344, // Position in rpx for the dot to align with selected slot
    bubbleText: "Maintenant\nque vous avez choisi\nla date, sélectionnez\nl'horaire",
    type: ''
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      day: options.day || '17',
      month: options.month || '6',
      year: options.year || '2025',
      type: options.type || ''
    });
    this.updateDotPosition();
  },

  updateDotPosition() {
    const index = this.data.selectedIndex;
    // Each item is 80rpx height, gap is 16rpx.
    // Timeline line padding-top starts around 24rpx.
    // Formula for dot top position in rpx:
    const dotTop = 56 + index * 96;
    this.setData({ timelineDotTop: dotTop });
  },

  onTimeTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedIndex: index });
    this.updateDotPosition();
  },

  onBack() {
    wx.navigateBack();
  },

  onSuivant() {
    const { day, month, year, selectedIndex, type } = this.data;
    wx.navigateTo({
      url: `/pages/aide-menagere-location/aide-menagere-location?day=${day}&month=${month}&year=${year}&timeIndex=${selectedIndex}&type=${type}`
    });
  },

  onNavTap(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '/pages/services/services' });
    } else if (action === 'emergency') {
      wx.navigateTo({ url: '/pages/urgence/urgence' });
    }
  }
});
