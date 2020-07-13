
# Serverless 'Orders' API
- Lambda API

## APIs:
1. List all pending orders (TODO: add 'seller' role authorization)
2. Get all pending orders by user ID
3. Get order by order ID
4. Post to create new order and persist to DB (DynamoDB/PostrgesQL)
5. Put to update order by order ID
6. Delete order by order ID

## Commands
- install: npm i
- deploy to AWS: sls deploy -v

## TODO:
### 1. Add separate API Gateway Lambda function for JWT and Roles authentication
#### Notes for current impl of JWT validation: 
 - Currently Jwt auth is not working due to wrong secret key from other project for jwt validation 
 - There is no API Gateway authorization lambda function, but Jwt token validation in "auth/auth.js" file
 - validation relies on secret key from other backend project
 - Jwt validation was written for "list" orders API 
 