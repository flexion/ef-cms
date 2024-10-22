# Expand and Contract Migrations

https://www.tim-wellhausen.de/papers/ExpandAndContract/ExpandAndContract.html

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
  - Add a migration that adds a new field called body
  - Update seed data(Fixtures) so that message.message is now message.body
  - Update the mapper so that message.body
  - (OPTIONAL) Update business entity Message.ts to have .body instead of .message
  - Write a script to copy fields from Message.message to Message.body
  - After deployment has finished run the script
  - Deploy
  - Run a migration to drop Message.message column

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
