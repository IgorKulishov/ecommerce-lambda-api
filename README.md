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
 
## Serverless Table definitions and recommendations
### A. Global secondary index (GSI) has to be defined in 'AttributeDefinitions'
### B. We defined two GSIs: usersGSI, ordersGSI
### C. Definitions:
- 'KeySchema' defines primary/partition key
- 'AttributeDefinitions' defines primary/partition key and secondary index(s) (GSI)
- 'GlobalSecondaryIndexes' defines GSI
- 'Projections' defines returns fields for secondary index(s)

### D. Docs : 
- Secondary indexes explanation and example: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
- Read notes when add/update secondary indexes https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-globalsecondaryindexes

## Notes:
- if you rename Lambda function name by changing 'service' field in serverless.yml file, please delete all Lambda functions in console including authorizing function or remove manually from API Gateway 
- when you update Authorizer please update manually environment properties, including secret key 
## TODO:
 - Add 'seller' and 'buyer' roles for authorization
 - update with secondary index queries the APIs:
    * delete order 
    * update order 
