'use strict';

const AWS = require('aws-sdk');
// For testing purposes need to instantiate Table inside function with region defined
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.delete = (event, context, callback) => {
  let order_id;
  let data;
  if(typeof event.body === 'string') {
    data = JSON.parse(event.body);
  } else {
    data = event.body;
  }
  if(!data.order_id) {
    console.error('Validation Failed');
    callback({
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: 'Couldn\'t delete the order.',
    }, null);
    return;
  }
  const params = {
    TableName: process.env.DYNAMODB_PLACED_ORDERS_DETAILS,
    Key: {
      id: data.order_id,
    },
  };
  // delete the order from the database
  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback({
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the order item.',
      }, null);
      return;
    }
    callback(null, {
      id: order_id,
      message: "order deleted"
    });
  });
};
