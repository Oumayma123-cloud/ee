Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    activeTab: {
      type: String,
      value: 'home'
    },
    variant: {
      type: String,
      value: ''
    },
    messageCount: {
      type: Number,
      value: 0
    }
  },
  data: {
    isAideMenagere: false
  },
  lifetimes: {
    ready() {
      const pages = getCurrentPages();
      if (pages && pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const route = currentPage.route || '';
        if (route.indexOf('aide-menagere') !== -1) {
          this.setData({
            messageCount: 0,
            isAideMenagere: true
          });
        }
      }
    }
  },
  methods: {
    onTap(e) {
      const action = e.currentTarget.dataset.action;
      if (action === 'calendar') {
        wx.removeStorageSync('modify_prestation_id');
        wx.navigateTo({ url: '/pages/sante_calendar/sante_calendar' });
      }
      this.triggerEvent('navtap', { action });
    }
  }
});
