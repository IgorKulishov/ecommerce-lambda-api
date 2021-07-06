'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

const OrderStatus = {
  'not_checked' : 'not_checked',
  'prepared_for_shipment' : 'prepared_for_shipment',
  'shipped' : 'shipped',
  'delivered' : 'delivered'
}

module.exports.list = (event, context, callback) => {
  // For testing purposes need to instantiate Table inside function with region defined
  const ordersDate = event && event.query ? event.query.ordersDate : undefined;
  const orderStatus = event && event.query &&
      event.query.orderStatus && Object.values(OrderStatus).includes(event.query.orderStatus) ?
      event.query.orderStatus :
      OrderStatus.not_checked;

  let expressionAttributeValues;

  if(ordersDate) {

    expressionAttributeValues = {
      ":ordersDate": ordersDate
    }
    if(!!orderStatus) {
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ":orderStatus": orderStatus
      }
    }

    const params = {
      IndexName: "ordersDatesGSI",
      TableName: process.env.DYNAMODB_ORDER_DETAILS,
      KeyConditionExpression: "orderPlacedDate = :ordersDate",
      FilterExpression: "orderStatus = :orderStatus",
      ExpressionAttributeValues: expressionAttributeValues
    };
    dynamoDb.query(params, (error, result) => {
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
