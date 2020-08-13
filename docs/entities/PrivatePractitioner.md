# PrivatePractitioner
 ```
---
  type: "object"
  keys: 
    email: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "email"
          args: 
            options: 
              tlds: false
        - 
          name: "max"
          args: 
            limit: 100
    name: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    role: 
      type: "string"
      flags: 
        presence: "required"
        only: true
      allow: 
        - "privatePractitioner"
    section: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "adc"
        - "admissions"
        - "chambers"
        - "clerkofcourt"
        - "docket"
        - "petitions"
        - "trialClerks"
        - "armensChambers"
        - "ashfordsChambers"
        - "buchsChambers"
        - "carluzzosChambers"
        - "cohensChambers"
        - "colvinsChambers"
        - "copelandsChambers"
        - "foleysChambers"
        - "galesChambers"
        - "gerbersChambers"
        - "goekesChambers"
        - "gustafsonsChambers"
        - "guysChambers"
        - "halpernsChambers"
        - "holmesChambers"
        - "jacobsChambers"
        - "jonesChambers"
        - "kerrigansChambers"
        - "laubersChambers"
        - "leydensChambers"
        - "marvelsChambers"
        - "morrisonsChambers"
        - "negasChambers"
        - "panuthosChambers"
        - "parisChambers"
        - "pughsChambers"
        - "ruwesChambers"
        - "thorntonsChambers"
        - "torosChambers"
        - "urdasChambers"
        - "vasquezsChambers"
        - "wellsChambers"
        - "admin"
        - "admissionsclerk"
        - "docketclerk"
        - "floater"
        - "inactivePractitioner"
        - "irsPractitioner"
        - "irsSuperuser"
        - "judge"
        - "petitioner"
        - "petitionsclerk"
        - "privatePractitioner"
        - "trialclerk"
    token: 
      type: "string"
      flags: 
        presence: "optional"
    userId: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "PrivatePractitioner"
    representing: 
      type: "array"
      flags: 
        presence: "optional"
        description: "List of contact IDs of contacts"
      items: 
        - 
          type: "string"
          rules: 
            - 
              name: "guid"
              args: 
                options: 
                  version: 
                    - "uuidv4"
    representingPrimary: 
      type: "boolean"
      flags: 
        presence: "optional"
    representingSecondary: 
      type: "boolean"
      flags: 
        presence: "optional"
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
