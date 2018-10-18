function convertToStarsArray(stars) {
  var num = stars.toString().substring(0,1);
  // console.log(num);
  var array = [];
  for(var i = 0; i < 5; i++) {
    if(i < num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  // console.log(array);
  return array;
}

function convertToCatsArray(casts) {
  var castsjoin = '';
  for( var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + '/';
  }
  // console.log(castsjoin.substring(0, castsjoin.length - 1));
  return castsjoin.substring(0, castsjoin.length - 1);
}

function convertToCatsInfos(casts) {
  var castsArray = [];
  for(var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : '',
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  // console.log(castsArray);
  return castsArray;
}



function http(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'json'
    },
    success: function (res) {
      console.log(res);
      callBack(res.data);
    },
    fail: function (err) {
      console.log(err);
    }
  })
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCatsInfos: convertToCatsInfos,
  convertToCatsArray: convertToCatsArray
}