import { DateTime } from 'luxon';
import { state } from '@web-client/presenter/app.cerebral';

export const performanceMeasurementEndAction = ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  sequenceName?: string;
  performanceMeasurementStart?: number;
  actionPerformanceArray?: { actionName: string; duration: number }[];
}>) => {
  const { email } = get(state.user) || {};
  const { actionPerformanceArray, performanceMeasurementStart, sequenceName } =
    props;

  if (
    !sequenceName ||
    !performanceMeasurementStart ||
    !actionPerformanceArray ||
    !email
  )
    return;

  const performanceMeasurementEnd = DateTime.now().toMillis();
  const durationInSeconds =
    (performanceMeasurementEnd - performanceMeasurementStart) / 1000;

  const RESULTS: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
  } = {
    actionPerformanceArray,
    duration: durationInSeconds,
    sequenceName,
  };

  applicationContext
    .getUseCases()
    .logUserPerformanceDataInteractor(applicationContext, RESULTS);
};
