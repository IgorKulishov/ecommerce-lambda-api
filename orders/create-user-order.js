'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  // For testing purposes need to instantiate Tadle inside function with region defined
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (!data.userid || !data.userRole || !data.orderid || !data.orderDetails) {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the order item.',
    });
    return;
  }
  // A. Params for to safe data into 'user placed orders' Table
  const paramsUserOrders = {
    TableName: process.env.DYNAMODB_TABLE_USERS_PLACED_ORDERS,
    Item: {
      id: data.userid,
      orderid: data.orderid,
      userRole: data.userRole,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };
  // B. Params for to safe data into 'order details' Table
  const paramsOrderDetails = {
    TableName: process.env.DYNAMODB_TABLE_ORDER_DETAILS,
    Item: {
      id: data.orderid,
      orderDetails: data.orderDetails,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };
  /** 1. Safe data to 'user placed orders' Table **/
  dynamoDb.put(paramsUserOrders, (error) => {
    // handle potential errors to safe to 'user placed orders' Table
    if (error) {
      // Error in response to safe 'user placed orders' Table
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the order item.',
      });
      return;
    }
    /** 2. Safe data to 'order details' Table **/
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

      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify({...paramsOrderDetails.Item, ...paramsUserOrders.Item}),
        headers: {
          "Access-Control-Allow-Headers" : "*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
      };
      callback(null, response);
    });
  });
};
