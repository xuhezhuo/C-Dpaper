const app = getApp();
var webhost = app.globalData.webhost;
var enID = app.globalData.enID;

var userID = '';
var loginToken = '';

var listProduct;
var categoryFilter;
var getTicket;

Page({
  data: {
    categoryList: [],
    category: '',    
    brandList: [],
    brand: '',
    gramList: [],
    gram: '',
    areaList: '',
    area: '',
    levelList: '',
    level: '',
    scaleList: [],
    scale: '', 
    gList: [],
    gory: '',
    gNameList: [],
    gName: '',

    active: '',
    sliderLeft: '',
    sliderOffset: '',
    search: '',
    
    productList: [],
    loginToken: loginToken,

    search1: false,
    search2: false,
    filter: false,
    windowWidth: '',
    pageIndex: 0,
    loading: false,
    noMore: true,
    connect: true,
    ticket: ''
  },

  //重新连接
  reConnect: function () {
    listProduct();
  },

  //搜索框搜索
  bindSearchName: function(e){
    this.setData({
      search: e.detail.value
    })
  },

  //确定搜索 
  search: function (e) {
    var that = this;
    that.setData({
      noMore: true,
      productList: [],
      pageIndex: 0,
      area: '',
      gory: '',
      gram: '',
      active: '',
      level: '',
      scale: '',
      gName: '',
      category: '',
      brand: ''
    })
    listProduct();
  },

  // 品牌筛选
  checkBrand: function (e) {
    var that = this;
    that.setData({
      noMore: true,      
      productList: [],
      pageIndex: 0
    })
    var brand = e.currentTarget.dataset.brand;
    that.setData({
      brand: brand,
      search1: false,
      // area: '',
      // level: '',
      // scale: '',
      // gory: '',
      // gName: ''      
    });
    listProduct();
  },

  //克重筛选 
  checkGram: function(e){
    var that = this;
    that.setData({
      noMore: true,      
      productList: [],
      pageIndex: 0
    })
    var gram = e.currentTarget.dataset.gram;
    that.setData({
      gram: gram,
      search2: false,
      // area: '',
      // level: '',
      // scale: '',
      // gory: '',
      // gName: ''     
    });
    listProduct();
  },

  // 品牌筛选弹窗
  brandSearch: function(){
    var search = this.data.search1;
    if (search == true) {
      this.setData({
        search1: false
      })
    } else {
      this.setData({
        search1: true,
        search2: false,
        filter: false
      })
    }
  },

  openDetailWin: function(e){
    var fullName = e.currentTarget.dataset.fullname;
    var area = e.currentTarget.dataset.area;
    // console.log(e);
    // return false;
    wx.navigateTo({
      url: './goodsdetail?fullName=' + fullName + '&area=' + area
    })
  },

  weightSearch: function () {
    var search = this.data.search2;
    if (search == true) {
      this.setData({
        search2: false
      })
    } else {
      this.setData({
        search2: true,
        search1: false,
        filter: false
      })
    }
  },

  filterClick: function () {
    var filter = this.data.filter;
    if (filter == true) {
      this.setData({
        filter: false
      })
    } else {
      this.setData({
        filter: true,
        search2: false,
        search1: false
      })
    }
  },

  stopFilter: function(){
    this.setData({
      filter: false
    })
  },

  tabClick: function(e){
    var that = this;
    that.setData({
      noMore: true,      
      productList: [],
      pageIndex: 0
    })
    var active =  e.currentTarget.dataset.index;
    var category = e.currentTarget.dataset.category;    
    that.setData({
      active: active,
      category: category,
      brand: '',
      gram: '',
      area: '',
      level: '',
      scale: '',
      gory: '',
      gName: ''
    })
    listProduct();
  },

  tabClick2: function (e) {
    var that = this;
    that.setData({
      noMore: true,      
      productList: [],
      pageIndex: 0
    })
    this.setData({
      active: '',
      category: '',
      brand: '',
      gram: '',
      area: '',
      level: '',
      scale: '',
      gory: '',
      gName: ''
    })
    listProduct();
  },

  bindGory: function(e){
    var that = this;
    var gory = e.currentTarget.dataset.gory;
    if( that.data.gory == gory){
      this.setData({
        gory: ''
      })
    } else{
      this.setData({
        productList: [],
        gory: gory,
        area: '',
        level: '',
        scale: '',
        gName: '',
        pageIndex: 0        
      })
    }
    listProduct();
  },

  bindGName: function (e) {
    var that = this;
    var gName = e.currentTarget.dataset.gname;
    if (that.data.gName == gName) {
      this.setData({
        gName: ''
      })
    } else {
      this.setData({
        productList: [],
        gName: gName,
        pageIndex: 0        
      })
    }
    listProduct();    
  },

  bindScale: function (e) {
    var that = this;
    var scale = e.currentTarget.dataset.scale;
    if (that.data.scale == scale) {
      this.setData({
        scale: ''
      })
    } else {
      this.setData({
        productList: [],
        scale: scale,
        pageIndex: 0        
      })
    }
    listProduct();    
  },

  bindLevel: function (e) {
    var that = this;
    var level = e.currentTarget.dataset.level;
    if (that.data.level == level) {
      this.setData({
        level: ''
      })
    } else {
      this.setData({
        productList: [],
        level: level,
        pageIndex: 0        
      })
    }
    listProduct();    
  },

  bindArea: function (e) {
    var that = this;
    var area = e.currentTarget.dataset.area;
    if (that.data.area == area) {
      this.setData({
        area: ''
      })
    } else {
      this.setData({
        area: area,
        productList: [],
        pageIndex: 0
      })
    }
    listProduct();    
  },

  finishFilter: function(){
    var that = this;
    that.setData({
      filter: false,
      // productList: [],
      // pageIndex: 0
    });
    // listProduct();
  },

  reset: function(){
    this.setData({
      area: '',
      level: '',
      scale: '',
      gory: '',
      gName: '',
      productList: [],
      pageIndex: 0
    })
    listProduct();
  },

  openLoginWin: function(){
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route;
    console.log(url);
    wx.showModal({
      title: '未登录',
      content: '现在去登录？',
      confirmColor: '#a53f35',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login?urlType=1',
          })
        }
      }
    })
  },

  onShow: function () {
    var that = this;
    
    if (app.globalData.user != '' && app.globalData.user != undefined) {
      userID = app.globalData.user.userID
    };
    if (app.globalData.loginToken != undefined) {
      loginToken = app.globalData.loginToken;
      this.setData({
        loginToken: loginToken
      })
    };
    if (loginToken != '') {
      if (!app.globalData.ticket){
        getTicket();        
      } else{
        that.setData({
          ticket: app.globalData.ticket
        })
      }
    }
    if (app.globalData.search != '' || app.globalData.area != '' || app.globalData.category != '' || app.globalData.gname != '' || app.globalData.brand != '' || app.globalData.area2 != '' ){
      if (app.globalData.search != ''){
        that.setData({
          search: app.globalData.search,
          productList: [],
          brand: '',
          area: '',
          gory: '',
          gram: '',
          active: '',
          level: '',
          scale: '',
          gName: '',
          category: '',
          pageIndex: 0
        });
        app.globalData.search = '';        
      }
      if (app.globalData.area2 != '') {
        that.setData({
          brand: '',
          gory: '',
          gram: '',
          active: '',
          level: '',
          scale: '',
          gName: '',
          category: '',
          area: app.globalData.area2,
          search: '',
          productList: [],
          pageIndex: 0
        });
        app.globalData.area2 = '';        
      }
      if (app.globalData.category != '') {
        that.setData({
          category: app.globalData.category,
          productList: [],
          pageIndex: 0,
          brand: '',
          area: '',
          gory: '',
          gram: '',
          active: '',
          level: '',
          scale: '',
          gName: '',
        });
        app.globalData.category = '';
      }
      if (app.globalData.gname != '') {
        that.setData({
          brand: '',
          area: app.globalData.area,
          gram: '',
          active: '',
          level: '',
          scale: '',
          gName: '',
          category: '',
          gory: app.globalData.gname,
          search: '',
          productList: [],
          pageIndex: 0
        });
        app.globalData.gname = ''; 
        app.globalData.area = '';        
      }
      if (app.globalData.brand != '') {
        that.setData({
          area: app.globalData.area,
          gory: '',
          gram: '',
          active: '',
          level: '',
          scale: '',
          gName: '',
          category: '',
          brand: app.globalData.brand,
          search: '',
          productList: [],
          pageIndex: 0
        });
        app.globalData.brand = '';        
        app.globalData.area = '';        
      }  
      console.log(that.data.area);
      listProduct();
    }
  },

  onLoad: function (options) {
    var that = this;

    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var arr = scene.split('/');
      var referrerID = arr[1];
      app.globalData.referrerID = referrerID;
    }

    if (options.referrerID) {
      app.globalData.referrerID = options.referrerID;
      console.log(options.referrerID);
    }

    wx.showShareMenu({
      withShareTicket: true
    });

    listProduct = function(){
      that.setData({
        loading: false
      })
      wx.showNavigationBarLoading()
      wx.request({
        url: webhost + "product/getProductList",
        data: {
          // entID: '',
          entID: enID,
          userID: userID,
          searchName: that.data.gory + " \v" + that.data.search,
          // searchName: '金东铜版纸',
          loginToken: loginToken,
          pageIndex: that.data.pageIndex,
          category: that.data.category,
          gattr1: that.data.gName,
          // gattr1: '双面铜版纸',
          gattr2: that.data.brand,
          gattr3: that.data.gram,
          gattr4: that.data.scale,
          gattr5: that.data.level,
          area: that.data.area,
          limit: ''
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            connect: true
          })
          wx.hideNavigationBarLoading()
          switch (+res.data.code) {
            case 0:
              if(that.data.category == ''){
                var gList = new Array();
                var len = res.data.data.brandList.length;
                for (var i = 0; i < len; i++) {
                  gList = gList.concat(res.data.data.brandList[i].gnameList)
                }
                that.setData({
                  gList: gList,
                  categoryList: res.data.data.brandList
                })
              } else{
                that.setData({
                  gList: res.data.data.brandList[0].gnameList
                })
              }
              if (res.data.data.productList.length == 0){
                if (that.data.productList.length != 0){
                 that.setData({
                   noMore: false
                 })
                } else{
                  that.setData({
                    noMore: true
                  })
                }
              } else{
                that.setData({
                  noMore: true
                })
              }
              that.setData({
                loading: true,
                productList: (that.data.productList).concat(res.data.data.productList),
                gNameList: res.data.data.attrMap.gattr1,
                gramList: res.data.data.attrMap.gattr3,
                areaList: res.data.data.attrMap.area,
                brandList: res.data.data.attrMap.gattr2,
                scaleList: res.data.data.attrMap.gattr4,
                levelList: res.data.data.attrMap.gattr5
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
            listProduct();
          }, 5000)
        }
      })
    }

    getTicket = function () {
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
          switch (+res.data.code) {
            case 0:
              app.globalData.ticket = res.data.data.ticket;
              that.setData({
                ticket: res.data.data.ticket
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
          // that.setData({
          //   connect: false
          // })
        }
      })
    };
    if (app.globalData.search == '' && app.globalData.area == '' && app.globalData.category == '' && app.globalData.gname == '' && app.globalData.brand == '' && app.globalData.area2 == '' ) {
      listProduct();
    }
  },

  onReachBottom: function(){
    var that = this;
    if (!that.data.noMore) {
      return false;
    }
    that.setData({
      pageIndex: that.data.pageIndex + 1
    })
    listProduct();
  },

  onPullDownRefresh: function () {
    var that = this;
 
    that.setData({
      productList: [],
      pageIndex: 0
    })
    listProduct();
  },

  onShareAppMessage: function () {
    var that = this;
    var url = '';
    if (app.globalData.referrerID) {
      url = '/pages/category/category?referrerID=' + app.globalData.referrerID
    } else {
      url = '/pages/category/category'
    }

    return {
      title: '纸源商城',
      path: url,
      success: function (res) {
        console.log(res);
        var wx_ticket = '';
        var target;
        if (res.shareTickets) {
          // 获取转发详细信息
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success(res) {
              console.log(res);
              res.errMsg; // 错误信息
              res.encryptedData; // 解密后为一个 JSON 结构（openGId  群对当前小程序的唯一 ID）
              res.iv; // 加密算法的初始向量
            },
          });
          if (res.shareTickets[0]) {
            wx_ticket = res.shareTickets[0];
          }
          target = 'group';
        } else {
          target = 'person';
        }
        if (loginToken == '') {
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
        wx.request({
          url: webhost + "common/submitRecord",
          data: {
            loginToken: loginToken,
            userID: userID,
            path: '/pages/category/category',
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
        console.log('分享结束');
      },
      fail: function (res) {
        console.log(res);
      }
    }
  }

})