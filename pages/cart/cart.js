const app = getApp();
var webhost = app.globalData.webhost;

var userID = '';
var loginToken = '';

var getCart;

Page({
  data: {
    dataList: [],
    cartID: '',
    loading: false,
    totalPrice: 0,
    loginToken: '',
    connect: true
  },

  //重新连接
  reConnect: function () {
    getCart();
  },

  radioChange: function (e) {
    var that = this;
    var cartID = e.detail.value;
    var dataList = that.data.dataList;

    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].id == cartID) {
        var total = 0;
        var list = dataList[i].items;
        for (var j = 0; j < list.length; j++) {
          total += +list[j].amount;
        }
        that.setData({
          cartID: e.detail.value,
          totalPrice: (total).toFixed(2)
        })
        break;
      }
    }

  },

  login: function () {
    wx.showModal({
      title: '去登录',
      content: '现在去登录？',
      confirmColor: '#a53f35',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login?urlType=2'
          })
        }
      }
    })
  },

  setQuant: function (e) {
    if (e.detail.value == '') {
      wx.showModal({
        title: '提示',
        content: '数量不能为空',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }
    var that = this;
    var cartID = e.currentTarget.dataset.cartid;
    var orderItemID = e.currentTarget.dataset.orderid;
    var unitId = e.currentTarget.dataset.unitid;
    var cartProducts = [{
      orderItemID: orderItemID,
      quantity: +e.detail.value,
      unitID: unitId,
      remark: ''
    }];
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    })
    wx.request({
      url: webhost + "product/submitCart",
      data: {
        userID: userID,
        cartID: cartID,
        cartProductStr: JSON.stringify(cartProducts),
        loginToken: loginToken
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
              getCart();
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
  },

  setUnit: function (e) {
    console.log(e);
    var that = this;
    var cartID = e.currentTarget.dataset.cartid;
    var orderItemID = e.currentTarget.dataset.orderid;
    var unitId = e.currentTarget.dataset.unitid;
    var quantity = e.currentTarget.dataset.quantity;
    var cartProducts = [{
      orderItemID: orderItemID,
      quantity: quantity,
      unitID: unitId,
      remark: ''
    }];
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    })
    wx.request({
      url: webhost + "product/submitCart",
      data: {
        userID: userID,
        cartID: cartID,
        cartProductStr: JSON.stringify(cartProducts),
        loginToken: loginToken
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
              getCart();
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
  },

  del: function (e) {
    var cartID = e.currentTarget.dataset.cartid;
    var orderItemID = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '提示',
      content: '确定要移除该商品？',
      confirmColor: '#a53f35',
      success: function (res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          wx.request({
            url: webhost + "product/deleteCartItem",
            data: {
              userID: userID,
              loginToken: loginToken,
              cartID: cartID,
              orderItemID: orderItemID
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              wx.hideNavigationBarLoading();
              switch (+res.data.code) {
                case 0:
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                  })
                  getCart();
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

  onHide: function () {
    this.setData({
      cartID: ''
    })
  },

  buy: function () {
    var that = this;
    var cartID = that.data.cartID;
    var dataList = that.data.dataList;
    if (cartID == '') {
      wx.showModal({
        title: '提示',
        content: '请先选择想要购买的商品',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }
    var productList = new Array();
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].id == cartID) {
        var productList = dataList[i];
        break;
      }
    }
    var itemList = productList.items;
    //判断是否有已下架商品 
    for (var k = 0; k < itemList.length; k++) {
      if (itemList[k].moved) {
        wx.showModal({
          title: '提示',
          content: '请先删除已下架商品',
          confirmColor: '#a53f35',
          showCancel: false
        })
        return false;
      }
    }
    var cartProducts = new Array();
    for (var j = 0; j < itemList.length; j++) {
      var item = {};
      item.orderItemID = itemList[j].id;
      item.quantity = itemList[j].quantity;
      item.unitID = itemList[j].unitId;
      item.remark = '';
      cartProducts.push(item);
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "product/submitCart",
      data: {
        userID: userID,
        cartID: cartID,
        cartProductStr: JSON.stringify(cartProducts),
        loginToken: loginToken
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
              wx.navigateTo({
                url: './orderInfo?cartID=' + that.data.cartID
              })
            } else {
              wx.showModal({
                title: '提示',
                showCancel: false,
                confirmColor: '#a53f35',
                content: res.data.stateInfo
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
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmColor: '#a53f35',
          content: '您的网络似乎有点不顺畅哦'
        })
      }
    })
  },

  cut: function (e) {
    var cartID = e.currentTarget.dataset.cartid;
    var orderItemID = e.currentTarget.dataset.orderid;
    var Max = e.currentTarget.dataset.max;
    wx.navigateTo({
      url: './cut?id=' + cartID + '&orderItemID=' + orderItemID + '&Max=' + Max
    })
  },

  onLoad: function (options) {
    var that = this;

    getCart = function () {
      wx.showNavigationBarLoading();
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
          that.setData({
            connect: true
          })
          wx.hideNavigationBarLoading();
          switch (+res.data.code) {
            case 0:
              if (res.data.state) {
                var data = res.data.data;
                if (data.length != 0) {
                  var total = 0;
                  var list = data[0].items;
                  for (var j = 0; j < list.length; j++) {
                    total += +list[j].amount;
                  }
                  that.setData({
                    cartID: data[0].id,
                    totalPrice: (total).toFixed(2)
                  })
                  for (var k = 0; k < data.length; k++) {
                    for (var l = 0; l < data[k].items.length; l++) {
                      data[k].items[l].amount = (data[k].items[l].amount).toFixed(2);
                    }
                  }
                }
                that.setData({
                  dataList: data,
                  loading: true
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
          setTimeout(function () {
            getCart();
          }, 5000)
        }
      })
    }

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
      getCart();
    } else {
      this.setData({
        loginToken: '',
        dataList: []
      })
    };
  },

  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})