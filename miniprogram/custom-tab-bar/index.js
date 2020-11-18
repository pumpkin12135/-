Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/index/index",
      iconPath: "/images/first-no.png",
      selectedIconPath: "/images/first-yes.png",
      text: "探索"
    }, {
      pagePath: "/index/my",
      iconPath: "/images/my-no.png",
      selectedIconPath: "/images/my-yes.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})