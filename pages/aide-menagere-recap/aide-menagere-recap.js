Page({
  data: {
    statusBarHeight: 20,
    day: '',
    month: '',
    year: '',
    timeIndex: '',
    addressVal: '',
    type: '',
    paymentMethod: '',
    amountVal: 180,
    dateVal: 'Lundi 8 juillet 2025',
    timeVal: '14h30',
    showModal: false,
    paymentName: 'Tashilat'
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    
    // Parse input options
    const day = options.day || '8';
    const month = options.month || '7';
    const year = options.year || '2025';
    const timeIndex = options.timeIndex || '3';
    const address = options.address ? decodeURIComponent(options.address) : '60, rue melouiya app 1 agdal Rabat';
    const type = options.type || 'appartement';
    const payment = options.payment ? decodeURIComponent(options.payment) : 'Tashilat';

    // Format Amount
    const amount = type.toLowerCase() === 'villa' ? 250 : 180;

    // French dates formatting
    const monthsFr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const daysFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const timesList = ['10h00', '11h00', '12h00', '14h30', '15h00', '16h00'];

    let dateStr = 'Lundi 8 juillet 2025';
    let timeStr = '14h30';

    try {
      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const dayName = daysFr[d.getDay()];
      const monthName = monthsFr[d.getMonth()];
      dateStr = `${dayName} ${day} ${monthName} ${year}`;
      
      const tIdx = parseInt(timeIndex) || 3;
      timeStr = timesList[tIdx] || '14h30';
    } catch (e) {
      console.error("Error formatting date on recap page:", e);
    }

    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      day,
      month,
      year,
      timeIndex,
      addressVal: address,
      type,
      paymentMethod: payment,
      paymentName: payment,
      amountVal: amount,
      dateVal: dateStr,
      timeVal: timeStr
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onConfirmPay() {
    const { day, month, year, timeIndex, addressVal, type, paymentMethod } = this.data;
    wx.navigateTo({
      url: `/pages/aide-menagere-confirm/aide-menagere-confirm?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(addressVal)}&payment=${encodeURIComponent(paymentMethod)}&type=${type}&from=recap`,
      fail: (err) => {
        console.warn("navigateTo failed in onConfirmPay, trying redirectTo:", err);
        wx.redirectTo({
          url: `/pages/aide-menagere-confirm/aide-menagere-confirm?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(addressVal)}&payment=${encodeURIComponent(paymentMethod)}&type=${type}&from=recap`
        });
      }
    });
  },

  onPreventBubble() {
    // Prevent event propagation inside modal card
  },

  onCancel() {
    this.setData({
      showModal: true
    });
  },

  onModalConfirm() {
    const { day, month, year, timeIndex, addressVal, type, paymentMethod } = this.data;
    this.setData({
      showModal: false
    });
    wx.navigateTo({
      url: `/pages/aide-menagere-cancel/aide-menagere-cancel?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(addressVal)}&type=${type}&payment=${encodeURIComponent(paymentMethod)}`,
      fail: (err) => {
        console.warn("navigateTo failed in onModalConfirm, trying redirectTo:", err);
        wx.redirectTo({
          url: `/pages/aide-menagere-cancel/aide-menagere-cancel?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(addressVal)}&type=${type}&payment=${encodeURIComponent(paymentMethod)}`
        });
      }
    });
  },

  onModalClose() {
    this.setData({
      showModal: false
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