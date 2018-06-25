const app = getApp();
var webhost = app.globalData.webhost;
var enID = app.globalData.enID;
var entID = '';

var userID = '';
var loginToken = '';

var getDetail;
var addToCart;
var addToCollection;
var delCollection;
var getTicket;

Page({
  data: {
    check: false,
    branchName: '',
    branchAddress: '',
    branchTelephone: '',
    branchFax: '',
    branchEmail: '',
    cashStockId: '',
    fullName: '',
    gname: '',
    gattr1: '',
    gattr2: '', //品牌
    gattr3: '', //规格,
    gattr4: '', //克重
    gattr5: '', //等级
    price: '',  //价格
    discount: '', // 折扣
    consumeStamp: '', // 每吨产生的消费卷
    cashStamp: '' ,// 每吨产生的红包
    pieceWeight: '',//件重
    reamWeight: '', //令重,
    service: '',//二维码地址
    serviceTelephone: '', //电话
    ifCollected: false ,
    storeList: [], //仓库列表    
    storeId: '',
    address: '',
    qrcode: false,
    connect: true,
    area: ''
  },

  //重新连接
  reConnect: function () {
    getDetail();
  },

  scan: function(e){
    var that = this;
    var current = e.target.dataset.src;
    var imgList = [];
    imgList.push(current);
    wx.previewImage({
      // current: current, // 当前显示图片的http链接  
      urls: imgList // 需要预览的图片http链接列表  
    }) 
  },

  openLoginWin: function () {
    wx.redirectTo({
      url: '../login/login?urlType=4&fullName='+ this.data.fullName
    })
  },

  qrcode: function(){
    var that = this;
    if(that.data.qrcode){
      that.setData({
        qrcode: false        
      })
    } else{
      that.setData({
        qrcode: true
      })
    }
  },

  check: function () {
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

  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.branchTelephone 
    })
  },

  call2: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.serviceTelephone
    })
  },
  
  bindstore: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      storeId: that.data.storeList[index].storeId,
      cashStockId: that.data.storeList[index].cashStockId,
      weightList: that.data.storeList[index].weight,
      reamWeight: that.data.storeList[index].weight[0].reamWeight,
      pieceWeight: that.data.storeList[index].weight[0].pieceWeight,//件重      
      price: that.data.storeList[index].price,  //价格
      discount: that.data.storeList[index].discount, // 折扣
      consumeStamp: that.data.storeList[index].consumeStamp, // 每吨产生的消费卷
      cashStamp: that.data.storeList[index].cashStamp,// 每吨产生的红包
      service: that.data.storeList[index].service,//二维码地址
      serviceTelephone: that.data.storeList[index].serviceTelephone, //电话
      address: that.data.storeList[index].storeAdress
    })
    // console.log(that.data.weightList);
  },

  bindPieceWeight: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      pieceWeight: weight[index].pieceWeight,//件重
      reamWeight: weight[index].reamWeight, //令重,
    })
  },

  collection: function(){
    var that = this;
    if (that.data.ifCollected){
      delCollection();
    } else{
      addToCollection();
    }
  },

  addToCart: function(){
    var that = this;    
    addToCart();
  },

  buy: function(){
    var that = this;
    if (loginToken == '') {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?urlType=4&fullName=' + that.data.fullName
            })
          }
        }
      })
      return false;
    } 
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "product/addToCart",
      data: {
        enID: enID,
        userID: userID,
        loginToken: loginToken,
        cashStockId: that.data.cashStockId
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
              wx.switchTab({
                url: '../cart/cart'
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

  onLoad: function (options) {
    var that = this;
    
    that.setData({
      loginToken: loginToken
    })
    
    if (options.fullName){
      that.setData({
        fullName: options.fullName
      })
    }

    if (options.area) {
      that.setData({
        area: options.area
      })
    }

    if (options.referrerID){
      app.globalData.referrerID = options.referrerID;
      console.log(options.referrerID);
    }

    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var obj = {};
      for (var i = 0; i < scene.split('#').length; i++) {
        var arr = scene.split('#')[i].split('/');
        obj[arr[0]] = arr[1];
      }
      app.globalData.referrerID = obj.referrerID;
      that.setData({
        fullName: obj.fullName
      })
    }
      

    getDetail = function(){
      wx.showNavigationBarLoading();
      var modelData = {
        // entID: '',
        entID: enID,
        userID: userID,
        loginToken: loginToken,
        storeId: '',
        fullName: that.data.fullName
        // fullName: '晨鸣双胶纸-本白双胶纸-鲸鲨-70G-710*1000-A'
        // fullName: '金东铜版纸-亚光双面铜版纸-太空梭-105G-889*1194-A'
      }
      if(that.data.area != ''){
        modelData.area = that.data.area;
      }
      wx.request({
        url: webhost + "product/getProductDetail",
        data: modelData,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          // console.log(res);
          that.setData({
            connect: true
          })
          switch (+res.data.code) {
            case 0:
              if(res.data.state == 'true'){
                var data = res.data.data;
                if (data.collect != undefined){
                  that.setData({
                    ifCollected: data.collect
                  })
                }               
                var productList = res.data.data.productList;
                var storeList = new Array();
                for(var i = 0; i < productList.length; i++){
                  var same = false;
                  for (var j = 0; j < storeList.length; j++){
                    if (productList[i].store.storeId == storeList[j].storeId){
                      same = true;
                      var weight = {};
                      if (productList[i].reamWeight) {
                        weight = [{ 'pieceWeight': productList[i].pieceWeight, 'reamWeight': productList[j].reamWeight }]
                      } else {
                        weight = [{ 'pieceWeight': productList[i].pieceWeight }]
                      }
                      storeList[j].weiht.push(weight);
                      break;
                    }
                  }
                  if(!same){
                    var item = {};
                    item.cashStockId = productList[i].cashStockId;
                    item.price = productList[i].price;
                    item.discount = productList[i].discount;
                    item.consumeStamp = productList[i].consumeStamp;
                    item.cashStamp = productList[i].cashStamp;
                    if (productList[i].reamWeight) {
                      item.weight = [{ 'pieceWeight': productList[i].pieceWeight, 'reamWeight': productList[i].reamWeight }]
                    } else {
                      item.weight = [{ 'pieceWeight': productList[i].pieceWeight }]
                    }
                    item.service = productList[i].service.service;
                    item.serviceTelephone = productList[i].service.serviceTelephone;
                    item.storeId = productList[i].store.storeId;
                    item.select = productList[i].store.select;
                    item.storeName = productList[i].store.storeName;
                    item.qty = productList[i].store.qty;    
                    item.storeAdress = productList[i].store.storeAdress;          
                    storeList.push(item);
                    // console.log(storeList);                    
                  }
                }
                // console.log(storeList);
                that.setData({
                  storeList: storeList,
                  branchName: productList[0].branch.branchName,
                  branchAddress: productList[0].branch.branchAddress,
                  branchTelephone: productList[0].branch.branchTelephone,
                  branchFax: productList[0].branch.branchFax,
                  branchEmail: productList[0].branch.branchEmail,
                  fullName: productList[0].fullName,
                  gname: productList[0].gname,
                  gattr1: productList[0].gattr1,
                  gattr2: productList[0].gattr2, //品牌
                  gattr3: productList[0].gattr3, //规格,
                  gattr4: productList[0].gattr4, //克重
                  gattr5: productList[0].gattr5, //等级
                    //随仓库变化
                  // cashStockId: storeList[0].cashStockId,//商品库存id
                  // price: storeList[0].price,  //价格
                  // discount: storeList[0].discount, // 折扣
                  // consumeStamp: storeList[0].consumeStamp, // 每吨产生的消费卷
                  // cashStamp: storeList[0].cashStamp,// 每吨产生的红包
                  // pieceWeight: storeList[0].weight[0].pieceWeight,//件重
                  // reamWeight: storeList[0].weight[0].reamWeight, //令重,
                  // service: storeList[0].service,//二维码地址
                  // serviceTelephone: storeList[0].serviceTelephone, //电话
                  // storeId: storeList[0].storeId,//仓库id 
                  // weightList: storeList[0].weight,
                  // address: storeList[0].storeAdress
                })
                console.log(storeList);
                for(var k = 0; k < storeList.length; k++){
                  if (storeList[k].select){
                    that.setData({
                      storeId: that.data.storeList[k].storeId,
                      cashStockId: that.data.storeList[k].cashStockId,
                      weightList: that.data.storeList[k].weight,
                      pieceWeight: storeList[k].weight[0].pieceWeight,//件重
                      reamWeight: storeList[k].weight[0].reamWeight,
                      price: that.data.storeList[k].price,  //价格
                      discount: that.data.storeList[k].discount, // 折扣
                      consumeStamp: that.data.storeList[k].consumeStamp,
                      cashStamp: that.data.storeList[k].cashStamp,
                      service: that.data.storeList[k].service,//二维码地址
                      serviceTelephone: that.data.storeList[k].serviceTelephone,
                      address: that.data.storeList[k].storeAdress
                    })
                    break;
                  }
                }
                // console.log(storeList[0]);
                wx.hideNavigationBarLoading();                          
              }
              break;
            case 1:
              wx.showToast({
                title: '连接超时',
                icon: 'loading'
              })
              wx.hideNavigationBarLoading();                        
              break;
            case 2:
              wx.showModal({
                title: '提示',
                showCancel: false,
                confirmColor: '#a53f35',
                content: res.data.codeInfo
              })
              wx.hideNavigationBarLoading();                        
          }
        },
        fail: function (res) {
          wx.hideNavigationBarLoading();
          that.setData({
            connect: false
          })
          setTimeout(function(){
            getDetail();
          },5000)
        }
      })
    }
    
    addToCart = function(){
      if (loginToken == '') {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          confirmColor: '#a53f35',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login?urlType=4&fullName=' + that.data.fullName
              })
            }
          }
        })
        return false;
      }
      wx.showNavigationBarLoading();      
      wx.request({
        url: webhost + "product/addToCart",
        data: {
          enID: enID,
          userID: userID,
          loginToken: loginToken,
          cashStockId: that.data.cashStockId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          wx.hideNavigationBarLoading();                    
          // console.log(res);
          switch (+res.data.code) {
            case 0:
              if(res.data.state){
                wx.showModal({
                  title: '加入成功',
                  content: '是否前往购物车？',
                  confirmColor: '#a53f35',
                  success: function(res){
                    if(res.confirm){
                      wx.switchTab({
                        url: '../cart/cart'
                      })
                    }
                  }
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
    }

    addToCollection = function () {
      if(!loginToken){
        wx.showModal({
          title: '提示',
          content: '请先登录',
          confirmColor: '#a53f35',
          success: function(res){
            if(res.confirm){
              wx.navigateTo({
                url: '../login/login?urlType=4&fullName=' + that.data.fullName
              })
            }
          }
        })
        return false;
      }
      wx.showNavigationBarLoading();      
      wx.request({
        url: webhost + "activity/addToFavorite",
        data: {
          userID: userID,
          loginToken: loginToken,
          fullName: that.data.fullName
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          wx.hideNavigationBarLoading();          
          // console.log(res);
          switch (+res.data.code) {
            case 0:
              if (res.data.state == 'true') {
                getDetail();
              } else{
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  confirmColor: '#a53f35',                  
                  content: res.stateInfo
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
    }

    delCollection = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "activity/deleteFavorite",
        data: {
          userID: userID,
          loginToken: loginToken,
          fullName: that.data.fullName
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          wx.hideNavigationBarLoading();
          switch (+res.data.code) {
            case 0:
              if(res.data.state == 'true'){
                getDetail();                
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
          return false;
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#a53f35',
            content: '您的网络似乎有点不顺畅哦'
          })
        }
      })
    };

  },

  onShow: function () {
    if (app.globalData.user != undefined) {
      userID = app.globalData.user.userID;
      entID = app.globalData.user.buyerEnterpriseID   
      if (app.globalData.user == ''){
        userID = '';
        entID = '';
      }   
    };
    if (app.globalData.loginToken != undefined) {
      loginToken = app.globalData.loginToken;
      this.setData({
        loginToken: loginToken
      })
    };
    if (loginToken != '') {
      if (!app.globalData.ticket) {
        getTicket();
      } else {
        this.setData({
          ticket: app.globalData.ticket
        })
      }
    }
    getDetail();
  },

  onShareAppMessage: function () {
    var that = this;
    var url = '';
    if (app.globalData.referrerID){
      url = '/pages/category/goodsdetail?fullName=' + that.data.fullName + '&referrerID=' + app.globalData.referrerID
    } else{
      url = '/pages/category/goodsdetail?fullName=' + that.data.fullName
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
        wx.request({
          url: webhost + "common/submitRecord",
          data: {
            loginToken: loginToken,
            userID: userID,
            path: '/pages/category/goodsdetail?fullName=' + that.data.fullName,
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
            console.log(res);
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