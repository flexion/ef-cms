export const performanceMeasurementEndAction = ({
  applicationContext,
  props,
}: ActionProps<{
  sequenceName?: string;
  performanceMeasurementStart?: number;
  actionPerformanceArray?: { actionName: string; duration: number }[];
}>) => {
  const { actionPerformanceArray, performanceMeasurementStart, sequenceName } =
    props;

  if (!sequenceName || !performanceMeasurementStart || !actionPerformanceArray)
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
