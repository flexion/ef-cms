export const addPropertyHelper = ({
  errorToMessageMap,
  itemErrorMessage,
  itemName,
  itemSchema,
  schema,
}: {
  errorToMessageMap: any;
  itemErrorMessage?: string;
  itemName: any;
  itemSchema: any;
  schema: any;
}) => {
  schema[itemName] = itemSchema;
  if (itemErrorMessage) {
    errorToMessageMap[itemName] = itemErrorMessage;
  }
};

export const makeRequiredHelper = ({
  itemName,
  schema,
  schemaOptionalItems,
}) => {
  if (schemaOptionalItems[itemName]) {
    schema[itemName] = schemaOptionalItems[itemName].required();
  }
};
