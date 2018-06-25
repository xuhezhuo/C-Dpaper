const app = getApp();
var webhost = app.globalData.webhost;

var loginToken = '';
var userID = '';
var listOrder;

Page({
  data: {
    active: 0,
    left: 50,
    pageIndex: 1,    
    orderList: [],
    status: '',
    payStatus: '',
    loading: false,
    connect: true,
    time: 1
  },

  // NEW("新单据"),
  // VIEWED("已查看"),
  // TO_CONFIRMED("待确认"),
  // PENDING("待处理"),
  // PROCESSING("处理中"),
  // PROCESSED("已处理"),
  // ARCHIVED("已归档"),
  // CANCELED("已取消"),
  // INVALID("已失效"),
  // BREAK("已终止");

  reConnect: function () {
    listOrder();
  },

  detail: function(e){
    var orderID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './orderDetail?orderID=' + orderID
    })
  },

  cancelOrder: function(e){
    var orderID = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗',
      confirmColor: '#a53f35',
      success: function(res){
        if(res.confirm){
          wx.showNavigationBarLoading();
          wx.request({
            url: webhost + "product/cancelOrder",
            data: {
              userID: userID,
              loginToken: loginToken,
              orderID: orderID
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
                    wx.showToast({
                      title: '已取消该订单',
                      icon: 'success',
                      duration: 1000
                    })
                    that.setData({
                      pageIndex: 1,
                      orderList: []
                    })
                    listOrder();
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
              wx.showModal({
                title: '提示',
                showCancel: false,
                confirmColor: '#a53f35',
                content: '服务器异常'
              })
            }
          })
        }
      }
    })
  },

  confirmOrder: function(e){
    var orderID = e.currentTarget.dataset.id;
    var formId = e.detail.formId;
    console.log('formID='+formID);
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
              orderID: orderID,
              formId: formId
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
                    wx.showToast({
                      title: '订单已确认',
                      icon: 'success',
                      duration: 1000
                    })
                    that.setData({
                      pageIndex: 1,
                      orderList: []
                    })
                    listOrder();
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

  tab: function(e){
    var that = this;
    if(!that.data.loading){
      return false;
    }
    that.setData({
      pageIndex: 1,
      orderList: []
    })
    var tab = +e.currentTarget.dataset.tab;
    switch(tab){
      case 0: 
        that.setData({
          left: 50,
          active: 0,
          status: '',
          payStatus: ''
        });
        listOrder();        
        break;
      case 1: 
        that.setData({
          left: 242,
          active: 1,
          status: '',
          payStatus: 'PayDue'          
        });
        listOrder();        
        break;
      case 2: 
        that.setData({
          left: 432,
          active: 2,
          status: '' ,
          payStatus: 'PayMade'         
        });
        listOrder();        
        break;
      case 3:
        that.setData({
          left: 621,
          active: 3,
          status: 'TO_CONFIRMED' ,
          payStatus: ''         
        });
        listOrder();
        break;
    }
  },

  onLoad: function (options) {
    var that = this;

    if(options.tab){
      if(+options.tab == 1){
        that.setData({
          left: 242,
          active: 1,
          status: '',
          payStatus: 'PayDue'
        });
      }
      if (+options.tab == 3) {
        that.setData({
          left: 621,
          active: 3,
          status: 'TO_CONFIRMED',
          payStatus: '' 
        });
      }
    }

    listOrder = function(){
      that.setData({
        loading: false
      })
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "product/getOrderList",
        data: {
          userID: userID,
          loginToken: loginToken,
          status: that.data.status,
          payStatus: that.data.payStatus,
          pageIndex: that.data.pageIndex
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
                  loading: true,
                  orderList: (that.data.orderList).concat(res.data.data.orderList)
                })
              } else{
                wx.showModal({
                  title: '提示',
                  confirmColor: '#a53f35',
                  content: res.data.stateInfo
                })
              }
              that.setData({
                time: 2
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
            listOrder();
          },5000)
        }
      })
    }
    if (app.globalData.user != '' && app.globalData.user != undefined) {
      userID = app.globalData.user.userID
    };
    if (app.globalData.loginToken != '' && app.globalData.loginToken != undefined) {
      loginToken = app.globalData.loginToken;
      this.setData({
        loginToken: loginToken
      })
    }
    listOrder(); 
     
  },

  onReady: function () {
  
  },

  onShow: function () {
    var that = this;

    if(that.data.time != 1){
      console.log(that.data.time);
      that.setData({
        pageIndex: 1,
        orderList: []
      })
      listOrder();
    }
    // if (app.globalData.user != '' && app.globalData.user != undefined) {
    //   userID = app.globalData.user.userID
    // };
    // if (app.globalData.loginToken != '' && app.globalData.loginToken != undefined) {
    //   loginToken = app.globalData.loginToken;
    //   this.setData({
    //     loginToken: loginToken
    //   })
    // }
  },

  onHide: function () {
  
  },

  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      orderList: [],      
      pageIndex: 1
    })
    listOrder();
  },

  onReachBottom: function () {
    var that = this;
    that.setData({
      pageIndex: that.data.pageIndex + 1
    })
    listOrder();
  }
})