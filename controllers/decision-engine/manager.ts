import { addSeconds, subSeconds } from "date-fns";
import { AudioGenerator } from "../audio-generator";
import { YoloManager } from "../yolo-manager";
import { DecisionHistory } from "./history";

export class DecisionEngine {
  private history: DecisionHistory<{ label: string; location: string }> =
    new DecisionHistory();

  constructor(
    private readonly audio: AudioGenerator,
    private readonly yolo: YoloManager
  ) {}

  start() {
    this.audio.start();
  }

  objectInference(seconds: number, useHistory = true) {
    const report = this.yolo.report(
      subSeconds(new Date(), seconds),
      new Date()
    );
    for (const object of report.objects) {
      if (
        useHistory &&
        this.history.get(`${object.label}-${object.location}`)
      ) {
        continue;
      }

      this.audio.playText({
        priority: 2,
        text: `${object.label} ${object.location}`,
        key: `${object.label}-${object.location}`,
        volume: 0.6,
        expiry: addSeconds(new Date(), 5),
      });
      this.history.add(`${object.label}-${object.location}`, object, 5000);
    }
  }
}
