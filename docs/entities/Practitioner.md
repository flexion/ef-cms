# Practitioner
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
      type: "alternatives"
      matches: 
        - 
          ref: 
            path: 
              - "admissionsStatus"
          is: 
            type: "any"
            flags: 
              only: true
            allow: 
              - "Active"
          then: 
            type: "string"
            flags: 
              only: true
              presence: "required"
            allow: 
              - "irsPractitioner"
              - "privatePractitioner"
          otherwise: 
            type: "string"
            flags: 
              only: true
              presence: "required"
            allow: 
              - "inactivePractitioner"
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
    additionalPhone: 
      type: "string"
      flags: 
        presence: "optional"
        description: "An alternate phone number for the practitioner."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    admissionsDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
        description: "The date the practitioner was admitted to the Tax Court bar."
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
    admissionsStatus: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The Tax Court bar admission status for the practitioner."
      allow: 
        - "Active"
        - "Suspended"
        - "Disbarred"
        - "Resigned"
        - "Deceased"
        - "Inactive"
    alternateEmail: 
      type: "string"
      flags: 
        presence: "optional"
        description: "An alternate email address for the practitioner."
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
      allow: 
        - null
    barNumber: 
      type: "string"
      flags: 
        presence: "required"
        description: "A unique identifier comprising of the practitioner initials, date, and series number."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    birthYear: 
      type: "number"
      flags: 
        presence: "required"
        description: "The year the practitioner was born."
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1900
        - 
          name: "max"
          args: 
            limit: 2020
    employer: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The employer designation for the practitioner."
      allow: 
        - "IRS"
        - "DOJ"
        - "Private"
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Practitioner"
    firmName: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The firm name for the practitioner."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    firstName: 
      type: "string"
      flags: 
        presence: "required"
        description: "The first name of the practitioner."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    lastName: 
      type: "string"
      flags: 
        presence: "required"
        description: "The last name of the practitioner."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    middleName: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The optional middle name of the practitioner."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    originalBarState: 
      type: "string"
      flags: 
        presence: "required"
        description: "The state in which the practitioner passed their bar examination."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    practitionerType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The type of practitioner - either Attorney or Non-Attorney."
      allow: 
        - "Attorney"
        - "Non-Attorney"
    suffix: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The name suffix of the practitioner."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - ""

 ```
