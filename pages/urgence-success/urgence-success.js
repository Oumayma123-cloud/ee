Page({
  data: {
    statusBarHeight: 20,
    messageCount: 6,
    currentStep: 0,
    stepsData: [
      {
        id: 1,
        title: "Demande bien reçue et en cours de traitement",
        heroType: 'operator',
        message: "Votre demande a été enregistrée. nous allons vous confirmer l’envoi d’une ambulance dans quelques minutes."
      },
      {
        id: 2,
        title: "Ambulance en route",
        heroType: 'ambulance',
        message: "votre ambulance est en route. nous sommes à vos cotés."
      },
      {
        id: 3,
        title: "Ces contacts sont au courant de votre urgence",
        heroType: 'operator',
        message: "nous avons informé vos contacts. ils seront tenus au courant de chaque étape de votre prise en charge."
      },
      {
        id: 4,
        title: "Ambulance est arrivé chez vous",
        heroType: 'ambulance',
        message: "l'ambulance est arrivée pour vous prendre en charge. nous sommes là pour vous."
      },
      {
        id: 5,
        title: "En route vers hôpital EL MANSOUR",
        heroType: 'operator',
        message: "vous êtes en route vers l'hôpital. nous allons nous occuper de votre admission."
      },
      {
        id: 6,
        title: "Vous êtes admis à l’ hôpital",
        heroType: 'operator',
        message: "vous êtes maintenant pris en charge à l'hôpital el mansour"
      },
      {
        id: 7,
        title: "Demande prise en compte",
        heroType: 'operator',
        message: "votre demande de retour a été enregistrée. nous préparons votre transport."
      },
      {
        id: 8,
        title: "Arrivée d’ambulance de retour",
        heroType: 'ambulance',
        message: "votre ambulance est arrivée. nous vous raccompagnons en toute sécurité."
      },
      {
        id: 9,
        title: "Transport vers domicile",
        heroType: 'ambulance',
        message: "en route vers votre domicile. nous restons à vos côtés jusqu'à l'arrivée."
      },
      {
        id: 10,
        title: "Retour effectué",
        heroType: 'operator',
        message: "vous êtes bien arrivé chez vous. l'équipe Tiqqa vous souhaite un bon rétablissement."
      }
    ]
  },

  onLoad: function() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
  },

  onBackTap: function() {
    wx.reLaunch({ url: '../home/home' });
  },

  onStepTap: function(e) {
    const step = parseInt(e.currentTarget.dataset.step);
    
    this.setData({
      currentStep: step
    });

    // Redirection après un court délai pour laisser l'utilisateur voir le changement de couleur
    setTimeout(() => {
      wx.navigateTo({
        url: '../urgence-paiement/urgence-paiement'
      });
    }, 800);
    
    if (wx.vibrateShort) wx.vibrateShort();
  },

  onNavTap: function(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '../home/home' });
    } else if (action === 'emergency') {
      wx.redirectTo({ url: '../urgence/urgence' });
    }
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
