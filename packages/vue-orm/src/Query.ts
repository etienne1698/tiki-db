export type OperatorValueType = {
  $eq: any;
  $in: Array<any>;
  $ne: any;
};

export type Operator = keyof OperatorValueType;

export enum QueryType {
  get = 1,
  update = 2,
  create = 3,
  delete = 4,
}

export type Query = {
  filters: Record<Operator, Record<string, any>>;
  withRelated: Set<string>;
  type: QueryType
};
