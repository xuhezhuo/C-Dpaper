var app = getApp();

Page({
  data: {
    eMail: '',    
    password: '',
    pwdRepeat: '',
    buyerEnterpriseName: '',
    realName: ''
  },


  Next: function () {
    var that = this;
    if (that.data.password.length < 1 || that.data.realName.length < 1) {
      wx.showModal({
        title: '提示',
        content: '真实姓名和密码不能为空',
        confirmColor: '#a53f35',
        showCancel: false
      });
      return false;
    }
    if (that.data.password != that.data.pwdRepeat) {
      wx.showModal({
        title: '提示',
        content: '确认密码不一致',
        confirmColor: '#a53f35',
        showCancel: false
      });
      return false;
    }
    if (that.data.realName.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请先填写姓名',
        confirmColor: '#a53f35',
        showCancel: false
      });
      return false;
    }
    if (that.data.eMail.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请先填写电子邮箱',
        confirmColor: '#a53f35',
        showCancel: false
      });
      return false;
    }
    if (that.data.buyerEnterpriseName.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请先填写企业名称',
        confirmColor: '#a53f35',
        showCancel: false
      });
      return false;
    }

    wx.navigateTo({
      url: './mobile?realName=' + that.data.realName + '&password=' + that.data.password + '&eMail=' + that.data.eMail + '&buyerEnterpriseName=' + that.data.buyerEnterpriseName
    })
  },

  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  bindPwdRepeatInput: function (e) {
    this.setData({
      pwdRepeat: e.detail.value
    });
  },

  bindEMailInput: function (e) {
    this.setData({
      eMail: e.detail.value
    });
  },

  bindBuyerEnterpriseNameInput: function (e) {
    this.setData({
      buyerEnterpriseName: e.detail.value
    });
  },

  bindRealNameInput: function (e) {
    this.setData({
      realName: e.detail.value
    });
  },

  onLoad: function (options) {

  }

})