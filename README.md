
# Placed orders history API

## Stack
Lambda function + DynamoDB

## Description
The API for placed orders history for seller and buyers

## API CRUDs:
- List all active orders (for seller)
- Get all pending orders by user ID (for buyer and seller)
- Get order by order ID (for buyer and seller)
- Post to create new order and persist to DB (for buyer and seller)
- Put to update order by order ID (for buyer and seller)
- Delete order by order ID (for buyer and seller)

## Fields of DB
 - userid
 - userRole
 - orderDetails
 - checked
 - createdAt
 - updatedAt
 - isPending
 - isBlocked
 - isDelivered
 

## Commands
- install: npm i
- deploy to AWS: sls deploy -v

## TODO:
 - Add API Gateway authorization lambda function with Jwt token validation
 - Add 'seller' and 'buyer' roles for authorization
