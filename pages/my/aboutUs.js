// pages/my/aboutUs.js
var getAbout;
Page({
  data: {
    title: '',
    content: ''
  },

  onLoad: function (options) {
    var that = this;

    getAbout = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "product/getProductList",
        data: {
          entID: enID,
          userID: userID,
          loginToken: loginToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          wx.hideNavigationBarLoading();
          switch (+res.data.code) {
            case 0:
              var gList = new Array();
              var len = res.data.data.brandList.length;
              for (var i = 0; i < len; i++) {
                gList = gList.concat(res.data.data.brandList[i].gnameList)
              }
              that.setData({
                productList: res.data.data.productList,
                gNameList: res.data.data.attrMap.gattr1,
                categoryList: res.data.data.brandList,
                gramList: res.data.data.attrMap.gattr3,
                areaList: res.data.data.attrMap.area,
                brandList: res.data.data.attrMap.gattr2,
                scaleList: res.data.data.attrMap.gattr4,
                levelList: res.data.data.attrMap.gattr5,
                gList: gList
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
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#a53f35',
            content: '服务器异常'
          })
        }
      })
    }
  },

  onShareAppMessage: function () {
  
  }
})