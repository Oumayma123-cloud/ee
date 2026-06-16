/**
 * Handler partagé pour la barre du bas (composant bottom-nav-bar ou markup legacy).
 */
function defaultBottomNavTap(e) {
  const action =
    (e.detail && e.detail.action) ||
    (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.action);

  if (action === 'home') {
    wx.reLaunch({ url: '/pages/sante/sante' });
    return;
  }
  
  if (action === 'calendar') {
    wx.removeStorageSync('modify_prestation_id');
    wx.navigateTo({ url: '/pages/sante_calendar/sante_calendar' });
    return;
  }

  if (action === 'emergency') {
    wx.navigateTo({ url: '/pages/urgence/urgence' });
    return;
  }

  wx.showToast({ title: 'Bientôt disponible', icon: 'none' });
}

module.exports = {
  defaultBottomNavTap
};
