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
  methods: {
    onTap(e) {
      const action = e.currentTarget.dataset.action;
      this.triggerEvent('navtap', { action });
    }
  }
});
