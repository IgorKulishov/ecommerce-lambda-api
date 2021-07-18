'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const deleteDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully delete item in database' });
};
const mockLambdaCallback = sinon.spy();
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'delete', deleteDBFunction);
AWS.config.update({ region: "us-east-1" });
process.env.DYNAMODB_ORDER_DETAILS = 'TEST';
const deleteUserOrder = require('../orders/delete-order');
describe('test delete-user-order', () => {
    afterEach(function() {
        AWSMock.restore('DynamoDB.DocumentClient');
        delete process.env.DYNAMODB_ORDER_DETAILS;
    });

    it('if dynamoDB delete was called', () => {
        const eventMock = { path: { id: '1234567' } };
        deleteUserOrder.delete(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
