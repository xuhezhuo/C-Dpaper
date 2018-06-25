const app = getApp();
console.log(app.globalData);
var webhost = app.globalData.webhost;
var enID = app.globalData.enID;
var userID = '';
var loginToken = '';
var listShop;
var getTicket;

Page({
  data: {
    imgList: [],
    dataList: [],
    check: false,
    address: '',
    contacts: '',
    fax: '',
    introduction: '',
    name: '',
    tel: '',
    phone: '',
    connect: true,
    ticket: ''
  },

  // scan: function(){
  //   wx.scanCode({
  //     success: (res) => {
  //       console.log(res)
  //     }
  //   })
  // },

  reConnect: function(){
    listShop();
  },

  call: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.tel //仅为示例，并非真实的电话号码
    })
  },

  search: function(e){
    var str = e.detail.value;
    app.globalData.search = str;
    wx.switchTab({
      url: '../category/category'
    })
  },

  searchClick1: function(e){
    var warehouse = e.currentTarget.dataset.warehouse;
    app.globalData.area2 = warehouse;
    wx.switchTab({
      url: '../category/category'
    })
  },

  searchClick2: function (e) {
    var category = e.currentTarget.dataset.category;    
    app.globalData.search = category;    
    wx.switchTab({
      url: '../category/category'
    })
  },

  searchClick3: function (e) {
    var gname = e.currentTarget.dataset.gname;
    var warehouse = e.currentTarget.dataset.warehouse;
    app.globalData.area = warehouse;
    // console.log(e);
    // return false;
    app.globalData.gname = gname;  
    wx.switchTab({
      url: '../category/category'
    })
  },

  searchClick4: function (e) {
    var brand = e.currentTarget.dataset.brand;
    var warehouse = e.currentTarget.dataset.warehouse;
    // console.log(e);
    // return false;
    app.globalData.area = warehouse;
    app.globalData.brand = brand;  
    wx.switchTab({
      url: '../category/category'
    })
  },

  check: function(){
    var check = this.data.check;
    if (check == true) {
      this.setData({
        check: false
      })
    } else {
      this.setData({
        check: true
      })
    }
  },

  onLoad: function (options) {
    var that = this;

    if (options.referrerID) {
      app.globalData.referrerID = options.referrerID;
      console.log(options.referrerID);
    }

    if (options.scene){
      console.log(options.scene);
      // return false;
      var scene = decodeURIComponent(options.scene);
      var arr = scene.split('/');
      var referrerID = arr[1];
      app.globalData.referrerID = referrerID;
    }

    wx.showShareMenu({
      withShareTicket: true
    });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo;
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({ 
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    listShop = function(){
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "common/getShopIndex",
        data: {
          entID: enID,
          userID: '',
          loginToken: ''
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
              var bannerList = new Array();
              for (var i = 0; i < res.data.data.bannerList.length; i++) {
                var url = res.data.data.bannerList[i].imageUrl;
                var pattern1 = /null/g;
                var re1 = url.match(pattern1);
                console.log(re1);
                if(re1){
                  // var reg = new RegExp("null", "g");
                  // var url = str.replace(reg, "");
                  url = url.replace("null", "");
                  // console.log(url);
                }
                var pattern2 = /http/g;
                var re2 = url.match(pattern2);
                if( re2 ){
                  bannerList.push(url);
                } else {
                  bannerList.push('https://app.papersource.cn' + url);
                }
              }
              // 'https://qa.cndpp.com' + 
              that.setData({
                imgList: bannerList,
                dataList: res.data.data.recommenList,
                address: res.data.data.shopInfo.address,
                contacts: res.data.data.shopInfo.contacts,
                fax: res.data.data.shopInfo.fax,
                introduction: res.data.data.shopInfo.introduction,
                name: res.data.data.shopInfo.name,
                tel: res.data.data.shopInfo.tel,
                phone: res.data.data.shopInfo.phone
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
        }
      })
    }

    getTicket = function(){
      console.log('获取的地方'+ loginToken);
      wx.request({
        url: webhost + "common/getTicket",
        data: {
          loginToken: loginToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res);
          
          that.setData({
            connect: true
          })
          switch (+res.data.code) {
            case 0:
              app.globalData.ticket = res.data.data.ticket;
              that.setData({
                ticket: res.data.data.ticket
              })
              console.log('门票'+ that.data.ticket);
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
          console.log(res);          
          that.setData({
            connect: false
          })
          setTimeout(function(){
            listShop();
          }, 5000)
        }
      })
    };

    listShop();
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow: function () {
    if (app.globalData.user != undefined && app.globalData.user != '') {
      userID = app.globalData.user.userID
    };
    if (app.globalData.loginToken != undefined && app.globalData.loginToken != '') {
      loginToken = app.globalData.loginToken;
    };

    if (loginToken != '') {
      if(this.data.ticket == ''){
        console.log('获取门票！');
        getTicket();
      }
    }
  },

  onShareAppMessage: function () {
    var that = this;
    var url = '';
    if (app.globalData.referrerID) {
      url = '/pages/index/index?referrerID=' + app.globalData.referrerID
    } else {
      url = '/pages/index/index'
    }

    return {
      title: '纸源商城',
      path: url,
      success: function (res) {
        console.log(res);
        var wx_ticket = '';
        var target;
        if (res.shareTickets){
          // 获取转发详细信息
          // wx.getShareInfo({
          //   shareTicket: res.shareTickets[0],
          //   success(res) {
          //     console.log(res);
          //     res.errMsg; // 错误信息
          //     res.encryptedData; // 解密后为一个 JSON 结构（openGId  群对当前小程序的唯一 ID）
          //     res.iv; // 加密算法的初始向量
          //   },
          // });
          console.log(res.shareTickets[0]);
          if (res.shareTickets[0]){
            wx_ticket = res.shareTickets[0];
          }
          target = 'group';
        } else{
          target = 'person';
        }
        if(loginToken == ''){
          return false;
        }
        console.log('开始分享');
        console.log('分享参数以下');
        var data = {
          loginToken: loginToken,
          userID: userID,
          path: '/pages/index/index',
          target: target,
          'type': 'share',
          self_ticket: that.data.ticket,
          wx_ticket: wx_ticket
        }
        console.log(JSON.stringify(data));
        // return false;
        wx.request({
          url: webhost + "common/submitRecord",
          data: {
            loginToken: loginToken,
            userID: userID,
            path: '/pages/index/index',
            target: target,
            'type': 'share',
            self_ticket: that.data.ticket,
            wx_ticket: wx_ticket
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            console.log('分享成功');
            console.log(JSON.stringify(res));
            switch (+res.data.code) {
              case 0:
              
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
            console.log('分享失败');
            console.log(JSON.stringify(res));
            wx.showModal({
              title: '提示',
              showCancel: false,
              confirmColor: '#a53f35',
              content: '您的网络似乎有点不顺畅哦'
            })
          }
        })
      },
      fail: function (res) {
        console.log(res);        
      }
    }
  }
  
})
