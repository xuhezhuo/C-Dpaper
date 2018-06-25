const app = getApp();
var webhost = app.globalData.webhost;

var loginToken = '';
var entID = '';
var userID = '';

var listCoupon;

Page({
  data: {
    active: 0,
    left: 86,
    usableList: [],
    usable: 0,
    usedList: [],
    used: 0,
    overtimeList: [],
    overtime: 0,
    dataList: [],
    code: '',
    total: 0,
    amount: 0,
    connect: true
  },

  reConnect: function () {
    listCoupon();
  },

  tab: function (e) {
    var tab = +e.currentTarget.dataset.tab;
    switch (tab) {
      case 0:
        this.setData({
          left: 86,
          active: 0,
          dataList: this.data.usableList
        });
        break;
      case 1:
        this.setData({
          left: 332,
          active: 1,
          dataList: this.data.usedList
        });
        break;
      case 2:
        this.setData({
          left: 584,
          active: 2,
          dataList: this.data.overtimeList
        });
        break;
    }
  },

  bindCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  Take: function(e){
    var that = this;
    if(that.data.active == 1){
      wx.showModal({
        title: '提示',
        content: '该优惠券已被使用',
        confirmColor: '#a53f35'
      })
    };
    if (that.data.active == 2) {
      wx.showModal({
        title: '提示',
        content: '该优惠券已过期',
        confirmColor: '#a53f35'
      })
    };
    var index = e.currentTarget.dataset.index;
    var data = that.data.dataList[index];
    if (data.type == 'ManJian'){
      if(data.manJian > that.data.total ){
        wx.showModal({
          title: '提示',
          content: '未达到满减条件',
          confirmColor: '#a53f35'
        })
        return false;
      }
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      couponsId: data.id,
      couponValue: data.value,
      couponType: data.type
    });
    wx.navigateBack({
      url: './orderInfo'
    })
  },

  exchange: function () {
    var that = this;
    if (that.data.code == '') {
      wx.showModal({
        title: '提示',
        content: '请先输入兑换码',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "activity/exchangeCoupon",
      data: {
        userID: userID,
        loginToken: loginToken,
        entID: entID,
        code: that.data.code
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
                title: '兑换成功',
                icon: 'success',
                duration: 1000
              })
              listCoupon();
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

  onLoad: function (options) {
    var that = this;

    that.setData({
      amount: options.amount,
      total: options.total
    });

    listCoupon = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "activity/couponList",
        data: {
          loginToken: loginToken,
          entID: entID
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
                var usableList = new Array();
                var usedList = new Array();
                var overtimeList = new Array();
                for (var i = 0; i < res.data.data.length; i++) {
                  var item = {};
                  item.time = res.data.data[i].end_time.substring(0, 10);
                  item.id = res.data.data[i].id;
                  item.is_enable = res.data.data[i].is_enable;
                  item.name = res.data.data[i].name;
                  item.remark = res.data.data[i].remark.replace(new RegExp("<br/>", "gm"), "\n");
                  item.type = res.data.data[i].type;
                  item.value = res.data.data[i].value;
                  if (item.is_enable == 'Usable') {
                    usableList.push(item);
                  } else if (item.is_enable == 'Used') {
                    usedList.push(item);
                  } else {
                    overtimeList.push(item);
                  }
                }
                that.setData({
                  usableList: usableList,
                  usedList: usedList,
                  overtimeList: overtimeList
                })
                that.setData({
                  usable: that.data.usableList.length,
                  used: that.data.usedList.length,
                  overtime: that.data.overtimeList.length
                })
                if (that.data.active == 0) {
                  that.setData({
                    dataList: usableList
                  })
                } else if (that.data.active == 1) {
                  that.setData({
                    dataList: usedList
                  })
                } else {
                  that.setData({
                    dataList: overtimeList
                  })
                }
              }
              console.log(that.data.dataList);
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
            listCoupon();
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
    loginToken = app.globalData.loginToken;
    entID = app.globalData.user.buyerEnterpriseID;
    userID = app.globalData.user.userID;
    listCoupon();
  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  }

})