Page({
  data: {
    statusBarHeight: 20,
    bubbleText: "Confirmez votre lieu\nde rendez-vous",
    address: "Rue melouiya, immeuble 68...",
    day: null,
    month: null,
    year: null,
    timeIndex: null,
    type: '',

    // Map configuration
    latitude: 33.9682,
    longitude: -6.8660,
    scale: 13,
    markers: [
      {
        id: 1,
        latitude: 33.9576,
        longitude: -6.8835,
        title: 'Avenue Abderrahim Bouabid',
        callout: {
          content: 'Avenue Abderrahim Bou...',
          color: '#FFFFFF',
          fontSize: 12,
          borderRadius: 8,
          bgColor: '#5A1A8F',
          padding: 6,
          display: 'ALWAYS'
        }
      },
      {
        id: 2,
        latitude: 33.9745,
        longitude: -6.8520,
        title: 'Avenue Annakhil',
        callout: {
          content: 'Avenue Annakhil',
          color: '#FFFFFF',
          fontSize: 12,
          borderRadius: 8,
          bgColor: '#5A1A8F',
          padding: 6,
          display: 'ALWAYS'
        }
      }
    ],
    polyline: [{
      points: [
        { latitude: 33.9576, longitude: -6.8835 },
        { latitude: 33.9602, longitude: -6.8795 },
        { latitude: 33.9652, longitude: -6.8715 },
        { latitude: 33.9705, longitude: -6.8635 },
        { latitude: 33.9745, longitude: -6.8520 }
      ],
      color: '#7D22CC', // Purple route
      width: 6,
      arrowLine: true
    }]
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 20,
      day: options.day || '',
      month: options.month || '',
      year: options.year || '',
      timeIndex: options.timeIndex || '',
      type: options.type || ''
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onEditAddress() {
    wx.showModal({
      title: 'Modifier l\'adresse',
      editable: true,
      placeholder: 'Saisissez votre adresse',
      content: this.data.address,
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({ address: res.content });
        }
      }
    });
  },

  onLocate() {
    wx.showLoading({ title: 'Localisation...' });
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        wx.hideLoading();
        const { latitude, longitude } = res;
        this.setData({
          latitude,
          longitude,
          scale: 15,
          address: "Avenue Annakhil, Hay Riad, Rabat",
          markers: [
            {
              id: 10,
              latitude,
              longitude,
              title: 'Votre Position',
              callout: {
                content: 'Votre Position',
                color: '#FFFFFF',
                fontSize: 12,
                borderRadius: 8,
                bgColor: '#234D6F',
                padding: 6,
                display: 'ALWAYS'
              }
            }
          ]
        });
        wx.showToast({
          title: 'Position mise à jour',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.hideLoading();
        // Fail fallback to coordinate center (simulated environment)
        this.setData({
          latitude: 33.9682,
          longitude: -6.8660,
          scale: 14,
          address: "Avenue Annakhil, Hay Riad, Rabat"
        });
        wx.showToast({
          title: 'Position mise à jour',
          icon: 'success'
        });
      }
    });
  },

  onConfirm() {
    const { day, month, year, timeIndex, address, type } = this.data;
    wx.navigateTo({
      url: `/pages/aide-menagere-confirm/aide-menagere-confirm?day=${day}&month=${month}&year=${year}&timeIndex=${timeIndex}&address=${encodeURIComponent(address)}&type=${type}&payment=Espèces`
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
