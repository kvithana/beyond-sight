export class DecisionHistory<T> {
  history: {
    [key: string]: {
      ttl: number;
      item: T;
    };
  } = {};

  private addsSinceCleanup: number = 0;

  constructor() {}

  add(key: string, item: T, ttl: number) {
    this.history[key] = {
      ttl,
      item,
    };
    this.addsSinceCleanup++;
  }

  get(key: string) {
    return this.history[key]?.item;
  }

  cleanup() {
    if (this.addsSinceCleanup < 10) {
      return;
    }
    this.addsSinceCleanup = 0;
    const now = Date.now();
    for (const key in this.history) {
      if (this.history[key].ttl > 0 && now - this.history[key].ttl > now) {
        delete this.history[key];
      }
    }
  }
}
