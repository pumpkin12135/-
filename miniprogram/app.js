//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          // env 参数说明：
          //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
          //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
          //   如不填则使用默认环境（第一个创建的环境）
          env: 'xly-rboaj',
          traceUser: true,
        })
      }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    this.globalData = {
      userInfo: null
    }

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        var app = this
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
        console.log(app.globalData)
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
        db.collection('pumpkin').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            console.log('[数据库] [查询记录] 成功: ', res.data[0])
            app.globalData._id = res.data[0]._id
            app.globalData.birth = res.data[0].birth
            app.globalData.loves = res.data[0].loves
            app.globalData.lovestar = res.data[0].lovestar
            app.globalData.name = res.data[0].name
            app.globalData.nums = res.data[0].nums
            app.globalData.sex = res.data[0].sex
            app.globalData.sign = res.data[0].sign
            app.globalData.star = res.data[0].star
            app.globalData.tel = res.data[0].tel
            var i = 0
            while(i < app.globalData.nums){
              app.globalData.star[i] = { 'beloved': app.globalData.star[i].beloved, 'beloved_id': app.globalData.star[i].beloved_id, 'from': app.globalData.star[i].from, 'image': app.globalData.star[i].image, 'message': app.globalData.star[i].message, 'paper': app.globalData.star[i].paper, 'time': app.globalData.star[i].time, 'title': app.globalData.star[i].title, 'display': 0, 'scale': '', 'slateX': '', 'zIndex': 0, 'style': '', 'beliked': false, 'id': app.globalData.star[i].id}
              i = i + 1
              console.log(i)
            }
            console.log(app.globalData)
          },
          fail: err => {
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    var app = this
    const db = wx.cloud.database()
    app.globalData.share = []
    // 查询当前用户所有的 counters
    db.collection('pumpkin').where({
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res.data)
        var i = 0
        while(i < res.data.length){
          var j = 0
          while(j < res.data[i].nums){
            var temp = { 'beloved': res.data[i].star[j].beloved, 'beloved_id': res.data[i].star[j].beloved_id, 'from': res.data[i].star[j].from, 'image': res.data[i].star[j].image, 'message': res.data[i].star[j].message, 'paper': res.data[i].star[j].paper, 'time': res.data[i].star[j].time, 'title': res.data[i].star[j].title, 'display': 0, 'scale': '', 'slateX': '', 'zIndex': 0, 'style': '', 'beliked': false, 'id': res.data[i].star[j].id }
            app.globalData.share.push(temp) 
            j = j + 1
            
          }

          i = i + 1
        }
        console.log(app.globalData.share)
      },
    })
  },



})
