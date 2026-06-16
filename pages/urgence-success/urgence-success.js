const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

Page({
  data: {
    statusBarHeight: 20,
    messageCount: 6,
    currentStep: 1,
    isRetour: false,
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
        title: "Prise en charge non autorisée par la loi.",
        heroType: 'warning',
        message: "nous somme sarrives à l'adresse que vous nous avez indiqué mais la loi ne nous permet pas de vous prendre en charge."
      },
      {
        id: 8,
        title: "Redirection : El Mansour - capacités limitées, transfert vers Narjiss",
        heroType: 'operator',
        message: "En raison de moyens inadaptés à l'hôpital EL MANSOUR, un transfert vers l'hôpital Narjiss a été décidé afin de garantir des soins adaptés à votre situation."
      },
      {
        id: 9,
        title: "Vous êtes admis à l' hôpital",
        heroType: 'operator',
        message: "vous êtes maintenant pris en charge à l'hôpital Narjiss"
      }
    ]
  },

  onLoad: function(options) {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
    if (options && options.type === 'retour') {
      this.setData({
        isRetour: true,
        currentStep: 1,
        stepsData: [
          {
            id: 1,
            title: "Demande prise en compte",
            heroType: 'ambulance',
            message: "une ambulance viendra vous chercher entre 13h00 et 14h00, selon l’avis de votre médecin traitant. merci de rester prêt, nous prenons soin de vous."
          },
          {
            id: 2,
            title: "Arrivée d'ambulance de retour",
            heroType: 'ambulance',
            message: "L'ambulance de retour arrive à l'hôpital pour vous ramener chez vous."
          },
          {
            id: 3,
            title: "Transport vers domicile",
            heroType: 'ambulance',
            message: "Vous êtes actuellement en route vers votre domicile. Gardez votre ceinture de sécurité attachée."
          },
          {
            id: 4,
            title: "Retour effectué",
            heroType: 'operator',
            message: "Vous êtes bien arrivé(e) chez vous. Nous espérons que votre transport s'est bien passé."
          }
        ]
      });
    } else {
      const authUser = wx.getStorageSync('auth_user') || {};
      const parentId = authUser.id || 521;
      
      wx.showLoading({ title: 'Chargement...' });
      api.getCurrentPrestationAmbulance(parentId)
        .then((res) => {
          wx.hideLoading();
          console.log('[Ambulance] Current prestation loaded:', res);
        })
        .catch((err) => {
          wx.hideLoading();
          console.error('[Ambulance] Failed to load current prestation:', err);
        });
    }
  },
  onBackTap: function() {
    if (this.data.isRetour) {
      wx.navigateBack();
    } else {
      wx.reLaunch({ url: '/pages/sante/sante' });
    }
  },

  onStepTap: function(e) {
    const step = parseInt(e.currentTarget.dataset.step);
    this.setData({ currentStep: step });
    if (wx.vibrateShort) wx.vibrateShort();
    
    // Normal emergency flow -> step 9 goes to return ambulance choice
    if (!this.data.isRetour && step === 9) {
      setTimeout(() => {
        wx.navigateTo({ url: '../urgence-retour/urgence-retour' });
      }, 600);
    }
  },

  onReserveNurse: function() {
    wx.navigateTo({
      url: '/pages/sante_calendar/sante_calendar'
    });
  },

  onNavTap: defaultBottomNavTap,

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
