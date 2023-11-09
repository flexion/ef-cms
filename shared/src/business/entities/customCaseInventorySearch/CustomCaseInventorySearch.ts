import {
  CASE_STATUSES,
  CASE_TYPES,
  CaseStatus,
  CaseType,
} from '../EntityConstants';
import { DATE_RANGE_VALIDATION_RULE_KEYS } from '@shared/business/entities/EntityValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';

export const CUSTOM_CASE_REPORT_FILING_METHODS = [
  'all',
  'electronic',
  'paper',
] as const;
export type CustomCaseFilingMethods =
  (typeof CUSTOM_CASE_REPORT_FILING_METHODS)[number];

export const CUSTOM_CASE_REPORT_PROCEDURE_TYPES = [
  'All',
  'Regular',
  'Small',
] as const;
export type CustomCaseProcedureTypes =
  (typeof CUSTOM_CASE_REPORT_PROCEDURE_TYPES)[number];

export class CustomCaseInventorySearch extends JoiValidationEntity {
  public caseStatuses: CaseStatus[];
  public caseTypes: CaseType[];
  public endDate: string;
  public filingMethod: CustomCaseFilingMethods;
  public highPriority: boolean;
  public judges: string[];
  public pageSize: number;
  public preferredTrialCities: string[];
  public procedureType: CustomCaseProcedureTypes;
  public searchAfter: {
    receivedAt: number;
    pk: string;
  };
  public startDate: string;

  constructor(rawProps) {
    super('CustomCaseInventorySearch');
    this.caseStatuses = rawProps.caseStatuses;
    this.caseTypes = rawProps.caseTypes;
    this.endDate = rawProps.endDate;
    this.filingMethod = rawProps.filingMethod;
    this.highPriority = rawProps.highPriority;
    this.judges = rawProps.judges;
    this.pageSize = rawProps.pageSize;
    this.preferredTrialCities = rawProps.preferredTrialCities;
    this.procedureType = rawProps.procedureType;
    this.searchAfter = rawProps.searchAfter;
    this.startDate = rawProps.startDate;
  }

  getValidationRules() {
    return {
      caseStatuses: joi.array().items(joi.string().valid(...CASE_STATUSES)),
      caseTypes: joi.array().items(joi.string().valid(...CASE_TYPES)),
      endDate: DATE_RANGE_VALIDATION_RULE_KEYS.endDate.optional(),
      filingMethod: joi
        .string()
        .valid(...CUSTOM_CASE_REPORT_FILING_METHODS)
        .required(),
      highPriority: joi.boolean(),
      judges: joi.array().items(joi.string()),
      pageSize: joi.number().required(),
      preferredTrialCities: joi.array().items(joi.string()),
      procedureType: joi
        .string()
        .valid(...CUSTOM_CASE_REPORT_PROCEDURE_TYPES)
        .required(),
      searchAfter: joi
        .object()
        .keys({
          pk: joi.string().allow('').required(),
          receivedAt: joi.number().required(),
        })
        .required(),
      startDate: DATE_RANGE_VALIDATION_RULE_KEYS.startDate.optional(),
    };
  }
}
