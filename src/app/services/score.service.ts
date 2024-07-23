import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor() {
  }

  readonly score = signal(0)

  setScore(score: number) {
    this.score.set(score);
  }

  getScore() {
    return this.score();
  }

  increment() {
    this.score.update((score) => score + 1);
  }

  decrement() {
    this.score.update((score) => score - 1);
  }

  addScore(score: number) {
    this.score.update((current) => current + score);
  }
}
