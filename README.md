
# Serverless 'Orders' API
- Lambda API
- JWT Validation (currently in test more separate  lambda validator function is not created yet)

## Structure
- List all pending orders for seller role
- List all pending orders by user ID
- Get order by order ID
- Post to create new order and persist to DB (DynamoDB/PostrgesQL)
- Put to update order by order ID
- Delete order by order ID

## Commands
- install: npm i
- deploy to AWS: sls deploy -v

## Note:
### JWT authentication 
 - Currently Jwt auth is not working due to wrong secret key from other project for jwt validation 
 - There is no API Gateway authorization lambda function, but Jwt token validation in "auth/auth.js" file
 - validation relies on secret key from other backend project
 - Jwt validation was written for "list" orders API 
 
