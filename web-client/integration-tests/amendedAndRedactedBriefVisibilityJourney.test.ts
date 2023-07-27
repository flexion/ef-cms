import { formattedDocketEntries as formattedDocketEntriesComputed } from '../src/presenter/computeds/formattedDocketEntries';
import { loginAs, setupTest } from './helpers';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../src/presenter/computeds/Public/publicCaseDetailHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { setupTest as setupPublicTest } from '../integration-tests-public/helpers';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Amended And Redacted Brief Visibility Journey', () => {
  const cerebralTest = setupTest();

  const formattedDocketEntries = withAppContextDecorator(
    formattedDocketEntriesComputed,
  );

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Unassociated petitioner', () => {
    const expectedDocketRecordVisibility = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: true,
      6: true,
      7: false,
      8: true,
      9: false,
      10: true,
      11: false,
      12: true,
      13: false,
      14: true,
      15: false,
      16: false,
      17: true,
      18: true,
      19: false,
      20: true,
      21: true,
      22: false,
      23: true,
      24: true,
      25: true,
      26: false,
      27: false,
      28: false,
      29: false,
      30: false,
    };

    loginAs(cerebralTest, 'petitioner1@example.com');

    it('view case detail', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '105-23',
      });

      const formattedDocketEntriesHelperResult = runCompute(
        formattedDocketEntries,
        {
          state: cerebralTest.getState(),
        },
      );

      const { formattedDocketEntriesOnDocketRecord } =
        formattedDocketEntriesHelperResult;

      for (const [docketEntryIndex, isLinked] of Object.entries(
        expectedDocketRecordVisibility,
      )) {
        const found = formattedDocketEntriesOnDocketRecord.find(
          entry => entry.index === +docketEntryIndex,
        );

        if (!found) {
          console.log(
            `count not find a docket entry with index ${docketEntryIndex} on case`,
          );
        }

        expect(found.showLinkToDocument).toBe(isLinked);
      }
    });
  });

  describe('Associated private practitioner', () => {
    const expectedDocketRecordVisibility = {
      1: true,
      2: false,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: false,
      10: true,
      11: true,
      12: true,
      13: false,
      14: true,
      15: true,
      16: false,
      17: true,
      18: true,
      19: true,
      20: true,
      21: true,
      22: true,
      23: true,
      24: true,
      25: true,
      26: false,
      27: true,
      28: true,
      29: true,
      30: true,
    };

    loginAs(cerebralTest, 'privatepractitioner1@example.com');

    it('view case detail', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '105-23',
      });

      const formattedDocketEntriesHelperResult = runCompute(
        formattedDocketEntries,
        {
          state: cerebralTest.getState(),
        },
      );

      const { formattedDocketEntriesOnDocketRecord } =
        formattedDocketEntriesHelperResult;

      for (const [docketEntryIndex, isLinked] of Object.entries(
        expectedDocketRecordVisibility,
      )) {
        const found = formattedDocketEntriesOnDocketRecord.find(
          entry => entry.index === +docketEntryIndex,
        );

        if (!found) {
          console.log(
            `count not find a docket entry with index ${docketEntryIndex} on case`,
          );
        }

        expect(found.showLinkToDocument).toBe(isLinked);
      }
    });
  });

  describe('Public', () => {
    const cerebralPublicTest = setupPublicTest();

    const publicCaseDetailHelper = withAppContextDecorator(
      publicCaseDetailHelperComputed,
    );

    const expectedDocketRecordVisibility = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: true,
      6: true,
      7: false,
      8: true,
      9: false,
      10: true,
      11: false,
      12: true,
      13: false,
      14: true,
      15: false,
      16: false,
      17: true,
      18: true,
      19: false,
      20: true,
      21: true,
      22: false,
      23: true,
      24: true,
      25: true,
      26: false,
      27: false,
      28: false,
      29: false,
      30: false,
    };

    it('view case detail', async () => {
      await cerebralPublicTest.runSequence('gotoPublicCaseDetailSequence', {
        docketNumber: '105-23',
      });

      const publicCaseDetail = runCompute(publicCaseDetailHelper, {
        state: cerebralPublicTest.getState(),
      });

      const { formattedDocketEntriesOnDocketRecord } = publicCaseDetail;

      for (const [docketRecordIndex, isLinked] of Object.entries(
        expectedDocketRecordVisibility,
      )) {
        const found = formattedDocketEntriesOnDocketRecord.find(
          entry => entry.index === +docketRecordIndex,
        );

        expect(found?.showLinkToDocument).toBe(isLinked);
      }
    });
  });

  describe.skip('Terminal user', () => {});
});
