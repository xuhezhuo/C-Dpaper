const app = getApp();
var webhost = app.globalData.webhost;
var loginToken = '';
var userID = '';
var listCollection;

Page({
  data: {
    collectList: [],
    connect: true
  },

  reConnect: function () {
    listCollection();
  },

  openDetail: function(e){
    var that = this;    
    var index = e.currentTarget.dataset.index
    var name = that.data.collectList[index].fullName;
    wx.navigateTo({
      url: '../category/goodsdetail?fullName=' + name
    })    
  },

  del: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index
    var id = that.data.collectList[index].id;
    wx.request({
      url: webhost + "activity/deleteFavorite",
      data: {
        userID: userID,
        loginToken: loginToken,
        favoriteId: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        switch (+res.data.code) {
          case 0:
            if (res.data.state) {
              wx.showToast({
                title: '取消收藏成功',
                icon: 'success',
                duration: 1000
              })
              listCollection();
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
          content: '您的网络似乎不太顺畅哦'
        })
      }
    })
  },

  onLoad: function (options) {
    var that = this;

    listCollection = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "activity/getFavorite",
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
              if(res.data.state){
                that.setData({
                  collectList: res.data.data
                })
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
          wx.hideNavigationBarLoading();
          that.setData({
            connect: false
          })
          setTimeout(function(){
            listCollection();
          }, 5000)
        }
      })
    }
  },

  onShow: function () {
    loginToken = app.globalData.loginToken;
    userID = app.globalData.user.userID;
    listCollection();
  }

})