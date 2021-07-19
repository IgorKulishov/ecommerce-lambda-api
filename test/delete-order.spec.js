'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const deleteDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully delete item in database' });
};
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'delete', deleteDBFunction);
AWS.config.update({ region: "us-east-1" });
const deleteUserOrder = require('../orders/delete-order');
describe('test delete-user-order', () => {
    const eventMock = { path: { id: '1234567' } };
    afterEach(function() {
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('if dynamoDB delete was called', () => {
        const mockLambdaCallback = sinon.spy();
        deleteUserOrder.delete(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
