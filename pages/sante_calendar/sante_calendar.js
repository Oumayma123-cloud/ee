const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

const monthNames = [
  '',
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];

Page({
  data: {
    currentYear: 2025,
    currentMonth: 9,
    currentMonthLabel: 'Septembre',
    selectedDay: 14,
    todayDay: 0,
    isCurrentMonth: false,

    weeks: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
    calendarDays: []
  },

  onLoad() {
    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth() + 1;
    const todayDay = now.getDate();

    const currentYear = this.data.currentYear || todayYear;
    const currentMonth = this.data.currentMonth || todayMonth;

    this.setData({
      todayDay,
      isCurrentMonth: (currentYear === todayYear && currentMonth === todayMonth)
    });

    this.updateMonthLabel();
    this.generateCalendar();
  },

  updateMonthLabel() {
    const { currentMonth } = this.data;
    this.setData({
      currentMonthLabel: monthNames[currentMonth]
    });
  },

  generateCalendar() {
    const { currentYear, currentMonth } = this.data;

    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDate = new Date(currentYear, currentMonth, 0).getDate();

    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7;

    const calendarDays = [];

    // empty cells
    for (let i = 1; i < startDay; i++) {
      calendarDays.push(null);
    }

    // real days
    for (let d = 1; d <= lastDate; d++) {
      calendarDays.push(d);
    }

    this.setData({ calendarDays });
  },

  changeMonth(e) {
    const dir = Number(e.currentTarget.dataset.dir);
    let { currentMonth, currentYear } = this.data;

    currentMonth += dir;

    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }

    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }

    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth() + 1;

    this.setData({ 
      currentMonth, 
      currentYear,
      isCurrentMonth: (currentYear === todayYear && currentMonth === todayMonth)
    }, () => {
      this.updateMonthLabel();
      this.generateCalendar();
    });
  },

  selectDay(e) {
    this.setData({
      selectedDay: e.currentTarget.dataset.day
    });
  },

  onNext() {
    const { selectedDay, currentMonth, currentYear } = this.data;
    const date = `${selectedDay}/${currentMonth}/${currentYear}`;

    const booking = { date };
    wx.setStorageSync('infirmier_booking', booking);

    wx.navigateTo({
      url: `/pages/sante_horaire/sante_horaire?date=${date}`
    });
  },

  onBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.reLaunch({ url: '/pages/sante/sante' });
    }
  },
  onPrev() {
    wx.navigateTo({ url: '/pages/sante/sante' });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onNavTap: defaultBottomNavTap
});