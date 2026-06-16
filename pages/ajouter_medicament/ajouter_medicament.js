const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

Page({
  data: {
    medName: '',
    showSuggestion: false,
    suggestionText: '',
    medNameOptions: ['DOLIPRANE', 'DIFAL', 'ASPIRINE', 'PARACETAMOL', 'VITAMINE C'],
    showNameDropdown: false, // Starts closed, opens on click
    frequencies: [
      '1 fois/jrs',
      '2 fois/jrs',
      '3 fois/jrs',
      'Tous les X heures',
      'Tous les X jours',
      'Hebdomadaire',
      'Mensuel'
    ],
    selectedFrequency: '1 fois/jrs',
    showFrequencyDropdown: false, // Starts closed, opens on click
    startDate: '20/02/2025', // Figma mockup date default
    messageCount: 6,

    // Custom Date Picker Modal States
    showDatePickerModal: false,
    pickerYear: 2025,
    pickerMonth: 2,
    selectedDay: 20,
    pickerDays: [],
    monthsList: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],

    // Custom Time Picker Modal (Heure de prise) States
    showTimePickerModal: false,
    showFrequencyModal: false,
    selectedTimeMatin: '09:00',
    selectedTimeMidi: '12:00',
    selectedTimeSoir: '22:00',
    intervalValue: 6,
    dayOfMonth: 1,
    firstIntakeTime: '08:00',
    activePicker: '', // 'matin', 'midi', 'soir', or 'firstIntake'
    showTimeDropdown: false,
    timeOptions: [
      '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
      '22:00', '23:00', '00:00'
    ],
    frequencyText: '1 fois/jrs à 9 heure',
    selectedDayOfWeek: 'Lundi',
    daysOfWeek: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    daysOfWeekFull: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],

    // Scrollbar synchronisation
    scrollHandleTop: 60,
    trackHeight: 0,
    handleHeight: 0,
    maxScrollTop: 1,
    dragOffsetY: 0
  },

  onLoad: function (options) {
  },

  onReady() {
    this.initScrollMetrics();
  },

  onPageScroll(e) {
    this.updateHandleFromScroll(e.scrollTop);
  },

  onResize() {
    this.initScrollMetrics();
  },

  onBack: function () {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.redirectTo({
        url: '/pages/suivi_medicaments/suivi_medicaments'
      });
    }
  },

  onProfileTap: function () {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  onNameInput: function (e) {
    const val = e.detail.value;
    const lowerVal = val.toLowerCase();
    let showSuggestion = false;
    let suggestionText = '';

    if (lowerVal === 'doli') {
      showSuggestion = true;
      suggestionText = 'prane';
    }

    this.setData({
      medName: val,
      showSuggestion,
      suggestionText
    });
  },

  toggleNameDropdown: function () {
    this.setData({
      showNameDropdown: !this.data.showNameDropdown,
      showFrequencyDropdown: false // Collapse frequency dropdown
    });
  },

  selectName: function (e) {
    const name = e.currentTarget.dataset.name;
    this.setData({
      medName: name,
      showNameDropdown: false,
      showSuggestion: false
    });
  },

  onInputTap: function () {
    // Prevent event propagation
  },

  toggleFrequencyDropdown: function () {
    this.setData({
      showFrequencyDropdown: !this.data.showFrequencyDropdown,
      showNameDropdown: false // Collapse name dropdown
    });
  },

  selectFrequency: function (e) {
    const freq = e.currentTarget.dataset.freq;
    this.setData({
      selectedFrequency: freq,
      showFrequencyDropdown: false // Collapse on select
    });
  },

  openDatePickerModal: function () {
    const parts = this.data.startDate.split('/');
    let d = 20, m = 2, y = 2025; // default
    if (parts.length === 3) {
      d = parseInt(parts[0]);
      m = parseInt(parts[1]);
      y = parseInt(parts[2]);
    }
    this.setData({
      showDatePickerModal: true,
      pickerYear: y,
      pickerMonth: m,
      selectedDay: d,
      showNameDropdown: false,
      showFrequencyDropdown: false
    });
    this.generateCalendar(y, m);
  },

  closeDatePickerModal: function () {
    this.setData({
      showDatePickerModal: false
    });
  },

  prevMonth: function () {
    let m = this.data.pickerMonth - 1;
    let y = this.data.pickerYear;
    if (m < 1) {
      m = 12;
      y--;
    }
    this.setData({ pickerMonth: m, pickerYear: y });
    this.generateCalendar(y, m);
  },

  nextMonth: function () {
    let m = this.data.pickerMonth + 1;
    let y = this.data.pickerYear;
    if (m > 12) {
      m = 1;
      y++;
    }
    this.setData({ pickerMonth: m, pickerYear: y });
    this.generateCalendar(y, m);
  },

  selectDay: function (e) {
    const day = e.currentTarget.dataset.day;
    if (!day) return;
    this.setData({
      selectedDay: day
    });
    this.generateCalendar(this.data.pickerYear, this.data.pickerMonth);
  },

  confirmDatePicker: function () {
    const d = this.data.selectedDay;
    const m = this.data.pickerMonth;
    const y = this.data.pickerYear;
    const formattedDay = d < 10 ? '0' + d : d;
    const formattedMonth = m < 10 ? '0' + m : m;
    const formattedDate = `${formattedDay}/${formattedMonth}/${y}`;

    this.setData({
      startDate: formattedDate,
      showDatePickerModal: false
    });
  },

  generateCalendar: function (year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    let firstDayIndex = new Date(year, month - 1, 1).getDay();
    // Convert Sunday=0 to Monday=0, Sunday=6
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days = [];
    // Pad empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNum: '', empty: true });
    }
    // Add calendar days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ 
        dayNum: d, 
        empty: false
      });
    }
    this.setData({
      pickerDays: days
    });
  },

  onSubmit: function () {
    let name = this.data.medName.trim();
    
    // Auto-complete suggestion if present
    if (name.toLowerCase() === 'doli') {
      name = 'DOLIPRANE';
    }

    if (!name) {
      wx.showToast({
        title: 'Entrez le nom du médicament',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // Initialize default text based on frequency
    const freq = this.data.selectedFrequency;
    let initialFreqText = '1 fois/jrs à 9 heure';
    if (freq === '2 fois/jrs') {
      initialFreqText = '2 fois/jrs à 22 heure';
    } else if (freq === '3 fois/jrs') {
      initialFreqText = '3 fois/jrs à 9 heure, 12 heure, 22 heure';
    } else if (freq === 'Tous les X heures') {
      initialFreqText = 'Toutes les 6 heures';
    } else if (freq === 'Tous les X jours') {
      initialFreqText = 'Toutes les 6 jours à 8 heure';
    } else if (freq === 'Hebdomadaire') {
      initialFreqText = 'Hebdomadaire le Lundi à 9 heure';
    } else if (freq === 'Mensuel') {
      initialFreqText = 'Le 1 de chaque mois à 8 heure';
    }

    this.setData({
      showTimePickerModal: true,
      frequencyText: initialFreqText,
      selectedTimeMatin: '09:00',
      selectedTimeMidi: '12:00',
      selectedTimeSoir: '22:00',
      intervalValue: 6,
      dayOfMonth: 1,
      firstIntakeTime: '08:00',
      selectedDayOfWeek: 'Lundi',
      activePicker: '',
      showTimeDropdown: false
    });
  },

  incrementInterval: function () {
    let val = this.data.intervalValue + 1;
    if (val > 24) val = 24;
    
    let frequencyText = `Toutes les ${val} heures`;
    if (this.data.selectedFrequency === 'Tous les X jours') {
      const hr = parseInt(this.data.firstIntakeTime.split(':')[0], 10);
      frequencyText = `Toutes les ${val} jours à ${hr} heure`;
    }

    this.setData({
      intervalValue: val,
      frequencyText: frequencyText
    });
  },

  decrementInterval: function () {
    let val = this.data.intervalValue - 1;
    if (val < 1) val = 1;

    let frequencyText = `Toutes les ${val} heures`;
    if (this.data.selectedFrequency === 'Tous les X jours') {
      const hr = parseInt(this.data.firstIntakeTime.split(':')[0], 10);
      frequencyText = `Toutes les ${val} jours à ${hr} heure`;
    }

    this.setData({
      intervalValue: val,
      frequencyText: frequencyText
    });
  },

  incrementDayOfMonth: function () {
    let val = this.data.dayOfMonth + 1;
    if (val > 31) val = 31;
    const hr = parseInt(this.data.firstIntakeTime.split(':')[0], 10);
    this.setData({
      dayOfMonth: val,
      frequencyText: `Le ${val} de chaque mois à ${hr} heure`
    });
  },

  decrementDayOfMonth: function () {
    let val = this.data.dayOfMonth - 1;
    if (val < 1) val = 1;
    const hr = parseInt(this.data.firstIntakeTime.split(':')[0], 10);
    this.setData({
      dayOfMonth: val,
      frequencyText: `Le ${val} de chaque mois à ${hr} heure`
    });
  },

  toggleFirstIntakeDropdown: function () {
    const nextActive = this.data.activePicker === 'firstIntake' && this.data.showTimeDropdown ? '' : 'firstIntake';
    this.setData({
      activePicker: nextActive,
      showTimeDropdown: !!nextActive
    });
  },

  toggleMatinDropdown: function () {
    const nextActive = this.data.activePicker === 'matin' && this.data.showTimeDropdown ? '' : 'matin';
    this.setData({
      activePicker: nextActive,
      showTimeDropdown: !!nextActive
    });
  },

  toggleMidiDropdown: function () {
    const nextActive = this.data.activePicker === 'midi' && this.data.showTimeDropdown ? '' : 'midi';
    this.setData({
      activePicker: nextActive,
      showTimeDropdown: !!nextActive
    });
  },

  toggleSoirDropdown: function () {
    const nextActive = this.data.activePicker === 'soir' && this.data.showTimeDropdown ? '' : 'soir';
    this.setData({
      activePicker: nextActive,
      showTimeDropdown: !!nextActive
    });
  },

  selectTime: function (e) {
    const time = e.currentTarget.dataset.time;
    const picker = this.data.activePicker;
    
    let nextMatin = this.data.selectedTimeMatin;
    let nextMidi = this.data.selectedTimeMidi;
    let nextSoir = this.data.selectedTimeSoir;
    let nextFirstIntake = this.data.firstIntakeTime;

    if (picker === 'matin') {
      nextMatin = time;
    } else if (picker === 'midi') {
      nextMidi = time;
    } else if (picker === 'soir') {
      nextSoir = time;
    } else if (picker === 'firstIntake') {
      nextFirstIntake = time;
    }

    const freq = this.data.selectedFrequency;
    let frequencyText = '';
    
    if (freq === '3 fois/jrs') {
      const hourMatin = parseInt(nextMatin.split(':')[0], 10);
      const hourMidi = parseInt(nextMidi.split(':')[0], 10);
      const hourSoir = parseInt(nextSoir.split(':')[0], 10);
      frequencyText = `3 fois/jrs à ${hourMatin} heure, ${hourMidi} heure, ${hourSoir} heure`;
    } else if (freq === '2 fois/jrs') {
      const hourSoir = parseInt(nextSoir.split(':')[0], 10);
      frequencyText = `2 fois/jrs à ${hourSoir} heure`;
    } else if (freq === 'Tous les X heures') {
      frequencyText = `Toutes les ${this.data.intervalValue} heures`;
    } else if (freq === 'Tous les X jours') {
      const hr = parseInt(nextFirstIntake.split(':')[0], 10);
      frequencyText = `Toutes les ${this.data.intervalValue} jours à ${hr} heure`;
    } else if (freq === 'Hebdomadaire') {
      const hr = parseInt(nextFirstIntake.split(':')[0], 10);
      frequencyText = `Hebdomadaire le ${this.data.selectedDayOfWeek} à ${hr} heure`;
    } else if (freq === 'Mensuel') {
      const hr = parseInt(nextFirstIntake.split(':')[0], 10);
      frequencyText = `Le ${this.data.dayOfMonth} de chaque mois à ${hr} heure`;
    } else {
      const hourMatin = parseInt(nextMatin.split(':')[0], 10);
      frequencyText = `1 fois/jrs à ${hourMatin} heure`;
    }

    this.setData({
      selectedTimeMatin: nextMatin,
      selectedTimeMidi: nextMidi,
      selectedTimeSoir: nextSoir,
      firstIntakeTime: nextFirstIntake,
      showTimeDropdown: false,
      activePicker: '',
      frequencyText: frequencyText
    });
  },

  closeAllModals: function () {
    this.setData({
      showTimePickerModal: false,
      showFrequencyModal: false,
      showTimeDropdown: false,
      activePicker: ''
    });
  },

  selectDayOfWeek: function (e) {
    const dayFull = e.currentTarget.dataset.day;
    const hr = parseInt(this.data.firstIntakeTime.split(':')[0], 10);
    this.setData({
      selectedDayOfWeek: dayFull,
      frequencyText: `Hebdomadaire le ${dayFull} à ${hr} heure`
    });
  },

  goToFrequencyModal: function () {
    this.setData({
      showTimePickerModal: false,
      showFrequencyModal: true
    });
  },

  confirmFrequency: function () {
    const freq = this.data.selectedFrequency;
    let nextDoseString = '';

    if (freq === '3 fois/jrs') {
      const hrMatin = parseInt(this.data.selectedTimeMatin.split(':')[0], 10);
      const hrMidi = parseInt(this.data.selectedTimeMidi.split(':')[0], 10);
      const hrSoir = parseInt(this.data.selectedTimeSoir.split(':')[0], 10);
      nextDoseString = `${hrMatin}h00, ${hrMidi}h00 et ${hrSoir}h00`;
    } else if (freq === '2 fois/jrs') {
      const hrMatin = parseInt(this.data.selectedTimeMatin.split(':')[0], 10);
      const hrSoir = parseInt(this.data.selectedTimeSoir.split(':')[0], 10);
      nextDoseString = `${hrMatin}h00 et ${hrSoir}h00`;
    } else if (freq === 'Tous les X heures') {
      nextDoseString = `Toutes les ${this.data.intervalValue}h (déb: ${this.data.firstIntakeTime})`;
    } else if (freq === 'Tous les X jours') {
      nextDoseString = `Tous les ${this.data.intervalValue} jours à ${this.data.firstIntakeTime}`;
    } else if (freq === 'Hebdomadaire') {
      nextDoseString = `${this.data.selectedDayOfWeek} à ${this.data.firstIntakeTime}`;
    } else if (freq === 'Mensuel') {
      nextDoseString = `Le ${this.data.dayOfMonth} du mois à ${this.data.firstIntakeTime}`;
    } else {
      const hrMatin = parseInt(this.data.selectedTimeMatin.split(':')[0], 10);
      nextDoseString = `${hrMatin}h00`;
    }

    this.setData({
      showFrequencyModal: false
    });
    this.saveMedicationAndNavigate(nextDoseString);
  },

  saveMedicationAndNavigate: function (time) {
    let name = this.data.medName.trim();
    if (name.toLowerCase() === 'doli') {
      name = 'DOLIPRANE';
    }

    const payload = {
      name: name.toUpperCase(),
      type: this.data.selectedFrequency,
      heures: this.data.selectedFrequency === '3 fois/jrs' 
        ? [this.data.selectedTimeMatin, this.data.selectedTimeMidi, this.data.selectedTimeSoir]
        : (this.data.selectedFrequency === '2 fois/jrs' 
            ? [this.data.selectedTimeMatin, this.data.selectedTimeSoir] 
            : [this.data.selectedTimeMatin]),
      date_debut: this.data.startDate,
      instructions: this.data.frequencyText
    };

    wx.showLoading({ title: 'Ajout...' });
    api.ajouterMedicamentSuivi(payload)
      .then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: 'Médicament ajouté',
          icon: 'success',
          duration: 1500,
          success: () => {
            setTimeout(() => {
              this.onBack();
            }, 1500);
          }
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: 'Erreur lors de l\'ajout',
          icon: 'none'
        });
      });
  },

  // Scrollbar Methods
  initScrollMetrics() {
    const query = wx.createSelectorQuery();
    query.select('.scroll-track').boundingClientRect();
    query.select('.scroll-handle').boundingClientRect();
    query.select('.suivi-container').boundingClientRect();
    query.exec((res) => {
      const trackRect = res && res[0];
      const handleRect = res && res[1];
      const containerRect = res && res[2];
      if (!trackRect || !containerRect) return;

      wx.getSystemInfo({
        success: ({ windowHeight }) => {
          const handleHeight = (handleRect && handleRect.height) || 0;
          const maxScrollTop = Math.max(containerRect.height - windowHeight, 1);
          const maxHandleTop = Math.max(trackRect.height - handleHeight, 0);

          this.setData({
            trackHeight: trackRect.height,
            trackTop: trackRect.top,
            handleHeight,
            maxScrollTop,
            scrollHandleTop: Math.min(this.data.scrollHandleTop, maxHandleTop)
          });
        }
      });
    });
  },

  updateHandleFromScroll(scrollTop) {
    const { maxScrollTop, trackHeight, handleHeight } = this.data;
    if (!trackHeight || !handleHeight) return;
    const maxHandleTop = Math.max(trackHeight - handleHeight, 0);
    const ratio = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
    this.setData({ scrollHandleTop: ratio * maxHandleTop });
  },

  onTrackTap(e) {
    const touchY =
      (e && e.detail && typeof e.detail.y === 'number' && e.detail.y) ||
      (e && e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY) ||
      (e && e.touches && e.touches[0] && e.touches[0].clientY);
    if (typeof touchY !== 'number') return;

    this.scrollByTouchY(touchY, true);
  },

  onHandleTouchStart(e) {
    const touchY = e.touches && e.touches[0] && e.touches[0].clientY;
    if (typeof touchY !== 'number') return;

    const { trackTop, scrollHandleTop } = this.data;
    this.setData({
      dragOffsetY: touchY - (this.data.trackTop || 0) - scrollHandleTop
    });
  },

  onHandleTouchMove(e) {
    const touchY = e.touches && e.touches[0] && e.touches[0].clientY;
    if (typeof touchY !== 'number') return;
    this.scrollByTouchY(touchY, false);
  },

  scrollByTouchY(touchY, withAnimation) {
    const { trackHeight, handleHeight, dragOffsetY, maxScrollTop, trackTop } = this.data;
    if (!trackHeight || !handleHeight) return;

    const maxHandleTop = Math.max(trackHeight - handleHeight, 1);
    const baseY = touchY - (trackTop || 0) - (withAnimation ? handleHeight / 2 : dragOffsetY);
    const clampedTop = Math.max(0, Math.min(baseY, maxHandleTop));
    const ratio = clampedTop / maxHandleTop;
    const targetScrollTop = ratio * maxScrollTop;

    this.setData({ scrollHandleTop: clampedTop });
    wx.pageScrollTo({
      scrollTop: targetScrollTop,
      duration: withAnimation ? 180 : 0
    });
  },

  scrollUp() {
    wx.pageScrollTo({ scrollTop: 0, duration: 180 });
  },

  scrollDown() {
    const { maxScrollTop } = this.data;
    wx.pageScrollTo({ scrollTop: maxScrollTop, duration: 180 });
  },

  onNavTap: defaultBottomNavTap
});
