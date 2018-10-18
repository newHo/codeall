var app = getApp();
var util = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheates: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatesUrl = app.globaData.doubanBase + "/movie/in_theaters"+"?start=0&count=3";
    var comingSoonUrl = app.globaData.doubanBase + "/movie/coming_soon"+"?start=0&count=3";
    var top250Url = app.globaData.doubanBase + "/movie/top250"+"?start=0&count=3";

    this.getMovieListData(inTheatesUrl, 'inTheates', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', '豆瓣Top250');
   
  },
  onBindFocus: function(event) {
    // console.log('focus');
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onbindConfirm: function(event) {
    console.log(event);
    var text = event.detail.value;
    var searchUrl = app.globaData.doubanBase + '/movie/search?q=' + text;
    this.getMovieListData(searchUrl, 'searchResult', '');

  },
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },
  //点击更多
  onMoreTap:function(event) {
    //  console.log(event);
    var category = event.currentTarget.dataset.category;
    // console.log(category);
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category
    })
  },
  //点击进入详情
  onMovieTap: function(event) {
    console.log(event);
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
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
        // console.log(res);
        _this.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (err) {
        //断网,请求没建立会走
        console.log(err);
      }
    })
  },
  processDoubanData: function (movieDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in movieDouban.subjects) {
      var subject = movieDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6) {
        title = title.slice(0,6) + "...";
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
    // console.log(movies);

    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };

    this.setData(readyData)
    // console.log(readyData);
  }
})