import {Component, ElementRef, Input, viewChild} from '@angular/core';

@Component({
  selector: 'app-video-layer',
  standalone: true,
  imports: [],
  templateUrl: './video-layer.component.html',
  styleUrl: './video-layer.component.scss'
})
export class VideoLayerComponent {
  video = viewChild<ElementRef<HTMLVideoElement>>('webcam');
  @Input() width = 640;
}
