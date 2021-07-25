'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
AWSMock.setSDKInstance(AWS);
let queryDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: ['successfully query item by orderid in database'] });
};
AWSMock.mock('DynamoDB.DocumentClient', 'query', queryDBFunction);
AWS.config.update({ region: "us-east-1" });
const getByOrderId = require('../orders/get-by-orderid');

describe('test get order details by order id', () => {
    const eventMock = { path: { id: '1234567' } };
    beforeEach(() => {
        process.env.DYNAMODB_PLACED_ORDERS_DETAILS = 'TEST_DB'
    });
    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        delete process.env.DYNAMODB_PLACED_ORDERS_DETAILS;
        queryDBFunction = null;
    });

    it('if dynamoDB get by orderid was called', async () => {
        const mockLambdaCallback = sinon.spy();
        await getByOrderId.getByOrderId(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
