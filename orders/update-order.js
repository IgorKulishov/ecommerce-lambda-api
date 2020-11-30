'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.update = (event, context, callback) => {
  // For testing purposes need to instantiate Tadle inside function with region defined

  const timestamp = new Date().getTime();
  let data;
  if(typeof event.body === 'string') {
    data = JSON.parse(event.body);
  } else {
    data = event.body;
  }
  // validation
  if (typeof data.orderDetails !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed');
    callback({
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the orders item.',
    }, null);
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE_ORDER_DETAILS,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ':orderDetails': data.orderDetails,
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET orderDetails = :orderDetails, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the order in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback({
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the order item.',
      }, null);
      return;
    }

    callback(null, JSON.stringify(result.Attributes));
  });
};
