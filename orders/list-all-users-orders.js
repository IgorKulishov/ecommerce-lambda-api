'use strict';
// const auth = require('../auth/auth');

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.list = (event, context, callback) => {
  // For testing purposes need to instantiate Tadle inside function with region defined
  const ordersDate = event && event.query ? event.query.ordersDate : undefined;
  const isOrderChecked = event && event.query ? event.query.isOrderChecked : undefined;

  let expressionAttributeValues;

  if(ordersDate) {

    expressionAttributeValues = {
      ":ordersDate": ordersDate
    }
    if(isOrderChecked === 'true' || isOrderChecked === 'false') {
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ":isOrderChecked": isOrderChecked === 'true'
      }
    }

    const params = {
      IndexName: "ordersDatesGSI",
      KeyConditionExpression: "orderPlacedDate = :ordersDate",
      FilterExpression: "checked = :isOrderChecked",
      TableName: process.env.DYNAMODB_TABLE_ORDER_DETAILS,
      ExpressionAttributeValues: expressionAttributeValues
    };

    // query orders from the database
    dynamoDb.query(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: error
        });
        return;
      }
      callback(null, result.Items);
    });

  } else {
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'ordersDate query params is missing'
    });
  }
};
