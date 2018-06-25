const app = getApp();
var webhost = app.globalData.webhost;

var loginToken = '';
var userID = '';

var getMsg;
var read;

Page({
  data: {
    messageContentID: '',
    connect: true
  },
  
  reConnect: function () {
    getMsg();
  },
  
  onLoad: function (options) {
    var that = this;

    that.setData({
      messageContentID: options.id,
      index: options.index
    });

    read = function(){
      wx.request({
        url: webhost + "common/viewMessage",
        data: {
          userID: userID,
          loginToken: loginToken,
          messageContentID: that.data.messageContentID
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
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
    }

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
              var message = res.data.data.messageList[that.data.index];
              that.setData({
                content: message.content.replace(new RegExp("<br>", "gm"), "\n"),
                title: message.title
              })
              read();
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
          },5000)
        }
      })
    }

  },

  onReady: function () {
  
  },

  onShow: function () {
    loginToken = app.globalData.loginToken;
    userID = app.globalData.user.userID;
    getMsg();
  },

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