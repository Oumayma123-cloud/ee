Page({
  data: {
    selected: ''
  },
  onLoad: function (options) {},
  onBack: function () {
    wx.navigateBack();
  },
  selectAvatar: function (e) {
    const avatar = e.currentTarget.dataset.id;
    this.setData({ selected: avatar });
    // Navigate to chat interface after brief delay to show selection
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/mardy_chat/mardy_chat?avatar=${avatar}`
      });
      // reset selection for when they return
      setTimeout(() => {
        this.setData({ selected: '' });
      }, 500);
    }, 300);
  }
});
