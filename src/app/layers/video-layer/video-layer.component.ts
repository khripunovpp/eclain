import {AfterViewInit, Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {CameraService} from "../../services/camera.service";
import {MOBILE_WIDTH} from "../../providers/responsive.provider";

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
  @Input({required: true}) width!: number;
  @Input({required: true}) height!: number;

  private readonly cameraService = inject(CameraService);

  ngAfterViewInit() {
    this.cameraService.bind(this.video!.nativeElement);
  }
}
