export const workQueueSectionHelper = (get, applicationContext) => {
  const {
    CHAMBERS_SECTIONS_LABELS,
    PETITIONS_SECTION,
  } = applicationContext.getConstants();

  const sectionDisplay = key => {
    return (
      {
        adc: 'ADC',
        admissions: 'Admissions',
        calendar: 'Calendar',
        chambers: 'Chambers',
        clerkofcourt: 'Clerk of the Court',
        docket: 'Docket',
        petitions: PETITIONS_SECTION,
        trialClerks: 'Trial Clerks',
      }[key] || chambersDisplay(key)
    );
  };

  const chambersDisplay = key => {
    return CHAMBERS_SECTIONS_LABELS[key];
  };

  return {
    chambersDisplay,
    sectionDisplay,
  };
};
