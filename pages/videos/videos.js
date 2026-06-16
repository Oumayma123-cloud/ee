const { defaultBottomNavTap } = require('../../utils/defaultNavTap.js');
const api = require('../../utils/api.js');

Page({
  data: {
    videos: []
  },

  onLoad() {
    this.loadVideos();
  },

  loadVideos() {
    wx.showLoading({ title: 'Chargement...' });
    api.getClubVideos()
      .then(res => {
        wx.hideLoading();
        if (res && res.status === 'success' && Array.isArray(res.data)) {
          this.setData({ videos: res.data });
          wx.setStorageSync('active_videos', res.data);
        } else {
          this.useFallbackVideos();
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Failed to load club videos:', err);
        this.useFallbackVideos();
      });
  },

  useFallbackVideos() {
    const fallbacks = [
      { id: 5, titre: 'Rêve Familial', image_url: '/assets/P2.png', description: "Dans cette vidéo pleine d'émotion, Mme Farida exprime sa gratitude..." },
      { id: 3, titre: 'Cap Futur', image_url: '/assets/P3.png', description: "Découvrez la mission de Tiqaa : offrir une solution simple..." },
      { id: 4, titre: 'Vie Simple', image_url: '/assets/P4.png', description: "Découvrez l'application Tiqaa..." },
      { id: 2, titre: 'Nouvel Élan', image_url: '/assets/P1.png', description: "Découvrez Tiqaa, une technologie vraiment humaine..." },
      { id: 1, titre: 'Mémoire Vive', image_url: '/assets/P5.png', description: "Mme Atika partage avec sincérité..." }
    ];
    this.setData({ videos: fallbacks });
    wx.setStorageSync('active_videos', fallbacks);
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onNavTap: defaultBottomNavTap,

  onCardTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/video_detail/video_detail?id=${id}` });
  },

  onProfileTap() {
    wx.navigateTo({ url: '../profile/profile' });
  }
});
