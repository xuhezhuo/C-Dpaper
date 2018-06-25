const app = getApp();
var webhost = app.globalData.webhost;

var loginToken = '';
var userID = '';

var getMsg;

Page({
  data: {
    dataList: [],
    connect: true
  },

  reConnect: function () {
    getMsg();
  },

  openDetailWin: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;    
    wx.navigateTo({
      url: './msgDetail?id=' + that.data.dataList[index].messageContentID + '&index=' + index
    })
  },

  onLoad: function (options) {
    var that = this;

    getMsg = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "common/getMessageList",
        data: {
          userID: userID,
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
              that.setData({
                dataList: res.data.data.messageList
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
            getMsg();
          })
        }
      })
    }
  },

  onShow: function () {
    loginToken = app.globalData.loginToken;
    userID = app.globalData.user.userID;     
    getMsg();
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