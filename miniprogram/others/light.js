// others/light.js
var util = require('../utils/util.js');
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: ["white", "white", "white", "white", "white", "white", "white", "white", "white"],
    date: " ",
    text_cursor: 0,
    imageList: [],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 0,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],

    my: "",
    image: "",
    message: "",
    title: "",
    paper: 1
  },
  onLoad: function () {
    var DATE = util.formatDate(new Date());
    this.setData({
      date: DATE,
    });
  },
  formInputChange1: function(e){   //个性署名
    console.log(e)
    this.setData({
      my: e.detail.value
    })
    console.log(this.data.my)
  },
  formInputChange2: function(e){   //标题文字
    console.log(e)
    this.setData({
      title: e.detail.value
    })
    console.log(this.data.title)
  },
  bindDateChange: function (e) {    //创作时间
    console.log(e)
    this.setData({
      date: e.detail.value,
      [`formData.date`]: e.detail.value,
    })
    console.log(this.data.date)
  },
  text_input: function(e){     //内容
    this.setData({text_cursor: e.detail.cursor})
    this.setData({
      message: e.detail.value
    })
    console.log(this.data.message)
  },
  papertap: function(e){    //选择贴纸
    console.log(e)
    this.setData({
      paper: e.currentTarget.dataset.idx + 1,
    })
    switch (e.currentTarget.dataset.idx){
      case 0: this.setData({
        grids: ["#04BE02", "white", "white", "white", "white", "white", "white", "white", "white"],
      });
        break;
      case 1: this.setData({
        grids: ["white", "#04BE02", "white", "white", "white", "white", "white", "white", "white"],
      });
        break;
      case 2: this.setData({
        grids: ["white", "white", "#04BE02", "white", "white", "white", "white", "white", "white"],
      });
        break;
      case 3: this.setData({
        grids: ["white", "white", "white", "#04BE02", "white", "white", "white", "white", "white"],
      });
        break;
      case 4: this.setData({
        grids: ["white", "white", "white", "white", "#04BE02", "white", "white", "white", "white"],
      });
        break;
      case 5: this.setData({
        grids: ["white", "white", "white", "white", "white", "#04BE02", "white", "white", "white"],
      });
        break;
      case 6: this.setData({
        grids: ["white", "white", "white", "white", "white", "white", "#04BE02", "white", "white"],
      });
        break;
      case 7: this.setData({
        grids: ["white", "white", "white", "white", "white", "white", "white", "#04BE02", "white"],
      });
        break;
      case 8: this.setData({
        grids: ["white", "white", "white", "white", "white", "white", "white", "white", "#04BE02"],
      });
        break;

    }
    console.log(this.data.paper)
  },
  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange: function (e) {
    this.setData({
      countIndex: e.detail.value
    })
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  submitForm: function(e){
    if(this.data.my!="" & this.data.title!="" & this.data.message!="" &this.data.imageList.length!=0){
      console.log(this.data.imageList)
      wx.showLoading({
        title: '上传中',
      })
      const filePath = this.data.imageList[0]
      // 上传图片
      console.log(e)
      const cloudPath = app.globalData.openid + this.data.date + e.timeStamp + app.globalData.nums + filePath.match(/\.[^.]+?$/)[0]
      app.globalData.nums = app.globalData.nums + 1
      app.globalData.loves = app.globalData.loves + 1
      console.log(app.globalData)
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('[上传文件] 成功：', res)

          app.globalData.fileID = res.fileID
          app.globalData.cloudPath = cloudPath
          app.globalData.imagePath = filePath
          wx.cloud.getTempFileURL({
            fileList: [app.globalData.fileID],
            success: res => {
              // get temp file URL
              console.log(res.fileList[0].tempFileURL)
              //修改数据库 返回
              const db = wx.cloud.database()
              const _ = db.command
              app.globalData.star.push({ "beloved": 1, "beloved_id": [app.globalData._id], "from": this.data.my, "image": res.fileList[0].tempFileURL, "message": this.data.message, "time": this.data.date, "title": this.data.title, "paper": this.data.paper, "id": app.globalData._id })
              app.globalData.lovestar.push({ "from": this.data.my, "id":  app.globalData._id,"image": res.fileList[0].tempFileURL, "message": this.data.message, "time": this.data.date, "title": this.data.title, "paper": this.data.paper })     //创作后同时加入喜欢
              console.log(app.globalData)
              db.collection('pumpkin').doc(app.globalData._id).update({
                data: {
                  loves: app.globalData.loves,
                   nums: app.globalData.nums,
                  star: _.push({ "beloved": 1, "beloved_id": [app.globalData._id], "from": this.data.my, "image": res.fileList[0].tempFileURL, "message": this.data.message, "time": this.data.date, "title": this.data.title, "paper": this.data.paper, "id": app.globalData._id}),
                  lovestar: _.push({ "from": this.data.my, "id": app.globalData._id, "image": res.fileList[0].tempFileURL, "message": this.data.message, "time": this.data.date, "title": this.data.title, "paper": this.data.paper })
                 },
                success: res => {
                  console.log('[数据库] [更新记录] 成功：', res)
                  wx.showToast({
                    title: '点亮成功',
                  })
                 },
                 fail: err => {
                   icon: 'none',
                   console.error('[数据库] [更新记录] 失败：', err)
                 }
              })
              wx.switchTab({
                url: '../index/my'
              })
            },
            fail: err => {
              // handle error
            }
          })

        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      })
      fail: e => {
        console.error(e)
      }
    }
    else{
      wx.showToast({
        icon: 'none',
        title: '请完善内容',
      })
    }
  },
})