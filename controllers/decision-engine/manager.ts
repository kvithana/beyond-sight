import { AudioPlayer } from "../audio-player";

export type RecognizedObject = {
  label: string;
  confidence: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

export class DecisionEngine {
  constructor(private readonly audio: AudioPlayer) {}

  start() {
    this.audio.start();
  }

  private _start() {}

  tick(objects: RecognizedObject[]) {
    for (const object of objects) {
    }
  }
}
