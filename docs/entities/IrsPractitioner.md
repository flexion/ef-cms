# IrsPractitioner
 ```
---
  type: "object"
  keys: 
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "IrsPractitioner"
    role: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "irsPractitioner"
    serviceIndicator: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Electronic"
        - "None"
        - "Paper"

 ```
