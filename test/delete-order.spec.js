'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
let deleteDBFunction = (params, queryCallback) => {
    queryCallback(null, {
        id: 'uuid_abc_123',
        message: "order deleted"
    });
};
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'delete', deleteDBFunction);
AWS.config.update({ region: "us-east-1" });
const deleteUserOrder = require('../orders/delete-order');
describe('test delete-user-order', () => {
    const eventMock = { path: { id: '1234567' } };
    beforeEach(() => {
        process.env.DYNAMODB_PLACED_ORDERS_DETAILS = 'TEST_DB'
    });
    afterEach(function() {
        AWSMock.restore('DynamoDB.DocumentClient');
        delete process.env.DYNAMODB_PLACED_ORDERS_DETAILS;
        deleteDBFunction = undefined;
    });

    it('if dynamoDB delete was called', async () => {
        const mockLambdaCallback = sinon.spy();
        await deleteUserOrder.delete(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
