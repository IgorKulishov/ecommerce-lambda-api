'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
let updateDBFunc= (params, queryCallback) => {
    queryCallback(null, { Attributes: 'successfully update item in database' });
};
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'update', updateDBFunc);
AWS.config.update({ region: "us-east-1" });
const updateOrder = require('../orders/update-order');
describe('update order', () => {
    const eventMock = {
        body: JSON.stringify({
            orderDetails: {
                totalAmount: 78.98,
                orderNumber: "689a43817e711f530598bef44f078700",
                orderToken: null,
                totalQuantity: 3,
                paymentPlaced: null,
                paymentId: null,
                itemList: []
            },
            orderStatus: 'not_checked'
        }), pathParameters: { id: '1234567' }};

    beforeEach(() => {
        process.env.DYNAMODB_PLACED_ORDERS_DETAILS = 'TEST_DB'
    });
    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        delete process.env.DYNAMODB_PLACED_ORDERS_DETAILS;
        updateDBFunc = undefined;
    });

    it('if dynamoDB update was called', async () => {
        const mockLambdaCallback = sinon.spy();
        await updateOrder.update(eventMock, {}, mockLambdaCallback);
        // TODO: enable test - currently breaks by the reason:
        // "Missing credentials in config, if using AWS_CONFIG_FILE, set AWS_SDK_LOAD_CONFIG=1"
        // Check error in pipeline: https://github.com/IgorKulishov/ecommerce-lambda-api/pull/15/checks?check_run_id=3101650306
        // Check solution: https://stackoverflow.com/questions/43322536/could-not-load-credentials-from-any-providers-while-using-dynamodb-locally-in
        // expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
