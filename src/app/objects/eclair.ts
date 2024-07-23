import {CanvasRenderer} from "../services/canvas-renderer.service";
import p5 from "p5";
import {createActor, createMachine} from 'xstate';
import {signal} from "@angular/core";

enum EclairState {
  Existed = 'existed',
  OutOfScreen = 'outOfScreen',
}

enum EclairEvents {
  GoOut = 'goOut',
  Show = 'show',
}


export class Eclair {
  constructor(
      private cr: CanvasRenderer,
      public id: number,
      public pos: p5.Vector,
  ) {
    this.actor.start();
    this.actor.subscribe((snapshot) => {
      this.state.set(snapshot.value as EclairState);
    });

  }

  velocity = this.cr.createVector(0, 1);
  _goldenImage: any;
  imgWidth = 20;
  imgHeight = this.imgWidth;
  golden = false;
  initialState = EclairState.OutOfScreen;
  state = signal(this.initialState);
  private readonly eclairMachine = createMachine({
    id: 'eclair' + this.id,
    initial: this.initialState,
    states: {
      [EclairState.Existed]: {
        on: {
          [EclairEvents.GoOut]: EclairState.OutOfScreen,
        },
      },
      [EclairState.OutOfScreen]: {
        on: {
          [EclairEvents.Show]: EclairState.Existed,
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

  setImage() {
    this._loadPic().then((img: any) => {
      this._img = img;
      this._img.resize(this.imgWidth, this.imgHeight);
    });

    this._loadPic().then((img: any) => {
      this._goldenImage = img;
      this._goldenImage.resize(this.imgWidth, this.imgHeight);
      this._goldenImage.filter(this.cr.INVERT);
    });

  }

  display() {
    this.show();
    if (!this.img) {
      return;
    }
    this.cr.image(
        this.img,
        this.pos.x
        - this.imgWidth / 2,
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
      type: EclairEvents.GoOut,
    });
  }

  show() {
    this.actor.send({
      type: EclairEvents.Show,
    });
  }

  private _loadPic() {
    return new Promise((resolve, reject) => this.cr.loadImage('./eclair.png', resolve, reject));
  }
}