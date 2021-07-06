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
  const timestamp = new Date().getTime();
  const time = new Date();
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
    TableName: process.env.DYNAMODB_ORDER_DETAILS,
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
  /** Safe placed orders **/
  dynamoDb.put(paramsOrderDetails, (error) => {
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
    callback(null, paramsOrderDetails.Item);
  });
};
