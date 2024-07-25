import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor() {
  }

  readonly score = signal(0)
  readonly winScore = 100;

  setScore(score: number) {
    this.score.set(score);
  }

  getScore() {
    return this.score();
  }

  get win() {
    return this.score() >= this.winScore;
  }

  increment() {
    this.score.update((score) => {
      if (score >= this.winScore) {
        return this.winScore;
      }
      return score + 1;
    })
  }

  decrement() {
    this.score.update((score) => {
      if (score <= 0) {
        return 0;
      }
      return score - 1;
    })
  }

  addScore(score: number) {
    this.score.update((current) => {
      if (current >= this.winScore || current + score >= this.winScore) {
        return this.winScore;
      }
      return current + score;
    });
  }
}
