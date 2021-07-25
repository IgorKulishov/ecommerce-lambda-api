'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
let queryDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully query item by userid in database' });
};
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'query', queryDBFunction);
AWS.config.update({ region: "us-east-1" });
const getByUserId = require('../orders/get-by-userid');

describe('test get order details by user id', () => {
    const eventMock = { path:{ id: '1234567' } };

    beforeEach(() => {
        process.env.DYNAMODB_PLACED_ORDERS_DETAILS = 'TEST_DB'
    });
    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        delete process.env.DYNAMODB_PLACED_ORDERS_DETAILS;
        queryDBFunction = undefined;
    });

    it('if dynamoDB query by userid was called', async () => {
        const mockLambdaCallback = sinon.spy();
        getByUserId.getByUserId( eventMock, {}, mockLambdaCallback );
        await expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
