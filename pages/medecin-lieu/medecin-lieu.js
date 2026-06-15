const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');

/**
 * Carte WeChat : renseignez la sous-clé Tencent (mp.weixin.qq.com → Paramètres → services tiers → carte)
 * Sans clé valide, la carte peut mal centrer ou afficher des tuiles incorrectes sur téléphone réel.
 */
const TENCENT_MAP_SUBKEY = '';

const DEST = { latitude: 34.0155, longitude: -6.827 };
const DEFAULT_START = { latitude: 33.9982, longitude: -6.8451 };

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const la1 = (a.latitude * Math.PI) / 180;
  const la2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function scaleForDistanceKm(d) {
  if (d > 120) return 9;
  if (d > 60) return 10;
  if (d > 25) return 11;
  if (d > 12) return 12;
  if (d > 5) return 13;
  return 14;
}

function lerpPoints(from, to, segments) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    pts.push({
      latitude: from.latitude + (to.latitude - from.latitude) * t,
      longitude: from.longitude + (to.longitude - from.longitude) * t
    });
  }
  return pts;
}

function midpoint(a, b) {
  return {
    latitude: (a.latitude + b.latitude) / 2,
    longitude: (a.longitude + b.longitude) / 2
  };
}

function buildMapState(start, userLocated) {
  const end = DEST;
  const points = lerpPoints(start, end, 16);
  const polyline = [
    {
      points,
      color: '#7C3AEDDD',
      width: 5
    }
  ];

  const destMarker = {
    id: 2,
    latitude: end.latitude,
    longitude: end.longitude,
    iconPath: '/assets/icons/icon-calendar.png',
    width: 34,
    height: 34,
    anchor: { x: 0.5, y: 1 }
  };

  const markers = userLocated
    ? [destMarker]
    : [
        {
          id: 1,
          latitude: start.latitude,
          longitude: start.longitude,
          iconPath: '/assets/icons/icon-home.png',
          width: 32,
          height: 32,
          anchor: { x: 0.5, y: 1 }
        },
        destMarker
      ];

  const circles = [
    {
      latitude: end.latitude,
      longitude: end.longitude,
      radius: 55,
      strokeWidth: 2,
      color: '#6D28D9AA',
      fillColor: '#8B5CF644'
    }
  ];

  const distKm = haversineKm(start, end);
  const center = midpoint(start, end);
  const scale = userLocated ? scaleForDistanceKm(distKm) : 14;
  const includePoints = [
    { latitude: start.latitude, longitude: start.longitude },
    { latitude: end.latitude, longitude: end.longitude }
  ];

  return {
    lat: center.latitude,
    lng: center.longitude,
    scale,
    markers,
    polyline,
    circles,
    includePoints,
    showUserOnMap: userLocated,
    locationActivated: userLocated
  };
}

function applyLocationToPage(page, res) {
  const start = { latitude: res.latitude, longitude: res.longitude };
  const state = buildMapState(start, true);
  page.setData(state, () => {
    setTimeout(() => {
      const ctx =
        page.mapCtx || wx.createMapContext('lieuMap', page);
      page.mapCtx = ctx;
      if (ctx && typeof ctx.moveToLocation === 'function') {
        ctx.moveToLocation({
          success: () => {},
          fail: () => {}
        });
      }
    }, 200);
  });
}

function tryGetLocation(options = {}) {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      ...options,
      success: resolve,
      fail: reject
    });
  });
}

function requestLocationPermission(onGranted, onDenied) {
  wx.authorize({
    scope: 'scope.userLocation',
    success: onGranted,
    fail: () => onDenied()
  });
}

Page({
  data: Object.assign(
    {
      address: 'Lieu : Rue melouiya, immeuble 60..',
      mapSubkey: TENCENT_MAP_SUBKEY
    },
    buildMapState(DEFAULT_START, false)
  ),

  mapCtx: null,

  onReady() {
    this.mapCtx = wx.createMapContext('lieuMap', this);
  },

  onShow() {
    if (this._retryLocationAfterSettings) {
      this._retryLocationAfterSettings = false;
      this.requestUserLocation();
    }
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onEditAddress() {
    wx.showToast({ title: 'Modification bientôt disponible', icon: 'none' });
  },

  requestUserLocation() {
    tryGetLocation({ isHighAccuracy: true, highAccuracyExpireTime: 12000 })
      .catch(() => tryGetLocation({ isHighAccuracy: false }))
      .then((res) => {
        applyLocationToPage(this, res);
        wx.showToast({ title: 'Position affichée', icon: 'success' });
      })
      .catch((err) => {
        wx.getSetting({
          success: (s) => {
            const auth = s.authSetting['scope.userLocation'];
            if (auth === false) {
              wx.showModal({
                title: 'Localisation désactivée',
                content:
                  'Autorisez la localisation pour tiqqa : Réglages → Confidentialité → Localisation.',
                confirmText: 'Ouvrir les réglages',
                cancelText: 'Annuler',
                success: (m) => {
                  if (m.confirm) {
                    this._retryLocationAfterSettings = true;
                    wx.openSetting();
                  }
                }
              });
              return;
            }

            // GPS indisponible/timeout: on garde une carte utilisable avec position par défaut
            applyLocationToPage(this, DEFAULT_START);
            wx.showModal({
              title: 'Position indisponible',
              content:
                'Le GPS est indisponible pour le moment. Vérifiez la localisation du téléphone et réessayez.',
              showCancel: false
            });
          },
          fail: () => {
            applyLocationToPage(this, DEFAULT_START);
            wx.showToast({ title: 'GPS indisponible', icon: 'none' });
          }
        });
      });
  },

  onActivateLocation() {
    wx.getSetting({
      success: (s) => {
        const auth = s.authSetting['scope.userLocation'];
        if (auth === true) {
          this.requestUserLocation();
          return;
        }

        if (auth === false) {
          wx.showModal({
            title: 'Localisation',
            content: 'Activez la localisation pour tiqqa dans les réglages du mini programme.',
            confirmText: 'Ouvrir les réglages',
            cancelText: 'Annuler',
            success: (m) => {
              if (m.confirm) {
                this._retryLocationAfterSettings = true;
                wx.openSetting();
              }
            }
          });
          return;
        }

        // Premier clic: demande explicite de permission
        requestLocationPermission(
          () => this.requestUserLocation(),
          () => {
            wx.showModal({
              title: 'Autorisation requise',
              content: 'Autorisez la localisation pour afficher votre position sur la carte.',
              confirmText: 'Ouvrir les réglages',
              cancelText: 'Annuler',
              success: (m) => {
                if (m.confirm) {
                  this._retryLocationAfterSettings = true;
                  wx.openSetting();
                }
              }
            });
          }
        );
      },
      fail: () => {
        wx.showToast({ title: 'Impossible de lire les réglages', icon: 'none' });
      }
    });
  },

  onNextStep() {
    wx.navigateTo({ url: '/pages/medecin-recap/medecin-recap' });
  },

  onProfileTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    });
  },

  onNavTap: defaultBottomNavTap
});
