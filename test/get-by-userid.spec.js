'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const queryDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully query item by userid in database' });
};
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'query', queryDBFunction);
AWS.config.update({ region: "us-east-1" });
const getByUserId = require('../orders/get-by-userid');

describe('test get order details by user id', () => {
    const eventMock = { path:{ id: '1234567' } };

    afterEach(function() {
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('if dynamoDB query by userid was called', () => {
        const mockLambdaCallback = sinon.spy();
        getByUserId.getByUserId( eventMock, {}, mockLambdaCallback );
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
