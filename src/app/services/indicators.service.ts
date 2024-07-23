import {Injectable, signal} from '@angular/core';
import {createActor, createMachine} from "xstate";

enum IndicatorsState {
  Showed = 'showed',
  Hidden = 'hidden',
}

enum IndicatorsEvent {
  Show = 'show',
  Hide = 'hide',
}

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {

  constructor() {
    this.actor.start();
    this.actor.subscribe((snapshot) => {
      this.state.set(snapshot.value as IndicatorsState);
    });
  }

  private readonly _initialState = IndicatorsState.Hidden;
  private readonly state = signal(this._initialState);
  private readonly stateMachine = createMachine({
    id: 'indicators',
    initial: this._initialState,
    states: {
      [IndicatorsState.Showed]: {
        on: {
          [IndicatorsEvent.Hide]: IndicatorsState.Hidden,
        },
      },
      [IndicatorsState.Hidden]: {
        on: {
          [IndicatorsEvent.Show]: IndicatorsState.Showed,
        },
      },
    },
  })
  private readonly actor = createActor(this.stateMachine)

  get hidden() {
    return this.state() === IndicatorsState.Hidden

  }

  show() {
    this.actor.send({
      type: IndicatorsEvent.Show,
    })
  }

  hide() {
    this.actor.send({
      type: IndicatorsEvent.Hide,
    })
  }
}
