/**
 * Barre bas Figma : 401×76 sur frame 390, centrée (équivalent left −5 sur 390).
 * Rayons ~30px, échelle selon la largeur d’écran.
 */
function getBottomNavStyle(sys) {
  const bottomInset = (sys && sys.safeArea && sys.safeArea.bottom) ? (sys.screenHeight - sys.safeArea.bottom) : 0;
  
  // Design "Floating Pill" premium
  return (
    'position: fixed;' +
    'bottom: calc(' + bottomInset + 'px + 20rpx);' +
    'left: 4%;' +
    'right: 4%;' +
    'width: 92%;' +
    'height: 120rpx;' +
    'background: #f5f7f8;' +
    'border-radius: 60rpx;' +
    'display: flex;' +
    'align-items: center;' +
    'justify-content: space-around;' +
    'box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.12);' +
    'z-index: 10000;' +
    'box-sizing: border-box;' +
    'padding: 0 10rpx;' +
    'overflow: visible;'
  );
}

module.exports = {
  getBottomNavStyle
};
