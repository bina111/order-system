// pages/list/list.js
const app = getApp();
const fetch = app.fetch;
var categoryHeight = [];    //记录各分类的高度

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,    //激活状态的分类项的索引
    tapIndex:0,   //表示用户按下哪个分类的索引
    promotion:{},  //促销信息
    foodList:[],  //商品信息
    cartList:{},   //购物车列表
    cartNumber:0,  //购物车数量
    cartPrice:0,    //购物车总价
    showCart:false,  //是否显示购物车列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取数据
    wx.showLoading({
      title: '努力加载中',
      mask: true,
    });
    fetch('food/list').then((data)=>{
      wx.hideLoading();
      for(var i in data.list){
        this.setData({
          activeIndex:i
        });
        break;
      }
      // console.log(data.list);
      this.setData({
        foodList:data.list,
        promotion:data.promotion[0]
      },()=>{
        //渲染后执行的高度
        let selQuery = wx.createSelectorQuery();
        let top = 0;
        selQuery.select('.food').boundingClientRect(rect=>{
          top = rect.top;
        });
        selQuery.selectAll('.food-category').boundingClientRect(res=>{
          res.forEach(rect=>{
            categoryHeight[rect.id.substring(rect.id.indexOf('_')+1)] = rect.top - top;
          });
        });
        selQuery.exec();
      })
    },()=>{
      this.onLoad();
    })
  },

  //this.changingCategory：为true表示分类正在发生变化（防止和右边滚动时冲突）。
  changingCategory:false,

  /*
  为什么使用tapIndex，而不是使用activeIndex：
  tapIndex表示用户单击项的索引，在按下以后就不变了，
  而activeIndex会根据右边的滚动而随时发生改变。
  如果使用activeIndex，会和“右边滚动时，切换左边激活项”的功能冲突。
  */

  //更改左边菜单来的激活状态
  tapCategory:function (e) {  
    var index = e.currentTarget.dataset.index;
    this.changingCategory = true;
    this.setData({
      activeIndex:index,
      tapIndex:index,
    },()=>{
      this.changingCategory = false;
    });

  },

  //右边滚动更改左边激活态
  /*
    onFoodScroll()方法的实现思路：
    根据内容卷起的高度scrollTop，
    来获知用户滚动到了哪个分类下了。
    需要先记住每个分类的高度，再进行判断。
  */
  onFoodScroll:function (e) {  
    var scrollTop = e.detail.scrollTop;
    var activeIndex = 0;
    categoryHeight.forEach((item,i)=>{
      if(scrollTop>=item){
        activeIndex=i;
      }
    });
    if(!this.changingCategory){
      this.changingCategory = true;
      this.setData({
        activeIndex:activeIndex,
      },()=>{
        this.changingCategory = false;
      })
    }
  },

  /*
    细节优化：
    当右侧菜单滚动到达底部时，有可能底部最后一个分类下的商品很少，
    会导致左边的菜单永远无法激活最后一项。
  */
  scrolltoLower:function () {  
    this.setData({
      activeIndex:categoryHeight.length-1,
    })
  },

  addToCart: function(e) {
    var id = e.currentTarget.dataset.id;
    var category_id = e.currentTarget.dataset.category_id;
    var food = this.data.foodList[category_id].food[id];
    /*
    添加到购物车，在添加前，先判断一下购物车中是不是已经有了，
    如果有了，则增加商品数量，如果没有，则添加到购物车中。
    */
    var cartList = this.data.cartList;
    if(cartList[id]){
      ++cartList[id].number;
    }
    else{
      cartList[id]={
        id:food.id,
        name:food.name,
        price:parseFloat(food.price),
        number:1
      }
    }
    this.setData({
      cartList:cartList,
      cartNumber:this.data.cartNumber+1,
      cartPrice:this.data.cartPrice+Number(food.price),
    });
    // console.log(food);
  },

  /*添加小球动画：
  在单击了“+”按钮以后，显示一个小球动画，让它以抛物线的方式进入购物车。
  示意图：
  */
 

  //购物车列表的隐藏和显示
  showCartList:function () {  
    if(this.data.cartNumber>0){
      this.setData({
        showCart:!this.data.showCart,
      })
    }
  },

  //减少商品数量
  cartNumberDec:function(e){
    const id = e.currentTarget.dataset.id;
    var cartList = this.data.cartList;
    const price = cartList[id].price;
    if(cartList[id].number>1){
      --cartList[id].number
    }else{
      delete cartList[id];
    } 
    this.setData({
        cartList:cartList,
        cartNumber:--this.data.cartNumber,
        cartPrice:this.data.cartPrice-price
    });
    if(this.data.cartNumber<=0){
      this.setData({
        showCart:false
      })
    }
  },

  //添加商品数量
  cartNumberAdd:function (e) {  
    const id = e.currentTarget.dataset.id;
    var cartList = this.data.cartList;
    const price = cartList[id].price;
    ++cartList[id].number;
    this.setData({
      cartList:cartList,
      cartNumber:++this.data.cartNumber,
      cartPrice:this.data.cartPrice+price
    })
  },

  //清空购物车
  cartClear:function () {  
    this.setData({
      showCart:false,
      cartPrice:0,
      cartNumber:0,
      cartList:{}
    })
  },

  //跳转到订单页面
  order:function(){
    if(this.data.cartNumber === 0){
      return ;
    }
    wx.showLoading({
      title:"正在生成订单",
      mask:true
    })
    fetch('/food/order',{
      order:this.data.cartList
    },'POST').then(data=>{
      wx.hideLoading();
      // console.log("订单创建成功，id为："+data.order_id);
      wx.navigateTo({
        url: '../order/balance/balance?order_id='+data.order_id,
      });
    },()=>{
      this.order();
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