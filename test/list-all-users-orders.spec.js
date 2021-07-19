'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const updateDBFunc= (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully query item by orderPlacedDate in database' });
};
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'query', updateDBFunc);
AWS.config.update({ region: "us-east-1" });
const allOrders = require('../orders/list-all-users-orders');

describe('test list all orders for all users', () => {
    const eventMock = {
        query: {
            ordersDate: '2021-07-05',
            orderStatus: 'prepared_for_shipment'
        }
    };
    afterEach(function() {
        // AWSMock.restore('DynamoDB');
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('if dynamoDB query was called', () => {
        const mockLambdaCallback = sinon.spy();
        allOrders.list(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
