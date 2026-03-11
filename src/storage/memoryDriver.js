export function memoryDriver() {
  return {
    read: () => ({ people: [], expenses: [] }),
    write: () => {},
    subscribe: () => () => {},
  };
}
