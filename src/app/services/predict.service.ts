import {Injectable} from "@angular/core";
import {CircularQueue} from "../structures/circular-queue";
import {Helpers} from "../helpers/helpers";

@Injectable({
  providedIn: 'root'
})
export class PredictService {
  constructor() {
  }

  readonly dotsCords: Record<string, {
    x: number,
    y: number,
    color: string
  }> = {
    nose: {x: 0, y: 0, color: 'blue'},
    leftEye: {x: 0, y: 0, color: 'red'},
    rightEye: {x: 0, y: 0, color: 'red'},
    leftEar: {x: 0, y: 0, color: 'red'},
    rightEar: {x: 0, y: 0, color: 'red'},
    leftShoulder: {x: 0, y: 0, color: 'red'},
    rightShoulder: {x: 0, y: 0, color: 'red'},
    leftElbow: {x: 0, y: 0, color: 'red'},
    rightElbow: {x: 0, y: 0, color: 'red'},
    leftWrist: {x: 0, y: 0, color: 'red'},
    rightWrist: {x: 0, y: 0, color: 'red'},
    leftHip: {x: 0, y: 0, color: 'red'},
    rightHip: {x: 0, y: 0, color: 'red'},
    leftKnee: {x: 0, y: 0, color: 'red'},
    rightKnee: {x: 0, y: 0, color: 'red'},
    leftAnkle: {x: 0, y: 0, color: 'red'},
    rightAnkle: {x: 0, y: 0, color: 'red'},
  }
  readonly #queues: Map<string, unknown> = new Map()
  private readonly bufferLength = 10;
  private readonly stdDeviationThreshold = 0.3;

  initQueues() {
    Object.keys(this.dotsCords).forEach((key) => {
      this.#queues.set(key, {
        x: new CircularQueue(this.bufferLength),
        y: new CircularQueue(this.bufferLength),
      });
    });
  }

  putIfOk(
      key: string,
      value: [number, number],
  ) {
    let shouldUpdateDotsCordsX = 0
    let shouldUpdateDotsCordsY = 0
    let lastX = 0
    let lastY = 0
    const q = this.#queues.get(key)
    if (q) {
      const xBuffer = ((q as any)['x'] as CircularQueue)
      const yBuffer = ((q as any)['y'] as CircularQueue)
      shouldUpdateDotsCordsX = this.calculateStdDeviation(xBuffer, value[0]);
      shouldUpdateDotsCordsY = this.calculateStdDeviation(yBuffer, value[1]);
      lastX = xBuffer.last()
      lastY = yBuffer.last()
    }

    let lastXGreater = true;
    let lastYGreater = true;

    if (lastX) {
      lastXGreater = lastX + 1 > value[0];
    }
    if (lastY) {
      lastYGreater = lastY + 1 > value[1];
    }

    if (this.isOk(shouldUpdateDotsCordsX) && lastXGreater) {
      this.dotsCords[key].x = value[0];
    }
    if (this.isOk(shouldUpdateDotsCordsY) && lastYGreater) {
      this.dotsCords[key].y = value[1];
    }
  }

  getQueue<T = number>(
      key: string
  ) {
    return this.#queues.get(key) as CircularQueue<T>;
  }

  private isOk(
      stdDeviation: number
  ) {
    return stdDeviation > this.stdDeviationThreshold;
  }

  private calculateStdDeviation(
      coords: CircularQueue,
      newValue: number,
  ): number {
    if (newValue) coords.enqueue(newValue);
    const queue = coords.getQueue();
    return Helpers.calculateStdDeviation(
        queue,
        Helpers.calculateMean(queue)
    );
  }
}