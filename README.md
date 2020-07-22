# Orders history API

## AWS Lambda function & DynamoDB

## API CRUDs:
| API    |  Method | Description | Auth |
|-----------|---|---|---|
| /orders | post | create new order |
| /orders | get | all orders |
| /orders/userid/{id} | get | all orders by userid |
| /orders/{id} | get | order by orderid |
| /orders/{id} | put | update order by orderid |
| /orders/{id} | delete | delete order by orderid |

### Notes:
Todo list:
* add and validate user 'seller' role for get /orders request
* add public key for proper jwt validation

## DynamoDB Tables

1 placed-user-orders

| Fields    |   |
|-----------|---|
| id (userid)   | string   |
| orderid   |  string |
| userRole   |  string |
| createdAt   |  integer |
| updatedAt   |  integer |

2  placed-order-details

| Fields    |   |
|-----------|---|
| id (orderid)  |  string |
| orderDetails   |  string |
| checked   | boolean  |
| createdAt   | integer  |
| updatedAt   |  integer |

## Commands
- install: npm i
- deploy to AWS: sls deploy -v

## TODO:
 - Add API Gateway authorization lambda function with Jwt token validation
 - Add 'seller' and 'buyer' roles for authorization
