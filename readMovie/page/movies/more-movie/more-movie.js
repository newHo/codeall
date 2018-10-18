var app = getApp();
var util = require('../../../utils/utils.js');
Page({
  data: {
    navigateTitle: '',
    movies: [],
    requestUrl: '',
    totalCount:0,
    isEmpty: false
  },
  //点击进入详情
  onMovieTap: function (event) {
    console.log(event);
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    })
    var dataUrl = "";
    switch (category) {
      case '正在热映':
        dataUrl = app.globaData.doubanBase + "/movie/in_theaters";
        break;
      case '即将上映':
        dataUrl = app.globaData.doubanBase + "/movie/coming_soon";
        break;
      case '豆瓣Top250':
        dataUrl = app.globaData.doubanBase + "/movie/top250";
        break
    }
    this.setData({
      requestUrl: dataUrl
    })
    util.http(dataUrl, this.processDoubanData);
  },
  processDoubanData: function (movieDouban) {
    var movies = [];
    for (var idx in movieDouban.subjects) {
      var subject = movieDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.slice(0, 6) + "...";
      }

      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    let totalMovies = [];
    //如果要绑定新加载的数据,那么需要旧有数据合并一起
    if(!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    })
    //起始位置 20条数据
    this.setData({
      totalCount: this.data.totalCount + 20
    })
    //隐藏导航条加载动画。
    wx.hideNavigationBarLoading();
    //停止当前页面的下拉刷新
    wx.stopPullDownRefresh();
  },
  getMovieListData: function (url, settedKey, categoryTitle) {
    var _this = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        console.log(res);
        _this.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (err) {
        //断网,请求没建立会走
        console.log(err);
      }
    })
  },
  //加载更多事件  上拉加载
  onScrollLower: function(event) {
    //在当前页面显示导航条加载动画。
    wx.showNavigationBarLoading();
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    util.http(nextUrl, this.processDoubanData);

  },
  //下拉刷新
  // 在滚动 scroll-view 时会阻止页面回弹,所以在scroll-view 中滚动，是无法触发 onPullDownRefresh.
  onPullDownRefresh: function() {
    // wx.startPullDownRefresh()
    //在当前页面显示导航条加载动画。
    wx.showNavigationBarLoading();
     let refreshUrl = this.data.requestUrl + '?start=0&count=20';
    this.setData({
      isEmpty: true,
      movies: [],
      totalCount: 0
    })
     util.http(refreshUrl, this.processDoubanData);

  },
  onReady: function(event){
    //动态设置网页标题
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function (res) {

      }
    })
  }
 
})