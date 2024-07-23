import {CanvasRenderer} from "../services/canvas-renderer.service";
import p5 from "p5";
import {createActor, createMachine} from 'xstate';
import {signal} from "@angular/core";
import {BaseObject} from "./base";

enum EnemyState {
  Existed = 'existed',
  OutOfScreen = 'outOfScreen',
}

enum EnemyEvents {
  GoOut = 'goOut',
  Show = 'show',
}


export class Enemy extends BaseObject {
  constructor(
      public override cr: CanvasRenderer,
      public id: number,
      public pos: p5.Vector,
  ) {
    super(cr);
    this.actor.start();
    this.actor.subscribe((snapshot) => {
      this.state.set(snapshot.value as EnemyState);
    });
  }

  velocity = this.cr.createVector(0, 1);
  _goldenImage: any;
  imgRatio = 2.59;
  imgWidth = 100;
  imgHeight = this.imgWidth / this.imgRatio;
  golden = false;
  initialState = EnemyState.OutOfScreen;
  state = signal(this.initialState);
  private readonly eclairMachine = createMachine({
    id: 'eclair' + this.id,
    initial: this.initialState,
    states: {
      [EnemyState.Existed]: {
        on: {
          [EnemyEvents.GoOut]: EnemyState.OutOfScreen,
        },
      },
      [EnemyState.OutOfScreen]: {
        on: {
          [EnemyEvents.Show]: EnemyState.Existed,
        },
      },
    },
  });
  private readonly actor = createActor(this.eclairMachine)

  _img: any;

  get img() {
    return this.golden ? this._goldenImage : this._img;
  }

  reset(
      pos: p5.Vector,
  ) {
    this.pos.set(pos);
  }

  update(
      time: number,
  ) {
    this.pos.add(this.velocity);
  }

  setGolden(
      status: boolean = true,
  ) {
    this.golden = status;
  }

  setImage(img: any) {
    this._img = img;

    this._goldenImage = this.copyImage(this._img);
    this._goldenImage.filter(this.cr.INVERT);
  }

  display() {
    this.show();
    if (!this.img) {
      return;
    }
    this.cr.image(
        this.img,
        this.pos.x - this.imgWidth / 2,
        this.pos.y - this.imgHeight / 2
    );

    // // set text inside the elipse with cords and id
    // this.cr.textSize(12);
    // this.cr.textAlign(this.cr.CENTER, this.cr.CENTER);
    // this.cr.text("x: " + this.pos.x.toFixed(2), this.pos.x, this.pos.y - 10);
    // this.cr.text("y: " + this.pos.y.toFixed(2), this.pos.x, this.pos.y + 10);
    // this.cr.text("id: " + this.id, this.pos.x, this.pos.y + 30);
  }

  setOutOfScreen() {
    this.actor.send({
      type: EnemyEvents.GoOut,
    });
  }

  show() {
    this.actor.send({
      type: EnemyEvents.Show,
    });
  }
}