import { CaseCountsByProcedureTypeByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import {
  PROCEDURE_TYPES_MAP,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  SessionCountByWeek,
  TrialSessionsByCity,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import ExcelJS from 'exceljs';

export const writeTrialSessionDataToExcel = async ({
  caseCountsByProcedureTypeByCity,
  remainingCaseCountsByProcedureTypeByCity,
  sessionCountPerWeek,
  sortedScheduledTrialSessionsByCity,
  weeks,
}: {
  sortedScheduledTrialSessionsByCity: TrialSessionsByCity;
  weeks: string[];
  sessionCountPerWeek: SessionCountByWeek;
  caseCountsByProcedureTypeByCity: CaseCountsByProcedureTypeByCity;
  remainingCaseCountsByProcedureTypeByCity: CaseCountsByProcedureTypeByCity;
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheetOptions = { properties: { outlineLevelCol: 2 } };
  const worksheet = workbook.addWorksheet('sheetInProgress', worksheetOptions);

  const trialSessionCalendar = {};
  let allWeekOfSlots = weeks.reduce((acc, weekOfString) => {
    acc[weekOfString] = '';
    return acc;
  }, {});

  for (const city in sortedScheduledTrialSessionsByCity) {
    const weekOfsForCity = sortedScheduledTrialSessionsByCity[city].reduce(
      (acc, session) => {
        acc[session.weekOf] = session.sessionType;
        return acc;
      },
      { ...allWeekOfSlots },
    );

    trialSessionCalendar[city] = weekOfsForCity;
  }

  let columns: any[] = [
    {
      header: 'City',
      key: 'city',
    },
  ];

  for (const week of weeks) {
    columns.push({
      header: formatDateString(week, FORMATS.MD),
      key: week,
    });
  }

  columns.push({
    header: 'Small Cases',
    key: 'initialSmallCaseCount',
  });

  columns.push({
    header: 'Regular Cases',
    key: 'initialRegularCaseCount',
  });

  columns.push({
    header: 'Small Cases Remaining',
    key: 'remainingSmallCaseCount',
  });

  columns.push({
    header: 'Regular Cases Remaining',
    key: 'remainingRegularCaseCount',
  });

  worksheet.columns = columns;

  for (const cityStateString in trialSessionCalendar) {
    let city;
    if (!cityStateString.toLowerCase().startsWith('portland')) {
      city = cityStateString.split(',')[0];
    } else {
      city = cityStateString;
    }

    const values = {
      city,
      ...trialSessionCalendar[cityStateString],
      initialRegularCaseCount:
        caseCountsByProcedureTypeByCity[cityStateString][
          PROCEDURE_TYPES_MAP.regular
        ],
      initialSmallCaseCount:
        caseCountsByProcedureTypeByCity[cityStateString][
          PROCEDURE_TYPES_MAP.small
        ],
      remainingRegularCaseCount:
        remainingCaseCountsByProcedureTypeByCity[cityStateString][
          PROCEDURE_TYPES_MAP.regular
        ],
      remainingSmallCaseCount:
        remainingCaseCountsByProcedureTypeByCity[cityStateString][
          PROCEDURE_TYPES_MAP.small
        ],
    };

    worksheet.addRow(values);
  }

  worksheet.eachRow(row => {
    row.eachCell({ includeEmpty: true }, cell => {
      cell.border = {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
      };

      switch (cell.value) {
        case SESSION_TYPES.hybrid:
          cell.fill = {
            fgColor: { argb: 'ffFDB8AE' },
            pattern: 'solid',
            type: 'pattern',
          };
          break;
        case SESSION_TYPES.small:
          cell.fill = {
            fgColor: { argb: 'ff97D4EA' },
            pattern: 'solid',
            type: 'pattern',
          };
          break;
        case SESSION_TYPES.regular:
          cell.fill = {
            fgColor: { argb: 'ffb4d0b9' },
            pattern: 'solid',
            type: 'pattern',
          };
          break;
        case SESSION_TYPES.special:
          cell.fill = {
            fgColor: { argb: 'ffD0C3E9' },
            pattern: 'solid',
            type: 'pattern',
          };
          break;
        default:
          if (cell.value && typeof cell.value === 'string') {
            cell.fill = {
              fgColor: { argb: 'ff989ca3' },
              pattern: 'solid',
              type: 'pattern',
            };
          }
          break;
      }
    });
  });

  worksheet.insertRow(1, [null, 'Week Of']);

  const counterRow = worksheet.addRow({
    city: 'No. of Sessions',
    ...sessionCountPerWeek,
  });

  const countColumnLength = Object.keys(trialSessionCalendar).length; // number of cells in a column that we care about

  counterRow.eachCell(cell => {
    cell.border = {
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      top: { style: 'thin' },
    };

    const cellLetter = cell.$col$row.split('$')[1];
    if (cellLetter === 'A') return;
    // Note: The formula below is tailored specifically to Microsoft Excel and
    // Google Sheets; it will not work in Apple Numbers.
    const formula = `SUMPRODUCT(--(LEN(TRIM(${cellLetter}3:${cellLetter}${countColumnLength + 2}))>0))`;
    cell.value = {
      formula,
      result: 0,
    };
  });

  const cityTitleCell = worksheet.getCell('A2');

  cityTitleCell.border = {
    bottom: undefined,
    left: undefined,
    right: undefined,
    top: undefined,
  };

  cityTitleCell.fill = {
    pattern: 'none',
    type: 'pattern',
  };

  return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
};
