import { differenceInMilliseconds } from "date-fns";

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
    const entry = this.history[key];
    if (
      !entry ||
      differenceInMilliseconds(Date.now(), entry.ttl) < Date.now()
    ) {
      return null;
    }
  }

  cleanup() {
    if (this.addsSinceCleanup < 10) {
      return;
    }
    this.addsSinceCleanup = 0;
    const now = Date.now();
    for (const key in this.history) {
      if (differenceInMilliseconds(now, this.history[key].ttl) < now) {
        delete this.history[key];
      }
    }
  }
}
