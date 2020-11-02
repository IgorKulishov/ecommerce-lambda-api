'use strict';
// const auth = require('../auth/auth');

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {

  // For testing purposes need to instantiate Tadle inside function with region defined
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

  const params = {
    TableName: process.env.DYNAMODB_TABLE_USERS_PLACED_ORDERS
  };
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the orders.'
      });
      return;
    }
    // create a response
    const response = {
        statusCode: 200,
        body: JSON.stringify(result.Items),
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          }
      };
    callback(null, response);
  });
};
