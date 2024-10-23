# Expand and Contract Migrations

https://www.tim-wellhausen.de/papers/ExpandAndContract/ExpandAndContract.html

Hard rules:
- Always Expand & Contract 
- Up, should do what you want aka changes
- Down, always revert back to previous working state

## Circle Flow (need to implement)

- Deploy
- Migrate
  - Expand Migration
- Switch colors
- Cleanup
  - Contract Migration

## Renaming field that is partially in Postgres (case.caption)
- DynamoDB Migration
- Expand & Contract
  - Add an expand migration that adds a new field called body
  - Add a contract migration that removes message field 
  - In database-types.ts, change MessageTable.message to be MessageTable.body
  - Update seed data (fixtures) so that message.message is now message.body in
  - Update the mapper so that Message.message = message.body from DB
  - (OPTIONAL) Update business entity Message.ts to have Message.body instead of Messge.message
  - Deploy changes

## Renaming field that is fully in Postgres (message.message -> message.body)
- Expand & Contract
  - Add an expand migration that adds a new field called body
  - Add a contract migration that removes message field 
  - In database-types.ts, change MessageTable.message to be MessageTable.body
  - Update seed data (fixtures) so that message.message is now message.body in
  - Update the mapper so that Message.message = message.body from DB
  - (OPTIONAL) Update business entity Message.ts to have Message.body instead of Messge.message
  - Deploy changes

## Dropping a field that is fully in Postgres
- Contract migration

## Dropping a field that is partially in Postgres
- DynamoDB Migration
- Contract migration

## Adding a field that is fully in Postgres
- Expand migration

## Adding a field that is partially in Postgres
- DynamoDB Migration
- Expand migration

## Modifying Validation Rules (default values) is partially in Postgres
- TBD


## Modifying Validation Rules (default values) is fully in Postgres
- TBD
