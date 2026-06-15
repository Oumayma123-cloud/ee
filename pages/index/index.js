Page({
    data: {
    },

    onLoad: function() {
        // Rediriger vers login après 3 secondes
        setTimeout(() => {
            wx.navigateTo({
                url: '/pages/login/login'
            });
        }, 3000);
    }
});
