'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const updateTableSpy = sinon.spy();
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'update', updateTableSpy);
const updateOrder = require('../orders/update-order');

describe('update order', () => {
    const eventMock = { body: JSON.stringify({
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

    beforeEach(function() {});

    // afterEach(function() {
    //     AWSMock.restore('DynamoDB');
    // });

    it('if dynamoDB update was called', () => {
        updateOrder.update(eventMock, {}, (arg1, arg2) => { return });
        expect(updateTableSpy.calledOnce).to.be.true;
    });
});
