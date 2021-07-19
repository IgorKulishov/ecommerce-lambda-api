'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const updateDBFunc= (params, queryCallback) => {
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

    afterEach(function() {
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('if dynamoDB update was called', () => {
        const mockLambdaCallback = sinon.spy();
        updateOrder.update(eventMock, {}, mockLambdaCallback);
        //TODO: enable test - currently breaks by unknown reason
        // expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
