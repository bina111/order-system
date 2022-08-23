var con = require('./config.js');
module.exports = function(path,data,method){
  var sess = wx.getStorageSync('PHPSESSID')
  return new Promise((resolve,reject)=>{
    //请求数据
    wx.request({
      url: con.url + path,
      method:method,
      data:data,
      header:{
        'Content-Type': 'json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': sess ? 'PHPSESSID=' + sess : ''
      },
      success:res=>{
        if (res.header['Set-Cookie'] !== undefined) {
          sess = decodeCookie(res.header['Set-Cookie'])['PHPSESSID']
          wx.setStorageSync('PHPSESSID', sess)
        }      
        if(res.statusCode!==200){
          fail("服务器出错！",reject);
          return ;
        }
        if(res.data.code === 0){
          fail(res.data.msg,reject);
          return ;
        }
        resolve(res.data);
      }
    })
  });
  function fail(msg,callback){
    wx.hideLoading();
    wx.showModal({
      title:msg,
      confirmText:'重试',
      success:function(res){
        if(res.confirm){
          callback();
        }
      }
    })
  }
  //解析Set_Cookie,将其转换成对象
  function decodeCookie(cookie){
    var obj = {};
    cookie.split('; ').forEach((item,i)=>{
      var arr = item.split('=');
      obj[arr[0]] = arr[1] !== undefined?decodeURIComponent(arr[1]):true;
    });
    return obj;
  }
}