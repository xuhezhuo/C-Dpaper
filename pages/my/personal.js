const app = getApp();
var webhost = app.globalData.webhost;

var userID = '';
var loginToken = '';

var getMyInfo;

Page({
  data: {
    headImg: '',
    buyerEnterpriseName: '',
    cellphone: '',
    realName: '',
    connect: true
  },

  reConnect: function () {
    getMyInfo();
  },

  onLoad: function (options) {
    var that = this;
    var src = app.globalData.userInfo.avatarUrl;
    that.setData({
      headImg: src
    })

    getMyInfo = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "common/getUserInfo",
        data: {
          userID: userID,
          loginToken: loginToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            connect: true
          })
          wx.hideNavigationBarLoading();
          switch (+res.data.code) {
            case 0:
              that.setData({
                buyerEnterpriseName: res.data.data.userInfo.buyerEnterpriseName,
                cellphone: res.data.data.userInfo.cellphone,
                realName: res.data.data.userInfo.realName
              })
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
          wx.hideNavigationBarLoading();
          that.setData({
            connect: false
          })
          setTimeout(function(){
            getMyInfo();
          },5000)
        }
      })
    }
  },

  setMobile: function(){
    wx.navigateTo({
      url: './setMobile1?mobile=' + this.data.cellphone
    })
  },

  setPwd: function () {
    wx.navigateTo({
      url: './setPwd?mobile=' + this.data.cellphone
    })
  },

  onShow: function () {
    if (app.globalData.user != '' && app.globalData.user != undefined) {
      userID = app.globalData.user.userID;
    };
    if (app.globalData.loginToken != '' && app.globalData.loginToken != undefined) {
      loginToken = app.globalData.loginToken;
      this.setData({
        loginToken: loginToken
      })
      getMyInfo();
    };
  }
})