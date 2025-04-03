import type { Collection } from "../collections/collections";

export type OperatorValueType = {
  $eq: any;
  $in: Array<any>;
  $ne: any;
};

export type Operator = keyof OperatorValueType;

export type Query<C extends Collection> = {
  filters: Record<
    keyof OperatorValueType,
    Partial<Record<keyof C["schema"], any>>
  >;
  with: Set<string>;
  primaries: Array<string>;
};
