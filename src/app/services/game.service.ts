import {inject, Injectable, OnInit, signal} from "@angular/core";
import {createActor, createMachine} from 'xstate';
import {PointCords} from "./points.service";
import {CanvasRendererService} from "./canvas-renderer.service";
import {FaceService} from "./face.service";
import {EclairsService} from "./eclairs.service";
import {ScoreService} from "./score.service";
import {LifeService} from "./life.service";
import p5 from "p5";
import {Eclair} from "../objects/eclair";
import {BodyPointsService} from "./body-points.service";

enum GameStates {
  Paused = 'Paused',
  Playing = 'Playing',
  Failed = 'Failed',
}

enum GameEvents {
  Toggle = 'toggle',
  Start = 'start',
  FailGame = 'failGame',
}

@Injectable({
  providedIn: 'root'
})
export class GameService
    implements OnInit {

  constructor() {
    this.actor.start();
    this.actor.subscribe((snapshot) => {
      this.gameState.set(snapshot.value as GameStates);
    });
  }

  private _initialState = GameStates.Paused;
  gameState = signal(this._initialState);
  private readonly gameMachine = createMachine({
    id: 'game',
    initial: this._initialState,
    states: {
      [GameStates.Playing]: {
        on: {
          [GameEvents.Toggle]: GameStates.Paused,
          [GameEvents.FailGame]: GameStates.Failed,
        },
      },
      [GameStates.Paused]: {
        on: {
          [GameEvents.Toggle]: GameStates.Playing,
          [GameEvents.Start]: GameStates.Playing,
        },
      },
      [GameStates.Failed]: {
        on: {
          [GameEvents.FailGame]: GameStates.Failed,
        },
      },
    },
  })
  private readonly actor = createActor(this.gameMachine)
  private readonly canvasRendererService = inject(CanvasRendererService)
  private readonly faceService = inject(FaceService);
  private readonly eclairsService = inject(EclairsService);
  private readonly scoreService = inject(ScoreService);
  private readonly lifeService = inject(LifeService);
  private readonly bodyPointsService = inject(BodyPointsService);

  get isPaused() {
    return this.actor.getSnapshot().value == GameStates.Paused;
  }

  get isGameOver() {
    return this.actor.getSnapshot().value == GameStates.Failed;
  }

  get renderer() {
    return this.canvasRendererService.renderer;
  }

  get playTheGame() {
    return !this.isPaused && !this.isGameOver;
  }

  get canEat() {
    return this.lifeService.alive;
  }

  ngOnInit() {
  }

  init() {
    return this.generateEclairs();
  }

  addPoints(
      cords: PointCords
  ) {
    this.bodyPointsService.createPoints(cords);
  }

  generateEclairs() {
    if (!this.renderer) return;
    return this.eclairsService.createEclairs();
  }

  toggle() {
    this.actor.send({
      type: 'toggle',
    });
  }

  pause() {

  }

  start() {
    this.actor.send({
      type: 'start',
    });
  }

  failGame() {
    this.actor.send({
      type: 'failGame',
    });
  }

  update() {
    this.renderer.clear();

    let currentTime = this.renderer.frameCount / 60;

    this.faceService.update();

    for (let eclair of this.eclairsService.eclairs) {
      if (this.playTheGame) {
        if (this._eclairOutOfBottomScreen(eclair.pos)) {
          this._resetEclair(eclair);

          if (this.lifeService.dead) {
            this.failGame();
            break;
          }
        } else {
          eclair.update(currentTime);
        }
      }
      eclair.display();

      if (this.canEat && this.faceService.mouth?.collidePointRect(eclair.pos)) {
        this.eclairsService.hitEclair(eclair);
        if (eclair.golden) {
          this.scoreService.addScore(5)
        } else {
          this.scoreService.increment();
        }
        break;
      }
    }

    this.bodyPointsService.update();
  }

  private _resetEclair(
      eclair: Eclair,
  ) {
    this.eclairsService.resetEclair(eclair);
    this.lifeService.decrement();
  }

  private _eclairOutOfBottomScreen(
      position: p5.Vector,
  ) {
    return position.y > this.renderer.height
  }

  private _eclairOutOfTopScreen(
      position: p5.Vector,
  ) {
    return position.y < 0
  }
}