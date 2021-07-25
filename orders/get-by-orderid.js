'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.getByOrderId = (event, context, callback) => {

    const params = {
      TableName: process.env.DYNAMODB_PLACED_ORDERS_DETAILS,
      IndexName: "ordersGSI",
      KeyConditionExpression: "orderid = :orderid",
      ExpressionAttributeValues: {
        ":orderid": event.path.id
      }
    };
  // query orders from the database
  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback({
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: error
      }, null);
      return;
    }
    callback(null, result.Items);
  });
};
