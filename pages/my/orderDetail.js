const app = getApp();
var webhost = app.globalData.webhost;

var loginToken = '';
var userID = '';
var getOrder;

Page({
  data: {
    orderID: '',
    productList: [],
    accountNumber: '',
    bank: '',
    buyerAddress: '',
    buyerLinkman: '',
    buyerName: '',
    buyerTelephone: '',
    shipExpenseMode: '',
    carryExpenseMode: '',
    consignmentDesc: '',
    orderTotal: '',
    serviceTelephone: '',
    service: '',
    receiveCompany: '',
    receiver: '',
    orderStatus: '',
    qrcode: false,
    connect: true,
    shipByBuyer: '',
    vehicleNumber: '',
    driver: '',
    driverTelephone: ''
  },

  reConnect: function () {
    getOrder();
  },

  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.serviceTelephone
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

  index: function(){
    wx.switchTab({
      url: '../index/index',
    })
  },

  //确认订单 
  confirmOrder: function (e) {
    var that = this;
    var formID = e.detail.formId;
    console.log('formID=' + formID);
    // return false;
    wx.showModal({
      title: '提示',
      content: '确认提交该订单',
      confirmColor: '#a53f35',
      success: function (res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          wx.request({
            url: webhost + "product/confirmOrder",
            data: {
              userID: userID,
              loginToken: loginToken,
              orderID: that.data.orderID,
              formId: formID
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              console.log(res);
              wx.hideNavigationBarLoading();
              switch (+res.data.code) {
                case 0:
                  if (res.data.state) {
                    wx.showToast({
                      title: '订单已确认',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(function(){
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1000)
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
              wx.showNavigationBarLoading();              
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderID = options.orderID;
    // var orderID = 1271507251;
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
          // orderID: 1271507251
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
                  buyerName: res.data.data.buyerName,
                  buyerLinkman: res.data.data.buyerLinkman,
                  buyerTelephone: res.data.data.buyerTelephone,
                  buyerAddress: res.data.data.buyerAddress,
                  shipExpenseMode: res.data.data.shipExpenseMode, //供方承担
                  carryExpenseModeChanged: res.data.data.carryExpenseModeChanged ,//
                  carryExpenseMode: res.data.data.carryExpenseMode, //
                  productList: res.data.data.productList,
                  orderTotal: res.data.data.orderTotal,
                  orderTotalChanged: res.data.data.orderTotalChanged,
                  receiver: res.data.data.receiver,
                  orderStatus: res.data.data.orderStatus,
                  receiveCompany: res.data.data.receiveCompany,
                  bank: res.data.data.bank,
                  accountNumber: res.data.data.accountNumber,
                  // 出库信息
                  consignmentDesc: res.data.data.consignmentDesc, //
                  shipmentStatus: res.data.data.shipmentStatus,
                  service: res.data.data.service,
                  serviceTelephone: res.data.data.serviceTelephone,
                  shipByBuyer: res.data.data.shipByBuyer,
                  vehicleNumber: res.data.data.vehicleNumber,
                  driver: res.data.data.driver,
                  driverTelephone: res.data.data.driverTelephone
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
              if (res.data.codeInfo == 'loginToken不允许为空'){
                wx.showModal({
                  title: '提示',
                  confirmColor: '#a53f35',
                  content: '请先登录',
                  success: function(res){
                    if(res.confirm){
                      wx.navigateTo({
                        url: '../login/login?urlType=6&orderID=' + that.data.orderID
                      })
                    }
                  }
                })
                return false;
              }
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