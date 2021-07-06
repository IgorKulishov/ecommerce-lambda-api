// 'use strict';
// const expect = require('chai').expect;
// const sinon = require('sinon');
// const AWS = require('aws-sdk');
// const AWSMock = require('aws-sdk-mock');
// const scanTableSpy = sinon.spy();
// AWSMock.setSDKInstance(AWS);
// AWSMock.mock('DynamoDB.DocumentClient', 'query', scanTableSpy);
// const allOrders = require('../../orders/list-all-users-orders');
//
// describe('test list all orders for all users', () => {
//
//     beforeEach(function() {});
//
//     afterEach(function() {
//         AWSMock.restore('DynamoDB');
//     });
//
//     it('if dynamoDB scan was called', () => {
//         allOrders.list({
//             query: {
//                 ordersDate: '2021-07-05',
//                 orderStatus: 'prepared_for_shipment'
//             }
//         }, {}, (arg1, arg2) => { return });
//         expect(scanTableSpy.calledOnce).to.be.true;
//     });
// });
