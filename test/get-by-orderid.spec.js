'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
AWSMock.setSDKInstance(AWS);
const queryDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully query item in database' });
};
const mockLambdaCallback = sinon.spy();
AWSMock.mock('DynamoDB.DocumentClient', 'query', queryDBFunction);
AWS.config.update({ region: "us-east-1" });
process.env.DYNAMODB_ORDER_DETAILS = 'TEST';
const getByOrderId = require('../orders/get-by-orderid');

describe('test get order details by order id', () => {
    const eventMock = { path: { id: '1234567' } };

    afterEach(function() {
        AWSMock.restore('DynamoDB.DocumentClient');
        delete process.env.DYNAMODB_ORDER_DETAILS;
    });

    it('if dynamoDB get by orderid was called', () => {
        getByOrderId.getByOrderId(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
