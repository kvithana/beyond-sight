import { PriorityQueue } from "@datastructures-js/priority-queue";
import { Howl } from "howler";
import { sum } from "ramda";
import { History } from "./history";
import { QueuedTrack } from "./queue";

export class AudioPlayer {
  /** Loop controller */
  private loopController: NodeJS.Timeout | null = null;

  /** History of played tracks */
  private history: History<PlayedTrack> = new History(10, 10e3);

  /** The track that is currently playing */
  private nowPlaying: Howl | null = null;

  constructor(
    /** The queue of tracks to play */
    private readonly queue: PriorityQueue<QueuedTrack>,
    /** The amount of time we should aim to be silent within a 10 second interval */
    private readonly silenceBuffer: number = 1000
  ) {}

  /** Start the audio player */
  start() {
    this.loopController = setInterval(() => {
      this.tick();
    }, 10);
  }

  /** Stop the audio player */
  stop() {
    if (this.loopController) {
      clearInterval(this.loopController);
      this.loopController = null;
    }
  }

  tick() {
    //check if the queue is empty
    if (this.queue.isEmpty()) return;
    //if it is not empty, play the next track
    const track = this.queue.front();

    //if the track is expired, remove it from the queue
    if (track.expiry && track.expiry < new Date()) {
      this.queue.dequeue();
      this.tick(); //recursively call tick to play the next track
      return;
    }

    if (this.nowPlaying) {
      // if high priority, fade out current play immediately
      if (track.priority === 1) {
        console.log("[AUDIO] fading out current track");
        this.nowPlaying.fade(1, 0, 500);
        this.play(track);
        return;
      }
      // else don't play until track is done
      return;
    }

    // check budget
    const budget =
      this.silenceBuffer - sum(this.history.get().map((t) => t.duration));

    // if budget is less than 0, return
    if (budget < 0) {
      return;
    }

    this.play(track);
  }

  private play(track: QueuedTrack) {
    track.howl.play();
    this.nowPlaying = track.howl;
  }

  queueTrack(track: QueueTrackInput) {
    const howl = new Howl({
      src: [track.uri],
      volume: 1,
      preload: true,
      onload: () => {
        console.log("[AUDIO] loaded track:", track.key);
      },
      onplay: () => {
        console.log("[AUDIO] playing track:", track.key);
      },
      onend: () => {
        console.log("[AUDIO] finished track:", track.key);
        this.history.add({
          uri: track.uri,
          key: track.key,
          text: track.text,
          playedAt: new Date(),
          duration: howl.duration() * 1000,
        });
      },
      onplayerror: () => {
        console.error("[AUDIO] error playing track:", track.key);
        this.localTTS(track);
      },
      onloaderror: () => {
        console.error("[AUDIO] error loading track:", track.key);
        this.localTTS(track);
      },
    });

    this.queue.enqueue({
      howl,
      key: track.key,
      text: track.text,
      priority: track.priority,
      expiry: track.expiry,
    });
  }

  localTTS(track: QueueTrackInput) {
    // check if speech synthesis is available
    if (!speechSynthesis) {
      console.error("[AUDIO] speech synthesis not available");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(track.text);
    utterance.volume = track.volume;
    speechSynthesis.speak(utterance);
    console.log("[AUDIO] playing local TTS:", track.text);
    setTimeout(() => {
      this.nowPlaying = null;
    }, 20 * track.text.length);
  }
}

export type QueueTrackInput = {
  uri: string;
  key: string;
  text: string;
  volume: number;
  priority: number;
  expiry?: Date;
};

export type PlayedTrack = {
  uri: string;
  key: string;
  text: string;
  playedAt: Date;
  duration: number;
};
