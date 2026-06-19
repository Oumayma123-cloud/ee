const api = require('../../utils/api.js');

Page({
  data: {
    activeTab: 'profil',
    showModal: false,
    user: {
      nom: '',
      prenom: '',
      email: '',
      dob: '',
      phone: ''
    },
    contacts: [],
    memberInfo: {
      id: null,
      nom: '',
      prenom: '',
      relationship: '',
      phone: ''
    },
    fullName: '',
    phone: '',
    viewState: 'main', // 'main' or 'details'
    villes: [],
    adresses: [],
    cliniques: []
  },

  onLoad(options) {
    this.loadProfileData();
  },

  loadProfileData() {
    wx.showLoading({ title: 'Chargement...' });
    
    // Fetch profile
    api.getProfile().then(res => {
      const data = res.data || {};
      this.setData({
        user: {
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          dob: data.date_naissance || '',
          phone: data.telephone || '',
          ville: data.ville || '',
          adresse: data.adresse || '',
          clinique: data.clinique || ''
        },
        fullName: `${data.prenom || ''} ${data.nom || ''}`.trim(),
        phone: data.telephone || ''
      });
      return api.getContacts();
    }).then(res => {
      this.setData({ contacts: res.data || [] });
      
      // Fetch dynamic lists
      return Promise.all([
        api.getVilles(),
        api.getAdresses(),
        api.getCliniques()
      ]);
    }).then(results => {
      this.setData({
        villes: results[0].data || [],
        adresses: results[1].data || [],
        cliniques: results[2].data || []
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: 'Erreur de chargement', icon: 'none' });
    });
  },

  showDetails() {
    this.setData({ viewState: 'details' });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  onBack() {
    if (this.data.viewState === 'details') {
      this.setData({ viewState: 'main' });
    } else {
      wx.navigateBack();
    }
  },

  onReglagesTap() {
    wx.navigateTo({
      url: '/pages/reglages/reglages'
    });
  },

  onJeuxTap() {
    wx.navigateTo({
      url: '/pages/jeux/jeux'
    });
  },

  onPaiementsTap() {
    wx.navigateTo({ url: '/pages/paiements/paiements' });
  },

  onAjouterMembreTap() {
    wx.navigateTo({
      url: '/pages/ajouter_famille/ajouter_famille'
    });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`user.${field}`]: value
    });

    if (field === 'nom' || field === 'prenom') {
      const { user } = this.data;
      this.setData({
        fullName: `${user.prenom || ''} ${user.nom || ''}`.trim()
      });
    }
  },

  onVilleChange(e) {
    const idx = e.detail.value;
    this.setData({ 'user.ville': this.data.villes[idx] });
  },

  onAdresseChange(e) {
    const idx = e.detail.value;
    this.setData({ 'user.adresse': this.data.adresses[idx] });
  },

  onCliniqueChange(e) {
    const idx = e.detail.value;
    this.setData({ 'user.clinique': this.data.cliniques[idx] });
  },

  onMemberInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`memberInfo.${field}`]: value
    });
  },

  openModal(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      const contact = this.data.contacts.find(c => c.id === id);
      if (contact) {
        this.setData({
          memberInfo: { ...contact },
          showModal: true
        });
        return;
      }
    }
    this.setData({
      memberInfo: { id: null, nom: '', prenom: '', relationship: '', phone: '' },
      showModal: true
    });
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  onDeleteContact(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: 'Supprimer',
      content: 'Voulez-vous supprimer ce contact ?',
      success: (res) => {
        if (res.confirm) {
          api.deleteContact(id).then(() => {
            wx.showToast({ title: 'Contact supprimé', icon: 'success' });
            this.loadProfileData(); // reload
          }).catch(() => {
            wx.showToast({ title: 'Erreur', icon: 'none' });
          });
        }
      }
    });
  },

  onValider() {
    if (this.data.showModal) {
      wx.showLoading({ title: 'Enregistrement...' });
      api.addContact(this.data.memberInfo).then(() => {
        wx.hideLoading();
        wx.showToast({ title: 'Membre enregistré', icon: 'success' });
        this.closeModal();
        this.loadProfileData();
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({ title: 'Erreur', icon: 'none' });
      });
    } else {
      wx.showLoading({ title: 'Enregistrement...' });
      api.updateProfile(this.data.user).then(() => {
        wx.hideLoading();
        wx.showToast({ title: 'Profil mis à jour', icon: 'success' });
        this.loadProfileData();
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({ title: 'Erreur', icon: 'none' });
      });
    }
  },

  onLogout() {
    wx.showModal({
      title: 'Déconnexion',
      content: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      confirmColor: '#c19a89',
      success: (res) => {
        if (res.confirm) {
          // Clear any stored user data if necessary
          // wx.clearStorageSync();
          
          // Redirect to the welcome/login page (index)
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  onNavTap(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '../sante/sante' });
    } else if (action === 'emergency') {
      wx.redirectTo({ url: '../urgence/urgence' });
    }
  }
});
