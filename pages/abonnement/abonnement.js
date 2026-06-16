const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

Page({
  data: {
    plans: [],
    selectedPlanId: 1,
    isLoading: false
  },

  onLoad: function (options) {
    this.loadPacks();
  },

  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  loadPacks: function() {
    this.setData({ isLoading: true });
    wx.showLoading({ title: 'Chargement des offres...' });

    api.getAbonnementPacks()
      .then(res => {
        wx.hideLoading();
        const plans = res.data || [];
        this.setData({
          plans,
          selectedPlanId: plans.length > 0 ? plans[0].id : 1,
          isLoading: false
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Failed to load packs:', err);
        wx.showToast({ title: 'Erreur de chargement', icon: 'none' });
        this.setData({ isLoading: false });
      });
  },

  selectPlan: function(e) {
    const planId = e.currentTarget.dataset.planId;
    this.setData({
      selectedPlanId: planId
    });
  },

  onContinue: function () {
    const selectedPlan = this.data.plans.find(p => p.id === this.data.selectedPlanId);
    if (!selectedPlan) {
      wx.showToast({ title: 'Veuillez choisir un plan', icon: 'none' });
      return;
    }

    wx.showLoading({ title: 'Création du paiement...' });
    api.paiementPack({ pack_id: selectedPlan.id })
      .then(res => {
        wx.hideLoading();
        // Pack payment initiated successfully
        // Navigate to payment receipt page and pass transaction details
        const txNum = res.data?.transactionNumber || 'SUB-MOCK-1234';
        const amount = res.data?.montant || selectedPlan.price;
        const packName = selectedPlan.name;
        
        wx.navigateTo({
          url: `/pages/recu_paiement/recu_paiement?tx=${txNum}&amount=${amount}&pack=${encodeURIComponent(packName)}`
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Subscription payment failed:', err);
        wx.showToast({ title: 'Échec de la souscription', icon: 'none' });
      });
  },

  onProfileTap: function () {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  onNavTap: defaultBottomNavTap
});
