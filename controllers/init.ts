import { AudioPlayer } from "./audio-engine";
import { queue } from "./audio-engine/queue";
import { AudioGenerator } from "./audio-generator";
import { DecisionEngine } from "./decision-engine/manager";
import { YoloManager } from "./yolo-manager";

const SILENCE_BUFFER = 10000;

export const audioEngine = new AudioPlayer(queue, SILENCE_BUFFER);

export const audioGenerator = new AudioGenerator(audioEngine);

export const yoloManager = new YoloManager();

const decisionEngine = new DecisionEngine(audioGenerator, yoloManager);
decisionEngine.start();

setInterval(() => {
  decisionEngine.objectInference(2);
}, 2000);
