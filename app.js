
// app.js
if (typeof wx !== 'undefined') {
  // Global patch for framework-level destructuring errors (mockConfig / n is undefined)
  const methods = ['setStorageSync', 'getStorageSync', 'writeFile', 'getFileSystemManager'];
  methods.forEach(m => {
    if (wx[m]) {
      const orig = wx[m];
      wx[m] = function(...args) {
        try {
          return orig.apply(this, args);
        } catch (e) {
          console.error(`Intercepted framework error in wx.${m}:`, e);
          return null;
        }
      };
    }
  });
}

App({
  onLaunch: function () {
    // show localstorage
    try {
      let logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
    } catch (err) {
      console.warn('Storage initialization skipped:', err);
    }

    // login
    wx.login({
      success: res => {
        // get custom login info res
      }
    })
    // get user settings
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // Already authorized, you can directly call getUserInfo to get the avatar nickname without popping up
          wx.getUserInfo({
            success: res => {
              // get custom user info res
              this.globalData.userInfo = res.userInfo;
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})