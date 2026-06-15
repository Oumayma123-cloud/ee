Component({
  properties: {
    statusBarHeight: {
      type: Number,
      value: 20
    },
    showBack: {
      type: Boolean,
      value: true
    }
  },
  
  lifetimes: {
    attached() {
      const sysInfo = wx.getSystemInfoSync();
      this.setData({
        statusBarHeight: sysInfo.statusBarHeight || 20
      });
    }
  },

  methods: {
    onBack() {
      this.triggerEvent('back');
    },
    onProfileTap() {
      wx.navigateTo({
        url: '/pages/profile/profile'
      });
    }
  }
});
