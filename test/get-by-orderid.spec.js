'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
AWSMock.setSDKInstance(AWS);
const getTableSpy = sinon.spy();
AWSMock.mock('DynamoDB.DocumentClient', 'query', getTableSpy);
AWS.config.update({ region: "us-east-1" });
const getByOrderId = require('../orders/get-by-orderid');

describe('test get order details by order id', () => {
    const eventMock = { path: { id: '1234567' } };

    // afterEach(function() {
    //     AWSMock.restore('DynamoDB');
    // });

    it('if dynamoDB get by orderid was called', () => {
        getByOrderId.getByOrderId(eventMock, {}, (arg1, arg2) => { return });
        expect(getTableSpy.calledOnce).to.be.true;
    });
});
