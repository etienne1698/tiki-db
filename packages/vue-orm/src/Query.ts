export type OperatorValueType = {
  $eq: any;
  $in: Array<any>;
  $ne: any;
};

export type Operator = keyof OperatorValueType;

export type Query = {
  filters: Record<Operator, Record<string, any>>;
  withRelated: Set<string>;
};
