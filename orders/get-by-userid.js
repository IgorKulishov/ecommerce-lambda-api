'use strict';

const AWS = require('aws-sdk');
// For testing purposes need to instantiate Table inside function with region defined
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.get = (event, context, callback) => {

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
      callback({
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: error
      }, null);
      return;
    }
    callback(null, result.Items);
  });
};
