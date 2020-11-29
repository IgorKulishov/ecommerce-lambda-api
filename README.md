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
 
## TODO:
 - Add 'seller' and 'buyer' roles for authorization
 - update with secondary index queries the APIs:
    * delete order 
    * update order 

## Notes:
- if you rename Lambda function name by changing 'service' field in serverless.yml file, please delete all Lambda functions in console including authorizing function or remove manually from API Gateway 
- when you update Authorizer please update manually environment properties in AWS Lambda UI console, including secret key
- When updating GSI (global secondary index) please keep in mind:

    A)  in existing GSI index you can update only 'ProvisionedThroughput' but can not update properties in 'NonKeyAttributes' in 'Projection'

    B)  in order to update properties in 'NonKeyAttributes' in 'Projection' you need to create new GSI by either way
        
        a) add new GSI in dynamodb in cloud formation in serverless.yaml file and use command 
        ```
            sls deploy -a
        ```
        
        b) use aws cli command `aws dynamodb update-table --table-name placed-orders-api-dev-orders-details --global-secondary-index-updates file://dynamodb_updates/gsi_update_1.json --attribute-definitions AttributeName=userid,AttributeType=S`
     

- "userid" is defined as a string type (in Table definition) and parameter comes to API from UI as string (for put and query), but somehow:
 
 A) dynamoDb.put saves it as number in Table
 B) dynamoDb.query is able to find the number in Table w/o stringifying "userid" or specifying type "S" in ExpressionAttributeValues as
    ```
        ExpressionAttributeValues: {
          ":userid": {
            "S": JSON.parse(event.path.id)
          }
        }
    ```
Note: just use as:
    ```
        ExpressionAttributeValues: {
          ":userid": event.path.id
        }
    ```
