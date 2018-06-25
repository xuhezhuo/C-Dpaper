const app = getApp();
var webhost = app.globalData.webhost;
// console.log(app);
var md5 = require('../../utils/md5.js')    
 
var getOpenId;
Page({
  data: {
    account: '',
    password: '',
    urlType: '',
    fullName: '',
    orderID: ''
  },

  index: function(){
    wx.switchTab({
      url: '../index/index'
    })
  },

  bindAccountInput: function(e){
    this.setData({
      account: e.detail.value
    })
  },

  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  }, 

  // onGotUserInfo: function (e) {
  //   app.globalData.userInfo = e.detail.userInfo;
  // },

  Login: function (e){
    var that = this;
    var account = that.data.account;
    var password = that.data.password;    
    if (account == '' || password == ''){
      wx.showModal({
        title: '提示',
        content: '账号或密码不能为空',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }
    password = md5.hexMD5(password);
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "common/userLogin",
      data: {
        loginID: account,
        password: password
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        wx.hideNavigationBarLoading();
        switch(+res.data.code){
          case 0:
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1000
            });
            wx.setStorage({
              key: 'user',
              data: res.data.data.user
            })
            wx.setStorage({
              key: 'loginToken',
              data: res.data.data.loginToken
            })
            that.setData({
              loginToken: res.data.data.loginToken
            })
            if (!app.globalData.openId){
              getOpenId();
            }
            app.globalData.user = res.data.data.user;
            app.globalData.loginToken = res.data.data.loginToken; 
            // console.log(that.data.urlType);
            setTimeout(function(){
              if(that.data.urlType == ''){
                wx.switchTab({
                  url: '../index/index'
                })
              } else if (that.data.urlType == '1'){
                wx.switchTab({
                  url: '../category/category'
                })
              } else if (that.data.urlType == '2') {
                wx.switchTab({
                  url: '../cart/cart'
                })
              } else if (that.data.urlType == '3') {
                wx.switchTab({
                  url: '../my/my'
                })
              } else if (that.data.urlType == '6') {
                wx.navigateTo({
                  url: '../my/orderDetail?orderID=' + that.data.orderID
                })
              }  else{
                wx.navigateTo({
                  url: '../category/goodsdetail?fullName=' + that.data.fullName
                })
              }
            },1000);
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
          content: '连接失败，请检查网络'
        })
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    console.log(options);

    if (options.urlType){
      that.setData({
        urlType: options.urlType
      })
      if(options.fullName){
        that.setData({
          fullName: options.fullName
        })
      }
      if (options.orderID) {
        that.setData({
          orderID: options.orderID
        })
      }
    }

    var code = app.globalData.openCode;    

    getOpenId = function(){
      // return false;
      wx.request({
        url: webhost + "common/getOpenID",
        data: {
          loginToken: that.data.loginToken,
          code: code
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              app.globalData.openId = res.data.data.openid;
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
            content: '连接失败，请检查网络'
          })
        }
      })
    }
  }
})