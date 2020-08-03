const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const updateOrder = require('../../orders/update-order');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

describe('update order', () => {
    const eventMock = { body: JSON.stringify({ orderDetails: 'microscope', checked: true }), pathParameters: { id: '1234567' }};
    let dynamoDb;
    let updateTableSpy = sinon.spy();

    beforeEach(function() {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('DynamoDB.DocumentClient', 'update', updateTableSpy);
        dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10", region: "us-east-1" });
    });

    afterEach(function() {
        AWSMock.restore('DynamoDB');
    });

    it('if dynamoDB update was called', () => {
        updateOrder.update(eventMock, {}, (arg1, arg2) => { return });
        expect(updateTableSpy.calledOnce).to.be.true;
    });
});
