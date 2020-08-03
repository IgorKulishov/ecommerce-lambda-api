const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const allOrders = require('../../orders/list-all-users-orders');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

describe('test list all orders for all users', () => {
    let dynamoDb;
    let scanTableSpy = sinon.spy();

    beforeEach(function() {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('DynamoDB.DocumentClient', 'scan', scanTableSpy);
        dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10", region: "us-east-1" });
    });

    afterEach(function() {
        AWSMock.restore('DynamoDB');
    });

    it('if dynamoDB scan was called', () => {
        allOrders.list({}, {}, (arg1, arg2) => { return });
        expect(scanTableSpy.calledOnce).to.be.true;
    });
});
