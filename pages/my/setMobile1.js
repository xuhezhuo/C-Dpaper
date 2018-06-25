const app = getApp();
var webhost = app.globalData.webhost;

var userID = '';
var loginToken = '';
var getCode;

Page({
  data: {
    mobile: '',
    code: '',
    validateToken: '',
    timer: '发送验证码'
  },

  bindCode: function(e){
    this.setData({
      code: e.detail.value
    })
  },

  next: function(){
    var that = this;
    if (that.data.code == '') {
      wx.showModal({
        title: '提示',
        content: '请先填写验证码',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "common/verifyOldCellphone",
      data: {
        userID: userID,
        validateCode: that.data.code,
        validateToken: that.data.validateToken,
        loginToken: loginToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        wx.hideNavigationBarLoading()
        switch (+res.data.code) {
          case 0:
            if(res.data.state == 'true'){
              wx.showToast({
                title: '验证成功',
                icon: 'success',
                duration: 1000
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: './setMobile2'
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
          content: '您的网络似乎有点不顺畅哦'
        })
      }
    });
  },

  sentCode: function () {
    var that = this;
    if (that.data.timer != '发送验证码') {
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
 
  onLoad: function (options) {
    var that = this;
    that.setData({
      mobile: options.mobile
    })

    getCode = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "common/getValidateCode",
        data: {
          cellphone: that.data.mobile,
          validateCodeType: "VERIFY_OLD_CELL_PHONES"
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          wx.hideNavigationBarLoading();
          switch (+res.data.code) {
            case 0:
              if (res.data.state == 'true') {
                wx.showToast({
                  title: '发送成功',
                  icon: 'success',
                  duration: 1000
                });
                that.setData({
                  validateToken: res.data.data.validateToken
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
            content: '您的网络似乎有点不顺畅哦'
          })
        }
      })
    }

  },

  onShow: function () {
    userID = app.globalData.user.userID;
    loginToken = app.globalData.loginToken;
  }

})