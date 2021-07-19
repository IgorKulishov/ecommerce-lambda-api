'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.update = (event, context, callback) => {

  const timestamp = new Date().getTime();
  let data;
  if(typeof event.body === 'string') {
    data = JSON.parse(event.body);
  } else {
    data = event.body;
  }
  // validation
  if (!data.orderDetails || !data.orderStatus) {
    console.error('Validation Failed');
    callback({
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Missing parameters in request body: couldn\'t update the order.',
    }, null);
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_ORDER_DETAILS,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ':orderDetails': data.orderDetails,
      ':orderStatus': data.orderStatus,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET orderDetails = :orderDetails, orderStatus = :orderStatus, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the order in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    console.log('DB update');
    if (error) {
      console.log('DB update error: ');
      console.error(error);
      callback({
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the order item.',
      }, null);
      return;
    }
    console.log(`error : ${error}`);
    console.log(`result : ${result}`);

    callback(null, JSON.stringify(result.Attributes));
  });
};
