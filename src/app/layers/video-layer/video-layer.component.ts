import {AfterViewInit, Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {CameraService} from "../../services/camera.service";
import {VideoLayerService} from "../../services/video-layer.service";

@Component({
  selector: 'app-video-layer',
  standalone: true,
  imports: [],
  templateUrl: './video-layer.component.html',
  styleUrl: './video-layer.component.scss'
})
export class VideoLayerComponent
    implements AfterViewInit {
  @ViewChild('webcam', {
    read: ElementRef<HTMLVideoElement>
  }) video!: ElementRef<HTMLVideoElement>;

  readonly cameraService = inject(CameraService);
  readonly videoLayerService = inject(VideoLayerService);

  readonly containerWidth = this.videoLayerService.videoWidth;


  ngAfterViewInit() {
    this.cameraService.bind(this.video!.nativeElement);
  }
}
