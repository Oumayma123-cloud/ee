Page({
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 44,
    scrollThumbTop: 0,
    scrollMaxTop: 0,
    titleScript: 'Renouvellement',
    titleBold: 'DE PASSEPORT',
    steps: [],
    showScrollbar: true,
    showHelpSection: true,
    scrollbarMarginTop: 68,
    scrollbarTrackHeight: 122,
    scrollbarThumbHeight: 40
  },

  onLoad(options) {
    const sysInfo = wx.getSystemInfoSync();
    const statusBarHeight = sysInfo.statusBarHeight || 44;
    const type = options.type || 'passport';
    let titleScript = 'Renouvellement';
    let titleBold = 'DE PASSEPORT';
    let steps = [];
    let showScrollbar = true;
    let showHelpSection = true;

    if (type === 'passport') {
      titleScript = 'Renouvellement';
      titleBold = 'DE PASSEPORT';
      steps = [
        {
          id: 0,
          title: "Achat du e-timbre\n(obligatoire)",
          active: false,
          trackHeight: 100,
          thumbHeight: 40,
          richContent: "<p style=\"color:#525355;font-size:13px;line-height:1.7;margin:0 0 6px 0;\">Acheter un timbre \u00e9lectronique de <strong>500 DH</strong>.</p><p style=\"color:#525355;font-size:13px;line-height:1.7;margin:0 0 3px 0;\">- Portail officiel <span style=\"text-decoration:underline;color:#98766B;\">e-timbre</span></p><p style=\"color:#525355;font-size:13px;line-height:1.7;margin:0 0 3px 0;\">- Application mobile bancaire</p><p style=\"color:#525355;font-size:13px;line-height:1.7;margin:0 0 10px 0;\">- Agence Wafacash</p><p style=\"color:#525355;font-size:13px;line-height:1.7;margin:0;font-style:italic;\"><strong>Astuce :</strong> Conservez le code du timbre (il sera demand\u00e9 au moment de remplir le formulaire).</p>"
        },
        {
          id: 1,
          title: "Remplissage du formulaire en ligne",
          active: false,
          trackHeight: 110,
          thumbHeight: 40,
          richContent: "<p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;\">Accéder au portail officiel, saisir vos informations personnelles et le code e-timbre.</p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 10px 0;\">- <span style=\"text-decoration:underline;color:#0066cc;\">Formulaire Passeport Maroc</span></p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;font-weight:bold;font-style:italic;\">À prévoir : Numéro CIN valide, justificatif d’adresse</p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0;font-weight:bold;font-style:italic;\">Résultat : Télécharger et imprimer le formulaire validé.</p>"
        },
        {
          id: 2,
          title: "Constitution du dossier",
          active: true,
          trackHeight: 140,
          thumbHeight: 45,
          richContent: "<p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;font-weight:bold;\">Pi\u00e8ces \u00e0 r\u00e9unir :</p><div style=\"position:relative;padding-left:14px;margin-bottom:8px;font-size:13px;line-height:1.6;color:#525355;\"><span style=\"position:absolute;left:0;top:0;color:#525355;\">\u2022</span><span>Formulaire imprim\u00e9, sign\u00e9 et dat\u00e9</span></div><div style=\"position:relative;padding-left:14px;margin-bottom:8px;font-size:13px;line-height:1.6;color:#525355;\"><span style=\"position:absolute;left:0;top:0;color:#525355;\">\u2022</span><span>Copie l\u00e9galis\u00e9e de la CIN</span></div><div style=\"position:relative;padding-left:14px;margin-bottom:8px;font-size:13px;line-height:1.6;color:#525355;\"><span style=\"position:absolute;left:0;top:0;color:#525355;\">\u2022</span><span>2 photos r\u00e9centes (35\u00d745 mm, fond bleu/blanc/gris clair)</span></div><div style=\"position:relative;padding-left:14px;margin-bottom:8px;font-size:13px;line-height:1.6;color:#525355;\"><span style=\"position:absolute;left:0;top:0;color:#525355;\">\u2022</span><span>Ancien passeport (si renouvellement)</span></div><div style=\"position:relative;padding-left:14px;margin-bottom:8px;font-size:13px;line-height:1.6;color:#525355;\"><span style=\"position:absolute;left:0;top:0;color:#525355;\">\u2022</span><span>D\u00e9claration de perte/vol (si applicable)</span></div><div style=\"position:relative;padding-left:14px;margin-bottom:2px;font-size:13px;line-height:1.6;color:#525355;\"><span style=\"position:absolute;left:0;top:0;color:#525355;\">\u2022</span><span>Justificatif de domicile (facture eau/\u00e9lectricit\u00e9)</span></div>"
        },
        {
          id: 3,
          title: "D\u00e9p\u00f4t du dossier",
          active: false,
          trackHeight: 80,
          thumbHeight: 40,
          richContent: "<p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;\"><strong style=\"color:#525355;\">Action :</strong> D\u00e9poser le dossier complet \u00e0 la Moqataa / annexe administrative de votre lieu de <strong style=\"color:#525355;\">r\u00e9sidence.</strong></p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0;\"><strong style=\"color:#525355;\">\u00c0 savoir :</strong> Un re\u00e7u vous sera remis, conservez-le.</p>"
        },
        {
          id: 4,
          title: "Suivi de la demande",
          active: false,
          trackHeight: 80,
          thumbHeight: 40,
          richContent: "<p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;\"><strong style=\"color:#525355;\">Action :</strong> V\u00e9rifier l\u2019\u00e9tat d\u2019avancement en ligne.</p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;\">- <span style=\"text-decoration:underline;color:#0066cc;\">Suivi Passeport</span></p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0;\"><strong style=\"color:#525355;\">Info :</strong> Num\u00e9ro de dossier ou CIN requis.</p>"
        },
        {
          id: 5,
          title: "Retrait du passeport",
          active: false,
          trackHeight: 120,
          thumbHeight: 40,
          richContent: "<p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;\"><strong style=\"color:#525355;\">Action :</strong> Retirer le passeport dans un d\u00e9lai max. de 2 mois.</p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;\"><strong style=\"color:#525355;\">Documents n\u00e9cessaires :</strong> CIN originale valide + re\u00e7u du d\u00e9p\u00f4t</p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;\"><strong style=\"color:#525355;\">Attention :</strong> Pass\u00e9 2 mois, le passeport est d\u00e9truit.</p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0;\"><strong style=\"color:#525355;\">Astuce :</strong> Procuration l\u00e9galis\u00e9e exig\u00e9e si retrait par un tiers.</p>"
        },
        {
          id: 6,
          title: "Informations pratiques",
          active: false,
          trackHeight: 80,
          thumbHeight: 40,
          richContent: "<p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0 0 8px 0;\"><strong style=\"color:#525355;\">Dur\u00e9e moyenne :</strong> 15 \u00e0 20 jours ouvrables</p><p style=\"color:#525355;font-size:13px;line-height:1.6;margin:0;\"><strong style=\"color:#525355;\">Validit\u00e9 :</strong> 5 ans (3 ans pour enfants &lt; 3 ans)</p>"
        }
      ];
    } else if (type === 'cnie') {
      titleScript = '';
      titleBold = "CARTE NATIONALE D'IDENTITÉ ELECTRONIQUE";
      steps = [
        {
          id: 0,
          title: "Rassembler les documents requis",
          active: true,
          trackHeight: 220,
          thumbHeight: 60,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 6px 0;\">• Certificat de résidence (Moqataa + Police/Gendarmerie)</p><p style=\"margin:0 0 6px 0;\">• 4 photos d'identité (35×45mm, fond bleu/gris, &lt; 6 mois)</p><p style=\"margin:0 0 6px 0;\">• Droits de timbre : 75 DH (appoint conseillé)</p><p style=\"margin:0 0 6px 0;\">• Ancienne CNIE ou déclaration sur l'honneur légalisée / formulaire DGSN (si perte/vol)</p><p style=\"margin:0 0 6px 0;\">• Formulaire de pré-demande imprimé</p><p style=\"margin:0 0 6px 0;\">• Pièces supplémentaires en cas de modification (nom, prénom, naissance, filiation, mention épouse/veuf/veuve)</p><p style=\"margin:0 0 10px 0;\">• Cas particuliers : Formulaire de dérogation + justificatif médical <span style=\"text-decoration:underline;color:#0066cc;\">[Télécharger formulaire]</span></p><p style=\"margin:0;color:#9D605F;font-size:11px;font-style:italic;line-height:1.4;\">Les photos doivent dater de maximum 6 mois et respecter les normes officielles.</p></div>"
        },
        {
          id: 1,
          title: "Accéder au site officiel DGSN et créer la pré-demande",
          active: false,
          trackHeight: 110,
          thumbHeight: 40,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 6px 0;\">• Aller sur <a href=\"#\" style=\"color:#0066cc;text-decoration:underline;\">https://www.cnie.ma/cnie.</a></p><p style=\"margin:0 0 6px 0;\">• Accepter les conditions générales d'utilisation</p><p style=\"margin:0;\">• Sélectionner \u00ab Renouvellement \u00bb</p></div>"
        },
        {
          id: 2,
          title: "Saisir vos informations personnelles et profession",
          active: false,
          trackHeight: 140,
          thumbHeight: 50,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 5px 0;\">• Numéro de CNIE actuelle</p><p style=\"margin:0 0 5px 0;\">• Nom et prénom (français + arabe)</p><p style=\"margin:0 0 5px 0;\">• Motif de renouvellement</p><p style=\"margin:0 0 5px 0;\">• Pays, lieu de naissance, province, commune</p><p style=\"margin:0 0 5px 0;\">• Nationalité d'origine</p><p style=\"margin:0;\">• Type et nom de profession</p></div>"
        },
        {
          id: 3,
          title: "Compléter les données de votre état civil",
          active: false,
          trackHeight: 100,
          thumbHeight: 40,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 5px 0;\">• Numéro d'état civil</p><p style=\"margin:0 0 5px 0;\">• Année de délivrance du carnet</p><p style=\"margin:0;\">• Situation familiale (célibataire, marié(e), etc.)</p></div>"
        },
        {
          id: 4,
          title: "Indiquer votre adresse de résidence actuelle",
          active: false,
          trackHeight: 110,
          thumbHeight: 40,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 5px 0;\">• Pays de résidence</p><p style=\"margin:0 0 5px 0;\">• Province/ville de résidence</p><p style=\"margin:0 0 5px 0;\">• Commune de résidence</p><p style=\"margin:0;\">• Adresse complète (français + arabe)</p></div>"
        },
        {
          id: 5,
          title: "Remplir les informations de filiation (parents/grands-parents)",
          active: false,
          trackHeight: 150,
          thumbHeight: 50,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 5px 0;\">• Nom et prénom du père (français + arabe)</p><p style=\"margin:0 0 5px 0;\">• Nom et prénom de la mère (français + arabe)</p><p style=\"margin:0 0 5px 0;\">• Nom et prénom du grand-père paternel</p><p style=\"margin:0 0 10px 0;\">• Nom et prénom du grand-père maternel</p><p style=\"margin:0;color:#9D605F;font-style:italic;\">Si un prénom manque, mettez simplement un tiret '-'</p></div>"
        },
        {
          id: 6,
          title: "Ajouter vos coordonnées et contacts d'urgence",
          active: false,
          trackHeight: 100,
          thumbHeight: 40,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 5px 0;\">• Adresse email</p><p style=\"margin:0 0 5px 0;\">• Numéro de téléphone portable</p><p style=\"margin:0;\">• Contacts d'urgence (1-2 personnes)</p></div>"
        },
        {
          id: 7,
          title: "Vérifier les données et prendre rendez-vous",
          active: false,
          trackHeight: 160,
          thumbHeight: 50,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 5px 0;\">• Vérifier toutes les données saisies</p><p style=\"margin:0 0 5px 0;\">• Valider le formulaire</p><p style=\"margin:0 0 5px 0;\">• Noter le numéro de demande (8 caractères)</p><p style=\"margin:0 0 5px 0;\">• Choisir centre de dépôt et date de RDV</p><p style=\"margin:0 0 10px 0;\">• Imprimer le formulaire de pré-demande</p><p style=\"margin:0;font-weight:700;color:#525355;\">IMPORTANT : Conservez précieusement votre numéro de demande !</p></div>"
        },
        {
          id: 8,
          title: "Se rendre au centre avec le dossier complet",
          active: false,
          trackHeight: 160,
          thumbHeight: 50,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 5px 0;\">• Apporter tous les documents requis</p><p style=\"margin:0 0 5px 0;\">• Formulaire de pré-demande imprimé</p><p style=\"margin:0 0 5px 0;\">• 75 DH en espèces (somme exacte)</p><p style=\"margin:0 0 5px 0;\">• Respecter l'heure de votre RDV</p><p style=\"margin:0;color:#9D605F;font-style:italic;\">• Cas particuliers : pas de déplacement — un agent CNIE se déplace à domicile ou à l'hôpital</p></div>"
        },
        {
          id: 9,
          title: "Suivre l'avancement et retirer la nouvelle carte",
          active: false,
          trackHeight: 110,
          thumbHeight: 40,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 5px 0;\">• Suivre sur <span style=\"color:#0066cc;text-decoration:underline;\">https://www.cnie.ma/CNIE_Tracking</span></p><p style=\"margin:0 0 5px 0;\">• Attendre SMS/email de disponibilité</p><p style=\"margin:0;\">• Retirer la nouvelle CNIE au centre (ou selon procédure spéciale)</p></div>"
        }
      ];
    } else if (type === 'permis-expiration') {
      titleScript = 'Expiration';
      titleBold = 'DE PERMIS';
      steps = [
        {
          id: 0,
          title: "En cas d’expiration, préparer les pièces suivantes",
          active: true,
          trackHeight: 220,
          thumbHeight: 60,
          richContent: "<div style=\"font-family:'Poppins',sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;min-height:329px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 8px 0;\"><span style=\"color:#0066cc;text-decoration:underline;\">Formulaire bleu</span> <span style=\"color:#0066cc;\">⬇</span> + <span style=\"color:#0066cc;text-decoration:underline;\">formulaire rose</span> <span style=\"color:#0066cc;\">⬇</span> dûment renseignés et signés</p><p style=\"margin:0 0 6px 0;\">• Copie légalisée de la CNIE en cours de validité</p><p style=\"margin:0 0 6px 0;\">• Reçu de paiement des droits (<strong>400 DH</strong> à payer chez Al Barid Bank ou Barid Cash)</p><p style=\"margin:0 0 6px 0;\">• Certificat médical de moins de 3 mois (médecin agréé) attestant de l'aptitude physique et mentale</p><p style=\"margin:0 0 6px 0;\">• <span style=\"color:#0066cc;text-decoration:underline;\">Formulaire bleu</span> with photo collée rempli et signé par un ophtalmologiste</p><p style=\"margin:0 0 6px 0;\">• 2 photos récentes (35x45mm, <span style=\"color:#0066cc;text-decoration:underline;\">fond bleu</span>, lunettes obligatoires si nécessaires pour conduire)</p><p style=\"margin:0 0 6px 0;\">• Original de l'ancien permis de conduire</p><p style=\"margin:0;\">• Reçu de paiement de l'amende administrative en cas de retard</p></div>"
        },
        {
          id: 1,
          title: "déposer le dossier de demande",
          active: false,
          trackHeight: 120,
          thumbHeight: 40,
          richContent: "<div style=\"font-family:'Poppins',sans-serif;color:#525355;font-size:12px;line-height:1.6;width:271px;box-sizing:border-box;margin:0;opacity:1;\"><p style=\"margin:0 0 8px 0;\">• Dépôt auprès de l'agence Al Barid Bank ou Barid Cash la plus proche</p><p style=\"margin:0 0 8px 0;\">• Obtention d'un permis provisoire de 60 jours (renouvelable)</p><p style=\"margin:0 0 8px 0;\">• Réception d'un SMS quand le nouveau permis est prêt</p><p style=\"margin:0 0 16px 0;\">• Retrait auprès de la même agence que le dépôt initial</p><p style=\"margin:0;color:#9D605F;font-size:12px;line-height:1.5;font-style:italic;\"><strong>Remarque :</strong> le service de rendez-vous auprès du service des Mines n'est plus valable. La démarche passe uniquement par Al Barid Bank et Barid Cash.</p></div>"
        }
      ];
    } else if (type === 'permis-domicile') {
      titleScript = 'Changement';
      titleBold = 'DE DOMICILE';
      showScrollbar = false;
      showHelpSection = false;
      steps = [
        {
          id: 0,
          title: "Changement de domicile",
          active: true,
          trackHeight: 80,
          thumbHeight: 40,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;font-weight:400;font-style:normal;font-size:12px;line-height:18px;letter-spacing:1px;color:#525355;width:271px;height:71px;box-sizing:border-box;margin:0;opacity:1;\">Déposer un nouveau certificat de résidence ou une nouvelle CNIE avec la nouvelle adresse auprès de l'agence Al Barid Bank / Barid Cash.</div>"
        }
      ];
    } else if (type === 'permis-perte') {
      titleScript = 'Perte ou vol';
      titleBold = 'DU PERMIS';
      showScrollbar = false;
      showHelpSection = false;
      steps = [
        {
          id: 0,
          title: "Perte ou vol du permis de conduire",
          active: true,
          trackHeight: 80,
          thumbHeight: 40,
          richContent: "<div style=\"font-family:'Neue Montreal', 'Poppins', sans-serif;font-weight:400;font-style:normal;font-size:12px;line-height:18px;letter-spacing:1px;color:#525355;width:271px;box-sizing:border-box;margin:0;opacity:1;\">Demander un duplicata directement auprès de l'agence Al Barid Bank / Barid Cash.</div>"
        }
      ];
    }

    // Compute initial scrollbar parameters based on active step
    let activeIdx = steps.findIndex(s => s.active);
    let scrollbarMarginTop = 68;
    let scrollbarTrackHeight = 122;
    let scrollbarThumbHeight = 40;
    if (activeIdx !== -1) {
      scrollbarMarginTop = (activeIdx * 56) + 68;
      scrollbarTrackHeight = steps[activeIdx].trackHeight || 122;
      scrollbarThumbHeight = steps[activeIdx].thumbHeight || 40;
    }

    this.setData({
      statusBarHeight,
      titleScript,
      titleBold,
      steps,
      showScrollbar,
      showHelpSection,
      scrollbarMarginTop,
      scrollbarTrackHeight,
      scrollbarThumbHeight
    });
  },

  onReady() {
    this.computeScrollDimensions();
    setTimeout(() => {
      this.computeScrollDimensions();
    }, 300);
  },

  computeScrollDimensions() {
    const query = wx.createSelectorQuery().in(this);
    query.select('.scroll-content').boundingClientRect();
    query.select('.scroll-inner').boundingClientRect();
    query.exec((res) => {
      if (!res || !res[0] || !res[1]) return;
      const viewportHeight = res[0].height;
      const contentHeight = res[1].height;
      const maxTop = Math.max(0, contentHeight - viewportHeight);
      this.setData({
        scrollMaxTop: maxTop
      });
      this.updateThumbTop(0);
    });
  },

  onScroll(e) {
    const top = e.detail.scrollTop || 0;
    this.updateThumbTop(top);
  },

  updateThumbTop(scrollTop = 0) {
    const trackHeight = this.data.scrollbarTrackHeight || 122;
    const thumbHeight = this.data.scrollbarThumbHeight || 40;
    const maxTop = this.data.scrollMaxTop || 1;
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    const ratio = maxTop > 0 ? scrollTop / maxTop : 0;
    const thumbTop = Math.min(maxThumbTop, Math.max(0, ratio * maxThumbTop));
    this.setData({ scrollThumbTop: thumbTop });
  },

  onBack() {
    wx.navigateBack();
  },

  toggleStep(e) {
    const idx = Number(e.currentTarget.dataset.index);
    let scrollbarMarginTop = 68;
    let scrollbarTrackHeight = 122;
    let scrollbarThumbHeight = 40;

    const steps = this.data.steps.map((step, i) => {
      const active = i === idx ? !step.active : false;
      if (active) {
        // Calculate margin top based on index: 44px height + 12px margin = 56px per step
        scrollbarMarginTop = (i * 56) + 68;
        scrollbarTrackHeight = step.trackHeight || 122;
        scrollbarThumbHeight = step.thumbHeight || 40;
      }
      return Object.assign({}, step, { active });
    });

    const anyActive = steps.some(s => s.active);
    if (!anyActive) {
      scrollbarMarginTop = 68;
      scrollbarTrackHeight = 122;
      scrollbarThumbHeight = 40;
    }

    this.setData({
      steps,
      scrollbarMarginTop,
      scrollbarTrackHeight,
      scrollbarThumbHeight
    }, () => {
      setTimeout(() => {
        this.computeScrollDimensions();
      }, 100);
    });
  },

  onCallAgent() {
    wx.makePhoneCall({
      phoneNumber: '0522000000',
      fail() {
        wx.showToast({ title: 'Appel impossible', icon: 'none' });
      }
    });
  },

  onNavTap(e) {
    const target = e.detail.target;
    if (target === 'home') {
      wx.reLaunch({ url: '/pages/services/services' });
    }
  }
});
