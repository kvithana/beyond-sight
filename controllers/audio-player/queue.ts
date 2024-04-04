import { ICompare, PriorityQueue } from "@datastructures-js/priority-queue";

export interface QueuedTrack {
  uri: string;
  expiry?: Date;
  priority: number;
  label: string;
}

const compare: ICompare<QueuedTrack> = (a: QueuedTrack, b: QueuedTrack) => {
  if (a.priority > b.priority) {
    return -1;
  }
  if (a.priority < b.priority) {
    return 1;
  }
  return 0;
};

export const queue = new PriorityQueue<QueuedTrack>(compare);
