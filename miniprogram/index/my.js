var app = getApp()
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      this.data.sign = app.globalData.sign
      console.log(this.data.sign)
      console.log(app.globalData)
    }
  },
  data: {
    user: {},
    sign: "请完善个人信息"
  },
  ready: function (options) {
    if (app.globalData.userInfo == null) {
      
      wx.redirectTo({
        url: './logs',
      })
    }
    else {
      this.setData({
        user: app.globalData.userInfo,
        sign: app.globalData.sign
      })
    }
  },
  methods: {
    test: function(event){
      var u = this.data.user   //这个解决方法也是复杂
      console.log(u)
    }
  }
})
