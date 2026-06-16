const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

Page({
  data: {
    statusBarHeight: 20,
    messageCount: 6,
    latitude: 33.9716,
    longitude: -6.8498,
    markers: [
      {
        id: 1,
        latitude: 33.9716,
        longitude: -6.8498,
        title: 'Votre position',
        iconPath: '/assets/ambu.png',
        width: 40,
        height: 40
      }
    ],
    locationLabel: '350 B......'
  },

  onLoad: function() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
    this.fetchLocation();
  },

  fetchLocation: function() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        const lat = res.latitude;
        const lng = res.longitude;
        this.setData({
          latitude: lat,
          longitude: lng,
          markers: [
            {
              id: 1,
              latitude: lat,
              longitude: lng,
              title: 'Votre position',
              iconPath: '/assets/ambu.png',
              width: 40,
              height: 40
            }
          ],
          locationLabel: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        });
      },
      fail: () => {
        // Fallback to Rabat coordinates
        this.setData({
          latitude: 33.9716,
          longitude: -6.8498
        });
      }
    });
  },

  onBackTap: function() {
    wx.navigateBack();
  },

  onFinalConfirm: function() {
    const authUser = wx.getStorageSync('auth_user') || {};
    const userProfile = wx.getStorageSync('userProfile') || {};

    const telephone = authUser.telephone || userProfile.phone || '0666666666';
    const ville = userProfile.ville || authUser.ville || 'Casablanca';
    const parent_id = authUser.id || 521;

    const payload = {
      latitude_lieu_beneficiaire: this.data.latitude,
      longitude_lieu_beneficiaire: this.data.longitude,
      ville_beneficiaire: ville,
      adresse_beneficiaire: this.data.locationLabel,
      numero_telephone_beneficiaire: telephone,
      canal: 'mobile',
      parent_id: String(parent_id)
    };

    console.log('[Ambulance] Sending demand payload:', payload);
    wx.showLoading({ title: 'Création de la demande...' });

    api.creerDemandeAmbulance(payload)
      .then((res) => {
        wx.hideLoading();
        console.log('[Ambulance] Demand created successfully, response:', res);
        wx.navigateTo({
          url: '../urgence-success/urgence-success'
        });
      })
      .catch((err) => {
        wx.hideLoading();
        console.error('[Ambulance] Failed to create demand:', err);
        wx.showToast({
          title: err.message || 'Erreur lors de la demande',
          icon: 'none'
        });
      });
  },

  onActivateLoc: function() {
    wx.showLoading({ title: 'Localisation...' });
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        wx.hideLoading();
        const lat = res.latitude;
        const lng = res.longitude;
        this.setData({
          latitude: lat,
          longitude: lng,
          markers: [
            {
              id: 1,
              latitude: lat,
              longitude: lng,
              title: 'Votre position',
              iconPath: '/assets/ambu.png',
              width: 40,
              height: 40
            }
          ],
          locationLabel: `Rabat, Maroc (${lat.toFixed(4)}, ${lng.toFixed(4)})`
        });
        wx.showToast({
          title: 'Localisation activée',
          icon: 'success'
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: 'Échec de localisation',
          icon: 'none'
        });
        this.setData({
          latitude: 33.9716,
          longitude: -6.8498,
          locationLabel: 'Rabat, Maroc (33.9716, -6.8498)'
        });
      }
    });
  },

  onNavTap: defaultBottomNavTap,

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  }
});
