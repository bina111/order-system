// index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_ad:'',
    img_category:[],
    img_swiper:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("onload");
    var callback = ()=>{
      wx.showLoading({
        title: '努力加载中',
        mask:true
      });
      app.fetch('food/index').then((res)=>{
        wx.hideLoading();
        this.setData({
          img_ad:res.img_ad,
          img_category:res.img_category,
          img_swiper:res.img_swiper
        });
      },()=>{
        callback();
      })
    }
    callback();
    
  },

  //点击跳转到点餐页面
  start:function(){
    wx.navigateTo({
      url: '../list/list',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log("onshow");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
