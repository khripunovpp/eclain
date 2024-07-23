import {Component, inject, viewChild} from '@angular/core';
import {BroadcastComponent} from "../broadcast/broadcast.component";
import {NgIf} from "@angular/common";
import {CameraService} from "../services/camera.service";
import {ModelService} from '../services/model.service';
import {GameService} from "../services/game.service";
import {ScoreService} from "../services/score.service";
import {LifeService} from "../services/life.service";
import {EclairsService} from "../services/eclairs.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

const animationsDuration = '250ms ease-in-out';

@Component({
  selector: 'page',
  standalone: true,
  imports: [
    BroadcastComponent,
    NgIf,
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  animations: [
    trigger('slideDown', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-100%)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void => *', [
        animate(animationsDuration)
      ]),
      transition('* => void', [
        animate(animationsDuration)
      ]),
    ]),
    trigger('slideUp', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(100%)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void => *', [
        animate(animationsDuration)
      ]),
      transition('* => void', [
        animate(animationsDuration)
      ]),
    ]),
  ],
})
export class PageComponent {
  readonly cameraService = inject(CameraService);
  readonly modelService = inject(ModelService);
  readonly gameService = inject(GameService);
  readonly eclairsService = inject(EclairsService);
  readonly scoreService = inject(ScoreService);
  readonly lifeService = inject(LifeService);
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

  get showAlreadyWin(){
    return window.location.search.includes('show-win');
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

  toggle() {
    this.gameService.toggle();
  }
}
