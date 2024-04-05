import { differenceInSeconds } from "date-fns";
export type RecognizedObject = {
  label: string;
  confidence: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

export type Memory = {
  [key: string]: {
    lastSeen: Date;
    confidence: number;
    count: number;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
};

export type Report = {
  objects: ReportObject[];
};

type ReportObject = {
  label: string;
  size: "small" | "medium" | "large";
  location: "left" | "right" | "center";
  confidence: number;
};

export class YoloManager {
  constructor(
    private cameraWidth: number = 640,
    private cameraHeight: number = 480
  ) {}

  memory: Memory = {};

  tick(objects: RecognizedObject[]) {
    for (const object of objects) {
      if (this.memory[object.label]) {
        if (
          differenceInSeconds(new Date(), this.memory[object.label].lastSeen) >
          5
        ) {
          delete this.memory[object.label];
        } else {
          this.memory[object.label] = {
            lastSeen: new Date(),
            // average the confidence
            confidence:
              (this.memory[object.label].confidence *
                this.memory[object.label].count +
                object.confidence) /
              (this.memory[object.label].count + 1),
            x0: object.x0,
            y0: object.y0,
            x1: object.x1,
            y1: object.y1,
            count: this.memory[object.label].count + 1,
          };
          continue;
        }
      }

      this.memory[object.label] = {
        lastSeen: new Date(),
        confidence: object.confidence,
        x0: object.x0,
        y0: object.y0,
        x1: object.x1,
        y1: object.y1,
        count: 1,
      };
    }
  }

  report(periodStart: Date, periodEnd: Date) {
    const report: Report = {
      objects: [],
    };

    for (const key in this.memory) {
      const object = this.memory[key];
      if (object.lastSeen < periodStart || object.lastSeen > periodEnd) {
        continue;
      }

      if (object.count < 3) {
        continue;
      }

      let size: "small" | "medium" | "large";
      if (
        (object.x1 - object.x0) * (object.y1 - object.y0) <
        this.cameraWidth * this.cameraHeight * 0.01
      ) {
        size = "small";
      } else if (
        (object.x1 - object.x0) * (object.y1 - object.y0) <
        this.cameraWidth * this.cameraHeight * 0.1
      ) {
        size = "medium";
      } else {
        size = "large";
      }

      let location: "left" | "right" | "center";
      if (object.x0 < this.cameraWidth * 0.1) {
        location = "left";
      } else if (object.x1 > this.cameraWidth * 0.9) {
        location = "right";
      } else {
        location = "center";
      }

      report.objects.push({
        label: key,
        size,
        location,
        confidence: object.confidence,
      });
    }

    return report;
  }

  setCameraDimensions(width: number, height: number) {
    this.cameraWidth = width;
    this.cameraHeight = height;
  }
}
