export function inputError(err: ErrorResponse) {
  let errors: { message: string; path: string }[] = [];
  if (err.errors) {
    for (const [key, value] of Object.entries(err.errors)) {
      errors.push({ message: value.message, path: value.path });
    }
  }
  return errors;
}

export function createPublisher<T>() {
  const observers: Function[] = [];

  return {
    subscribe: (obMethod: (message: T) => void) => {
      observers.push(obMethod);
    },
    notifyAll: (message: T) => {
      observers.forEach((obMethod) => {
        obMethod(message);
      });
    },
  };
}
