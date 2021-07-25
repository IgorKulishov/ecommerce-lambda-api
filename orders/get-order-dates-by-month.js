'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.getOrderDatesByMonth = (event, context, callback) => {
  let orderYearMonth = event.path.id;
  /** Fall back to current month **/
  if(!orderYearMonth) {
    const time = new Date();
    orderYearMonth = time.toISOString().slice(0,7);
  }
  const params = {
    TableName: process.env.DYNAMODB_PLACED_ORDERS_DATES,
    KeyConditionExpression: "orderYearMonth = :orderYearMonth",
    ExpressionAttributeValues: {
      ":orderYearMonth": orderYearMonth
    },
    ProjectionExpression: "orderPlacedDate"
  };
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
    const resultsObject = result.Items;
    if(resultsObject) {
      const resultsArray = resultsObject.map(res => res.orderPlacedDate);
      callback(null, resultsArray);
    } else {
      callback(null, []);
    }
  });
};
