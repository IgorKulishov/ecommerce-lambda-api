'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  // For testing purposes need to instantiate Tadle inside function with region defined
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

  const params = {
    TableName: process.env.DYNAMODB_TABLE_ORDER_DETAILS,
    Key: {
      id: event.pathParameters.id,
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

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({}),
      headers: {
        "Access-Control-Allow-Headers" : "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
    };
    callback(null, response);
  });
};
