Page({
  data: {
    statusBarHeight: 20,
    day: '',
    month: '',
    year: '',
    timeIndex: '',
    addressVal: '',
    paymentVal: 'Espèces',
    type: 'Appartement',
    dateVal: 'Mardi 13 avril à 12h',
    amountVal: '180 Dhs',
    showModal: false
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    const day = options.day || '13';
    const month = options.month || 'avril';
    const year = options.year || '2025';
    const timeIndex = options.timeIndex || '1';
    const address = options.address ? decodeURIComponent(options.address) : '60, rue melouiya app 1 agdal Rabat';
    const payment = options.payment ? decodeURIComponent(options.payment) : 'Espèces';
    const type = options.type || 'Appartement';

    // Format Date dynamically
    const monthsFr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const daysOfWeekFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const timeSlotsStart = ["8h", "12h", "16h"];

    let dayName = 'Mardi';
    let monthName = month;
    
    // Parse month index if it's a number or string
    let monthIdx = parseInt(month) - 1;
    if (isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) {
      monthIdx = monthsFr.indexOf(month.toLowerCase());
      if (monthIdx === -1) monthIdx = 3; // default April
    } else {
      monthName = monthsFr[monthIdx];
    }

    try {
      const d = new Date(parseInt(year), monthIdx, parseInt(day));
      if (!isNaN(d.getTime())) {
        dayName = daysOfWeekFr[d.getDay()];
      }
    } catch (e) {
      console.error(e);
    }

    const startHour = timeSlotsStart[parseInt(timeIndex)] || "12h";
    const dateVal = `${dayName} ${day} ${monthName} à ${startHour}`;

    // Format Amount
    const amountVal = type.toLowerCase() === 'villa' ? '250 Dhs' : '180 Dhs';

    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      day,
      month,
      year,
      timeIndex,
      addressVal: address,
      paymentVal: payment,
      type,
      dateVal,
      amountVal
    });
  },

  onBackTap() {
    wx.navigateBack({
      delta: 1
    });
  },

  onProfileTap() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  onModify() {
    const { day, month, year, timeIndex, addressVal, type } = this.data;
    wx.navigateTo({
      url: `/pages/aide-menagere-calendar/aide-menagere-calendar?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(addressVal)}&type=${type}`,
      fail: (err) => {
        console.warn("navigateTo failed in cancel page, trying redirectTo:", err);
        wx.redirectTo({
          url: `/pages/aide-menagere-calendar/aide-menagere-calendar?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(addressVal)}&type=${type}`
        });
      }
    });
  },

  onCancelExit() {
    this.setData({
      showModal: true
    });
  },

  onModalConfirm() {
    this.setData({
      showModal: false
    });
    wx.reLaunch({
      url: '/pages/services/services'
    });
  },

  onModalClose() {
    this.setData({
      showModal: false
    });
  },

  onPreventBubble() {
    // Prevent event propagation inside modal card
  },

  onNavTap(e) {
    const tab = e.detail.tab;
    if (tab === 'home') {
      wx.reLaunch({ url: '/pages/services/services' });
    } else if (tab === 'settings') {
      wx.navigateTo({ url: '/pages/reglages/reglages' });
    } else if (tab === 'emergency') {
      wx.navigateTo({ url: '/pages/urgence/urgence' });
    }
  }
});
