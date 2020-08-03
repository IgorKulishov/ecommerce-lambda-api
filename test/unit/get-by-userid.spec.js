// const assert = require('chai').assert;
// const expect = require('chai').expect;
// const sinon = require('sinon');
// const getByUserId = require('../../orders/get-by-userid');
// const AWS = require('aws-sdk');
// const AWSMock = require('aws-sdk-mock');
//
// describe('test get order details by user id', () => {
//     const eventMock = { pathParameters:{ id: '1234567' } };
//     let dynamoDb;
//     let getTableSpy = sinon.spy();
//
//     beforeEach(function() {
//         AWSMock.setSDKInstance(AWS);
//         AWSMock.mock('DynamoDB.DocumentClient', 'get', getTableSpy);
//         dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10", region: "us-east-1" });
//     });
//
//     afterEach(function() {
//         AWSMock.restore('DynamoDB');
//     });
//
//     it('if dynamoDB get by userid was called', () => {
//         getByUserId.get(eventMock, {}, (arg1, arg2) => { return });
//         expect(getTableSpy.calledOnce).to.be.true;
//     });
// });
