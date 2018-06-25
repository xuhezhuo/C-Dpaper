const app = getApp();
var webhost = app.globalData.webhost;

var userID = '';
var loginToken = '';

var getMyInfo;
var getMsg;
var getCart;

Page({
  data: {
    headImg: '../images/head.png',
    buyerEnterpriseName: '',
    cellphone: '',
    levelName: '',
    unConfirm: 0,
    unPay: 0,
    currentPoint: 0,
    msgSize: 0,
    cartSize: 0,
    loginToken: '',
    connect: true
  },

  reConnect: function () {
    getMyInfo();
    getMsg();
    getCart();
  },

  openConfirmWin: function(){
    if(loginToken == ''){
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    }
    wx.navigateTo({
      url: './listOrder?tab=3'
    })
  },

  openPayWin: function () {
    if (loginToken == '') {
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    }
    wx.navigateTo({
      url: './listOrder?tab=1'
    })
  },

  openCartWin: function () {
    if (loginToken == '') {
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    }
    wx.switchTab({
      url: '../cart/cart'
    })
  },

  openMsgWin: function(){
    if (loginToken == '') {
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    }
    wx.navigateTo({
      url: './listMsg',
    })
  },

  openAddressWin: function () {
    if (loginToken == '') {
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    }
    wx.navigateTo({
      url: './listAddress'
    })
  },

  openOrderWin: function () {
    if (loginToken == '') {
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    }
    wx.navigateTo({
      url: './listOrder'
    })
  },

  openCollectionWin: function () {
    if (loginToken == '') {
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    }
    wx.navigateTo({
      url: './listCollection'
    })
  },

  openPersonalWin: function () {
    if (loginToken == '') {
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    }
    wx.navigateTo({
      url: './personal'
    })
  },

  openRedpackageWin: function () {
    if (loginToken == '') {
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    } 
    wx.navigateTo({
      url: './listRedpackage'
    })
  },

  onGotUserInfo: function (e) {
    var that = this;
    console.log(e);
    if (e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo;
      that.setData({
        headImg: e.detail.userInfo.avatarUrl
      });
    }
  },

  openCouponWin: function () {
    if (loginToken == '') {
      wx.showModal({
        title: '未登录',
        content: '现在去登录？',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=3'
            })
          }
        }
      })
      return false;
    }
    wx.navigateTo({
      url: './listCoupon'
    })
  },

  openAboutWin: function () {
    wx.navigateTo({
      url: './aboutUs'
    })
  },

  login: function () {
    wx.navigateTo({
      url: '../login/login?urlType=3'
    })
  },

  logout: function(){
    var that = this;
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录？',
      confirmColor: '#a53f35',      
      success: function(res){
        if(res.confirm){
          wx.request({
            url: webhost + "common/userLogout",
            data: {
              loginToken: loginToken
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
                      title: '退出登录成功!',
                      icon: 'success',
                      duration: 1000
                    })
                    app.globalData.loginToken = '';
                    app.globalData.user = '';
                    that.setData({
                      unConfirm: 0,
                      unPay: 0,
                      msgSize: 0,
                      cartSize: 0,
                      loginToken: ''
                    })
                    // app.globalData.openId = '';
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../index/index'
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
                content: '您的网络似乎有点不顺畅哦'
              })
            }
          })
        }
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    
    if (app.globalData.userInfo != null){
      var src = app.globalData.userInfo.avatarUrl;
      that.setData({
        headImg: src
      });
    }

    getMyInfo = function(){
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
                levelName: res.data.data.userInfo.levelName,
                unConfirm: res.data.data.userInfo.unConfirm,
                unPay: res.data.data.userInfo.unPay,
                currentPoint: res.data.data.userInfo.currentPoint
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
          }, 5000)
        }
      })
    }

    getMsg = function () {
      wx.request({
        url: webhost + "common/getMessageList",
        data: {
          userID: userID,
          loginToken: loginToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              var msgSize = 0;
              for (var i = 0; i < res.data.data.messageList.length; i++) {
                if (!res.data.data.messageList[i].read) {
                  msgSize++;
                }
              }
              that.setData({
                msgSize: msgSize
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
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#a53f35',
            content: '服务器异常'
          })
        }
      })
    }

    getCart = function () {
      wx.request({
        url: webhost + "product/getCart",
        data: {
          userID: userID,
          loginToken: loginToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                cartSize: res.data.data.length
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
                content: res.codeInfo
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
    }

  },

  onShow: function () {
    if (app.globalData.user != '' && app.globalData.user != undefined) {
      userID = app.globalData.user.userID
    };
    if (app.globalData.loginToken != undefined) {
      loginToken = app.globalData.loginToken;
      this.setData({
        loginToken: loginToken
      })
      if(loginToken != ''){
        getMyInfo();
        getMsg();
        getCart();
      }
    } else{
      this.setData({
        loginToken: ''
      })
    };
  }

})