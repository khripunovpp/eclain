import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  viewChild
} from '@angular/core';
import {JsonPipe, NgIf} from "@angular/common";
import {tfProv} from "../providers/tf.provider";
import {BroadcastService} from "./broadcast.service";
import {CanvasLayoutComponent} from "../layers/canvas-layout/canvas-layout.component";
import {VideoLayerComponent} from "../layers/video-layer/video-layer.component";
import {PointsService} from "../services/points.service";
import {CanvasLayoutService} from "../layers/canvas-layout/canvas-layout.service";
import {GameService} from "../services/game.service";

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
  styleUrls: ['./broadcast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BroadcastComponent
    implements AfterViewInit, OnInit {
  @ViewChild(VideoLayerComponent) videoLayer: VideoLayerComponent | undefined;
  @ViewChild(CanvasLayoutComponent, {
    static: false
  }) canvasLayer: CanvasLayoutComponent | undefined;
  dots = viewChild<ElementRef<HTMLElement>>('dots');
  readonly broadcastService = inject(BroadcastService);
  readonly canvasLayoutService = inject(CanvasLayoutService);
  readonly gameService = inject(GameService);
  readonly tf = inject(tfProv)
  private readonly pointsService = inject(PointsService);

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (!this.videoLayer?.video?.nativeElement) return;
    this.broadcastService.load(this.videoLayer?.video!.nativeElement);
    this.broadcastService.onPredict.subscribe((dots) => {
      this.canvasLayoutService?.addPoints(dots);
      this.canvasLayoutService?.addMouth(dots);
    });
  }

  enable() {
    this.broadcastService.enable();
    this.gameService.start();
  }


  makePhoto() {
    return this.broadcastService.makePhotoByTimeout(2000);
  }
}
