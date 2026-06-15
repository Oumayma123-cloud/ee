function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

function normalizeLocale(lang) {
  if (!lang || typeof lang !== 'string') return 'fr-FR';
  return lang.replace(/_/g, '-');
}

/** Heure locale, façon iOS (ex. 9:41, 24 h sauf locales en commençant par en). */
function formatDeviceTime(d, localeTag) {
  const loc = (localeTag || 'fr-FR').toLowerCase();
  const use12h = /^en\b/.test(loc);

  if (use12h) {
    let h12 = d.getHours() % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ':' + pad2(d.getMinutes());
  }

  return d.getHours() + ':' + pad2(d.getMinutes());
}

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    fillStatusBar: {
      type: Boolean,
      value: false
    },
    edgePadding: {
      type: Boolean,
      value: true
    },
    /** Afficher l’heure à gauche (style iOS). Mettre false pour masquer. */
    showTime: {
      type: Boolean,
      value: false
    },
    /** Afficher les indicateurs réseau/wifi/batterie à droite. */
    showIndicators: {
      type: Boolean,
      value: false
    }
  },
  data: {
    timeText: '',
    rootStyle: ''
  },
  lifetimes: {
    attached() {
      const sys = wx.getSystemInfoSync();
      const sb = sys.statusBarHeight || 20;
      const fill = this.properties.fillStatusBar;
      this._locale = normalizeLocale(sys.language);
      this.setData({
        rootStyle: fill ? 'padding-top:' + sb + 'px;' : ''
      });
      if (this.properties.showTime) {
        this.tick();
        this._scheduleMinuteTick();
      }
    },
    detached() {
      if (this._minuteTimer) clearTimeout(this._minuteTimer);
      if (this._tickTimer) clearInterval(this._tickTimer);
    }
  },
  observers: {
    fillStatusBar(v) {
      const sys = wx.getSystemInfoSync();
      const sb = sys.statusBarHeight || 20;
      this.setData({
        rootStyle: v ? 'padding-top:' + sb + 'px;' : ''
      });
    },
    showTime(show) {
      if (show) {
        this.tick();
        this._scheduleMinuteTick();
      } else {
        if (this._minuteTimer) clearTimeout(this._minuteTimer);
        if (this._tickTimer) clearInterval(this._tickTimer);
        this._minuteTimer = null;
        this._tickTimer = null;
      }
    }
  },
  pageLifetimes: {
    show() {
      if (this.properties.showTime) this.tick();
    }
  },
  methods: {
    tick() {
      const d = new Date();
      const timeText = formatDeviceTime(d, this._locale);
      if (timeText !== this.data.timeText) {
        this.setData({ timeText });
      }
    },
    _scheduleMinuteTick() {
      if (this._minuteTimer) clearTimeout(this._minuteTimer);
      if (this._tickTimer) clearInterval(this._tickTimer);
      const d = new Date();
      const ms = 60000 - (d.getSeconds() * 1000 + d.getMilliseconds());
      this._minuteTimer = setTimeout(() => {
        this.tick();
        this._tickTimer = setInterval(() => this.tick(), 60000);
      }, ms);
    }
  }
});
