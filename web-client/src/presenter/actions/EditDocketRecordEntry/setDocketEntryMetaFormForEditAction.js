import { state } from 'cerebral';

/**
 * update state form with docket record entry and document properties
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the props passed to this action
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setDocketEntryMetaFormForEditAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { docketRecord, documents } = get(state.caseDetail);
  const { docketRecordIndex } = props;
  const { deconstructDate } = applicationContext.getUtilities();

  // TODO: Maybe move this to the DateHandler or its own utility
  const deconstructDateWrapper = (date, fieldName) => {
    let deconstructedDate = {};
    if (date) {
      const { day, month, year } = deconstructDate(date);

      const dayFieldName = fieldName ? `${fieldName}Day` : 'day';
      const monthFieldName = fieldName ? `${fieldName}Month` : 'month';
      const yearFieldName = fieldName ? `${fieldName}Year` : 'year';

      deconstructedDate[dayFieldName] = day;
      deconstructedDate[monthFieldName] = month;
      deconstructedDate[yearFieldName] = year;
    }
    return deconstructedDate;
  };

  const docketRecordEntry = docketRecord.find(
    ({ index }) => index === docketRecordIndex,
  );

  store.set(state.docketRecordIndex, docketRecordIndex);

  if (docketRecordEntry.documentId) {
    const documentDetail = documents.find(
      document => docketRecordEntry.documentId === document.documentId,
    );

    // TODO: Abstract this (also in getFormattedCaseDetail)
    if (docketRecordEntry.servedPartiesCode) {
      documentDetail.servedPartiesCode = docketRecordEntry.servedPartiesCode;
    } else {
      if (
        documentDetail &&
        !!documentDetail.servedAt &&
        documentDetail.servedParties &&
        documentDetail.servedParties.length > 0
      ) {
        documentDetail.servedPartiesCode = 'B';
      } else {
        // TODO: Address Respondent and Petitioner codes
        documentDetail.servedPartiesCode = '';
      }
    }

    store.set(state.form, {
      ...docketRecordEntry,
      ...documentDetail,
      lodged: !!documentDetail.lodged,
      ...deconstructDateWrapper(
        (documentDetail && documentDetail.filingDate) ||
          docketRecordEntry.filingDate,
        'filingDate',
      ),
      ...deconstructDateWrapper(
        documentDetail && documentDetail.certificateOfServiceDate,
        'certificateOfService',
      ),
      ...deconstructDateWrapper(documentDetail && documentDetail.date),
    });

    // TODO: add to unit test
    return {
      key: 'initEventCode',
      value: documentDetail.eventCode,
    };
  } else {
    store.set(state.form, {
      ...docketRecordEntry,
      ...deconstructDateWrapper(docketRecordEntry.filingDate, 'filingDate'),
    });
  }
};
