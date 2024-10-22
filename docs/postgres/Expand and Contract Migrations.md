# Expand and Contract Migrations

https://www.tim-wellhausen.de/papers/ExpandAndContract/ExpandAndContract.html

Hard rules:
- Always Expand & Contract 
- Up, should do what you want aka changes
- Down, always revert back to previous working state

## Circle Flow
- Expand
- Deployment
- Switch colors
- Contract

## Renaming field that is partially in Postgres (case.caption)
- Update Mapper
- Update Fixture
- Update Stream
- Add up/down Migration
- Expand & Contract

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
- Update Mapper
- Update Fixture
- Standard up/down migration

## Dropping a field that is partially in Postgres
- Update Mapper
- Update Fixture
- Update Stream
- Add up/down Migration

## Adding a field that is fully in Postgres
- Update Mapper
- Update Fixture
- Standard up/down migration

## Adding a field that is partially in Postgres
- Update Mapper
- Update Fixture
- Update Stream
- Add up/down Migration

## Modifying Validation Rules (default values) is partially in Postgres
- Expand & Contract?


## Modifying Validation Rules (default values) is fully in Postgres
- Expand & Contract?


## Questions
- Can we default message.body to message.message
- Do we want sub folders for expand/ and contract/
