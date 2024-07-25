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
import {tfProv} from "../../providers/tf.provider";
import {BroadcastService} from "../../services/broadcast.service";
import {CanvasLayoutComponent} from "../canvas-layout/canvas-layout.component";
import {VideoLayerComponent} from "../video-layer/video-layer.component";
import {GameService} from "../../services/game.service";
import {ControlsLayerComponent} from "../controls-layer/controls-layer.component";

@Component({
  selector: 'app-broadcast',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    CanvasLayoutComponent,
    VideoLayerComponent,
    ControlsLayerComponent
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
  readonly gameService = inject(GameService);
  readonly tf = inject(tfProv)

  get displayGame() {
    return this.gameService.hasStarted && this.broadcastService.streamStarted()
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (!this.videoLayer?.video?.nativeElement) return;
    this.broadcastService.load(this.videoLayer?.video!.nativeElement);
    this.broadcastService.onPredict.subscribe((dots) => {
      this.gameService?.addPoints(dots);
    });
  }

  async enable() {
    await this.broadcastService.enable();
    this.gameService.start();
  }


  makePhoto() {
    return this.broadcastService.makePhotoByTimeout(2000);
  }
}