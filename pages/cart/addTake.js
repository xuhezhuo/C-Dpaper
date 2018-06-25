const app = getApp();
var webhost = app.globalData.webhost;

var userID = '';
var loginToken = '';

Page({
  data: {
    name: '',
    car: '',
    mobile: '',
    certificate: '',
    firm: ''
  },

  bindName: function(e){
    this.setData({
      name: e.detail.value
    })
  },

  bindCar: function (e) {
    this.setData({
      car: e.detail.value
    })
  },

  bindMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  bindCertificate: function (e) {
    this.setData({
      certificate: e.detail.value
    })
  },

  bindFirm: function (e) {
    this.setData({
      firm: e.detail.value
    })
  },

  add: function(){
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "product/addShipByBuyerInfo",
      data: {
        userID: userID,
        loginToken: loginToken,
        vehicleNo: that.data.car,
        driverName: that.data.name,
        telephone: that.data.mobile,
        certificateNo: that.data.certificate,
        transportCompany: that.data.firm
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        wx.hideNavigationBarLoading();
        switch (+res.data.code) {
          case 0:
            if (res.data.state) {
              wx.showToast({
                title: '新增成功',
                icon:'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  url: './listTake'
                })
              }, 1000)
            }
            break;
          case 1:
            wx.showToast({
              title: '连接超时',
              icon: 'loading'
            })
            break;
          case 2:
            wx.showModal({
              title: '提示',
              showCancel: false,
              confirmColor: '#a53f35',
              content: res.data.codeInfo
            })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmColor: '#a53f35',
          content: '您的网络似乎有点不顺畅哦'
        })
      }
    })

  },

  onLoad: function (options) {
  
  },

  onReady: function () {
  
  },

  onShow: function () {
    if (app.globalData.user != '' && app.globalData.user != undefined) {
      userID = app.globalData.user.userID
    };
    if (app.globalData.loginToken != '' && app.globalData.loginToken != undefined) {
      loginToken = app.globalData.loginToken;
      this.setData({
        loginToken: loginToken
      })
    }
  }

})