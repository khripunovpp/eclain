import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  streamStarted = signal(false)
  constraints = {
    video: true
  };
  supports = !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia)
  video: HTMLVideoElement | null = null;
  ratio = 0;
  direction: 'v' | 'h' = 'v'

  get isVertical() {
    return this.direction === 'v';
  }

  get isHorizontal() {
    return this.direction === 'h';
  }

  bind(
      videoElement: HTMLVideoElement,
  ) {
    this.video = videoElement;
  }

  enableCam() {
    return new Promise<void>((resolve, reject) => {
      return navigator.mediaDevices.getUserMedia(this.constraints)
          .then((stream: any) => {
            if (!this.video) return
            this.video.srcObject = stream;
            this.video.addEventListener('loadeddata', () => {
              this.streamStarted.set(true);
              this.ratio = this.video!.videoWidth / this.video!.videoHeight;
              console.log('ratio', this.ratio)
              this.direction = this.ratio > 1 ? 'h' : 'v';
              console.log('direction', this.direction)
              resolve();
            });
          });
    });
  }

  makePhoto() {
    if (!this.video?.videoWidth || !this.video?.videoHeight) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }
}
