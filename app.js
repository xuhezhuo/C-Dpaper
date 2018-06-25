//app.js
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log(options);
    if (options.scene == 1044) {
      console.log(options.shareTicket)
    };

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.openCode = res.code        
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);        
        if (res.authSetting['scope.userInfo']) {
          console.log('已获取用户信息权限');
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              } 
              // console.log(res.userInfo);
            }
          })
        } else{
          console.log('无获取用户权限');
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
            }, 
            fail: res => {
              console.log(res);
            }
          })
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              console.log('重新尝试获取权限');             
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo;

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                  // console.log(res.userInfo);
                },
                fail: res =>{
                  console.log('重新尝试获取权限失败')
                }
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    appid: 'wx82fc559a0884b0d8',
    appSecret: '8d41b8678b16acd2ec766e68457363f9',
    enID: "663300893",
    // webhost: 'https://qa.cndpp.com/wxinterface/',
    webhost: 'https://app.papersource.cn/wxinterface/', 
    // loginToken: 'd15404d538da43adbdf24ca08fe7c1a9',
    // user: {'userID': "39899867", 'buyerEnterpriseID': '39899860'},
    // openCode: '',
    // openId: 'ocYXD5NbeEpStkcU0be_uAUei1lQ',
    search: '',
    area: '',
    area2: '',
    category: '',
    gname: '',
    brand: ''
  }
})