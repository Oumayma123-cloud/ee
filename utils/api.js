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

function getMockResponse(path, method, data) {
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

    // Prevent ugly 404 console logs by bypassing the network entirely for endpoints we KNOW are missing.
    if (FORCE_MOCK_ENDPOINTS.includes(path) || path.startsWith('/api/mobile/v1/utilisateur/contacts/')) {
      const mockResponse = getMockResponse(path, method, data);
      if (mockResponse) {
        setTimeout(() => {
          resolve(mockResponse);
        }, 200); // Simulate network delay
        return;
      }
    }

    wx.request({
      url: `${BASE_URL}${path}`,
      method,
      data,
      timeout: 15000,
      header: {
        'Content-Type': 'application/json',
        ...headers
      },
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

module.exports = {
  BASE_URL,
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
  restoreCloturerDemandeInfirmier
};

