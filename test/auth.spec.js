// 'use strict';
// const expect = require('chai').expect;
// const sinon = require('sinon');
// const AWS = require('aws-sdk');
// const AWSMock = require('aws-sdk-mock');
//
// const authModule = require('../orders-auth/auth');
// describe('update order', () => {
//     let event;
//     beforeEach(() => {
//         process.env.ACCESS_TOKEN_SECRET = 'webcodes@io'
//         event = {
//             type: 'TOKEN',
//             methodArn: 'arn:aws:execute-api:us-east-1:086267801817:iedztczn9f/dev/POST/orders',
//             authorizationToken: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrdWt1QGt1a3UuY29tIiwiaWF0IjoxNjI5MzQ5MzQ3LCJleHAiOjE2MjkzNTExNDd9.oZupyITyCeCXcxVGYuOnHS8_8Bm2HKj-JNNSXBmyOSc'
//         }
//     });
//     afterEach(() => {
//
//     });
//
//     it('auth', async () => {
//         const authRes = authModule.auth(event);
//         console.log(authRes);
//     });
// });
