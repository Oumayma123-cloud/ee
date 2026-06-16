const BASE_URL = 'http://217.182.133.168:16080';

function isDevtools() {
  try {
    const info = wx.getSystemInfoSync();
    return info.platform === 'devtools';
  } catch (e) {
    return false;
  }
}

function shouldUseMockFromError(errMsg) {
  return false;
}

function getMockResponse(originalPath, method, data) {
  const path = originalPath.split('?')[0];
  if (path === '/api/mobile/v1/auth/login') {
    return {
      status: 'success',
      data: {
        access_token: 'mock_access_token_dev',
        refresh_token: 'mock_refresh_token_dev',
        user: {
          id: 'dev-user',
          telephone: data && data.telephone ? data.telephone : '',
          nom: 'Dev',
          prenom: 'User'
        }
      },
      mock: true
    };
  }

  if (path === '/api/mobile/v1/auth/register') {
    wx.setStorageSync('userProfile', { ...data, id: 'mock-register-dev' });
    return {
      status: 'success',
      data: {
        id: 'mock-register-dev',
        telephone: data && data.telephone ? data.telephone : ''
      },
      mock: true
    };
  }

  if (path === '/api/mobile/v1/utilisateur/profile') {
    const savedProfile = wx.getStorageSync('userProfile') || {};
    const authUser = wx.getStorageSync('auth_user') || {};
    
    return {
      status: 'success',
      data: {
        id: authUser.id || 'dev-user',
        nom: savedProfile.nom || authUser.nom || '',
        prenom: savedProfile.prenom || authUser.prenom || '',
        email: savedProfile.email || authUser.email || '',
        date_naissance: savedProfile.dob || savedProfile.date_naissance || authUser.date_naissance || '',
        telephone: savedProfile.phone || savedProfile.telephone || authUser.telephone || '',
        ville: savedProfile.ville || '',
        adresse: savedProfile.adresse || '',
        clinique: savedProfile.clinique || ''
      },
      mock: true
    };
  }

  if (path === '/api/mobile/v1/auth/modifier-utilisateur') {
    const currentProfile = wx.getStorageSync('userProfile') || {};
    wx.setStorageSync('userProfile', { ...currentProfile, ...data });
    return { status: 'success', data: {}, mock: true };
  }

  if (path === '/api/mobile/v1/utilisateur/contacts') {
    if (method === 'POST') {
      const contacts = wx.getStorageSync('mock_contacts') || [];
      const newContact = { ...data, id: Date.now() };
      contacts.push(newContact);
      wx.setStorageSync('mock_contacts', contacts);
      return { status: 'success', data: newContact, mock: true };
    }
    
    // Default GET
    const contacts = wx.getStorageSync('mock_contacts') || [
      { id: 1, nom: 'Amine', telephone: '0600000001', lien: 'fils' },
      { id: 2, nom: 'Amine', telephone: '0600000002', lien: 'frère' }
    ];
    if (!wx.getStorageSync('mock_contacts')) {
      wx.setStorageSync('mock_contacts', contacts);
    }
    return {
      status: 'success',
      data: contacts,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/utilisateur/contacts/') && method === 'DELETE') {
    const id = parseInt(path.split('/').pop(), 10);
    let contacts = wx.getStorageSync('mock_contacts') || [];
    contacts = contacts.filter(c => c.id !== id && c.id !== String(id));
    wx.setStorageSync('mock_contacts', contacts);
    return { status: 'success', data: {}, mock: true };
  }

  if (path === '/api/mobile/v1/utilisateur/famille' && method === 'POST') {
    return {
      status: 'success',
      data: { message: 'Invitation envoyée avec succès' },
      mock: true
    };
  }

  if (path === '/api/mobile/v1/sante/medecin-de-garde' && method === 'POST') {
    const newPrestation = {
      id: 798,
      utilisateur_id: data ? (data.parent_id || 521) : 521,
      status: 'en_attente',
      ville_beneficiaire: data ? (data.ville_beneficiaire || 'Casablanca') : 'Casablanca',
      adresse_beneficiaire: data ? (data.adresse_beneficiaire || 'Casablanca') : 'Casablanca',
      numero_telephone_beneficiaire: data ? (data.numero_telephone_beneficiaire || '0666666666') : '0666666666',
      cree_le: new Date().toISOString()
    };
    wx.setStorageSync('mock_medecin_garde_prestation', newPrestation);
    return {
      status: 'success',
      data: newPrestation,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/medecin-de-garde/en-cours') && method === 'GET') {
    const prestation = wx.getStorageSync('mock_medecin_garde_prestation') || {
      id: 798,
      utilisateur_id: 521,
      status: 'en_attente',
      ville_beneficiaire: 'Casablanca',
      adresse_beneficiaire: 'Casablanca',
      numero_telephone_beneficiaire: '0666666666',
      cree_le: new Date().toISOString()
    };
    return {
      status: 'success',
      data: prestation,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/medecin-de-garde/') && path.endsWith('/cloturer') && method === 'PUT') {
    wx.removeStorageSync('mock_medecin_garde_prestation');
    return {
      status: 'success',
      data: { message: 'Prestation cloturée avec succès' },
      mock: true
    };
  }

  // Mocks pour Infirmier à domicile
  if (path === '/api/mobile/v1/sante/infirmier-a-domicile' && method === 'POST') {
    const newPrestation = {
      id: 800,
      utilisateur_id: data ? (data.parent_id || 521) : 521,
      status: 'en_attente',
      date_prestation: data ? data.date_prestation : new Date().toISOString(),
      ville_beneficiaire: data ? (data.ville_beneficiaire || 'Casablanca') : 'Casablanca',
      adresse_beneficiaire: data ? (data.adresse_beneficiaire || 'Casablanca') : 'Casablanca',
      numero_telephone_beneficiaire: data ? (data.numero_telephone_beneficiaire || '0666666666') : '0666666666',
      cree_le: new Date().toISOString()
    };
    wx.setStorageSync('mock_infirmier_prestation', newPrestation);
    return {
      status: 'success',
      data: newPrestation,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/infirmier-a-domicile/en-cours') && method === 'GET') {
    const prestation = wx.getStorageSync('mock_infirmier_prestation') || null;
    return {
      status: 'success',
      data: prestation,
      mock: true
    };
  }

  if (path === '/api/mobile/v1/sante/infirmier-a-domicile' && method === 'GET') {
    const cur = wx.getStorageSync('mock_infirmier_prestation');
    return {
      status: 'success',
      data: cur ? [cur] : [],
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/infirmier-a-domicile/') && path.endsWith('/cloturer') && method === 'PUT') {
    wx.removeStorageSync('mock_infirmier_prestation');
    return {
      status: 'success',
      data: { message: 'Prestation cloturée avec succès' },
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/infirmier-a-domicile/') && path.endsWith('/restore-cloturer') && method === 'PUT') {
    const restored = {
      id: 800,
      utilisateur_id: 521,
      status: 'en_attente',
      date_prestation: new Date().toISOString(),
      ville_beneficiaire: 'Casablanca',
      adresse_beneficiaire: 'Casablanca',
      numero_telephone_beneficiaire: '0666666666',
      cree_le: new Date().toISOString()
    };
    wx.setStorageSync('mock_infirmier_prestation', restored);
    return {
      status: 'success',
      data: restored,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/infirmier-a-domicile/') && method === 'PUT') {
    const id = path.split('/').pop();
    if (id !== 'cloturer' && id !== 'restore-cloturer') {
      const current = wx.getStorageSync('mock_infirmier_prestation') || {};
      const updated = {
        ...current,
        id: Number(id) || current.id || 800,
        ...data,
        status: 'en_attente',
        cree_le: current.cree_le || new Date().toISOString()
      };
      wx.setStorageSync('mock_infirmier_prestation', updated);
      return {
        status: 'success',
        data: updated,
        mock: true
      };
    }
  }

  if (path.startsWith('/api/mobile/v1/sante/infirmier-a-domicile/') && method === 'GET') {
    const id = path.split('/').pop();
    if (id !== 'en-cours' && id !== 'details') {
      const cur = wx.getStorageSync('mock_infirmier_prestation') || {
        id: Number(id) || 800,
        utilisateur_id: 521,
        status: 'en_attente',
        date_prestation: new Date().toISOString(),
        ville_beneficiaire: 'Casablanca',
        adresse_beneficiaire: 'Casablanca',
        numero_telephone_beneficiaire: '0666666666',
        cree_le: new Date().toISOString()
      };
      return {
        status: 'success',
        data: cur,
        mock: true
      };
    }
  }
  // Mocks for Urgence/Ambulance
  if (path === '/api/mobile/v1/sante/demande-ambulance' && method === 'POST') {
    const newPrestation = {
      id: 489,
      utilisateur_id: data ? (data.parent_id || 521) : 521,
      status: 'en_attente',
      ville_beneficiaire: data ? (data.villeBeneficiaire || 'Rabat') : 'Rabat',
      adresse_beneficiaire: data ? (data.adresseBeneficiaire || '123 Avenue Mohamed VI') : '123 Avenue Mohamed VI',
      numero_telephone_beneficiaire: data ? (data.numeroTelephoneBeneficiaire || '0612345678') : '0612345678',
      cree_le: new Date().toISOString()
    };
    wx.setStorageSync('mock_ambulance_prestation', newPrestation);
    return {
      status: 'success',
      data: newPrestation,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/demande-ambulance/en-cours') && method === 'GET') {
    const prestation = wx.getStorageSync('mock_ambulance_prestation') || {
      id: 489,
      utilisateur_id: 521,
      status: 'en_attente',
      ville_beneficiaire: 'Rabat',
      adresse_beneficiaire: '123 Avenue Mohamed VI',
      numero_telephone_beneficiaire: '0612345678',
      cree_le: new Date().toISOString()
    };
    return {
      status: 'success',
      data: prestation,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/demande-ambulance/') && path.endsWith('/retour-maison') && method === 'POST') {
    const current = wx.getStorageSync('mock_ambulance_prestation') || { id: 489 };
    const updated = { ...current, needRetour: true, retourData: data };
    wx.setStorageSync('mock_ambulance_prestation', updated);
    return {
      status: 'success',
      data: updated,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/demande-ambulance/') && path.endsWith('/informations') && method === 'PUT') {
    const current = wx.getStorageSync('mock_ambulance_prestation') || { id: 489 };
    const updated = { ...current, ...data };
    wx.setStorageSync('mock_ambulance_prestation', updated);
    return {
      status: 'success',
      data: updated,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/demande-ambulance/') && path.endsWith('/restore-cloturer') && method === 'PUT') {
    const restored = {
      id: 489,
      utilisateur_id: 521,
      status: 'en_attente',
      ville_beneficiaire: 'Rabat',
      adresse_beneficiaire: '123 Avenue Mohamed VI',
      numero_telephone_beneficiaire: '0612345678',
      cree_le: new Date().toISOString()
    };
    wx.setStorageSync('mock_ambulance_prestation', restored);
    return {
      status: 'success',
      data: restored,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/demande-ambulance/') && method === 'PUT') {
    // Cloturer demande
    wx.removeStorageSync('mock_ambulance_prestation');
    return {
      status: 'success',
      data: { message: 'Prestation cloturée avec succès' },
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/demande-ambulance/') && method === 'GET') {
    const id = path.split('/').pop();
    if (id !== 'en-cours') {
      const cur = wx.getStorageSync('mock_ambulance_prestation') || {
        id: Number(id) || 489,
        utilisateur_id: 521,
        status: 'en_attente',
        ville_beneficiaire: 'Rabat',
        adresse_beneficiaire: '123 Avenue Mohamed VI',
        numero_telephone_beneficiaire: '0612345678',
        cree_le: new Date().toISOString()
      };
      return {
        status: 'success',
        data: cur,
        mock: true
      };
    }
  }

  if (path === '/api/mobile/v1/sante/demande-ambulance' && method === 'GET') {
    const cur = wx.getStorageSync('mock_ambulance_prestation');
    return {
      status: 'success',
      data: cur ? [cur] : [],
      mock: true
    };
  }

  // Suivi Médicaments Mocks
  if (path.startsWith('/api/mobile/v1/sante/medicaments/suivi') && method === 'GET') {
    if (path.endsWith('/jour')) {
      const allMeds = wx.getStorageSync('medications') || [];
      return {
        status: 'success',
        data: allMeds.filter(m => m.checked),
        mock: true
      };
    } else {
      let allMeds = wx.getStorageSync('medications');
      if (!allMeds) {
        allMeds = [
          {
            id: 1,
            name: 'DOLIPRANE',
            checked: true,
            frequency: '2 fois/jrs',
            nextDose: '8h00'
          },
          {
            id: 2,
            name: 'DIFAL',
            checked: true,
            frequency: '3 fois/jrs',
            nextDose: '9h00'
          }
        ];
        wx.setStorageSync('medications', allMeds);
      }
      return {
        status: 'success',
        data: allMeds,
        mock: true
      };
    }
  }

  if (path === '/api/mobile/v1/sante/medicaments/suivi' && method === 'POST') {
    const allMeds = wx.getStorageSync('medications') || [];
    const newMed = {
      id: Date.now(),
      name: data.name ? data.name.toUpperCase() : (data.medicament_id === 27003 ? 'DOLIPRANE' : 'AUTRE'),
      checked: true,
      frequency: data.type || '1 fois/jrs',
      nextDose: data.heures ? data.heures.join(', ') : '08:00'
    };
    allMeds.push(newMed);
    wx.setStorageSync('medications', allMeds);
    return {
      status: 'success',
      data: newMed,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/medicaments/suivi/') && method === 'PATCH') {
    const id = Number(path.split('/').pop());
    const allMeds = wx.getStorageSync('medications') || [];
    let updatedMed = null;
    const nextMeds = allMeds.map(med => {
      if (med.id === id) {
        updatedMed = { ...med, ...data };
        return updatedMed;
      }
      return med;
    });
    wx.setStorageSync('medications', nextMeds);
    return {
      status: 'success',
      data: updatedMed,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/medicaments/suivi/') && method === 'DELETE') {
    const id = Number(path.split('/').pop());
    const allMeds = wx.getStorageSync('medications') || [];
    const nextMeds = allMeds.filter(med => med.id !== id);
    wx.setStorageSync('medications', nextMeds);
    return {
      status: 'success',
      data: { success: true },
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/sante/medicaments') && method === 'GET') {
    const parts = originalPath.split('?');
    let q = '';
    if (parts[1]) {
      const queryParams = parts[1].split('&');
      for (let param of queryParams) {
        if (param.startsWith('q=')) {
          q = decodeURIComponent(param.split('=')[1]);
          break;
        }
      }
    }
    const items = [
      { id: 27003, name: 'DOLIPRANE' },
      { id: 27004, name: 'DIFAL' },
      { id: 27005, name: 'ASPIRINE' },
      { id: 27006, name: 'PARACETAMOL' },
      { id: 27007, name: 'SPASFON' },
      { id: 27008, name: 'IBUPROFENE' }
    ];
    const filtered = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
    return {
      status: 'success',
      data: filtered,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/slider/liste') && method === 'GET') {
    return {
      status: 'success',
      data: [
        {
          id: 1,
          titre: "Découvrez nos bons plans chez hard auto - batteries",
          image: "/assets/bon4.png",
          type: "bons_plans",
          color: "#F7DC7C",
          actif: true
        },
        {
          id: 2,
          titre: "Découvrez nos bons plans chez hard auto - filtres",
          image: "/assets/bon3.png",
          type: "bons_plans",
          color: "#FAEAB0",
          actif: true
        },
        {
          id: 3,
          titre: "Découvrez nos bons plans chez hard auto - freinage",
          image: "/assets/bon5.png",
          type: "bons_plans",
          color: "#EEC683",
          actif: true
        },
        {
          id: 4,
          titre: "Découvrez nos bons plans chez hard auto - pneus bridgestone",
          image: "/assets/bon6.png",
          type: "bons_plans",
          color: "#F7DC7C",
          actif: true
        },
        {
          id: 5,
          titre: "Découvrez nos bons chez auditec - appareils auditifs",
          image: "/assets/bon2.png",
          type: "bons_plans",
          color: "#FAEAB0",
          actif: true
        },
        {
          id: 6,
          titre: "Voyage istanbul - monarch travel",
          image: "/assets/bon9.png",
          type: "bons_plans",
          color: "#EEC683",
          actif: true
        },
        {
          id: 7,
          titre: "MERZOUGA ET ERFOUD - monarch travel",
          image: "/assets/bon8.png",
          type: "bons_plans",
          color: "#FAEAB0",
          actif: true
        },
        {
          id: 8,
          titre: "Eco-lodge SAFA BOULAOUANE - monarch travel",
          image: "/assets/bon7.png",
          type: "bons_plans",
          color: "#EEC683",
          actif: true
        },
        {
          id: 9,
          titre: "Sur toute la gamme nadari",
          image: "/assets/bon1.png",
          type: "bons_plans",
          color: "#FAEAB0",
          actif: true
        }
      ],
      mock: true
    };
  }

  if (path === '/api/mobile/v1/clubs/thematiques/videos' && method === 'GET') {
    return {
      status: 'success',
      data: [
        {
          id: 5,
          titre: "Rêve Familial",
          description: "Dans cette vidéo pleine d'émotion, Mme Farida exprime sa gratitude envers son fils Tareq et toute l'équipe qui ont créé Tiqaa. L'histoire vraie d'une application née d'un lien familial fort et de l'amour d'une mère.",
          url: "",
          image_url: "/assets/P2.png",
          duration: null
        },
        {
          id: 3,
          titre: "Cap Futur",
          description: "Découvrez la mission de Tiqaa : offrir une solution simple, pratique et perfectly adaptée aux seniors pour faciliter le quotidien et renforcer l'autonomie. Une innovation qui a du sens et qui transforme vraiment la vie !",
          url: "",
          image_url: "/assets/P3.png",
          duration: null
        },
        {
          id: 4,
          titre: "Vie Simple",
          description: "Découvrez l'application Tiqaa, la solution pensée spécialement pour simplifier votre quotidien ! Un outil pratique, accessible et parfaitement adapté aux besoins des seniors pour favoriser l'autonomie et le bien-être.",
          url: "",
          image_url: "/assets/P4.png",
          duration: null
        },
        {
          id: 2,
          titre: "Nouvel Élan",
          description: "Découvrez Tiqaa, une technologie vraiment humaine conçue pour faciliter votre quotidien, renforcer les liens sociaux et encourager un vieillissement actif et épanoui. Une plateforme pensée par et pour les seniors !",
          url: "",
          image_url: "/assets/P1.png",
          duration: null
        },
        {
          id: 1,
          titre: "Mémoire Vive",
          description: "Mme Atika partage avec sincérité son témoignage sur l'application Tiqaa et comment cette technologie va transformer son quotidien. Une expérience humaine touchante qui montre l'impact positif de la tech sur la vie des seniors.",
          url: "",
          image_url: "/assets/P5.png",
          duration: 5
        }
      ],
      mock: true
    };
  }

  if (path === '/api/mobile/v1/paiements/epag/facturier/categories' && method === 'GET') {
    return {
      status: 'success',
      data: [
        { code: '001', name: 'EAU ET ELECTRICITÉ' },
        { code: '002', name: 'TÉLÉPHONIE ET INTERNET' },
        { code: '003', name: 'TRANSPORT' },
        { code: '004', name: 'IMPÔT ET TAXE' }
      ],
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/paiements/epag/facturier/') && path.endsWith('/list') && method === 'GET') {
    const categoryCode = path.split('/')[7];
    let facturiers = [];
    if (categoryCode === '001') {
      facturiers = [
        { code: '0009', name: 'Lydec', logo: '/assets/icons/logo-lydec.png' },
        { code: '0013', name: 'Redal', logo: '/assets/icons/logo-redal.png' },
        { code: '0027', name: 'Amendis', logo: '/assets/icons/logo-amendis.png' }
      ];
    } else if (categoryCode === '002') {
      facturiers = [
        { code: '1007', name: 'Maroc Telecom', logo: '/assets/icons/logo-maroc-telecom.png' },
        { code: '1008', name: 'Orange', logo: '/assets/icons/logo-orange.png' },
        { code: '1009', name: 'Inwi', logo: '/assets/icons/logo-inwi.png' }
      ];
    } else {
      facturiers = [
        { code: '0051', name: 'CTM Voyage', logo: '/assets/icons/logo-ctm.png' },
        { code: '0052', name: 'ONCF', logo: '/assets/icons/logo-oncf.png' }
      ];
    }
    return {
      status: 'success',
      data: facturiers,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/paiements/epag/facturier/') && path.endsWith('/services') && method === 'GET') {
    const facturierCode = path.split('/')[7];
    let services = [
      { code: '0001', name: 'Paiement Facture' },
      { code: '0002', name: 'Recharge Mobile' }
    ];
    if (facturierCode === '1007') {
      services = [
        { code: '1017', name: 'Paiement Fixe' },
        { code: '1027', name: 'Paiement Mobile' },
        { code: '1037', name: 'Paiement Internet' }
      ];
    }
    return {
      status: 'success',
      data: services,
      mock: true
    };
  }

  if (path.startsWith('/api/mobile/v1/paiements/epag/facturier/') && path.includes('/form/') && method === 'GET') {
    const parts = path.split('/');
    const facturierCode = parts[7];
    const serviceCode = parts[9];
    
    let fields = [
      { dataName: 'nofacture', label: 'Numéro de Facture', type: 'text', required: true },
      { dataName: 'search_crit', label: 'Critère', type: 'hidden', value: '2' }
    ];
    if (serviceCode === '1027') {
      fields = [
        { dataName: 'idmobile', label: 'Numéro Mobile', type: 'text', required: true },
        { dataName: 'reference2', label: 'Référence', type: 'text', required: true },
        { dataName: 'search_crit', label: 'Critère', type: 'hidden', value: '2' }
      ];
    }
    return {
      status: 'success',
      data: { fields },
      mock: true
    };
  }

  if (path === '/api/mobile/v1/paiements/epag/facturier/factures-impayees' && method === 'POST') {
    const factures = [
      { id: 'fact_01', reference: 'FACT-2026-A', montant: 180.00, dateLimit: '2026-07-15', description: 'Facture Electricité' },
      { id: 'fact_02', reference: 'FACT-2026-B', montant: 95.50, dateLimit: '2026-06-30', description: 'Facture Eau' }
    ];
    return {
      status: 'success',
      data: { factures },
      mock: true
    };
  }

  if (path === '/api/mobile/v1/paiements/epag/facturier/verifier-paiement' && method === 'POST') {
    return {
      status: 'success',
      data: {
        status: 'valide',
        transactionNumber: data && data.transactionNumber ? data.transactionNumber : '100142699737',
        auditNumber: data && data.auditNumber ? data.auditNumber : '4a79e841-7ff6-4307-95f1-fecd5a871c83'
      },
      mock: true
    };
  }

  if (path === '/api/mobile/v1/paiements/utilisateur-paiements' && method === 'POST') {
    return {
      status: 'success',
      data: {
        id: Math.floor(Math.random() * 1000) + 1,
        utilisateur_id: data && data.utilisateur_id ? data.utilisateur_id : 521,
        service_id: data && data.service_id ? data.service_id : 4,
        montant: data && data.montant ? data.montant : 197.00,
        status: 'paye',
        cree_le: new Date().toISOString()
      },
      mock: true
    };
  }

  return null;
}

const FORCE_MOCK_ENDPOINTS = [
  '/api/mobile/v1/utilisateur/profile',
  '/api/mobile/v1/utilisateur/contacts',
  '/api/mobile/v1/auth/modifier-utilisateur',
  '/api/mobile/v1/auth/login',
  '/api/mobile/v1/utilisateur/famille'
];

function request(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const cleanPath = path.split('?')[0];
    const token = wx.getStorageSync('access_token');
    const isMockUser = token === 'mock_access_token_dev';

    // Prevent ugly 404/401 console logs by bypassing the network entirely for endpoints we KNOW are missing
    // or if we are using the mock user session.
    const isForceMock = 
      isMockUser ||
      FORCE_MOCK_ENDPOINTS.includes(cleanPath) || 
      cleanPath.startsWith('/api/mobile/v1/utilisateur/contacts/') ||
      cleanPath.startsWith('/api/mobile/v1/sante/medicaments') ||
      cleanPath.startsWith('/api/mobile/v1/paiements');

    if (isForceMock) {
      const mockResponse = getMockResponse(path, method, data);
      if (mockResponse !== null) {
        setTimeout(() => {
          resolve(mockResponse);
        }, 200); // Simulate network delay
        return;
      }
    }

    const headersCombined = {
      'Content-Type': 'application/json',
      ...headers
    };
    if (token) {
      headersCombined['Authorization'] = `Bearer ${token}`;
    }

    wx.request({
      url: `${BASE_URL}${path}`,
      method,
      data,
      timeout: 15000,
      header: headersCombined,
      success: (res) => {
        const body = res.data || {};
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
          return;
        }

        // Use Mock data on ANY non-2xx error if available
        const mockResponse = getMockResponse(path, method, data);
        if (mockResponse) {
          wx.showToast({ title: `Mode mock actif (${res.statusCode})`, icon: 'none' });
          resolve(mockResponse);
          return;
        }

        let message =
          body.message ||
          body.error ||
          `Erreur API (${res.statusCode})`;

        if (body.errors && Array.isArray(body.errors) && body.errors.length > 0) {
          const errObj = body.errors[0];
          const keys = Object.keys(errObj);
          if (keys.length > 0 && Array.isArray(errObj[keys[0]]) && errObj[keys[0]].length > 0) {
            message = errObj[keys[0]][0];
          }
        }

        reject(new Error(message));
      },
      fail: (err) => {
        const errMsg = err && err.errMsg ? err.errMsg : 'Erreur reseau';
        const mockResponse = getMockResponse(path, method, data);

        if (mockResponse) {
          wx.showToast({
            title: 'Mode mock actif (dev)',
            icon: 'none'
          });
          resolve(mockResponse);
          return;
        }

        reject(new Error(errMsg));
      }
    });
  });
}

function normalizePhone(phone) {
  return String(phone || '').replace(/\s+/g, '');
}

function login(telephone, password) {
  return request('/api/mobile/v1/auth/login', 'POST', {
    telephone: normalizePhone(telephone),
    password
  });
}

function register(payload) {
  return request('/api/mobile/v1/auth/register', 'POST', payload);
}

function getProfile() {
  return request('/api/mobile/v1/utilisateur/profile', 'GET');
}

function updateProfile(data) {
  return request('/api/mobile/v1/auth/modifier-utilisateur', 'PUT', data);
}

function getContacts() {
  return request('/api/mobile/v1/utilisateur/contacts', 'GET');
}

function addContact(data) {
  return request('/api/mobile/v1/utilisateur/contacts', 'POST', data);
}

function deleteContact(id) {
  return request(`/api/mobile/v1/utilisateur/contacts/${id}`, 'DELETE');
}

function getVilles() {
  return new Promise(resolve => setTimeout(() => resolve({
    status: 'success', data: ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir']
  }), 200));
}

function getCliniques() {
  return new Promise(resolve => setTimeout(() => resolve({
    status: 'success', data: ['Clinique Avicenne', 'Clinique Al Rahma', 'Clinique Internationale', 'Clinique des Nations Unies']
  }), 200));
}

function getAdresses() {
  return new Promise(resolve => setTimeout(() => resolve({
    status: 'success', data: ['Maarif', 'Gauthier', 'Agdal', 'Hivernage', 'Centre Ville']
  }), 200));
}

function ajouterFamille(data) {
  return request('/api/mobile/v1/utilisateur/famille', 'POST', data);
}

function creerDemandeMedecinGarde(data) {
  return request('/api/mobile/v1/sante/medecin-de-garde', 'POST', data);
}

function getCurrentPrestationMedecinGarde(parentId) {
  return request(`/api/mobile/v1/sante/medecin-de-garde/en-cours?parent_id=${parentId}`, 'GET');
}

function cloturerMedecinGarde(id, parentId) {
  return request(`/api/mobile/v1/sante/medecin-de-garde/${id}/cloturer`, 'PUT', {
    parent_id: String(parentId)
  });
}

function creerDemandeInfirmier(data) {
  return request('/api/mobile/v1/sante/infirmier-a-domicile', 'POST', data);
}

function getCurrentPrestationInfirmier(parentId) {
  return request(`/api/mobile/v1/sante/infirmier-a-domicile/en-cours?parent_id=${parentId}`, 'GET');
}

function cloturerDemandeInfirmier(id, parentId) {
  return request(`/api/mobile/v1/sante/infirmier-a-domicile/${id}/cloturer`, 'PUT', {
    parent_id: String(parentId)
  });
}

function getPrestationsInfirmier() {
  return request('/api/mobile/v1/sante/infirmier-a-domicile', 'GET');
}

function getPrestationDetailInfirmier(id) {
  return request(`/api/mobile/v1/sante/infirmier-a-domicile/${id}`, 'GET');
}

function modifierDemandeInfirmier(id, data) {
  return request(`/api/mobile/v1/sante/infirmier-a-domicile/${id}`, 'PUT', data);
}

function restoreCloturerDemandeInfirmier(id) {
  return request(`/api/mobile/v1/sante/infirmier-a-domicile/${id}/restore-cloturer`, 'PUT');
}

function creerDemandeAmbulance(data) {
  return request('/api/mobile/v1/sante/demande-ambulance', 'POST', data);
}

function getCurrentPrestationAmbulance(parentId) {
  return request(`/api/mobile/v1/sante/demande-ambulance/en-cours?parent_id=${parentId}`, 'GET');
}

function getDemandeAmbulanceDetail(id, parentId) {
  return request(`/api/mobile/v1/sante/demande-ambulance/${id}?parent_id=${parentId}`, 'GET');
}

function getDemandesAmbulance(parentId) {
  return request(`/api/mobile/v1/sante/demande-ambulance?parent_id=${parentId}`, 'GET');
}

function demanderRetourAmbulance(id, data) {
  return request(`/api/mobile/v1/sante/demande-ambulance/${id}/retour-maison`, 'POST', data);
}

function updateDemandeAmbulanceInfo(id, data) {
  return request(`/api/mobile/v1/sante/demande-ambulance/${id}/informations`, 'PUT', data);
}

function cloturerDemandeAmbulance(id, parentId) {
  return request(`/api/mobile/v1/sante/demande-ambulance/${id}`, 'PUT', {
    parent_id: String(parentId)
  });
}

function restoreCloturerDemandeAmbulance(id) {
  return request(`/api/mobile/v1/sante/demande-ambulance/${id}/restore-cloturer`, 'PUT');
}

function getMedicamentsSuivi(parentId) {
  return request(`/api/mobile/v1/sante/medicaments/suivi?parent_id=${parentId}`, 'GET');
}

function ajouterMedicamentSuivi(data) {
  return request('/api/mobile/v1/sante/medicaments/suivi', 'POST', data);
}

function modifierMedicamentSuivi(id, data) {
  return request(`/api/mobile/v1/sante/medicaments/suivi/${id}`, 'PATCH', data);
}

function supprimerMedicamentSuivi(id) {
  return request(`/api/mobile/v1/sante/medicaments/suivi/${id}`, 'DELETE');
}

function rechercheMedicaments(q) {
  return request(`/api/mobile/v1/sante/medicaments?q=${encodeURIComponent(q)}&fields=minimal`, 'GET');
}

function getSliders(page = 1, pageSize = 200, dansHome = true) {
  return request(`/api/mobile/v1/slider/liste?page=${page}&pageSize=${pageSize}&dans_home=${dansHome}`, 'GET');
}

function getClubVideos() {
  return request('/api/mobile/v1/clubs/thematiques/videos', 'GET');
}

function getFacturierCategories() {
  return request('/api/mobile/v1/paiements/epag/facturier/categories', 'GET');
}

function getFacturiersByCategory(categoryCode) {
  return request(`/api/mobile/v1/paiements/epag/facturier/${categoryCode}/list`, 'GET');
}

function getServicesByFacturier(facturierCode) {
  return request(`/api/mobile/v1/paiements/epag/facturier/${facturierCode}/services`, 'GET');
}

function getFormByFacturierAndService(facturierCode, serviceCode) {
  return request(`/api/mobile/v1/paiements/epag/facturier/${facturierCode}/form/${serviceCode}`, 'GET');
}

function verifierFacturesImpayees(data) {
  return request('/api/mobile/v1/paiements/epag/facturier/factures-impayees', 'POST', data);
}

function verifierPaiement(data) {
  return request('/api/mobile/v1/paiements/epag/facturier/verifier-paiement', 'POST', data);
}

function creerPaiementUtilisateur(data) {
  return request('/api/mobile/v1/paiements/utilisateur-paiements', 'POST', data);
}

module.exports = {
  BASE_URL,
  getSliders,
  getClubVideos,
  getFacturierCategories,
  getFacturiersByCategory,
  getServicesByFacturier,
  getFormByFacturierAndService,
  verifierFacturesImpayees,
  verifierPaiement,
  creerPaiementUtilisateur,
  login,
  register,
  getProfile,
  updateProfile,
  getContacts,
  addContact,
  deleteContact,
  getVilles,
  getCliniques,
  getAdresses,
  ajouterFamille,
  creerDemandeMedecinGarde,
  getCurrentPrestationMedecinGarde,
  cloturerMedecinGarde,
  creerDemandeInfirmier,
  getCurrentPrestationInfirmier,
  cloturerDemandeInfirmier,
  getPrestationsInfirmier,
  getPrestationDetailInfirmier,
  modifierDemandeInfirmier,
  restoreCloturerDemandeInfirmier,
  creerDemandeAmbulance,
  getCurrentPrestationAmbulance,
  getDemandeAmbulanceDetail,
  getDemandesAmbulance,
  demanderRetourAmbulance,
  updateDemandeAmbulanceInfo,
  cloturerDemandeAmbulance,
  restoreCloturerDemandeAmbulance,
  getMedicamentsSuivi,
  ajouterMedicamentSuivi,
  modifierMedicamentSuivi,
  supprimerMedicamentSuivi,
  rechercheMedicaments
};

