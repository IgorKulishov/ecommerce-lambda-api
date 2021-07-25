'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
let putDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully put item in database' });
};
let updateDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: 'successfully updated item in database' });
};
AWSMock.mock('DynamoDB.DocumentClient', 'put', putDBFunction);
AWSMock.mock('DynamoDB.DocumentClient', 'update', updateDBFunction);
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

    beforeEach(() => {
        process.env.DYNAMODB_PLACED_ORDERS_DETAILS = 'ORDERS_DETAILS_DB';
        process.env.DYNAMODB_PLACED_ORDERS_DATES = 'ORDERS_DATES_DB';
    });
    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        delete process.env.DYNAMODB_PLACED_ORDERS_DETAILS;
        delete process.env.DYNAMODB_PLACED_ORDERS_DATES;
        putDBFunction = undefined;
        updateDBFunction = undefined;
    });

    it('if dynamoDB put was called', async () => {
        const mockLambdaCallback = sinon.spy();
        await createUserOrder.create(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
