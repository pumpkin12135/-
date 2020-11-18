// others/open.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xin: {},
    beliked: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.id == 2){        //我的星星
      this.setData({
        xin: app.globalData.star[options.idx],

        'beliked': false
      })
    } 
    if(options.id == 1){         //喜欢的星星
      this.setData({
        xin: app.globalData.star[options.idx],
      })
      this.setData({
        'beliked': true
      })
      const db = wx.cloud.database()
       // 查询当前用户所有的 counters
       db.collection('pumpkin').where({
         'star.image': options.image
       }).get({
         success: res => {
           console.log('[数据库] [查询记录] 成功: ', res.data[0])
           if(res.data[0]==undefined){
             wx.showToast({
               title: '该星星已被删除',
               image: "../images/toast1.png",
             })
             //从数据库删除
            app.globalData.loves = app.globalData.loves - 1
             const db = wx.cloud.database()
             app.globalData.lovestar.splice(options.idx, 1)
             console.log(app.globalData)
             db.collection('pumpkin').doc(app.globalData._id).update({
               data: {
                 loves: app.globalData.loves,
                 lovestar: app.globalData.lovestar
               },
               success: res => {
                 console.log('[数据库] [更新记录] 成功：', res)
                 wx.navigateBack({
                 })
               },
               fail: err => {
                 icon: 'none',
                   console.error('[数据库] [更新记录] 失败：', err)
               }
             })
           }
         },
       })
      this.setData({
        xin: app.globalData.lovestar[options.idx],
      })
    }

  },

  onShareAppMessage: function () {
    return {
      title: '这一次为全世界署名~'
    }
  },
  tapno: function (e) {   //从喜欢到不喜欢
    console.log(e)
    this.setData({
      ['xin.beliked']: false,
      beliked: false
    })
    console.log(this.data.xin.beliked)
    //从数据库删除
    //假装删除嘿嘿嘿

    app.globalData.loves = app.globalData.loves - 1
    const db = wx.cloud.database()
    const _ = db.command
    var i = 0
    while (i < app.globalData.loves) {
      if (this.data.xin.image == app.globalData.lovestar[i].image) {
        app.globalData.lovestar.splice(i, 1)
      }
      i = i + 1
      console.log(i)
    }
    console.log(app.globalData)
    db.collection('pumpkin').doc(app.globalData._id).update({
      data: {
        loves: app.globalData.loves,
        lovestar: app.globalData.lovestar
      },
      success: res => {
        console.log('[数据库] [更新记录] 成功：', res)
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  tapyes: function (e) {   //从不喜欢到喜欢
    console.log(e)
    this.setData({
      ['xin.beliked']: true,
      beliked: true
    })
    console.log(this.data.xin.beliked)
    var i = 0
    var flag = true   //为真时说明没有
    console.log(flag)
    while (i < app.globalData.loves) {
      if (this.data.xin.image == app.globalData.lovestar[i].image) {
        flag = false
      }
      i = i + 1
      console.log(i)
    }
    console.log(flag)
    if (flag == true) {
      app.globalData.loves = app.globalData.loves + 1
      console.log(app.globalData)
      const db = wx.cloud.database()
      const _ = db.command
      //添加喜欢
      app.globalData.lovestar.push({ "from": this.data.xin.from, "id": this.data.xin.id, "image": this.data.xin.image, "message": this.data.xin.message, "time": this.data.xin.time, "title": this.data.xin.title, "paper": this.data.xin.paper })     //创作后同时加入喜欢
      console.log(app.globalData)
      db.collection('pumpkin').doc(app.globalData._id).update({
        data: {
          loves: app.globalData.loves,
          lovestar: _.push({ "from": this.data.xin.from, "id": this.data.xin.id, "image": this.data.xin.image, "message": this.data.xin.message, "time": this.data.xin.time, "title": this.data.xin.title, "paper": this.data.xin.paper })
        },
        success: res => {
          console.log('[数据库] [更新记录] 成功：', res)
        },
        fail: err => {
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    }
  }, 


})