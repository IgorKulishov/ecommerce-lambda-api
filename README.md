
# Serverless 'Orders' API
- Lambda API
- JWT Validation

## APIs:
1. List all pending orders for seller role
2. List all pending orders by user ID
3. Get order by order ID
4. Post to create new order and persist to DB (DynamoDB/PostrgesQL)
5. Put to update order by order ID
6. Delete order by order ID

## Commands
- install: npm i
- deploy to AWS: sls deploy -v

## TODO:

### 1. Finalize APIs from the docs mentioned above in 'APIs' p. 1,2

### 2. Add roles in DB

### 3. Add JWT API Gateway Lambda function authentication

## JWT: 
 - Currently Jwt auth is not working due to wrong secret key from other project for jwt validation 
 - There is no API Gateway authorization lambda function, but Jwt token validation in "auth/auth.js" file
 - validation relies on secret key from other backend project
 - Jwt validation was written for "list" orders API 
 
