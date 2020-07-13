'use strict';
// const auth = require('../auth/auth');

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE
};

module.exports.list = (event, context, callback) => {
  /** TODO: add separate lambda function for API Gateway JWT Auth and move code from "../auth/auth.js" **/
  // const decoder = auth.validateJwt(event);
  // const decoder = Auth.validateJwt(event);
  // if(decoder !== 'unauthorized') {
  //   // Here fetch all order from the database
  // }

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
        body: JSON.stringify(result.Items)
      };
      callback(null, response);
    });


};
