const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const userOrder = require('../../orders/delete-order');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

describe('test delete-user-order', () => {
    const eventMock = { pathParameters: JSON.stringify({ id: '1234567' }) };
    let dynamoDb;
    let deleteTableSpy = sinon.spy();

    beforeEach(function() {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('DynamoDB.DocumentClient', 'delete', deleteTableSpy);

        AWS.config.update({ region: "us-east-1" });
        dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
    });

    afterEach(function() {
        AWSMock.restore('DynamoDB');
    });

    it('if dynamoDB delete was called', () => {
        userOrder.delete(eventMock, {}, (arg1, arg2) => { return });
        expect(deleteTableSpy.calledOnce).to.be.true;
    });
});
