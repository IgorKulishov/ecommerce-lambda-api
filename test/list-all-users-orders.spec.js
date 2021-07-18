'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const updateDBFunc= (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully query item in database' });
};
const mockLambdaCallback = sinon.spy();
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'query', updateDBFunc);
AWS.config.update({ region: "us-east-1" });
process.env.DYNAMODB_ORDER_DETAILS = 'TEST';
const allOrders = require('../orders/list-all-users-orders');

describe('test list all orders for all users', () => {
    afterEach(function() {
        // AWSMock.restore('DynamoDB');
        AWSMock.restore('DynamoDB.DocumentClient');
        delete process.env.DYNAMODB_ORDER_DETAILS;
    });

    it('if dynamoDB query was called', () => {
        allOrders.list({
            query: {
                ordersDate: '2021-07-05',
                orderStatus: 'prepared_for_shipment'
            }
        }, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
