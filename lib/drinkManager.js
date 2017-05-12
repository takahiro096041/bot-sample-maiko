'use strict';
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'drink-states';

exports.drink = (userId, alcohol) => {
  let params = {
    TableName: tableName,
    Key: {
      uid: userId
    }
  };

  return dynamo.get(params).promise()
    .then(data => {
      let item = data.Item;
      if (!item) {
        item = {
          uid: userId,
          alcohol: 0
        };
      }
      item.alcohol += Number(alcohol) * 0.8;
      delete params.Key;
      params.Item = item;

      return dynamo.put(params).promise();
    });
};

exports.getAlcohol = (userId) => {
  const params = {
    TableName: tableName,
    Key: {
      uid: userId
    }
  };

  return dynamo.get(params).promise()
    .then(data => {
      return data.Item ? data.Item.alcohol : 0;
    });
};

exports.reset = (userId) => {
  const params = {
    TableName: tableName,
    Key: {
      uid: userId
    }
  };

  return dynamo.delete(params).promise();
};
