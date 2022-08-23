// pages/order/list/list.js

const app = getApp();
const fetch = app.fetch;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_last: true,
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */

  row:10,   //一次获取十条
  last_id:0,  //保存last_id

  onLoad(options) {
    // console.log("onload")
     wx.showLoading({
       title:"努力加载中",
       mask:true
     });
     this.loadData({
       last_id:0,
       success:data=>{
         this.setData({
           order:data.list
         },()=>{
           wx.hideLoading();
         });
       },
       fail:function(){
         this.onLoad();
       }
     })
  },

  /*
  页面中的加载初始化数据、下拉刷新、上拉触底 都需要调用相同的接口，
  来请求数据。为了减少重复代码，将请求数据的代码封装起来。
  */
  loadData:function (options) {  
    wx.showNavigationBarLoading();
    fetch('/food/orderlist',{
      last_id:options.last_id,
      row:this.row
    }).then(data=>{
      this.last_id = data.last_id;
      this.setData({
        is_last:data.list.length < this.row
      },()=>{
        wx.hideNavigationBarLoading();
        options.success(data);
      })
    },()=>{
      wx.hideNavigationBarLoading();
      options.fail();
    });
    /*该回调函数指向自己*/
    // setTimeout(function(){
    //   this.a = "aaaaa";
    //   console.log(this.a);

    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  /*
    当用户创建新订单的时候，有可能订单列表已经在后台打开，
    为了在订单列表中看到最新的订单，
    使用onShow事件，在订单列表页面显示的时候加载数据。

    注意：onShow事件和onLoad事件，在页面打开以后都会触发。
    为了避免请求两次数据，在onShow中跳过第一次的请求，
    利用this.enableRefresh来实现。
  */
  /*
    wx.pageScrollTo()用来自动滚动到指定位置。
    这里用来在页面内容刷新以后，自动滚动到顶部。
  */
  enableRefresh:false,
  onShow() {
    // console.log("onshow")
    if(this.enableRefresh){
      this.onLoad();
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
    else{
      this.enableRefresh = true;
    }
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
  //使用下拉刷新按钮时需要先开启下拉刷新
  onPullDownRefresh() {
    wx.showLoading({
      title:"努力加载中",
      mask:true
    });
    this.loadData({
      last_id:0,
      success:data=>{
        this.setData({
          order:data.list
        },()=>{
          wx.hideLoading();
          wx.stopPullDownRefresh();
          /*
          在用户下拉刷新的时候，在加载完成前，页面会保持被拉下来的状态，
          这里我们调用了这个方法，表示已经加载完成了，让页面弹回去。
          如果不调用这个方法，页面过一段时间后也会自动弹回去，这个回弹比较慢，
          所以最好在加载完成的时候手动调用一下这个方法。
          */
        })
      },
      fail:()=>{
        this.onLoad();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.is_last){
      return
    }
    this.loadData({
      last_id:this.last_id,
      success:data=>{
        var order = this.data.order
        data.list.forEach(item=>{
          order.push(item);
        });
        this.setData({
          order:order
        });
      },
      fail:()=>{
        this.onReachBottom();
      }
    })
  },

  //查看详情
  detail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/order/detail/detail?order_id=' + id
    })
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})