const app = getApp();
var webhost = app.globalData.webhost;
var userID = '';
var loginToken = '';
var getAddress;

Page({
  data: {
    setting: false,
    addressID: '',
    dataList: [],
    connect: true
  },

  reConnect: function () {
    getAddress();
  },

  setting: function () {
    if (this.data.setting == false) {
      this.setData({
        setting: true
      })
    } else {
      this.setData({
        setting: false
      })
    }
  },

  take: function (e) {
    var that = this;
    var addressID = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    that.setData({
      addressID: addressID
    })
    if (that.data.setting) {
      return false;
    }
    var address = that.data.dataList[index];
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      address: address.address,
      addressID: address.addressID,
      linkman: address.linkman,
      telephone: address.addressID
    });
    wx.navigateBack({
      url: './orderInfo'
    })
  },

  cancel: function(){
    var that = this;
    that.setData({
      setting: false
    })
  },

  del: function () {
    var that = this;
    if (that.data.addressID == '') {
      wx.showModal({
        title: '提示',
        content: '请先选择要删除的信息',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.cancel) {
            // that.setData({
            //   setting: false
            // })
          }
        }
      })
      return false;
    }
    wx.request({
      url: webhost + "product/deleteShipBySellerInfo",
      data: {
        loginToken: loginToken,
        addressID: that.data.addressID
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
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
              that.setData({
                setting: false
              })
              getAddress();
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

  radioChange: function (e) {
    this.setData({
      addressID: e.detail.value
    })
  },

  addClick: function () {
    wx.navigateTo({
      url: './addAddress',
    })
  },

  onLoad: function (options) {
    var that = this;

    getAddress = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "product/showShipBySellerPage",
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
                that.setData({
                  dataList: res.data.data.shipBySellerInfoList
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
            getAddress();
          }, 5000)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (app.globalData.user != '' && app.globalData.user != undefined) {
      userID = app.globalData.user.userID
    };
    if (app.globalData.loginToken != '' && app.globalData.loginToken != undefined) {
      loginToken = app.globalData.loginToken;
      this.setData({
        loginToken: loginToken
      })
    }
    getAddress();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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