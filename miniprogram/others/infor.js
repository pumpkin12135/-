var util = require('../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: " ",
    sex: ["男", "女", "其他"],
    sexIndex: 0,
    text_cursor: 0,
    name: "",
    tel: "",
    text: ""
  },
  onLoad: function(){
    var DATE = util.formatDate(new Date());
    this.setData({
      date: DATE,
    });
  },
  formInputChange1: function(e){ 
    console.log(this.data.name)
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  formInputChange2: function (e) {
    console.log(this.data.tel)
    console.log(e)
    this.setData({
      tel: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      [`formData.date`]: e.detail.value
    })
  },
  bindsexChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      sexIndex: e.detail.value
    })
  },
  text_input: function (e) {
    this.setData({ text_cursor: e.detail.cursor })
    this.setData({
      text: e.detail.value
    })
    console.log(this.data.text)
  },
  submitForm: function(e){
    const db = wx.cloud.database()
    app.globalData.name= this.data.name
    app.globalData.sex= this.data.sex[this.data.sexIndex] 
    app.globalData.tel= this.data.tel
    app.globalData.birth= this.data.date
    app.globalData.sign= this.data.text
    console.log(app.globalData)
      db.collection('pumpkin').doc(app.globalData._id).update({
       data: {
         name: this.data.name,
         sex: this.data.sex[this.data.sexIndex] ,
         tel: this.data.tel,
         birth: this.data.date,
         sign: this.data.text
       },
       success: res => {
         console.log('[数据库] [更新记录] 成功：')
         wx.showToast({
           title: '修改成功',
         })
       },
       fail: err => {
         icon: 'none',
         console.error('[数据库] [更新记录] 失败：', err)
       }
     })
    wx.reLaunch({
      url: '../index/my',
    })
  }
})