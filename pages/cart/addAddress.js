const app = getApp();
var area = require('../../utils/area.js');
var proList = area.proList;
var cityList = area.cityList;
var distList = area.distList;
var webhost = app.globalData.webhost;
var userID = '';
var loginToken = '';

Page({
  data: {
    name: '',
    contact: '',
    mobile: '',
    post: '',
    proList: proList,
    cityList: cityList,
    distList: distList,
    pro: '请选择省份',
    city: '请选择市',
    dist: '请选择区',
    areaID: '',
    address: ''
  },

  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  bindContact: function (e) {
    this.setData({
      contact: e.detail.value
    })
  },

  bindMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  bindPost: function (e) {
    this.setData({
      post: e.detail.value
    })
  },

  bindAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  bindProChange: function (e) {
    var that = this;
    var index = e.detail.value;
    that.setData({
      pro: that.data.proList[index].codeName
    })
    var id = that.data.proList[index].codeValue;
    var newList = [];
    for (var i = 0; i < cityList.length; i++) {
      if (cityList[i].codeFilter == id) {
        newList.push(cityList[i]);
      }
    }
    that.setData({
      cityList: newList,
      city: newList[0].codeName
    })
    var filter = newList[0].codeValue
    var newList2 = [];
    for (var i = 0; i < distList.length; i++) {
      if (distList[i].codeFilter == filter) {
        newList2.push(distList[i]);
      }
    }
    that.setData({
      distList: newList2,
      dist: newList2[0].codeName,
      areaID: newList2[0].codeValue
    })
  },

  bindCityChange: function(e){
    var that = this;
    var index = e.detail.value;
    that.setData({
      city: that.data.cityList[index].codeName
    })
    var id = that.data.cityList[index].codeValue;
    var newList = [];
    for (var i = 0; i < distList.length; i++) {
      if (distList[i].codeFilter == id) {
        newList.push(distList[i]);
      }
    }
    that.setData({
      distList: newList,
      dist: newList[0].codeName,
      areaID: newList[0].codeValue      
    })
  },

  bindDistChange: function(e) {
    var that = this;
    var index = e.detail.value;
    that.setData({
      dist: that.data.distList[index].codeName,
      areaID: that.data.distList[index].codeValue
    })
  },

  addClick: function () {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "product/addShipBySellerInfo",
      data: {
        userID: userID,
        loginToken: loginToken,
        linkMan: that.data.contact,
        postCode: that.data.post,
        telephone: that.data.mobile,
        defaultFlag: 'true',
        address: that.data.address,
        areaID: that.data.areaID
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
                title: '新增成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function(){
                wx.navigateBack({
                  url: './listAddress'
                })
              },1000)
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
    }
  }

})