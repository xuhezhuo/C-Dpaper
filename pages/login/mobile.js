const app = getApp();
var webhost = app.globalData.webhost;
var md5 = require('../../utils/md5.js');  
var getCode;
var Login;
var getOpenId;

Page({
  data: {
    timer: '发送验证码',
    mobile: '',
    read: false,
    code: ''
  },

  aa: function(e){
    console.log(e);
    var that = this;
    if(that.data.read){
      that.setData({
        read: false
      })
    } else{
      that.setData({
        read: true
      })
    }
  },

  bindMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    });
  },

  sentCode: function(){
    var that = this;
    if (that.data.timer != '发送验证码') {
      return false;
    }
    if(that.data.mobile == ''){
      wx.showModal({
        title: '提示',
        content: '请先填写手机号码',
        confirmColor: '#a53f35'
      })
      return false;
    }
    getCode();  
    var time = 60;
    var setTime = function () {
      if (time > 0) {
        setTimeout(function () {
          time--;
          that.setData({
            timer: '还剩' + time + '秒'
          })
          setTime();
        }, 1000);
      } else {
        that.setData({
          timer: '发送验证码'
        })
      }
    }
    setTime();
  },

  register: function(){
    var that = this;
    // console.log(that.data.validateToken);    
    if(that.data.code == ''){
      wx.showModal({
        title: '提示',
        content: '请先填写验证码',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }
    if(!that.data.read){
      wx.showModal({
        title: '提示',
        content: '请先阅读并同意服务条款',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }
    var password = md5.hexMD5(that.data.password);
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "common/userRegister",
      data: {
        cellphone: that.data.mobile,
        eMail: that.data.eMail,
        buyerEnterpriseName: that.data.buyerEnterpriseName,
        password: password,
        pwdRepeat: password,
        realName: that.data.realName,
        validateCode: that.data.code,
        validateToken: that.data.validateToken        
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        wx.hideNavigationBarLoading();
        // console.log(res);
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 1000
            });

            setTimeout(function(){
              Login();              
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
          content: '服务器异常'
        })
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      buyerEnterpriseName: options.buyerEnterpriseName,
      eMail: options.eMail,
      password: options.password,
      realName: options.realName
    })

    getCode = function() {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "common/getValidateCode",
        data: {
          cellphone: that.data.mobile,
          validateCodeType: "REG"
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          wx.hideNavigationBarLoading();
          console.log(res);
          switch (+res.data.code) {
            case 0:
              wx.showToast({
                title: '发送成功',
                icon: 'success',
                duration: 1000
              });
              that.setData({
                validateToken: res.data.data.validateToken
              })
              console.log(that.data.validateToken);
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
                confirmColor: '#a53f35',
                content: res.codeInfo
              })
          }
        },
        fail: function (res) {
          console.log(res);
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#a53f35',
            content: '服务器异常'
          })
        }
      })
    }

    Login = function() {
      var password = md5.hexMD5(that.data.password)
      wx.request({
        url: webhost + "common/userLogin",
        data: {
          loginID: that.data.mobile,
          password: password
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              app.globalData.user = res.data.data.user;
              app.globalData.loginToken = res.data.data.loginToken;
              that.setData({
                loginToken: res.data.data.token
              })  
              if (!app.globalData.openId) {
                getOpenId();
              }
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 200);
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
                showCancel:false,
                confirmColor: '#a53f35',
                content: res.codeInfo
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

    var code = app.globalData.openCode;
    // console.log(code);

    getOpenId = function () {
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