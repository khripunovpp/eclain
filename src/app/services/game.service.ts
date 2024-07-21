import {Injectable, OnInit} from "@angular/core";
import {createActor, createMachine} from 'xstate';

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

  get isPaused() {
    return this.actor.getSnapshot().value == GameStates.Paused;
  }

  ngOnInit() {
  }

  toggle() {
    this.actor.send({
      type: 'toggle',
    });

    console.log('after toggle', this.actor.getSnapshot().value);
  }

  pause() {

  }

  start() {
    this.actor.send({
      type: 'start',
    });


    console.log('after start', this.actor.getSnapshot().value);
  }
}