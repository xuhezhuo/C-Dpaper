const app = getApp();
var webhost = app.globalData.webhost;

var loginToken = '';
var userID = '';
var getOrder;

Page({
  data: {
    accountNumber: '',
    bank: '',
    serviceTelephone: '',
    service: '',
    receiveCompany: '',
    receiver: '',
    orderStatus: '',
    qrcode: false,
    connect: true
  },

  reConnect: function () {
    getOrder();
  },

  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.serviceTelephone
    })
  },

  detail: function(){
    var that = this;
    wx.navigateTo({
      url: '../my/orderDetail?orderID=' + that.data.orderID
    })
  },

  index: function(){
    wx.switchTab({
      url: '../index/index'
    })
  },

  scan: function (e) {
    var that = this;
    var current = e.target.dataset.src;
    var imgList = [];
    imgList.push(current);
    wx.previewImage({
      // current: current, // 当前显示图片的http链接  
      urls: imgList // 需要预览的图片http链接列表  
    })
  },

  qrcode: function () {
    var that = this;
    if (that.data.qrcode) {
      that.setData({
        qrcode: false
      })
    } else {
      that.setData({
        qrcode: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderID = options.id;

    that.setData({
      orderID: orderID
    })

    getOrder = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "product/getOrderDetail",
        data: {
          loginToken: loginToken,
          orderID: orderID
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
                  receiver: res.data.data.receiver,
                  receiveCompany: res.data.data.receiveCompany,
                  bank: res.data.data.bank,
                  accountNumber: res.data.data.accountNumber,
                  // 出库信息
                  service: res.data.data.service,
                  serviceTelephone: res.data.data.serviceTelephone
                })
              } else {
                wx.showModal({
                  title: '提示',
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
          wx.hideNavigationBarLoading();
          that.setData({
            connect: false
          })
          setTimeout(function(){
            getOrder();
          },5000)
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
    getOrder();
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