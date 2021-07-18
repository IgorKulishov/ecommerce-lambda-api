'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const deleteDBFunction = (params, queryCallback) => {
    console.log('successfully query item in database');
    queryCallback(null, { Items: 'successfully query item in database' });
};
const mockLambdaCallback = sinon.spy();
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'delete', deleteDBFunction);
AWS.config.update({ region: "us-east-1" });
const deleteUserOrder = require('../orders/delete-order');
describe('test delete-user-order', () => {

    afterEach(function() {
        AWSMock.restore('DynamoDB');
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('if dynamoDB delete was called', () => {
        const eventMock = { path: { id: '1234567' } };
        deleteUserOrder.delete(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
