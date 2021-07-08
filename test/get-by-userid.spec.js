'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
AWSMock.setSDKInstance(AWS);
const queryTableSpy = sinon.spy();
AWSMock.mock('DynamoDB.DocumentClient', 'query', queryTableSpy);
AWS.config.update({ region: "us-east-1" });
const getByUserId = require('../orders/get-by-userid');

describe('test get order details by user id', () => {
    const eventMock = { path:{ id: '1234567' } };

    afterEach(function() {
        AWSMock.restore('DynamoDB');
    });

    // it('if dynamoDB get by userid was called', () => {
    //     getByUserId.getByUserId(eventMock, {}, (arg1, arg2) => { return });
    //     expect(queryTableSpy.calledOnce).to.be.true;
    // });
});
