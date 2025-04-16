/**
 * This is a convenience utility for converting an Event Code CSV from the court
 * to a JSON file that can be used by the application. It may never be used
 * again, but we've kept it in the project just in case.
 */

import { gatherRecords, getCsvOptions, sortableTitle } from './helpers';
import { parse } from 'csv-parse';
import { remove } from 'lodash';
import fs from 'fs';

const USAGE = `
Usage: node generateCategories.js [internal/external] spreadsheet.csv > output.json
`;

const type = process.argv[2];

const files: string[] = [];
process.argv.forEach((val, index) => {
  if (index > 2) {
    files.push(val);
  }
});

const INTERNAL_EXPORT_COLUMNS = [
  'documentTitle',
  'documentType',
  'category',
  'eventCode',
  'scenario',
  'labelPreviousDocument',
  'labelFreeText',
  'labelFreeText2',
  'ordinalField',
];

const EXTERNAL_EXPORT_COLUMNS = [
  'documentTitle',
  'documentType',
  'category',
  'eventCode',
  'scenario',
  'labelPreviousDocument',
  'labelFreeText',
  'ordinalField',
];

function getExportColumns(type: string): string[] | undefined {
  if (type === 'internal') return INTERNAL_EXPORT_COLUMNS;
  if (type === 'external') return EXTERNAL_EXPORT_COLUMNS;
  return;
}

const exportColumns: string[] | undefined = getExportColumns(type);

const INTERNAL_CSV_COLUMNS = [
  'documentTitle',
  'documentType',
  'category',
  'respondent-ignore',
  'practitioner-ignore',
  'petitioner-ignore',
  'eventCode',
  'scenario',
  'variations-ignore',
  'labelPreviousDocument',
  'labelFreeText',
  'labelFreeText2',
  'ordinalField',
];
const EXTERNAL_CSV_COLUMNS = [
  'documentTitle',
  'documentType',
  'category',
  'respondent-ignore',
  'practitioner-ignore',
  'petitioner-ignore',
  'eventCode',
  'scenario',
  'labelPreviousDocument',
  'labelFreeText',
  'ordinalField',
];

function getCsvColumns(type: string): string[] | undefined {
  if (type === 'internal') return INTERNAL_CSV_COLUMNS;
  if (type === 'external') return EXTERNAL_CSV_COLUMNS;
  return;
}
const csvColumns: string[] | undefined = getCsvColumns(type);

const csvOptions = getCsvOptions(csvColumns);

const documentTypeSort = (a, b) => {
  const [first, second] = [
    sortableTitle(a.documentType),
    sortableTitle(b.documentType),
  ];
  const result = first.localeCompare(second, {
    ignorePunctuation: true,
    sensitivity: 'base',
  });
  return result;
};

const presorted = {
  Motion: [
    'Motion for Continuance',
    'Motion for Extension of Time',
    'Motion to Dismiss for Lack of Jurisdiction',
    'Motion to Dismiss for Lack of Prosecution',
    'Motion for Summary Judgment',
    'Motion to Change or Correct Caption',
  ],
};

const presortCategory = (sortedCategory, categoryName) => {
  const firstEntries = presorted[categoryName];
  if (!firstEntries) {
    return sortedCategory;
  }
  const resortedEntries = firstEntries.map(title => {
    const [foundObj] = remove(
      sortedCategory,
      (m: { documentTitle: string }) => {
        return m.documentTitle.toLowerCase() === title.toLowerCase();
      },
    );
    return foundObj;
  });

  if (resortedEntries.length !== firstEntries.length) {
    throw new Error('Pre-sorted items could not be extracted.');
  }

  return [...resortedEntries, ...sortedCategory];
};

/* eslint no-console: "off"*/
const main = () => {
  if (files.length < 1) {
    console.log(USAGE);
    return;
  }
  const data = fs.readFileSync(files[0], 'utf8');

  const output: { category: string }[] = [];
  const result: { [key: string]: { category: string }[] } = {};
  const sortedResult = {};

  const stream = parse(data, csvOptions);

  stream.on('readable', gatherRecords(exportColumns, output));
  stream.on('end', () => {
    output.forEach((el: { category: string }) => {
      if (el.category.length === 0) {
        return;
      }
      if (!result[el.category]) {
        result[el.category] = [];
      }
      result[el.category].push(el);
    });
    Object.keys(result)
      .sort()
      .forEach(category => {
        const values = result[category];
        sortedResult[category] = presortCategory(
          values.sort(documentTypeSort),
          category,
        );
      });

    console.log(JSON.stringify(sortedResult, null, 2));
  });
};

main();
