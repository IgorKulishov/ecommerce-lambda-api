const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const createUserOrder = require('../../orders/create-user-order');
describe('test create-user-order', () => {
    // const sandbox = sinon.createSandbox();
    const eventMock = { body: JSON.stringify({ userid: 'userid', userRole: 'userRole', orderid: 'orderid', orderDetails: 'orderDetails' }) };
    let dynamoDb;

    beforeEach(function() {
        AWS.config.update({ region: "us-east-1" });
        dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
        sinon.stub(dynamoDb, "put").callsFake(() => true)
    });

    afterEach(function() {

    });

    it('if dynamoDB put was called', () => {
        createUserOrder.create(eventMock, {}, (arg1, arg2) => { return });
        expect(dynamoDb.put.called).to.be.true;
    });
});
