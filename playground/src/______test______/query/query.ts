import type { CollectionFullSchema } from "../types";

export type OperatorValueType = {
  $eq: any;
  $in: Array<any>;
  $ne: any;
};

export type Operator = keyof OperatorValueType;

export type Query<C extends CollectionFullSchema> = {
  filters: Record<
    keyof OperatorValueType,
    Partial<Record<keyof C["fields"], any>>
  >;
  with: Set<string>;
  primaries: Array<string>;
};
