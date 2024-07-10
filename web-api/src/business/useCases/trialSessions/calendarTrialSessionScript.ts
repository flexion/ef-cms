import { createApplicationContext } from '@web-api/applicationContext';
import { setTrialSessionCalendarInteractor } from '@web-api/business/useCases/trialSessions/setTrialSessionCalendarInteractor';
import { updateQcCompleteForTrial } from '@shared/business/useCases/updateQcCompleteForTrialInteractor';
const eligibleDocketNumbers = [
  '17815-23',
  '17461-23',
  '17475-23',
  '17507-23',
  '17563-23',
  '17630-23',
  '17903-23',
  '17669-23',
  '17700-23',
  '17717-23',
  '17733-23',
  '17735-23',
  '17739-23',
  '17749-23',
  '18052-23',
  '17908-23',
  '17909-23',
  '17912-23',
  '17932-23',
  '17968-23',
  '18107-23',
  '18488-23',
  '18130-23',
  '18139-23',
  '18571-23',
  '18260-23',
  '18278-23',
  '18282-23',
  '18284-23',
  '18709-23',
  '18322-23',
  '18324-23',
  '18332-23',
  '18333-23',
  '18334-23',
  '18357-23',
  '18548-23',
  '18758-23',
  '18777-23',
  '18855-23',
  '18856-23',
  '18895-23',
  '18896-23',
  '18912-23',
  '18936-23',
  '18972-23',
  '18973-23',
  '18990-23',
  '19043-23',
  '19046-23',
  '19088-23',
  '19092-23',
  '19118-23',
  '19310-23',
  '19177-23',
  '19194-23',
  '19195-23',
  '19197-23',
  '19198-23',
  '19199-23',
  '19200-23',
  '19201-23',
  '19202-23',
  '19203-23',
  '19204-23',
  '19218-23',
  '19219-23',
  '19267-23',
  '19495-23',
  '19387-23',
  '19450-23',
  '19565-23',
  '19569-23',
  '19716-23',
  '19823-23',
  '19521-23',
  '19696-23',
  '19650-23',
  '19669-23',
  '19672-23',
  '19736-23',
  '19835-23',
  '19836-23',
  '19847-23',
  '19882-23',
  '19947-23',
  '19985-23',
  '20003-23',
  '20047-23',
  '20344-23',
  '20373-23',
  '20331-23',
  '20509-23',
  '20582-23',
  '109-24',
  '126-24',
  '356-24',
  '210-24',
  '211-24',
  '264-24',
  '440-24',
  '535-24',
  '567-24',
  '581-24',
  '582-24',
  '799-24',
  '618-24',
  '656-24',
  '680-24',
  '681-24',
  '689-24',
  '704-24',
  '1055-24',
  '1061-24',
  '1119-24',
  '783-24',
  '882-24',
  '925-24',
  '970-24',
  '1280-24',
  '1238-24',
  '1268-24',
  '1388-24',
  '1389-24',
  '1423-24',
  '1449-24',
  '1484-24',
  '1555-24',
  '1570-24',
  '1581-24',
  '1588-24',
  '1670-24',
  '1915-24',
  '2094-24',
  '2101-24',
  '2135-24',
  '2136-24',
  '2148-24',
  '2295-24',
  '2330-24',
  '2358-24',
  '2538-24',
  '2565-24',
  '2610-24',
  '2840-24',
  '2800-24',
  '2868-24',
  '2874-24',
  '2951-24',
  '3239-24',
  '2999-24',
  '3005-24',
  '3007-24',
  '3154-24',
  '3185-24',
  '3290-24',
  '3324-24',
  '3427-24',
  '3454-24',
  '3712-24',
  '3663-24',
  '3818-24',
  '3858-24',
  '4017-24',
  '3945-24',
  '3957-24',
  '3959-24',
  '3970-24',
  '3971-24',
  '4028-24',
  '4089-24',
  '4141-24',
  '4210-24',
  '4392-24',
  '4393-24',
  '4506-24',
  '4559-24',
  '4567-24',
  '4569-24',
  '4572-24',
  '4714-24',
  '4651-24',
  '4666-24',
  '4684-24',
  '4685-24',
  '4851-24',
  '4858-24',
  '4866-24',
  '4882-24',
  '4923-24',
  '4945-24',
  '5008-24',
  '5191-24',
  '5065-24',
  '5109-24',
  '5141-24',
  '5153-24',
  '5206-24',
  '5212-24',
  '5223-24',
  '5371-24',
  '5323-24',
  '5386-24',
  '5406-24',
  '5546-24',
  '5675-24',
  '6144-24',
];
async function main() {
  const applicationContext = createApplicationContext({});
  const trialSessionId = '311fc435-3267-42a2-a1e8-3c74d5cdfdfe';
  // QC complete
  await Promise.all(
    eligibleDocketNumbers.map(async docketNumber => {
      await updateQcCompleteForTrial(applicationContext, {
        docketNumber,
        qcCompleteForTrial: true,
        trialSessionId,
      });
    }),
  );

  console.time('Calling interactor');
  await setTrialSessionCalendarInteractor(applicationContext, {
    trialSessionId,
  });

  console.timeEnd('Calling interactor');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
// trial sessionIdd that failed 38b8285d-9256-44fc-8979-e6b85e484195/
