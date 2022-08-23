// pages/order/balance/balance.js
const app = getApp();
const fetch = app.fetch;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const order_id = options.order_id;
    //获取订单的内容
    wx.showLoading({
      title: "努力加载中",
      mask: true,
    });
    fetch('food/order',{
      id:order_id}).then(data=>{
        wx.hideLoading();
        this.setData(data);
        console.log(data)
      },()=>{
        this.onLoad(options);
      })
  },

  //获取备注的内容
  comment:function (e) {  
    this.data.comment = e.detail.value;
  },

  //支付功能
  pay:function(){
    const id = this.data.id;
    wx.showLoading({
      title:"正在支付",
      mask:true
    });
    fetch('food/order', {
      id: id,
      comment: this.data.comment
    }, 'POST').then(data => {
      return fetch('food/pay', {
        id: id
      }, 'POST')
    }).then(data => {
      wx.hideLoading()
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          wx.navigateTo({
            url: '/pages/order/detail/detail?order_id=' + id
          })
        }
      })
    }).catch(() => {
      this.pay()
    })
  

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})