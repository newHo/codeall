var postsData = require('../../../data/posts-data.js');
//调用app.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayMusic: false
  },
  // onCollectionTap: function (event) {
  //   //获取缓存的方法
  //   var game = wx.getStorageSync('key');
  //   console.log(game);
  // },
  // onDateTap: function(event) {
  //   //清除指定缓存, 如果清除所有,不写key即可
  //   wx.removeStorageSync("key");
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    var postId = options.id;
    this.setData({
      currentId: postId
    })
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    })

    // wx.setStorageSync('key', '风暴英雄');
    //修改和设置是一样的, 保持键名一致
    // wx.setStorageSync('key',{
    //   game: '风暴英雄',
    //   developer: '暴雨'
    // })
    var postsCollected = wx.getStorageSync('posts_collected');
    // console.log(postsCollected);
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      postCollected = postCollected === undefined ? false : postCollected;
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }

    if(app.globaData.g_isPlayingMusic && app.g_currentMusicPostId === this.data.currentId) {
      this.setData({
        isPlayMusic: true
      })
    }

    this.setMusicMonitor();
   
  },
  setMusicMonitor: function() {
    //监听音乐
    const _this = this;
    wx.onBackgroundAudioPlay(function () {
      _this.setData({
        isPlayMusic: true
      })
      app.globaData.g_isPlayingMusic = true;
      app.globaData.g_currentMusicPostId = _this.data.currentId;
    })
    //歌曲暂停改变图标
    wx.onBackgroundAudioPause(function () {
      _this.setData({
        isPlayMusic: false
      })
      app.globaData.g_isPlayingMusic = false;
      app.globaData.g_currentMusicPostId = null;
    })
    //歌曲放完改变图标
    wx.onBackgroundAudioStop(function () {
      _this.setData({
        isPlayMusic: false
      })
      app.globaData.g_isPlayingMusic = false;
      app.globaData.g_currentMusicPostId = null;
    })
  },
  onCollected: function(event) {
    this.getPostsCollectedSync();
    // this.getPostsCollectedAsy();
  },
  //异步写法
  getPostsCollectedAsy: function() {
    const _this = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        var postsCollected = res.data;
        //以上写法不同
        var postCollected = postsCollected[_this.data.currentId];
        postCollected = !postCollected;
        postsCollected[_this.data.currentId] = postCollected;
        _this.showToast(postsCollected, postCollected);
      }
    })
  },
  //同步写法
  getPostsCollectedSync: function() {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentId];
    postCollected = !postCollected;
    postsCollected[this.data.currentId] = postCollected;

    this.showToast(postsCollected, postCollected);
    //收藏文章用户确认意义不大,无需特别提醒,所以用
    // this.showModal(postsCollected, postCollected);
  },
  showToast: function(postsCollected, postCollected) {
    //更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量,从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      duration: 1000,
      icon: "success"
    })
  },
  showModal: function(postsCollected, postCollected) {
    var _this = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? "收藏该文章?" : "取消收藏该文章",
      showCancel: 'true',
      confirmText: '确认',
      confirmColor: '#405f80',
      cancelText: '取消',
      cancelColor: '#333',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          _this.setData({
            collected: postCollected
          })
        }
        if (res.cancel) {
          // wx.setStorageSync('posts_collected', postsCollected);
        }
      }
    })
  },
  onShareTap: function(event) {
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        console.log(res);
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "用户是否取消?" + res.cancel + '现在无法实现分享功能',
        })
      }
    })
  },
  onMusicTap: function(event) {
    var isPlayMusic = this.data.isPlayMusic;
    if(isPlayMusic) {
      //音乐暂停
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.postData.music.url,
        title: this.data.postData.music.title
      })
      this.setData({
        isPlayMusic: true
      })
    }
  }

})