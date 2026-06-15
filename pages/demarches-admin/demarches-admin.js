Page({
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 44,
    scrollThumbTop: 0,
    showRenewalType: '' // '', 'cnie', 'passport', 'permis', 'permis-guide'
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 44
    });
  },

  onBack() {
    if (this.data.showRenewalType === 'permis-guide') {
      this.setData({ showRenewalType: 'permis' });
    } else if (this.data.showRenewalType) {
      this.setData({ showRenewalType: '' });
    } else {
      wx.navigateBack();
    }
  },

  onScroll(e) {
    const { scrollTop, scrollHeight } = e.detail;
    const trackHeight = 240; // from wxss
    const thumbHeight = 60; // from wxss
    const windowHeight = wx.getSystemInfoSync().windowHeight;
    const maxScroll = scrollHeight - windowHeight;
    
    if (maxScroll > 0) {
      let ratio = scrollTop / maxScroll;
      let top = ratio * (trackHeight - thumbHeight);
      this.setData({ scrollThumbTop: top });
    }
  },

  onServiceTap(e) {
    const type = e.currentTarget.dataset.type;
    console.log('Service tapped:', type);
    
    if (type === 'passport') {
      this.setData({ showRenewalType: 'passport' });
    } else if (type === 'cnie') {
      this.setData({ showRenewalType: 'cnie' });
    } else if (type === 'permis') {
      this.setData({ showRenewalType: 'permis' });
    } else if (type === 'permis-action') {
      this.setData({ showRenewalType: 'permis-guide' });
    } else if (type === 'passport-action' || type === 'cnie-action' || type === 'permis-expiration' || type === 'permis-domicile' || type === 'permis-perte') {
      let routeType = type;
      if (type === 'passport-action') routeType = 'passport';
      if (type === 'cnie-action') routeType = 'cnie';
      wx.navigateTo({
        url: '/pages/passport-steps/passport-steps?type=' + routeType
      });
    } else if (type === 'cnie-derogation-va' || type === 'cnie-derogation-vf') {
      wx.showLoading({ title: 'Téléchargement...' });
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: 'Fichier téléchargé',
          icon: 'success'
        });
      }, 1200);
    }
  },

  onNavTap(e) {
    const target = e.detail.target;
    if (target === 'home') {
      wx.reLaunch({ url: '/pages/services/services' });
    }
  }
});
