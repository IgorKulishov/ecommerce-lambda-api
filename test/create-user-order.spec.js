'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const putDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully put item in database' });
};
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'put', putDBFunction);
AWS.config.update({ region: "us-east-1" });
const createUserOrder = require('../orders/create-user-order');

describe('test create-user-order', () => {
    const eventMock = {
        body: JSON.stringify({
            userid: 'userid',
            userRole: 'userRole',
            orderid: 'orderid',
            orderDetails: {
                totalAmount: 78.98,
                orderNumber: "689a43817e711f530598bef44f078700",
                orderToken: null,
                totalQuantity: 3,
                paymentPlaced: null,
                paymentId: null,
                itemList: []
            }
        })
    };

    afterEach(function() {
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('if dynamoDB put was called', () => {
        const mockLambdaCallback = sinon.spy();
        createUserOrder.create(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
