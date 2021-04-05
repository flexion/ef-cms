# DynamoDB Access Patterns

The following table is meant to help understand the different ways we use dynamodb to store our application's data.  

| Access Scenario                                            | PK                                 | SK                                       | GS1PK                             |
|------------------------------------------------------------|------------------------------------|------------------------------------------|-----------------------------------|
| the case deadline object                                   | case-deadline\|                    | case-deadline\|                          |                                   |
| associate a deadline with a case (mapping record)          | case\|                             | case-deadline\|                          |                                   |
| associate user with a case                                 | user\|                             | case\|                                   | user-case\|                       |
| associate user with pending case                           | user\|                             | pending-case\|                           |                                   |
| a case                                                     | case\|                             | case\|                                   |                                   |
| how we store the list of trial sessions eligble for a case | eligible-for-trial-case-catalog    | LasVegasNevada-H-B-20190816132910-107-19 | eligible-for-trial-case-catalog\| |
| docket number generator counter                            | docketNumberCounter-2021           | docketNumberCounter-2021                 |                                   |
| associate a irs practitioner onto a case                   | case\|                             | irsPractitioner\|                        |                                   |
| associate a private practitioner onto a case               | case\|                             | privatePractitioner\|                    |                                   |
| associate docket entry on a case                           | case\|                             | docket-entry\|                           |                                   |
| add correspondence to a case                               | case\|                             | correspondence\|                         |                                   |
| associate message onto a case                              | case\|                             | message\|                                | message\|                         |
| save web socket connection associated with the user        | user\|                             | connection\|                             | connection\|                      |
| add a hearing to a case                                    | case\|                             | hearing\|                                |                                   |
| a trial session record                                     | trial-session\|                    | trial-session\|                          | trial-session-catalog             |
| copy the trial session and attach it to the user           | trial-session-working-copy\|       | user\|                                   |                                   |
| add a case not to the user                                 | user-case-note\|                   | user\|                                   |                                   |
| create a user                                              | user\|                             | user\|                                   |                                   |
| lookup a user by their email                               | user-email\|                       | user\|                                   |                                   |
| for getting all users in a section                         | section\|                          | user\|                                   |                                   |
| work item saved in a section                               | section\|                          | work-item\|                              | work-item\|                       |
| save outbox workitems for a section sorted by date         | section-outbox\|                   | $datetime                                | work-item\|                       |
| save work items for a user inbox                           | user\|                             | work-item\|                              | work-item\|                       |
| user outbox workitems sorted by date                       | user-outbox\|                      | $datetime                                | work-item\|                       |
| a work item entry                                          | work-item\|                        | work-item\|                              | work-item\|                       |
| a work item on a case                                      | case\|                             | work-item\|                              |                                   |
| associate practitioner by name for lookup                  | privatePractitioner\|${NAME}       | user\|${userId}                          |                                   |
| associate practitioner by bar number for lookup            | privatePractitioner\|${BAR_NUMBER} | user\|${userId}                          |                                   |