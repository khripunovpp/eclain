import {ChangeDetectionStrategy, Component, ElementRef, inject, viewChild, ViewEncapsulation} from '@angular/core';
import {JsonPipe, NgIf} from "@angular/common";
import {tfProv} from "../providers/tf.provider";
import {BroadcastService} from "./broadcast.service";
import {CanvasLayoutComponent} from "../layers/canvas-layout/canvas-layout.component";
import {VideoLayerComponent} from "../layers/video-layer/video-layer.component";

@Component({
  selector: 'app-broadcast',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    CanvasLayoutComponent,
    VideoLayerComponent
  ],
  templateUrl: './broadcast.component.html',
  styleUrl: './broadcast.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BroadcastComponent {
  videoLayer = viewChild<VideoLayerComponent>(VideoLayerComponent);
  dots = viewChild<ElementRef<HTMLElement>>('dots');
  readonly broadcastService = inject(BroadcastService);
  readonly tf = inject(tfProv)


  ngOnInit() {
    if (!this.videoLayer()?.video()?.nativeElement) return
    this.broadcastService.load(this.videoLayer()!.video()!.nativeElement);
  }

  onButtonClick() {
    this.broadcastService.enable();
  }


  makePhoto() {
    return this.broadcastService.makePhotoByTimeout(2000);
  }
}
