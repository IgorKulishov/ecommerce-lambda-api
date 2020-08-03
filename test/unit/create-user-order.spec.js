const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const createUserOrder = require('../../orders/create-user-order');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

describe('test create-user-order', () => {
    const eventMock = { body: JSON.stringify({ userid: 'userid', userRole: 'userRole', orderid: 'orderid', orderDetails: 'orderDetails' }) };
    let dynamoDb;
    let updateTableSpy = sinon.spy();

    beforeEach(function() {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('DynamoDB.DocumentClient', 'put', updateTableSpy);

        AWS.config.update({ region: "us-east-1" });
        dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
    });

    afterEach(function() {
        AWSMock.restore('DynamoDB');
    });

    it('if dynamoDB put was called', () => {
        createUserOrder.create(eventMock, {}, (arg1, arg2) => { return });
        expect(updateTableSpy.calledOnce).to.be.true;
    });
});
