// others/my.js
var app = getApp()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    xinList:[],
  },
  onLoad: function(options) {
    this.setData({
      search: this.search.bind(this)
    })
    this.setData({
        xinList: app.globalData.star,
    });
    console.log(this.data.xinList)
    console.log(app.globalData)
  },
  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{ text: '搜索结果', value: 1 }, { text: '搜索结果2', value: 2 }])
      }, 200)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },
  slideButtonTap(e) {
    var that = this
    console.log('slide button tap', e)
    if(e.detail.index == 1){
      wx.showModal({
        title: '提示',
        content: '确认使这颗星星坠落吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.globalData.nums = app.globalData.nums - 1
            const db = wx.cloud.database()
            app.globalData.star.splice(e.detail.data, 1)
            console.log(app.globalData)
            db.collection('pumpkin').doc(app.globalData._id).update({
              data: {
                nums: app.globalData.nums,
                star: app.globalData.star
              },
              success: res => {
                console.log('[数据库] [更新记录] 成功：', res)
                wx.showToast({
                  title: '删除成功',
                })
              },
              fail: err => {
                icon: 'none',
                  console.error('[数据库] [更新记录] 失败：', err)
              }
            })
            that.onLoad()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

});