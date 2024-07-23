import {computed, inject, Injectable, OnInit, signal} from "@angular/core";
import {assign, createActor, createMachine} from 'xstate';
import {PointCords} from "./points.service";
import {CanvasRendererService} from "./canvas-renderer.service";
import {FaceService} from "./face.service";
import {EclairsService} from "./eclairs.service";
import {ScoreService} from "./score.service";
import {LifeService} from "./life.service";
import p5 from "p5";
import {Eclair} from "../objects/eclair";
import {BodyPointsService} from "./body-points.service";
import {LocalStorageService} from "./local-storage.service";
import {AssetsService} from "./assets.service";

export enum GameStates {
  Paused = 'Paused',
  Playing = 'Playing',
  Failed = 'Failed',
  Win = 'Win',
}

export enum GameEvents {
  Toggle = 'toggle',
  Start = 'start',
  FailGame = 'failGame',
  WinGame = 'winGame',
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

  readonly localStorageService = inject(LocalStorageService);
  readonly alreadyWon = computed(() => {
    return !!this.localStorageService.getItem('win-score')
  });
  private _initialState = GameStates.Paused;
  gameState = signal(this._initialState);
  private readonly gameMachine = createMachine({
    id: 'game',
    initial: this._initialState,
    context: {
      hasStarted: false,
    },
    states: {
      [GameStates.Playing]: {
        on: {
          [GameEvents.Toggle]: GameStates.Paused,
          [GameEvents.FailGame]: GameStates.Failed,
          [GameEvents.WinGame]: GameStates.Win,
        },
      },
      [GameStates.Paused]: {
        on: {
          [GameEvents.Toggle]: GameStates.Playing,
          [GameEvents.Start]: {
            target: GameStates.Playing,
            actions: assign({
              hasStarted: (context) => true
            })
          },
        },
      },
      [GameStates.Failed]: {
        on: {
          [GameEvents.FailGame]: GameStates.Failed,
          [GameEvents.Start]: GameStates.Playing,
        },
      },
      [GameStates.Win]: {
        on: {
          [GameEvents.WinGame]: GameStates.Win,
          [GameEvents.Start]: GameStates.Playing,
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
  private readonly assetsService = inject(AssetsService);

  get isPaused() {
    return this.actor.getSnapshot().value == GameStates.Paused;
  }

  get isGameOver() {
    return this.actor.getSnapshot().value == GameStates.Failed;
  }

  get hasStarted() {
    return this.actor.getSnapshot().context.hasStarted;
  }

  get renderer() {
    return this.canvasRendererService.renderer;
  }

  get winTheGame() {
    return this.actor.getSnapshot().value == GameStates.Win;
  }

  get playTheGame() {
    return !this.isPaused && !this.isGameOver && !this.winTheGame;
  }

  get canEat() {
    return this.lifeService.alive;
  }

  ngOnInit() {
  }

  async init() {
    await this.assetsService.loadAssets();
    await this.eclairsService.createEclairs();
  }

  addPoints(
      cords: PointCords
  ) {
    this.bodyPointsService.createPoints(cords);
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

  winGame() {
    this.actor.send({
      type: 'winGame',
    });
    this.localStorageService.setItem('win-score', this.scoreService.score())
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

      if (this.playTheGame && this.canEat && this.faceService.mouth?.collidePointRect(eclair.pos)) {
        this.eclairsService.hitEclair(eclair);
        if (eclair.golden) {
          this.scoreService.addScore(5)
        } else {
          this.scoreService.increment();
        }

        if (this.scoreService.win) {
          this.winGame();
        }

        break;
      }
    }

    this.bodyPointsService.update();
  }

  async restart() {
    this.lifeService.setLife(1);
    this.scoreService.setScore(0);
    // TODO: refactor
    await this.init();
    this.start();
    this.update();
  }

  private _resetEclair(
      eclair: Eclair,
  ) {
    this.eclairsService.runEclairAgain(eclair);
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