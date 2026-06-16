const MONTHS_FR = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
];

Page({
  data: {
    statusBarHeight: 20,
    year: 2025,
    month: 6, // 0-indexed: 6 = Juillet
    selectedDay: 17,
    monthName: 'JUILLET',
    calendarDays: [],
    type: ''
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    this.setData({ 
      statusBarHeight: sys.statusBarHeight || 20,
      type: options.type || ''
    });
    this.buildCalendar();
  },

  buildCalendar() {
    const { year, month, selectedDay } = this.data;
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // WeChat Mon=1..Sun=0, we need Mon=0..Sun=6
    let startDow = firstDay.getDay(); // 0=Sun..6=Sat
    startDow = (startDow === 0) ? 6 : startDow - 1; // convert to Mon-based

    const days = [];
    // Empty cells before first day
    for (let i = 0; i < startDow; i++) {
      days.push({ day: '', isSelected: false, isToday: false });
    }
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d,
        isSelected: d === selectedDay,
        isToday: false
      });
    }

    this.setData({
      calendarDays: days,
      monthName: MONTHS_FR[month]
    });
  },

  onPrevMonth() {
    let { year, month } = this.data;
    month--;
    if (month < 0) { month = 11; year--; }
    this.setData({ year, month, selectedDay: null });
    this.buildCalendar();
  },

  onNextMonth() {
    let { year, month } = this.data;
    month++;
    if (month > 11) { month = 0; year++; }
    this.setData({ year, month, selectedDay: null });
    this.buildCalendar();
  },

  onDayTap(e) {
    const day = e.currentTarget.dataset.day;
    if (!day) return;
    this.setData({ selectedDay: day });
    this.buildCalendar();
  },

  onSuivant() {
    const { selectedDay, month, year, type } = this.data;
    if (!selectedDay) {
      wx.showToast({ title: 'Veuillez choisir une date', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: `/pages/aide-menagere-time/aide-menagere-time?day=${selectedDay}&month=${month}&year=${year}&type=${type}`
    });
  },

  onBack() {
    wx.navigateBack();
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
