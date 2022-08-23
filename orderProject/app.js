// app.js
App({
  fetch:require('./utils/fetch.js'),
  onLaunch:function(){
    //判断登录状态
    wx.showLoading({
      title: '登录中',
      mask:true
    });
    this.fetch('user/setting').then((data)=>{
      if (data.isLogin) {
        this.onUserInfoReady()
      }
      else{
        //未登录，请求登录
        this.login({
          success:()=>{
            this.onUserInfoReady();
          },
          fail:()=>{
            console.log("登录失败");
            this.onLaunch();
          }
        });
      }
    },()=>{
      this.onLaunch();
    })
  },

  //编写登录函数
  login:function(options){  //options为登录成功和失败的回调函数
    wx.login({
      success: (result) => {
        //请求服务登录接口
        this.fetch('user/login',{js_code:result.code}).then((data)=>{
          if(data && data.isLogin){
            //登录成功
            options.success();
          }
          else{
            //登录失败
            wx.hideLoading();
            wx.showModal({
              title:'登录失败',
              confirmText:'重试',
              success:res=>{
                if(res.confirm){
                  options.fail();
                }
              }
            })
          }
        },()=>{
          //登录失败，服务器异常
          options.fail();
        })
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  userInfoReady:false,   //表示用户登录状态
  onUserInfoReady:function(){   //处于登录态执行相应的操作
    wx.hideLoading();
    /*
    开发思路：
    在App实例中保存userInfoReady布尔值，表示用户信息是否就绪。
    如果希望在就绪的时候执行某些操作，就把回调函数保存给app.userInfoReadyCallback。

    然后利用app.onUserInfoReady()来决定调用时机，
    如果存在userInfoReadyCallback就去调用，
    最后将userInfoReady设为true。
    */
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback()
    }
    this.userInfoReady = true
  }
})
