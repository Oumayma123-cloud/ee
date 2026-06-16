const api = require('../../utils/api');

Page({
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 44,
    step: 1, // 1: Operators, 2: Services, 3: Form, 4: Unpaid Bills, 5: Success
    operators: [],
    selectedOperator: null,
    services: [],
    selectedService: null,
    formFields: [],
    formValues: {},
    unpaidBills: [],
    totalAmount: 0,
    transactionNumber: '',
    isLoading: false
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sys.statusBarHeight || 44 });
    this.loadOperators();
  },

  onBack() {
    if (this.data.step > 1 && this.data.step < 5) {
      this.setData({ step: this.data.step - 1 });
    } else {
      wx.navigateBack();
    }
  },

  loadOperators() {
    this.setData({ isLoading: true });
    wx.showLoading({ title: 'Chargement...' });
    
    api.getFacturiersByCategory('003') // 003 is Transport
      .then(res => {
        wx.hideLoading();
        this.setData({
          operators: res.data || [],
          isLoading: false
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Failed to load operators:', err);
        wx.showToast({ title: 'Erreur de chargement', icon: 'none' });
        this.setData({ isLoading: false });
      });
  },

  onSelectOperator(e) {
    const operator = e.currentTarget.dataset.operator;
    this.setData({
      selectedOperator: operator,
      isLoading: true
    });
    wx.showLoading({ title: 'Chargement des services...' });

    api.getServicesByFacturier(operator.code)
      .then(res => {
        wx.hideLoading();
        this.setData({
          services: res.data || [],
          step: 2,
          isLoading: false
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Failed to load services:', err);
        wx.showToast({ title: 'Erreur de chargement', icon: 'none' });
        this.setData({ isLoading: false });
      });
  },

  onSelectService(e) {
    const service = e.currentTarget.dataset.service;
    this.setData({
      selectedService: service,
      isLoading: true
    });
    wx.showLoading({ title: 'Chargement du formulaire...' });

    api.getFormByFacturierAndService(this.data.selectedOperator.code, service.code)
      .then(res => {
        wx.hideLoading();
        // Pre-fill hidden inputs with their values
        const formValues = {};
        const fields = res.data && res.data.fields ? res.data.fields : [];
        fields.forEach(field => {
          if (field.type === 'hidden' && field.value) {
            formValues[field.dataName] = field.value;
          }
        });

        this.setData({
          formFields: fields,
          formValues,
          step: 3,
          isLoading: false
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Failed to load form fields:', err);
        wx.showToast({ title: 'Erreur de chargement', icon: 'none' });
        this.setData({ isLoading: false });
      });
  },

  onFormFieldInput(e) {
    const name = e.currentTarget.dataset.name;
    const value = e.detail.value;
    const formValues = { ...this.data.formValues, [name]: value };
    this.setData({ formValues });
  },

  onSubmitForm() {
    const { formFields, formValues, selectedOperator, selectedService } = this.data;
    
    // Validate required fields
    for (const field of formFields) {
      if (field.type !== 'hidden' && field.required && !formValues[field.dataName]) {
        wx.showToast({ title: `Veuillez saisir : ${field.label}`, icon: 'none' });
        return;
      }
    }

    // Prepare payload
    const formValuesArray = Object.keys(formValues).map(key => ({
      dataName: key,
      dataVal: formValues[key]
    }));

    const payload = {
      facturierCode: selectedOperator.code,
      serviceCode: selectedService.code,
      formValues: formValuesArray
    };

    this.setData({ isLoading: true });
    wx.showLoading({ title: 'Recherche des factures...' });

    api.verifierFacturesImpayees(payload)
      .then(res => {
        wx.hideLoading();
        const factures = res.data && res.data.factures ? res.data.factures : [];
        if (factures.length === 0) {
          wx.showToast({ title: 'Aucune facture impayée trouvée', icon: 'none' });
          this.setData({ isLoading: false });
          return;
        }

        const totalAmount = factures.reduce((sum, item) => sum + item.montant, 0);

        this.setData({
          unpaidBills: factures,
          totalAmount,
          step: 4,
          isLoading: false
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Failed to query unpaid bills:', err);
        wx.showToast({ title: err.message || 'Erreur lors de la recherche', icon: 'none' });
        this.setData({ isLoading: false });
      });
  },

  onPayBills() {
    const { selectedOperator, selectedService, totalAmount } = this.data;
    this.setData({ isLoading: true });
    wx.showLoading({ title: 'Traitement du paiement...' });

    const auditNumber = 'audit-' + Math.floor(Math.random() * 1000000);
    const verifyPayload = {
      facturierCode: selectedOperator.code,
      serviceCode: selectedService.code,
      auditNumber: auditNumber,
      authorizationCode: '699737',
      transactionNumber: '100142699737'
    };

    api.verifierPaiement(verifyPayload)
      .then(res => {
        const transactionNum = res.data && res.data.transactionNumber ? res.data.transactionNumber : '100142699737';
        
        // Record user payment record
        const paymentRecordPayload = {
          utilisateur_id: wx.getStorageSync('auth_user')?.id || 521,
          service_id: 4,
          montant: totalAmount,
          mode_paiement: 'Carte Bancaire',
          prestation_type: 'App\\Models\\ServicePaiementFacture',
          paye_par_membre_famille: 't'
        };

        return api.creerPaiementUtilisateur(paymentRecordPayload)
          .then(() => {
            wx.hideLoading();
            this.setData({
              transactionNumber: transactionNum,
              step: 5,
              isLoading: false
            });
          });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Failed to verify/record payment:', err);
        wx.showToast({ title: 'Échec du paiement', icon: 'none' });
        this.setData({ isLoading: false });
      });
  },

  onFinish() {
    wx.reLaunch({ url: '/pages/services/services' });
  },

  onNavTap(e) {
    const action = e.detail.action;
    if (action === 'home') {
      wx.reLaunch({ url: '/pages/services/services' });
    } else if (action === 'emergency') {
      wx.navigateTo({ url: '/pages/urgence/urgence' });
    }
  }
});
