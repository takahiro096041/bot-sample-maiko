'use strict';
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'drink-states';

exports.saveState = function(item, callback){
  const param = {
    TableName: tableName,
    Item: item
  };
  dynamo.put(param, function(err, data){
    console.log(err);
  });
}

exports.getState = function(userId, callback){
  const param = {
    TableName: tableName,
    Key: {
      userId: userId
    }
  };
  dynamo.get(param, function(err, data){
    if(err){
      console.log(err);
    }else{
      callback(data.Item);
    }
  })
}
