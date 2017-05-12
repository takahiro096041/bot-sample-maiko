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
      if (!data) {
        data = {
          uid: userId,
          alcohol: 0
        };
      }
      data.alcohol += alcohol;
      delete params.Key;
      params.Item = data;

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
      return data.Item.alcohol;
    });
};
