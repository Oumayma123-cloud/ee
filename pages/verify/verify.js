Page({
  data: {
    code: ["", "", "", ""],
    currentIndex: 0,
    seconds: 56,
    timer: null,
    timer: null,
    inputFocused: false,
    phoneNumber: '',
    maskedPhone: ''
  },

  onLoad(options) {
    if (options && options.phone) {
      const phone = options.phone;
      this.setData({
        phoneNumber: phone,
        maskedPhone: this.maskPhone(phone)
      });
    }
    this.startTimer();
  },

  maskPhone(phone) {
    if (!phone) return '';
    let p = phone.trim();
    if (p.startsWith('0')) {
      p = '+212 ' + p.substring(1);
    } else if (!p.startsWith('+')) {
      p = '+212 ' + p;
    }
    if (p.length < 8) return p;
    const start = p.substring(0, 8);
    const end = p.substring(p.length - 2);
    return start + '****' + end;
  },

  onUnload() {
    clearInterval(this.data.timer);
  },

  /* ===== TIMER ===== */
  startTimer() {
    const timer = setInterval(() => {
      let s = this.data.seconds;
      if (s > 0) {
        this.setData({ seconds: s - 1 });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    this.setData({ timer });
  },

  /* ===== KEYPAD CLICK ===== */
  handleKey(e) {
    const key = e.currentTarget.dataset.key;
    let { code, currentIndex } = this.data;

    if (key === "delete") {
      if (currentIndex > 0) {
        currentIndex--;
        code[currentIndex] = "";
      }
    } else {
      if (currentIndex < 4) {
        code[currentIndex] = key;
        currentIndex++;
      }
    }

    this.setData({ code, currentIndex });

    /* CODE COMPLET - Hide keyboard and show button */
    if (currentIndex === 4) {
      const finalCode = code.join("");
      console.log("Code saisi :", finalCode);
      
      // Hide keyboard when all digits entered
      this.setData({ inputFocused: false });
    }
  },

  /* ===== FOCUS CODE INPUT ===== */
  focusCodeInput() {
    this.setData({ inputFocused: true });
  },

  /* ===== VALIDATE CODE ===== */
  handleValidate() {
    const { code, currentIndex } = this.data;

    if (currentIndex < 4) {
      wx.showToast({
        title: "Veuillez entrer les 4 chiffres",
        icon: "none"
      })
      return
    }

    const finalCode = code.join("");
    console.log("Code validé :", finalCode);

    // Dismiss keyboard
    this.setData({ inputFocused: false });

    // Navigate to password page
    wx.navigateTo({
      url: "/pages/password/password"
    })
  }
});