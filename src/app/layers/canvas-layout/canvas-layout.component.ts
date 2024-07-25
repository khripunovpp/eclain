import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  inject,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CanvasLayerService} from "../../services/canvas-layer.service";

@Component({
  selector: 'app-canvas-layout',
  standalone: true,
  imports: [],
  templateUrl: './canvas-layout.component.html',
  styleUrl: './canvas-layout.component.scss',
})
export class CanvasLayoutComponent
    implements AfterViewInit {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  @Input({required: true}) width!: number
  @Input({required: true}) height!: number
  private readonly canvasLayoutService = inject(CanvasLayerService)
  @HostBinding('style.height.px') get widthCss() {
    return this.height;
  }

  ngAfterViewInit() {
    this.canvasLayoutService.init(this.canvasContainer, this.width, this.height);
  }
}
