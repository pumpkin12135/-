// index/log.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: ""
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
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
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        const db = wx.cloud.database()
        console.log(app.globalData)
        db.collection('pumpkin').add({
          data: {
            birth: "",
            loves: 0,
            lovestar: [],
            name: "",
            nums: 0,
            sex: "",
            sign: "",
            star: [],
            tel: ""
          },
         success: res => {
           // 在返回结果中会包含新创建的记录的 _id
           this.setData({
             counterId: res._id,
             count: 1
           })
           app.globalData._id = res._id
           app.globalData.birth = ""
           app.globalData.loves = 0
           app.globalData.lovestar = []
           app.globalData.name = ""
           app.globalData.nums = 0
           app.globalData.sex = ""
           app.globalData.sign = ""
           app.globalData.star = []
           app.globalData.tel = ""
           wx.showToast({
             title: '登录成功',
           })
           console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)

         },
         fail: err => {
           console.error('[数据库] [新增记录] 失败：', err)
         }
       })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    //写数据库
    wx.switchTab({
      url: './my'
    })
  }

})