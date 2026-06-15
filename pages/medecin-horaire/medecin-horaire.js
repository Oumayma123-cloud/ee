const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    scrollThumbTopPct: 6,
    slots: [
      { id: 1, start: '08:00', end: '10:00', selected: false },
      { id: 2, start: '10:00', end: '12:00', selected: true },
      { id: 3, start: '12:00', end: '14:00', selected: false },
      { id: 4, start: '14:00', end: '16:00', selected: false },
      { id: 5, start: '16:00', end: '18:00', selected: false },
      { id: 6, start: '18:00', end: '20:00', selected: false }
    ]
  },

  onReady() {
    const measure = () => {
      wx.createSelectorQuery()
        .select('.slots-scroll')
        .boundingClientRect((rect) => {
          if (rect && rect.height) {
            this._slotsScrollClientPx = rect.height;
          }
        })
        .exec();
    };
    measure();
    [120, 350, 600].forEach((ms) => setTimeout(measure, ms));
  },

  onSlotsScroll(e) {
    const { scrollTop, scrollHeight } = e.detail;
    if (!scrollHeight) {
      return;
    }
    let clientH = this._slotsScrollClientPx;
    if (!clientH) {
      const sys = wx.getSystemInfoSync();
      const winW = sys.windowWidth || 375;
      clientH = (420 * winW) / 750;
      this._slotsScrollClientPx = clientH;
    }
    if (scrollHeight <= clientH + 2) {
      this.setData({ scrollThumbTopPct: 6 });
      return;
    }
    const maxScroll = scrollHeight - clientH;
    const ratio = maxScroll <= 0 ? 0 : Math.min(1, Math.max(0, scrollTop / maxScroll));
    const minPct = 6;
    const maxPct = 94;
    this.setData({ scrollThumbTopPct: minPct + ratio * (maxPct - minPct) });
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onSelectSlot(e) {
    const id = Number(e.currentTarget.dataset.id);
    const slots = this.data.slots.map((slot) => ({
      ...slot,
      selected: slot.id === id
    }));
    this.setData({ slots });
  },

  onNextStep() {
    wx.navigateTo({ url: '/pages/medecin-lieu/medecin-lieu' });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onNavTap: defaultBottomNavTap
});
