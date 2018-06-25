const app = getApp();
var util = require('../../utils/date.js')
var webhost = app.globalData.webhost;

var userID = '';
var loginToken = '';
var referrerID = '';
var openId = '';
var referrerID = '';
var entID = app.globalData.enID;
var enterpriseID = '';
var getOrder;
var listCoupon;

Page({
  data: {
    usingStamp: false,
    active: 0,
    left: 150,
    corpList: [], //发票列表
    corpName: '', //发票名称
    corpId: '',   //发票ID
    productList: [], //商品列表
    orderRemark: '', //订单备注
    canUseCashStamp: 0, //可用红包
    orderAmonut: '', //订单总数量
    shipDate: '', //最晚要货
    salesManName: '', //业务员
    service: "", //二维码
    serviceTelephone: '', //客服电话
    shipExpenseMode: true, //运费承担
    carryExpenseMode: '01', //装卸费承担
    canEditCarryExpenseMode: true, //能否修改装卸费承担
    payDate: '', //付款日期
    useCashStamp: 0, //使用红包
    addressID: '', //地址ID
    vehicleID: '', //自提ID
    orderTotal: 0,  //订单总价
    allDiscount: 0,  //列表优惠总和
    maxCashStamp: 0, //使用红包上限
    stamp: '', //红包输入框
    canUseCoupon: 0, //可用优惠券张数
    couponsId: '', //优惠券ID
    coupons: 0, //优惠券总优惠
    couponValue: 0, //优惠券每吨减价 或 满减
    couponType: '',//优惠券类型
    qrcode: false,
    height: 0,
    paying: false,
    connect: true,
    driverName: ''
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

  reConnect: function () {
    getOrder();
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

  roll: function(e){
    var that = this;
    var i  = e.currentTarget.dataset.index;
    var list = that.data.productList;
    if (list[i].present == false){
      list[i].present = true;
    } else{
      list[i].present = false      
    }
    that.setData({
      productList: list
    })
  },

  addNote: function(e){
    var that = this;
    var i = e.currentTarget.dataset.index;
    var list = that.data.productList;
    list[i].remark = e.detail.value;
    that.setData({
      productList: list
    })
    // console.log(list);
  },

  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.serviceTelephone //仅为示例
    })
  },

  //运费承担设置
  setShipExpenseMode: function(e){
    //自提由客户承担
    if (this.data.active == 0) {
      return false;
    }
    var tof = e.currentTarget.dataset.type;
    if( tof == '1'){
      this.setData({
        shipExpenseMode: true
      })
    } else{
      this.setData({
        shipExpenseMode: false
      })
    }
   
  },

  //显示使用红包遮罩层
  useStamp: function(){
    this.setData({
      usingStamp: true      
    })
  },

 //取消使用红包
  cancel:function(){
    this.setData({
      usingStamp: false
    })
  },

  //不使用红包
  not: function(){
    this.setData({
      usingStamp: false,
      useCashStamp: 0      
    })
  },

  //确定使用红包
  sureStamp: function(){
    this.setData({
      usingStamp: false,      
      useCashStamp: +(this.data.stamp)
    })
  },

  //装卸费承担设置
  setCarryExpenseMode: function (e) {
    if (!this.data.canEditCarryExpenseMode){
      return false;
    }
    var tof = e.currentTarget.dataset.type;
    console.log(e);
    this.setData({
      carryExpenseMode: tof
    })
  },

  //选择自提地址
  selfTake: function(){
    wx.navigateTo({
      url: './listTake'
    })
  },

  //选择送货地址
  helpTake: function(){
    wx.navigateTo({
      url: './listAddress'
    })
  },

  //选择优惠券
  chooseCoupon: function () {
    wx.navigateTo({
      url: './listCoupon?amount=' + this.data.orderAmonut + '&total=' + this.data.orderTotal
    })
  },

  //切换地址模式
  tab: function (e) {
    var tab = +e.currentTarget.dataset.tab;
    switch (tab) {
      case 0:
        this.setData({
          left: 150,
          active: 0,
          shipExpenseMode: true          
        });
        break;
      case 1:
        this.setData({
          left: 524,
          active: 1
        });
        break;
    }
  },

  //选择要货日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      shipDate: e.detail.value
    })
  },

  //选择发票抬头
  bindPickerChange: function (e) {
    this.setData({
      cropName: this.data.corpList[e.detail.value].cropName,
      cropId: this.data.corpList[e.detail.value].cropId
    })
  },

  // 可用红包输入
  setStamp: function(e){
    var that = this;
    var stamp = e.detail.value;
    if (+stamp > that.data.maxCashStamp){
      wx.showModal({
        title: '提示',
        content: '不能超过本单可用红包',
        confirmColor: '#a53f35'
      })
    }
    that.setData({
      stamp: stamp
    })
  },

  //全部使用
  useAll: function(){
    this.setData({
      stamp: this.data.maxCashStamp
    })
  },

  //提交订单
  submit: function(e){
    var that = this;
    if(that.data.paying){
      return false;
    }
    that.setData({
      paying: true
    })
  
    var formID = e.detail.formId;
    var shipBy;
    var telephone;
    if(that.data.active == 0){
      shipBy = true;
      telephone = that.data.buyertelephone;
      if (that.data.driverName == ''){
        wx.showModal({
          title: '提示',
          content: '请先选择自提信息',
          confirmColor: '#a53f35'
        })
        that.setData({
          paying: false
        })
        return false;
      }
    } else{
      shipBy = false;
      telephone = that.data.telephone;      
      if (that.data.addressID == '') {
        wx.showModal({
          title: '提示',
          content: '请先选择协助物流信息',
          confirmColor: '#a53f35'
        })
        that.setData({
          paying: false
        })
        return false;
      }
    }
    var list = that.data.productList;
    var newList = new Array();
    for(var i = 0; i < list.length; i++){
      var item = {};
      item.itemId = list[i].id;
      item.itemRemark = list[i].remark;
      newList.push(item);    
    }
    wx.showLoading({
      title: '正在提交订单',
    })
    var data = {
      openID: openId,
      userID: userID,
      cartID: that.data.cartID,
      loginToken: loginToken,
      // formId: 'sdkp32kljljkl32',
      formId: formID,
      referrerID: referrerID,
      addressID: that.data.addressID,
      vehicleID: that.data.vehicleID,
      vehicleNo: that.data.vehicleNo,
      driverName: that.data.driverName,
      telephone: telephone,
      // driverIdentification: that.data.driverIdentification,
      shipExpenseMode: that.data.shipExpenseMode,
      carryExpenseMode: that.data.carryExpenseMode,
      orderRemark: that.data.orderRemark,
      payDate: that.data.payDate,
      shipDate: that.data.shipDate,
      corpId: that.data.corpId,
      itemStr: JSON.stringify(newList),
      shipBy: shipBy,
      useCashStamp: that.data.useCashStamp,
      couponId: that.data.couponsId
    }
    console.log(JSON.stringify(data));
    // return false;
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "product/submitOrder",
      data:data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        that.setData({
          paying: false
        })
        wx.hideNavigationBarLoading();
        wx.hideLoading();        
        switch (+res.data.code) {
          case 0:
            if (res.data.state) {
                wx.navigateTo({
                  url: './success?id=' + that.data.cartID
                })
            } else{
              wx.showModal({
                title: '提示',
                content: res.data.stateInfo,
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
              confirmColor: '#a53f35',
              content: res.data.codeInfo,
              success: function(res){
                if(res.cancel){
                  wx.switchTab({
                    url: './cart',
                  })
                }
              }
            })
        }
      },
      fail: function (res) {
        wx.hideLoading();        
        that.setData({
          paying: false
        })
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
    var that = this

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          height: res.screenHeight
        })
        console.log(that.data.height);
      }
    })
    var date = util.Format("yyyy-MM-dd", new Date());
    that.setData({
      payDate: date,
      cartID: options.cartID,
    })

    if (app.globalData.user != '' && app.globalData.user != undefined) {
      userID = app.globalData.user.userID
    };
    if (app.globalData.loginToken != '' && app.globalData.loginToken != undefined) {
      loginToken = app.globalData.loginToken;
      this.setData({
        loginToken: loginToken
      })
    }
    console.log(app.globalData.openId);
    if (app.globalData.openId != '' && app.globalData.openId != undefined) {
      openId = app.globalData.openId
    };
    console.log(app.globalData.openId);    
    if (app.globalData.user.buyerEnterpriseID != '' && app.globalData.user.buyerEnterpriseID != undefined) {
      enterpriseID = app.globalData.user.buyerEnterpriseID
    };
    if (app.globalData.referrerID != '' && app.globalData.referrerID != undefined) {
      referrerID = app.globalData.referrerID
    };

    getOrder = function(){
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "product/getUnsubmitOrder",
        data: {
          userID: userID,
          loginToken: loginToken,
          cartID: that.data.cartID,
          entID: entID
          // userID: '1269559037',
          // loginToken: '69d5663714464044bed42c11e52bf200',
          // cartID: '1271483726',
          // entID: '663300893'
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
                var data = res.data.data;
                
                var list = new Array();
                var discount = 0;
                for (var i = 0; i < data.productList.length; i++){
                  var item = data.productList[i];
                  discount += +data.productList[i].discount;
                  item.present = false;
                  list.push(item);
                }
                that.setData({
                  allDiscount: discount,
                  //自提信息
                  driverName: data.shipMode.shipByBuyer.driverName,
                  buyertelephone: data.shipMode.shipByBuyer.telephone,
                  vehicleNo: data.shipMode.shipByBuyer.vehicleNo,
                  //送货信息
                  address: data.shipMode.shipBySeller.address,
                  addressID: data.shipMode.shipBySeller.addressID,
                  clientName: data.shipMode.shipBySeller.clientName,
                  linkman: data.shipMode.shipBySeller.linkman,
                  telephone: data.shipMode.shipBySeller.telephone,
                  // --
                  productList: list,
                  shipExpenseMode: data.shipExpenseMode, //true客户false供方
                  carryExpenseMode: data.carryExpenseMode,//01/需方；02/供方
                  canEditCarryExpenseMode: data.canEditCarryExpenseMode, //能否修改装卸费承担
                  canUseCashStamp: data.canUseCashStamp,//可用红包
                  agreementFor: data.agreementFor, //约定事项
                  corpList: data.enterprisecorps, //开票公司
                  corpId: data.enterprisecorps[0].corpId, //开票ID
                  corpName: data.enterprisecorps[0].corpName,//开票名称
                  cutServiceMoney: data.cutServiceMoney, //分切服务费
                  serviceName: data.serviceName, 
                  serviceID: data.serviceID,
                  service: data.service,
                  serviceTelephone: data.serviceTelephone,
                  payDeadline: data.payDeadline, //付款截止日期
                  shipDate: data.shipDate, //最迟要货日期
                  salesManName: data.salesManName, //建发业务人员
                  orderTotal: +((data.orderTotal).replace(',', '')), //总金额
                  orderAmonut: +data.orderAmonut
                })
                // true/客户自提；false/送货上门 自提时不允许选择供方承担
                if (data.shipMode.shipBy) {
                  that.setData({
                    left: 150,
                    active: 0,
                    shipExpenseMode: true, //true客户false供方
                  });
                } else {
                  that.setData({
                    left: 524,
                    active: 1
                  });
                }
                if (that.data.canUseCashStamp > that.data.orderTotal){
                  that.setData({
                    maxCashStamp: data.orderTotal
                  })
                } else{
                  that.setData({
                    maxCashStamp: that.data.canUseCashStamp
                  })
                }
              }
              listCoupon();
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

    listCoupon = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "activity/couponList",
        data: {
          loginToken: loginToken,
          entID: enterpriseID
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
                var l = 0;
                for (var i = 0; i < res.data.data.length; i++) {
                  var type1 = res.data.data[i].type;
                  var value = res.data.data[i].value;
                  var enable = res.data.data[i].is_enable;
                  var manJian;
                  if (type1 == 'ManJian'){
                    manJian = res.data.data[i].manJian;
                  }
                  if (enable == 'Usable') {
                    if (type1 == 'ManJian'){
                      if (manJian < that.data.orderTotal){
                        l++;
                      }
                    } else{
                      l++;
                    }
                  }
                }
                that.setData({
                  canUseCoupon: l
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
    getOrder();     
  },

  onShow: function () {
   var that = this;
   if (that.data.couponsId != ''){
     console.log('优惠券ID' + that.data.couponsId);
     if (that.data.couponType == 'DanJia'){
      //  console.log(+that.data.orderAmonut);
        if ( +that.data.orderAmonut < 1 ){
          var amount = 1
        } else{
          amount = parseInt(+that.data.orderAmonut) + 1;
        }
        that.setData({
          coupons: +(amount * that.data.couponValue)
        });
      } else {
       that.setData({
         coupons: +(that.data.couponValue)
       });
      }
    }
  }
})