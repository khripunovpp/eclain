import {ChangeDetectionStrategy, Component, ElementRef, inject, viewChild, ViewEncapsulation} from '@angular/core';
import {JsonPipe, NgIf} from "@angular/common";
import {tfProv} from "../providers/tf.provider";
import {BroadcastService} from "./broadcast.service";

@Component({
  selector: 'app-broadcast',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf
  ],
  templateUrl: './broadcast.component.html',
  styleUrl: './broadcast.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BroadcastComponent {
  video = viewChild<ElementRef<HTMLVideoElement>>('webcam');
  dots = viewChild<ElementRef<HTMLElement>>('dots');
  readonly broadcastService = inject(BroadcastService);
  readonly tf = inject(tfProv)


  ngOnInit() {
    if (!this.video()?.nativeElement) return
    this.broadcastService.load(this.video()!.nativeElement);
  }

  onButtonClick() {
    this.broadcastService.enable();
  }


  makePhoto() {
    return this.broadcastService.makePhotoByTimeout(2000);
  }
}
