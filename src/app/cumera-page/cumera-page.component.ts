import {Component, inject, viewChild} from '@angular/core';
import {BroadcastComponent} from "../broadcast/broadcast.component";
import {NgIf} from "@angular/common";
import {CameraService} from "../services/camera.service";
import {ModelService} from '../services/model.service';

@Component({
  selector: 'app-cumera-page',
  standalone: true,
  imports: [
    BroadcastComponent,
    NgIf
  ],
  templateUrl: './cumera-page.component.html',
  styleUrl: './cumera-page.component.scss'
})
export class CumeraPageComponent {


  private readonly cameraService = inject(CameraService);
  private readonly modelService = inject(ModelService);
  private readonly broadcastComponent = viewChild(BroadcastComponent);

  get supports() {
    return this.cameraService.supports
        && (this.websiteOnSSL || this.localhost);

  }

  get websiteOnSSL() {
    return window.location.protocol === 'https:';
  }

  get displayEnableButton() {
    return !this.cameraService.streamStarted();
  }

  get readyToEnable() {
    return this.modelService.model();
  }

  get localhost() {
    return window.location.hostname === 'localhost';
  }

  get canEnableCam() {
    return this.cameraService.supports;
  }

  onButtonClick() {
    this.broadcastComponent()?.enable();
  }
}
