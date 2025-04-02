export type OperatorValueType = {
  $eq: any;
  $in: Array<any>;
  $ne: any;
};

export enum Operator = {}


export type Query = {
  filters: Record<Operator, Record<string, any>>;
  with: Set<string>;
  primaries: Array<string>;
};
