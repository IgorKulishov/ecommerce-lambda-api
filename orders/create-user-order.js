'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies


module.exports.create = (event, context, callback) => {

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
  /** Safe data to 'user placed orders' Table **/
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
    // const response = {
    //   statusCode: 200,
    //   body: JSON.stringify(params.Item),
    // };
    // callback(null, response);
    /** Safe data to 'order details' Table **/
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
      };
      callback(null, response);
    });
  });
};
