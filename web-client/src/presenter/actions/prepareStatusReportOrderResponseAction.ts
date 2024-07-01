import { state } from '@web-client/presenter/app.cerebral';

export const prepareStatusReportOrderResponseAction = ({
  get,
  store,
}: ActionProps) => {
  const {
    additionalOrderText,
    dueDate,
    jurisdiction,
    orderType,
    strickenFromTrialSessions,
  } = get(state.form);
  const { statusReportFilingDate, statusReportIndex } = get(
    state.statusReportOrderResponse,
  );

  const hasOrderType = !!orderType;
  const hasStrickenFromTrialSessions = !!strickenFromTrialSessions;
  const hasJurisdiction = !!jurisdiction;
  const hasAdditionalOrderText = !!additionalOrderText;

  const filedLine = `<p>On ${statusReportFilingDate}, a status report was filed in this case (Index no. ${statusReportIndex}). For cause, it is</p>`;

  const orderTypeLine =
    hasOrderType && orderType === 'statusReport'
      ? `<p>ORDERED that the parties shall file a further status report by ${dueDate}.</p>`
      : hasOrderType
        ? `<p>ORDERED that the parties shall file a status report or proposed stipulated decision by ${dueDate}.</p>`
        : '';

  const strickenLine = hasStrickenFromTrialSessions
    ? '<p>ORDERED that this case is stricken from the trial session.</p>'
    : '';

  const jurisdictionLine =
    hasJurisdiction && jurisdiction === 'retained'
      ? '<p>ORDERED that this case is restored to the general docket.</p>'
      : hasJurisdiction
        ? '<p>ORDERED that jurisdiction is retained by the undersigned.</p>'
        : '';

  const additionalTextLine = hasAdditionalOrderText
    ? `<pre>ORDERED that ${additionalOrderText}</pre>`
    : '';

  const linesWithText = [
    orderTypeLine,
    strickenLine,
    jurisdictionLine,
    additionalTextLine,
  ].filter(line => line);

  const richText =
    filedLine +
    linesWithText
      .map((line, index) => {
        const isLastLine = index === linesWithText.length - 1;
        return isLastLine ? line : line.replace('</p>', ' It is further</p>');
      })
      .join('');

  // TODO, maybe add documentType=Order ?
  store.set(state.form.documentTitle, 'Order');
  store.set(state.form.eventCode, 'O');
  store.set(state.form.richText, richText);
};
