import { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
<<<<<<< HEAD
=======
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
export class Order extends JoiValidationEntity {
  public documentTitle: string;
  public documentType: string;
  public orderBody: string;

  constructor(rawOrder: RawOrder) {
    super('Order');
    this.documentTitle = rawOrder.documentTitle;
    this.documentType = rawOrder.documentType;
    this.orderBody = rawOrder.orderBody;
  }

  static VALIDATION_RULES = {
    documentTitle: JoiValidationConstants.STRING.max(100).required().messages({
      'any.required': 'Enter the title of this order',
      'string.max': 'Limit is 100 characters. Enter 100 or fewer characters.',
    }),
    documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
      .required()
      .messages({ '*': 'Select an order type' }),
    eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
      .optional()
      .messages({ '*': 'Select an order type' }),
    orderBody: JoiValidationConstants.STRING.max(500)
      .required()
      .messages({ '*': 'Order body is required.' }),
  };

  static VALIDATION_RULES_NEW = {
    documentTitle: JoiValidationConstants.STRING.max(100).required().messages({
      'any.required': 'Enter the title of this order',
      'string.max': 'Limit is 100 characters. Enter 100 or fewer characters.',
    }),
    documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
      .required()
      .messages(setDefaultErrorMessage('Select an order type')),
    eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
      .optional()
      .messages(setDefaultErrorMessage('Select an order type')),
    orderBody: JoiValidationConstants.STRING.max(500)
      .required()
      .messages(setDefaultErrorMessage('Order body is required.')),
  };

  getValidationRules() {
    return Order.VALIDATION_RULES;
  }
<<<<<<< HEAD
=======

  getValidationRules_NEW() {
    return Order.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return Order.VALIDATION_ERROR_MESSAGES;
  }
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
}

declare global {
  type RawOrder = ExcludeMethods<Order>;
}
