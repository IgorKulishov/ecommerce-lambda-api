'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  // TODO: Move instance outside function , currently for testing purposes need to instantiate Tadle inside function with region defined
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  const params = {
    TableName: process.env.DYNAMODB_TABLE_ORDER_DETAILS,
    IndexName: "usersGSI",
    KeyConditionExpression: "userid = :userid",
    ExpressionAttributeValues: {
      ":userid": event.path.id
    }
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
};
