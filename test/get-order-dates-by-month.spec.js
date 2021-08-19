'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
AWSMock.setSDKInstance(AWS);
let queryDBFunction = (params, queryCallback) => {
    queryCallback(null, { Items: [{'orderPlacedDate': 'successfully query dates by month in database'}] });
};
AWSMock.mock('DynamoDB.DocumentClient', 'query', queryDBFunction);
AWS.config.update({ region: "us-east-1" });
const getOrderDates = require('../orders/get-order-dates-by-month');

describe('test get order dates by month', () => {
    const eventMock = { path: { id: '2021-07' } };
    beforeEach(() => {
        process.env.DYNAMODB_PLACED_ORDERS_DATES = 'ORDERS_DATES_TABLE'
    });
    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
        delete process.env.DYNAMODB_PLACED_ORDERS_DATES;
        queryDBFunction = undefined;
    });

    it('if dynamoDB get by orderid was called', async () => {
        const mockLambdaCallback = sinon.spy();
        await getOrderDates.getOrderDatesByMonth.handler(eventMock, {}, mockLambdaCallback);
        expect(mockLambdaCallback.calledOnce).to.be.true;
    });
});
