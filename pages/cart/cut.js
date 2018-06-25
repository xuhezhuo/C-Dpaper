const app = getApp();
var webhost = app.globalData.webhost;
var userID;
var loginToken;

var getCut;

Page({
  data: {
    active: 0,
    left: 150,
    pieceList: [],
    allList: [],
    quantity: 0,
    quantity2: 0,
    gram: '',
    Max: '',
    cutAllQuantity: '',
    remain: 0,
    connect: true
  },

  reConnect: function () {
    getCut();
  },

  //零切模块
  addPiece: function(){
    var that = this;
    var pieceList = that.data.pieceList;
    var l = pieceList.length;
    if(l != 0){
      if (pieceList[l-1].length == '' && pieceList[l-1].pieces == ''){
        wx.showModal({
          title: '提示',
          content: '请先完成当前项',
          confirmColor: '#a53f35',
          showCancel: false
        })
        return false;
      }
    }
    var item = {}
    item.width = that.data.width;
    item.length = '';
    item.pieces = '';
    item.quantity = '';
    pieceList.push(item);
    that.setData({
      pieceList: pieceList
    })
  },
  
  bindLength: function(e){
    var that = this;
    var pieceList = that.data.pieceList;    
    var index = e.currentTarget.dataset.index;
    var length = e.detail.value;
    pieceList[index].length = length;
    if (pieceList[index].pieces != ''){
      pieceList[index].quantity = (+pieceList[index].width) * (+pieceList[index].length) * (+pieceList[index].pieces) * that.data.gram / 1e12;
      console.log(pieceList[index].quantity);
      var quantity = 0;
      for(var i = 0; i < pieceList.length; i++){
        quantity = quantity + (+pieceList[i].quantity)
      }
      console.log(quantity);
      if (quantity > that.data.Max) {
        wx.showModal({
          title: '提示',
          content: '不能超过库存',
          confirmColor: '#a53f35',
          showCancel: false
        })
        return false;
      }
      that.setData({
        quantity: quantity
      })
    }
    that.setData({
      pieceList: pieceList
    })
  },

  bindPieces: function (e) {
    var that = this;
    var pieceList = that.data.pieceList;
    var index = e.currentTarget.dataset.index;
    var pieces = e.detail.value;
    pieceList[index].pieces = pieces;
    if (pieceList[index].length != '') {
      pieceList[index].quantity = (+pieceList[index].width) * (+pieceList[index].length) * (+pieceList[index].pieces) * that.data.gram / 1e12;
      console.log(pieceList[index].quantity);
      var quantity = 0;
      for (var i = 0; i < pieceList.length; i++) {
        quantity = quantity + (+pieceList[i].quantity)
      }
      console.log(quantity);
      if(quantity > that.data.Max){
        wx.showModal({
          title: '提示',
          content: '不能超过库存',
          confirmColor: '#a53f35',
          showCancel: false
        })
        return false;
      }
      that.setData({
        quantity: quantity
      })
    }
    that.setData({
      pieceList: pieceList
    })
  },

  delpart: function(e){
    var that = this;
    var pieceList = that.data.pieceList;
    var index = e.currentTarget.dataset.index;
    var newList = new Array();
    var quantity = 0;
    for(var i = 0; i < pieceList.length; i++ ){
      if(i != index){
        newList.push(pieceList[i]);
        quantity += (+pieceList[i].quantity);
      }
    }
    that.setData({
      pieceList: newList,
      quantity: quantity
    })
  },

  //整切模块   
  addAll: function () {
    var that = this;
    var allList = that.data.allList;
    var l = allList.length;
    if (l != 0) {
      if (allList[l - 1].length == '' && allList[l - 1].pieces == '') {
        wx.showModal({
          title: '提示',
          content: '请先完成当前项',
          confirmColor: '#a53f35',
          showCancel: false
        })
        return false;
      }
    }
    var item = {}
    item.width = that.data.width;
    item.length = '';
    item.pieces = '';
    item.quantity = '';
    allList.push(item);
    that.setData({
      allList: allList
    })
  },

  setLength: function(e){
    var that = this;
    var allList = that.data.allList;
    var index = e.currentTarget.dataset.index;
    var length = e.detail.value;
    allList[index].length = +length;
    var remain = +that.data.remain;
    // if(){
    remain = (+allList[index].quantity) + remain;
    // }
    console.log(remain);
    var pieces = remain * 1e12 / ((+allList[index].width) * (+allList[index].length) * that.data.gram );
    pieces = parseInt(pieces);
    console.log(pieces);
    var quantity = (+allList[index].width) * (+allList[index].length) * that.data.gram * pieces / 1e12;
    allList[index].pieces = pieces;
    allList[index].quantity = quantity;
    var quantity2 = 0;
    for (var i = 0; i < allList.length; i++){
      quantity2 = quantity2 + (+allList[i].quantity)
    }
    if (quantity2 > that.data.cutAllQuantity){
      wx.showModal({
        title: '提示',
        content: '不能超过总重量',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }
    
    that.setData({
      allList: allList,
      quantity2: (quantity2).toFixed(6),
      remain: (that.data.cutAllQuantity - quantity2).toFixed(6)
    })
  },

  setPieces: function(e){
    var that = this;
    var allList = that.data.allList;
    var index = e.currentTarget.dataset.index;
    var pieces = e.detail.value;
    var remain = that.data.remain;
    var quantity = (+allList[index].width) * (+allList[index].length) * that.data.gram * pieces / 1e12;
    allList[index].pieces = pieces;
    allList[index].quantity = quantity;
    var quantity2 = 0;
    for (var i = 0; i < allList.length; i++) {
      quantity2 += (+allList[i].quantity)
    }
    if (quantity2 > that.data.cutAllQuantity) {
      wx.showModal({
        title: '提示',
        content: '不能超过总重量',
        confirmColor: '#a53f35',
        showCancel: false
      })
      return false;
    }

    that.setData({
      allList: allList,
      quantity2: quantity2.toFixed(6),
      remain: (that.data.cutAllQuantity - quantity2).toFixed(6)
    })
  },

  delAll: function (e) {
    var that = this;
    var allList = that.data.allList;
    var index = e.currentTarget.dataset.index;
    var newList = new Array();
    var quantity = 0;
    for (var i = 0; i < allList.length; i++) {
      if (i != index) {
        newList.push(allList[i]);
        quantity += (+allList[i].quantity)
      }
    }
    that.setData({
      allList: newList,
      quantity2: (quantity).toFixed(6),
      remain: (that.data.cutAllQuantity - quantity).toFixed(6)
    })
  },

  tab: function (e) {
    if(!this.data.both){
      return false;
    }
    var tab = +e.currentTarget.dataset.tab;
    switch (tab) {
      case 0:
        this.setData({
          left: 150,
          active: 0
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

  setting: function(){
    var that = this;
    var data = {};
    if(that.data.active == 0){
      wx.showModal({
        title: '提交零切信息',
        content: '您当前选择的是零切模式，请确认编辑分切信息无误',
        confirmColor: '#a53f35',
        success: function(res){
          if(res.cancel){
            return false;
          } else{
            data = {
              userID: userID,
              loginToken: loginToken,
              orderID: that.data.orderID,
              orderItemID: that.data.orderItemID,
              gram: that.data.gram,
              cutPartInfoStr: JSON.stringify(that.data.pieceList)
            }
            wx.showNavigationBarLoading();
            wx.request({
              url: webhost + "product/submitCutInfo",
              data: data,
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
                        title: '提交成功',
                        icon: 'success',
                        duration: 1000
                      })
                      setTimeout(function () {
                        wx.navigateBack({
                          url: './cart'
                        })
                      }, 1000)
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
        }
      })
      
    } else{
      var allList = that.data.allList;
      var index = allList.length - 1;
      var remain = +that.data.remain;
      console.log(remain);
      var pieces = remain * 1e12 / ((+allList[index].width) * (+allList[index].length) * that.data.gram);
      console.log(pieces);
      if(+pieces >= 1){
        wx.showModal({
          title: '未完全整切',
          content: '当前剩余重量仍可进行分切，是否按照最后一项的整切长度进行分割',
          success: function(res){
            if(res.confirm){
              allList[index].pieces = (+allList[index].pieces) + parseInt(pieces);    
              console.log(allList[index].pieces);
              var quantity = (+allList[index].width) * (+allList[index].length) * that.data.gram * allList[index].pieces / 1e12;
              allList[index].quantity = quantity;
              console.log(quantity);
              var quantity2 = 0;
              console.log(allList);
              for (var i = 0; i < allList.length; i++) {
                quantity2 += (+allList[i].quantity)
              }
              that.setData({
                allList: allList,
                quantity2: quantity2,
                remain: (that.data.cutAllQuantity - quantity2).toFixed(6)
              })
            }
          }
        })
        return false;
      }
      wx.showModal({
        title: '提交整切信息',
        content: '您当前选择的是整切模式，请确认编辑分切信息无误',
        confirmColor: '#a53f35',
        success: function (res) {
          if (res.cancel) {
            return false;
          } else {
            data = {
              userID: userID,
              loginToken: loginToken,
              orderID: that.data.orderID,
              orderItemID: that.data.orderItemID,
              gram: that.data.gram,
              cutAllInfoStr: JSON.stringify(that.data.allList),
              cutAllPiece: that.data.cutAllPiece,
              pieceWeight: that.data.pieceWeight,
              cutAllQuantity: that.data.cutAllQuantity
            }
            wx.showNavigationBarLoading();
            wx.request({
              url: webhost + "product/submitCutInfo",
              data: data,
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
                        title: '提交成功',
                        icon: 'success',
                        duration: 1000
                      })
                      setTimeout(function () {
                        wx.navigateBack({
                          url: './cart'
                        })
                      }, 1000)
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
        }
      })
    }
  },

  cancel: function(){
    wx.navigateBack({
      url: './cart'
    })
  },

  onLoad: function (options) {
    var that = this;

    that.setData({
      orderID: options.id,
      orderItemID: options.orderItemID,
      Max: options.Max
    })

    getCut = function(){
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "product/getEditCutInfoPage",
        data: {
          orderID: that.data.orderID,
          orderItemID: that.data.orderItemID,
          loginToken: loginToken
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
                  width: +res.data.data.productWidth,
                  gram: +res.data.data.gram,//克重
                  pieceWeight: +res.data.data.pieceWeight,//件重
                  // allQuantity: res.data.data.productQuantity,
                  cutAllQuantity: +res.data.data.cutAllQuantity,
                  cutAllPiece: +res.data.data.cutAllPiece
                })
                if (res.data.data.showCutAll && res.data.data.showCutPart){
                  that.setData({
                    both: true
                  })
                } else{
                  that.setData({
                    both: false
                  })
                }
                if (res.data.data.showCutPart){
                  that.setData({
                    left: 150,
                    active: 0,
                    pieceList: res.data.data.cutPartInfo
                  })
                  if (res.data.data.cutPartInfo.length != 0){
                    // var quantity = 0;
                    // for (var i = 0; i < res.data.data.cutPartInfo.length; i++){
                    //   quantity += res.data.data.cutPartInfo[i].quantity;
                    // }
                    that.setData({
                      quantity: +res.data.data.productQuantity
                    })
                    console.log(that.data.quantity);                    
                  }
                } 
                if (res.data.data.showCutAll) {
                  if (!res.data.data.showCutPart){
                    that.setData({
                      left: 524,
                      active: 1
                    })
                  }
                  that.setData({
                    allList: res.data.data.cutAllInfo
                  })
                  if (res.data.data.cutAllInfo.length != 0) {
                    var quantity2 = 0;
                    for (var j = 0; j < res.data.data.cutAllInfo.length; j++) {
                      quantity2 += (+res.data.data.cutAllInfo[j].quantity);
                    }
                    console.log(quantity2);                    
                    that.setData({
                      quantity2: (+quantity2).toFixed(6),
                      remain: (that.data.cutAllQuantity - (+quantity2)).toFixed(6)
                    })
                  } else {
                    that.setData({
                      remain: that.data.cutAllQuantity
                    })
                  }
                }
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
            getCut();
          }, 5000)
        }
      })
    }
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
    getCut();
    
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