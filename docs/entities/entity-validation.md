Problem Statement: How can we detect when making validation changes to entities, we do not invalidate data in the database?

What is the bigger problem
  - Remembering to run a migration?
  - Difficulty in knowing if your validation changes break existing data?

# 1. Proactive Detection
## (Yes) Generate a fingerprint of validation rules. Run validation when fingerprint changes.
 Strategy: Have a script which can scan a directory looking for entities, when an entity is found generate a hash of its validation rules and compare it with its previous validation rules hash, if a difference is detected in validation rules then run validation on all entities of that type in the DB. Fail the pipeline if validation does not pass.

Pros
- Can detect if the content of a function changes
- Detection mechanism is neutral to using joi, functions, or any other library.
- Will fail a deployment if there are failing entities in the DB.

Cons
- (Avoidable if we require the user to approve validation) simple changes can trigger the mechanism, like updating a console log, updating joi package, if joi decides how it structures its validation functions.
- (Avoidable if we require the user to approve validation) Updating error messages triggers re-validation
- (Avoidable if we require the user to approve validation) If our compiler changes(esbuild) our string representation of what a function is will change and trigger re-validation
- (Avoidable if we require the user to approve validation) refactoring a function, even if it produces the same output will cause re-validation
- (Simple Fix) Validation rules are not static in all entities. getValidationRules() can return different schemas.
- (Very complex Fix) Not all entities have a specific way to get all of them from the DB. For instance there is no way to get all CaseNotes in the DB.

## (No) Contract Tests
Strategy: Create a wide range of entities touching the edge cases of entities that should always pass validation

Pros
- Can tell the developer if expected snapshots of entities ar failing

Cons
- Requires us to have all entities in varied combinations being tested. Anything not within the tested examples will slip through the cracks.
- Does not solve the problem of forgetting to update migration scripts as what if we forget to add more test cases to the contract tests?

## (Yes) Utility to validate the whole database or a portion of the database
Strategy: Create individual scripts or processes that allows a devloper to scan a database and run all entities through validation to see what is and is not valid. 

Pros
- Allows devs to run real validation on data in test
- Relatively simple to achieve

Cons
- Slow if validating the whole DB
- You need to remember to run the utility

## (No) Have schema version numbers on each entity

# 2. Better Team Awareness
## (Yes) Creating Folders for persisted entities vs. non DB entities

## (No) When an entitiy file is changed send a message to the developer to go check if they need a migration.

## (No) Require that PRs with changes to entities have documentation that the dev knows they are changing validation rules

# 3. Reactive Handling of Invalid Entities
## (YES)Logging when an entity is invalid
Strategy: Continue validating inside of interactor but log when an entity is invalid. Look over logs of invalid data to see what entities in the DB are invalid.

Pros
- No major changes need to be made to the system.

Cons
- We are waiting for a problem to happen before fixing it.
- Validation logic is currently slow, so the end user will experience a slow down to achieve this.
- How will we systematically review validation error logs?