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
  const userToken = get(state.token);
  const { actionPerformanceArray, performanceMeasurementStart, sequenceName } =
    props;

  if (
    !sequenceName ||
    !performanceMeasurementStart ||
    !actionPerformanceArray ||
    !userToken
  )
    return;

  const performanceMeasurementEnd = Date.now();
  const duration = performanceMeasurementEnd - performanceMeasurementStart;

  const RESULTS: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
  } = {
    actionPerformanceArray,
    duration,
    sequenceName,
  };

  // TODO 10432 Wrap this in a try catch so the user never knows it happens.
  void applicationContext
    .getUseCases()
    .logUserPerformanceDataInteractor(applicationContext, RESULTS);
};
