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


  bindMobiel: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  bindCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  sentCode: function () {
    var that = this;
    if (that.data.timer != '发送验证码') {
      return false;
    }
    if (that.data.mobile == '' || that.data.code == '') {
      wx.showModal({
        title: '提示',
        content: '请先填写手机号码或验证码',
        confirmColor: '#a53f35',
        showCancel: false
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

  setting: function(){
    var that = this;
    if (that.data.code == '' || that.data.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '请先填写手机号或验证码',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "common/verifyNewCellphone",
      data: {
        userID: userID,
        newCellphone: that.data.mobile,
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
            if (res.data.state == 'true') {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000
              });
              setTimeout(function () {
                wx.switchTab({
                  url: './my'
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

  onLoad: function (options) {
    var that = this;

    getCode = function () {
      if(that.data.mobile == ''){
        wx.showModal({
          title: '提示',
          content: '请先填写手机号码',
          confirmColor: '#a53f35',
          showCancel: false
        })
        return false;
      }
      wx.request({
        url: webhost + "common/getValidateCode",
        data: {
          cellphone: that.data.mobile,
          validateCodeType: "VERIFY_NEW_CELL_PHONES"
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
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
                content: res.codeInfo
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