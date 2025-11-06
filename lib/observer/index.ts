type ObserverListener<T> = (data: T) => void;

class Observer<T> {
  private observers: Set<ObserverListener<T>>;

  constructor() {
    this.observers = new Set();
  }

  subscribe(observer: ObserverListener<T>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: ObserverListener<T>): void {
    this.observers.delete(observer);
  }

  unsubscribeAll(): void {
    this.observers.clear();
  }

  notify(data: T): void {
    Array.from(this.observers).forEach((observer) => observer(data));
  }
}

export { Observer };
