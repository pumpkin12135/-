var app = getApp()
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  ready: function (options) {
    //写入xinList
    var that = this
    setTimeout(function () {
      that.setData({
        xinList: app.globalData.share
      })
      console.log(that.data.xinList)
      that.onLoad()
    }, 2000)
  },
  data: {
    userInfo: {},
    startX: 0, //开始移动时距离左
    endX: 0, //结束移动时距离左
    nowPage: 0, //当前是第几个个页面
    xinList: [{
      beloved: 1,
       beloved_id: ["5b6191e3-3c49-4cd7-a79e-0d197eabfbc3"],
      display: 1,
      from: "pumpkin",
        image: "cloud://xly-rboaj.786c-xly-rboaj-1300558317/006yt1Omgy1gbrh2664qrj30rs0jn7wh.jpg",
        message: "为众人抱薪者，不可使其冻毙于风雪。\n为愚昧启蒙者，不可使其困惑于无知。\n为自由开路者，不可使其困顿于荆棘。",
        paper: 1,
        scale: 1,
        slateX: 0,
        style: "",
        time: "2020-02-15",
        title: "哎呦，不错哦",
        zIndex: 1,
        beliked: false,
        id: "5b6191e3-3c49-4cd7-a79e-0d197eabfbc3"
    }]
  },
  methods: {
    onLoad: function (e) {

      this.checkPage(this.data.nowPage);
    },
    onReady: function () {

    }, 
    onPullDownRefresh: function () {    //上拉刷新
      this.setData({
        xinList: app.globalData.star,
      });
      console.log(this.data.xinList)
      this.onLoad()
    },
    onShareAppMessage: function () {
      return {
        title: '这一次为全世界署名~'
      }
    },
    share: function(e){
      console.log(e)
      this.onShareAppMessage()
    },
    tapno: function(e){   //从喜欢到不喜欢
      console.log(e)
      this.setData({
        ['xinList[' + e.currentTarget.dataset.idx + '].beliked']: false
      })
      console.log(this.data.xinList[e.currentTarget.dataset.idx].beliked)
      //从数据库删除
      //假装删除嘿嘿嘿

      app.globalData.loves = app.globalData.loves - 1
      const db = wx.cloud.database()
      const _ = db.command
      var i = 0
      while (i < app.globalData.loves) {
        if (this.data.xinList[e.currentTarget.dataset.idx].image == app.globalData.lovestar[i].image) {
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

    tapyes: function(e){   //从不喜欢到喜欢
      console.log(e)
      this.setData({
        ['xinList[' + e.currentTarget.dataset.idx + '].beliked'] : true
      })
      console.log(this.data.xinList[e.currentTarget.dataset.idx].beliked)
      var i = 0
      var flag = true   //为真时说明没有
      console.log(flag)
      while(i < app.globalData.loves){
        if (this.data.xinList[e.currentTarget.dataset.idx].image == app.globalData.lovestar[i].image){
          flag = false
        }
        i = i + 1
        console.log(i)
      }
      console.log(flag)
      if(flag == true){
        app.globalData.loves = app.globalData.loves + 1
        console.log(app.globalData)
        const db = wx.cloud.database()
        const _ = db.command
        //添加喜欢
        app.globalData.lovestar.push({ "from": this.data.xinList[e.currentTarget.dataset.idx].from, "id": this.data.xinList[e.currentTarget.dataset.idx].id, "image": this.data.xinList[e.currentTarget.dataset.idx].image, "message": this.data.xinList[e.currentTarget.dataset.idx].message, "time": this.data.xinList[e.currentTarget.dataset.idx].time, "title": this.data.xinList[e.currentTarget.dataset.idx].title, "paper": this.data.xinList[e.currentTarget.dataset.idx].paper })     //创作后同时加入喜欢
        console.log(app.globalData)
        db.collection('pumpkin').doc(app.globalData._id).update({
          data: {
            loves: app.globalData.loves,
            lovestar: _.push({ "from": this.data.xinList[e.currentTarget.dataset.idx].from, "id": this.data.xinList[e.currentTarget.dataset.idx].id, "image": this.data.xinList[e.currentTarget.dataset.idx].image, "message": this.data.xinList[e.currentTarget.dataset.idx].message, "time": this.data.xinList[e.currentTarget.dataset.idx].time, "title": this.data.xinList[e.currentTarget.dataset.idx].title, "paper": this.data.xinList[e.currentTarget.dataset.idx].paper })
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

    //手指触发开始移动
    moveStart: function (e) {
      var startX = e.changedTouches[0].pageX;
      this.setData({
        startX: startX
      });
      //写入



    },
    //手指触摸后移动完成触发事件
    moveItem: function (e) {
      var that = this;
      var endX = e.changedTouches[0].pageX;
      this.setData({
        endX: endX
      });

      //计算手指触摸偏移剧距离
      var moveX = this.data.startX - this.data.endX;

      //向左移动
      if (moveX > 20) {

        if (that.data.nowPage >= (that.data.xinList.length - 1)) {
          wx.showToast({
            title: '最后一个了呢',
            image: "../images/toast1.png",
          })
          return false;
        }
        that.setData({
          nowPage: that.data.nowPage + 1
        });
        this.checkPage(this.data.nowPage);
      }
      if (moveX < -20) {
        if (that.data.nowPage <= 0) {
          wx.showToast({
            title: '这是第一个',
            image: "../images/toast1.png",
          })
          return false;
        }
        that.setData({
          nowPage: that.data.nowPage - 1
        });
        this.checkPage(this.data.nowPage);

        // wx.showToast({
        //  title: '不可以回退噢',
        //  icon:'none'
        // })
      }


    },
    // 页面判断逻辑,传入参数为当前是第几页 
    checkPage: function (index) {
      //信列表数据
      var data = this.data.xinList;
      var that = this;
      var m = 1;
      for (var i = 0; i < data.length; i++) {
        //先将所有的页面隐藏
        var disp = 'xinList[' + i + '].display';
        var sca = 'xinList[' + i + '].scale';
        var slateX = 'xinList[' + i + '].slateX';
        var zIndex = 'xinList[' + i + '].zIndex';
        var style = 'xinList[' + i + '].style';
        that.setData({
          [disp]: 0,
          [style]: "display:block",
        });
        //向左移动上一个页面
        if (i == (index - 1)) {
          that.setData({
            [slateX]: '-120%',
            [disp]: 1,
            [zIndex]: 2,

          });
        }
        //向右移动的最右边要display:none的页面
        if (i == (index + 3)) {
          that.setData({
            [style]: 'display:none',
            [slateX]: '0',
            [zIndex]: -10,
          });
        }
        if (i == index || (i > index && (i < index + 3))) {
          //显示最近的三封
          that.setData({
            [disp]: 1
          });
          //第一封信
          if (m == 1) {
            this.setData({
              [sca]: 1,
              [slateX]: 0,
              [zIndex]: 1,
            });
          }
          //第一封信
          else if (m == 2) {
            this.setData({
              [sca]: 0.8,
              [slateX]: '-10px',
              [zIndex]: -1,
            });
          }
          //第三封信
          else if (m == 3) {
            this.setData({
              [sca]: 0.6,
              [slateX]: '-10px',
              [zIndex]: -2,
            });
          }
          m++;
        }
      }
    }



  }

  
  
})

