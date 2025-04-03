export function is<T extends abstract new (...args: any) => any>(
  value: any,
  type: T
): value is InstanceType<T> {
  return value instanceof type;
}
