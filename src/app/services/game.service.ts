import {inject, Injectable, OnInit} from "@angular/core";
import {createActor, createMachine} from 'xstate';
import {Point} from "../layers/canvas-layout/objects/point";
import {PointCords} from "./points.service";
import {CanvasRendererService} from "./canvas-renderer.service";
import {FaceService} from "./face.service";
import {EclairsService} from "./eclairs.service";
import {ScoreService} from "./score.service";
import {LifeService} from "./life.service";

enum GameStates {
  Paused = 'Paused',
  Playing = 'Playing',
}

enum GameEvents {
  Toggle = 'toggle',
  Start = 'start',
}

@Injectable({
  providedIn: 'root'
})
export class GameService
    implements OnInit {

  constructor() {

    this.actor.start();

    console.log('actor', this.actor.getSnapshot().value);

    this.actor.subscribe((snapshot) => {
      console.log('Value:', snapshot.value);
    });
  }

  points: Point[] = []
  gameMachine = createMachine({
    id: 'game',
    initial: GameStates.Paused,
    states: {
      [GameStates.Playing]: {
        on: {
          [GameEvents.Toggle]: GameStates.Paused,
        },
      },
      [GameStates.Paused]: {
        on: {
          [GameEvents.Toggle]: GameStates.Playing,
          [GameEvents.Start]: GameStates.Playing,
        },
      }
    },
  })
  actor = createActor(this.gameMachine)
  private readonly canvasRendererService = inject(CanvasRendererService)
  private readonly faceService = inject(FaceService);
  private readonly eclairsService = inject(EclairsService);
  private readonly scoreService = inject(ScoreService);
  private readonly lifeService = inject(LifeService);

  get isPaused() {
    return this.actor.getSnapshot().value == GameStates.Paused;
  }

  get renderer() {
    return this.canvasRendererService.renderer;
  }

  ngOnInit() {
  }

  init() {
    return this.generateEclairs();
  }

  addPoints(
      cords: PointCords
  ) {
    this.points = []
    for (let [key, value] of Object.entries(cords)) {
      this.points.push(new Point(value.x, value.y, value.color))
    }
  }

  generateEclairs() {
    if (!this.renderer) return;
    return this.eclairsService.createEclairs();
  }

  addMouth(
      cords: PointCords,
  ) {
    if (!this.renderer) return;
    this.faceService.createMouth();
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

  update() {
    this.renderer.clear();

    let currentTime = this.renderer.frameCount / 60;

    if (this.faceService.mouth) {
      this.faceService.mouth.show();
    }

    for (let eclair of this.eclairsService.eclairs) {
      if (!this.isPaused) {
        if (eclair.pos.y > this.renderer.height) {
          eclair.reset();
          this.lifeService.decrement();
        } else {
          eclair.update(currentTime);
        }
      }
      eclair.display();

      if (!this.faceService.mouth) continue;

      const hit = this.faceService.mouth.collidePointRect(eclair.pos)

      if (hit) {
        eclair.reset();
        this.scoreService.increment();
        break;
      }
    }

    for (let point of this.points) {
      point.show(this.renderer)
      point.update(this.renderer)
    }
  }
}