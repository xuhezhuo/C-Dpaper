const app = getApp();
var webhost = app.globalData.webhost;
var loginToken = '';
var userID = '';
var listredPackage;

Page({
  data: {
    active: 0,
    left: 150,
    overtime: 2,
    pageIndex: 1,
    dataList: [],
    usableList: [],
    usedList: [],
    status: '未使用',
    connect: true
  },

  reConnect: function () {
    listredPackage();
  },

  tab: function (e) {
    var tab = +e.currentTarget.dataset.tab;
    switch (tab) {
      case 0:
        this.setData({
          left: 150,
          active: 0,
          dataList: this.data.usableList          
        });
        break;
      case 1:
        this.setData({
          left: 524,
          active: 1,
          dataList: this.data.usedList
        });
        break;
    }
  },

  onLoad: function (options) {
    var that = this;

    listredPackage = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "activity/cashstamplist",
        data: {
          userID: userID,
          loginToken: loginToken,
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
                var usableList = new Array();
                var usedList = new Array();
                for (var i = 0; i < res.data.data.cashStampSummary.length; i++) {
                  var item = res.data.data.cashStampSummary[i];
                  if (item.cashStampStatus == '过期') {
                    usedList.push(item);
                  } else {
                    usableList.push(item);
                  }
                }
                that.setData({
                  usableList: usableList,
                  usedList: usedList,
                  dataList: usableList
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
                content: res.res.data.codeInfo
              })
          }
        },
        fail: function (res) {
          wx.hideNavigationBarLoading();
          that.setData({
            connect: false
          })
          setTimeout(function(){
            listredPackage();
          },5000)
        }
      })
    }
  },

  onShow: function () {
    loginToken = app.globalData.loginToken;
    userID = app.globalData.user.userID;
    listredPackage();
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  }
})