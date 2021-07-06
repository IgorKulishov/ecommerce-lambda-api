'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const deleteTableSpy = sinon.spy();
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'delete', deleteTableSpy);
AWS.config.update({ region: "us-east-1" });
const deleteUserOrder = require('../../orders/delete-order');

describe('test delete-user-order', () => {

    afterEach(function() {
        AWSMock.restore('DynamoDB');
    });

    it('if dynamoDB delete was called', () => {
        const eventMock = { path: { id: '1234567' } };
        deleteUserOrder.delete(eventMock, {}, (arg1, arg2) => { return });
        expect(deleteTableSpy.calledOnce).to.be.true;
    });
});
