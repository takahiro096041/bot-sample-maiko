'use strict';
const request = require('request');
const parseString = require('xml2js').parseString;

const id = "190";
const pass = "rGfS3enPgdV5";
const host = "https://caloriecheck.eatsmart.jp";

exports.getKey = function(callback){
  let param = {
    method: 'POST',
    url: host + '/auth',
    form: {
      siteId: id,
      password: pass
    }
  };
  request(param, function(err, res, body){
    console.log(body);
    parseString(body.toString(), function(err, data){
      if(data.data.status == 0){
        callback(data.data.authKey.toString());
      }else{
        callback(null);
      }
    });
  });
}

exports.freewordSearch = function(key, kbn, keyword, callback){
  let param = {
    method: 'GET',
    url: host + '/freeword/search',
    qs: {
      authKey: key,
      freewordSearchKbn: kbn,
      freeword: keyword
    }
  };
  request(param, function(err, res, body){
    parseString(body.toString(), function(err, data){
      if(data.data.status == 0){
        console.log(data.data.food);
        const foods = data.data.food;
        callback(foods);
      }else{
        callback(null);
      }
    });
  });
}

exports.getLargeCategory = function(key, callback){
  let param = {
    method: 'GET',
    url: host + '/largecategory/list',
    qs: {
      authKey: key,
      categoryKbn: "01"
    }
  };
  request(param, function(err, res, body){
    console.log(body);
    parseString(body.toString(), function(err, data){
      if(data.data.status == 0){
        callback(data.data.authKey);
      }else{
        console.log(err);
        callback(null);
      }
    });
  });
}
