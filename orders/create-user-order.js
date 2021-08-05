'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

const OrderStatus = {
  'not_checked' : 'not_checked',
  'prepared_for_shipment' : 'prepared_for_shipment',
  'shipped' : 'shipped',
  'delivered' : 'delivered'
}

module.exports.create = (event, context, callback) => {
  let data;
  const time = new Date();
  const timestamp = time.getTime();
  const orderDay = time.getDate().toString();
  const orderYearMonth = time.toISOString().slice(0,7);
  const orderPlacedDate = time.toISOString().split('T')[0];
  if(typeof event.body === 'string') {
    data = JSON.parse(event.body);
  } else {
    data = event.body;
  }

  if (!data.userid || !data.userRole || !data.orderid || !data.orderDetails) {
    console.error('Validation Failed');
    callback({
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: 'Couldn\'t create the order item.',
    }, null);
    return;
  }
  const paramsOrderDetails = {
    TableName: process.env.DYNAMODB_PLACED_ORDERS_DETAILS,
    Item: {
      id: uuid.v1(),
      userid: data.userid,
      orderid: data.orderid,
      orderDetails: typeof data.orderDetails ==='string' ? JSON.parse(data.orderDetails) : data.orderDetails,
      userRole: data.userRole,
      orderStatus: OrderStatus.not_checked,
      createdAt: timestamp,
      updatedAt: timestamp,
      orderPlacedDate: time.toISOString().split('T')[0]
    }
  };
  /** Save placed orders **/
  dynamoDb.put(paramsOrderDetails, (error, res) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback({
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the order item.',
      }, null);
      return;
    }
    /** Save order month and year **/
    saveOrderDate();
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: paramsOrderDetails.Item
    };
    callback(null, response);
  });

  function saveOrderDate() {
    const updateParamsOrderYearMonth = {
      TableName: process.env.DYNAMODB_PLACED_ORDERS_DATES,
      Key: {
        orderYearMonth: orderYearMonth,
        orderDay: orderDay
      },
      UpdateExpression: 'SET orderPlacedDate = :orderPlacedDate, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':orderPlacedDate': orderPlacedDate,
        ':updatedAt': timestamp
      },
      ReturnValues: 'UPDATED_NEW',
    };
    dynamoDb.update(updateParamsOrderYearMonth, (error, updateResult) => {
      if (error) {
        console.error(error);
        callback({
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t fetch the order item.',
        }, null);
        return;
      }
      console.log('successfully saved order date', updateResult);
    });
  }
};
