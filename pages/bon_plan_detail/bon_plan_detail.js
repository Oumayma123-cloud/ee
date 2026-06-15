const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

Page({
  data: {
    deal: null
  },

  onLoad: function (options) {
    const id = parseInt(options.id) || 1;
    const deals = [
      {
        id: 1,
        subtitle: 'Batteries Bosch',
        titlePrefix: '',
        titleSuffix: '-10%',
        image: '/assets/bon4.png',
        description: 'Profitez de <b>-10 %</b> sur toute la gamme de batteries Bosch, reconnues pour leur fiabilité et longévité. Idéal pour tous types de véhicules.'
      },
      {
        id: 2,
        subtitle: 'FILTRES BOSCH',
        titlePrefix: '',
        titleSuffix: '-15%',
        image: '/assets/bon3.png',
        description: 'Bénéficiez de <b>-15 %</b> sur les filtres huile, air et carburant Bosch pour un moteur plus propre et performant.'
      },
      {
        id: 3,
        subtitle: 'FREINAGE BOSCH',
        titlePrefix: '',
        titleSuffix: '-15%',
        image: '/assets/bon5.png',
        description: 'Réductions de <b>-15 %</b> sur plaquettes et disques Bosch, pour un freinage sécurisé et durable.'
      },
      {
        id: 4,
        subtitle: 'PNEUS BRIDGESTONE',
        titlePrefix: '',
        titleSuffix: '690 MAD',
        image: '/assets/bon6.png',
        description: 'Pneus de qualité premium aux prix avantageux :'
      },
      {
        id: 5,
        subtitle: 'APPAREILS AUDITIFS',
        titlePrefix: '',
        titleSuffix: '-15%',
        image: '/assets/bon2.png',
        description: 'Profitez de <b>20 %</b> de réduction sur toute la gamme, une offre avantageuse pour allier style et accessibilité.'
      },
      {
        id: 6,
        subtitle: 'Voyage Istanbul',
        titlePrefix: '',
        titleSuffix: '9866 MAD',
        image: '/assets/bon9.png',
        description: "Plongez au cœur d'Istanbul, entre tradition et modernité, pour un séjour unique :<br/><br/><b>Vol A/R avec Air Arabia</b><br/><br/>(10 kg cabine + 20 kg soute à l'aller, 10 kg cabine + 40 kg soute au retour)<br/><br/><b>6 nuits en hôtel 4*</b>"
      },
      {
        id: 7,
        subtitle: 'Merzouga Et Erfoud',
        titlePrefix: '',
        titleSuffix: '5850 MAD',
        image: '/assets/bon8.png',
        description: "<b>Inclus dans le programme</b><br/><br/>• Vol A/R Casablanca – Errachidia (Royal Air Maroc)<br/>• Transferts en 4x4 de luxe aéroport-hôtels<br/>• 2 nuits au Kasbah Hôtel Xaluca Erfoud 4* (demi-pension)<br/>• 2 nuits au Riad Xaluca Merzouga (petit-déjeuner)<br/>• Excursion en 4x4 dans le désert<br/>• Balade à dos de dromadaire au coucher du soleil<br/>• Visite de Rissani et du village Gnaoua de Khamlia<br/>• Dîner en bivouac sous les étoiles"
      },
      {
        id: 8,
        subtitle: 'Écolodge Safa Boulaouane',
        titlePrefix: '',
        titleSuffix: '2150 MAD',
        image: '/assets/bon7.png',
        description: "à partir de 2150 Mad<br/>Un séjour nature et terroir au cœur d'un domaine paisible, entre détente, randonnée et gastronomie locale.<br/><br/><b>Durée & Période</b><br/><br/>• 2 nuitées / 3 jours<br/>• De septembre à décembre<br/>• Formule pension complète : tous les repas + café et eau à volonté<br/>• Minimum : 10 participants<br/><br/><b>Jour 1 – Arrivée & détente</b>"
      },
      {
        id: 9,
        subtitle: 'Sur Toute La Gamme',
        titlePrefix: '',
        titleSuffix: '-20%',
        image: '/assets/bon1.png',
        description: 'Profitez de -20% sur toutes les lunettes Nadary : style, élégance et clarté de vue sans compromis.'
      }
    ];

    const deal = deals.find(d => d.id === id) || deals[0];
    this.setData({ deal });
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onObtainCode() {
    const code = `TIQQA-${this.data.deal.subtitle.toUpperCase().replace(/\s+/g, '-')}-OFFER`;
    wx.showModal({
      title: 'Votre Code Promo',
      content: `Félicitations ! Voici votre code promo unique :\n\n${code}\n\nPrésentez ce code chez notre partenaire pour profiter de l'offre.`,
      confirmText: 'Copier',
      cancelText: 'Fermer',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: code,
            success: () => {
              wx.showToast({
                title: 'Code copié !',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
