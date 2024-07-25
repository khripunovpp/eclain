import {inject, Injectable, signal} from "@angular/core";
import {tfProv} from "../providers/tf.provider";
import {IS_LOCALHOST} from "../providers/localhost.provider";


@Injectable({
  providedIn: 'root'
})
export class ModelService {
  readonly model = signal<any | null>(null)
  readonly status = signal<string | null>(null)
  private readonly tf = inject(tfProv)
  private readonly MODEL_PATH_REMOTE = 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4';
  private readonly MODEL_PATH_LOCAL = '/';
  private readonly isLocalHost = inject(IS_LOCALHOST)
  private readonly modelPath = this.isLocalHost ? this.MODEL_PATH_LOCAL : this.MODEL_PATH_REMOTE;

  async load() {
    if (this.tf.version.tfjs) {
      this.status.set('Loaded TensorFlow.js - version: ' + this.tf.version.tfjs);

      this.model.set(await this.tf.loadGraphModel(this.modelPath, {fromTFHub: true}));
      this.status.set('Model loaded');
    }
  }
}
