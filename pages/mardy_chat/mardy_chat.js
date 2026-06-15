Page({
  data: {
    avatar: 'mardy',
    micEnabled: true,
    showWelcome: true
  },
  onLoad: function (options) {
    if (options.avatar) {
      this.setData({ avatar: options.avatar });
    }
  },
  onBack: function () {
    wx.navigateBack();
  },
  toggleMic: function () {
    this.setData({ micEnabled: !this.data.micEnabled });
  },
  onHangup: function () {
    wx.navigateBack();
  },
  closeWelcome: function () {
    this.setData({ showWelcome: false });
  },
  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
