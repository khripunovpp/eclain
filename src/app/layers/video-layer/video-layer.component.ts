import {AfterViewInit, Component, ElementRef, inject, Input, viewChild} from '@angular/core';
import {CameraService} from "../../services/camera.service";

@Component({
  selector: 'app-video-layer',
  standalone: true,
  imports: [],
  templateUrl: './video-layer.component.html',
  styleUrl: './video-layer.component.scss'
})
export class VideoLayerComponent
    implements AfterViewInit {
  video = viewChild<ElementRef<HTMLVideoElement>>('webcam');
  @Input({required: true}) height!: number;

  private readonly cameraService = inject(CameraService);

  ngAfterViewInit() {
    this.cameraService.bind(this.video()!.nativeElement);
  }
}
