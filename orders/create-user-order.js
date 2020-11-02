'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  // For testing purposes need to instantiate Table inside function with region defined
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  let data;
  const timestamp = new Date().getTime();
  if(typeof event.body === 'string') {
    data = JSON.parse(event.body);
  } else {
    data = event.body;
  }

  if (!data.userid || !data.userRole || !data.orderid || !data.orderDetails) {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the order item.',
    });
    return;
  }
  const paramsOrderDetails = {
    TableName: process.env.DYNAMODB_TABLE_ORDER_DETAILS,
    Item: {
      id: uuid.v1(),
      userid: data.userid,
      orderid: data.orderid,
      orderDetails: JSON.parse(data.orderDetails),
      userRole: data.userRole,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };
  /** Safe placed orders **/
  dynamoDb.put(paramsOrderDetails, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the order item.',
      });
      return;
    }
    callback(null, paramsOrderDetails.Item);
  });
};
