'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  // Params for Scan
  // Useful link https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
  // const params = {
  //   TableName: process.env.DYNAMODB_TABLE_USERS_PLACED_ORDERS,
  //   FilterExpression: "userid = :userid",
  //   ExpressionAttributeValues: { ":userid": event.pathParameters.id },
  //   ProjectionExpression: 'userid, orderDetails'
  // };
  const params = {
    TableName: process.env.DYNAMODB_TABLE_USERS_PLACED_ORDERS,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // fetch orders from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the orders for the userid',
      });
      return;
    }
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
