var postsData = require('../../data/posts-data.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //做数据绑定,在onLoad执行之后发生的.
  },
  onPostTap:function(event) {
    // console.log(event);
    var postId = event.currentTarget.dataset.postId;
    // console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  // onSwiperItemTap: function(event) {
  //   // console.log(event);
  //   var postId = event.currentTarget.dataset.postid;
  //   // console.log(postId);
  //   wx.navigateTo({
  //     url: 'post-detail/post-detail?id=' + postId
  //   })
  // },
  onSwiperTap: function(event) {
    console.log(event);
    //target 和 currentTarget 
    //target指的是当前点击的组件  
    //currentTarget 指的是事件捕获的组件 
    // currentTarget这里指的是image   target这是指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //异步时不可这样写
    // this.data.postList = postsData.postList;
    this.setData({
      postList: postsData.postList
    })
  }
  
})