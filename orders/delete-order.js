'use strict';

const AWS = require('aws-sdk');
// For testing purposes need to instantiate Table inside function with region defined
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.delete = (event, context, callback) => {
  const order_id = event.path.id;
  const params = {
    TableName: process.env.DYNAMODB_ORDER_DETAILS,
    Key: {
      id: order_id,
    },
  };

  // delete the order from the database
  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the order item.',
      });
      return;
    }
    callback(null, {
      id: order_id,
      message: "order deleted"
    });
  });
};
