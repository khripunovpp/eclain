import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LifeService {

  constructor() {
  }

  private readonly maxLife = 1;

  readonly life = signal(this.maxLife)

  get alive() {
    return this.life() > 0;
  }

  get dead() {
    return this.life() <= 0;
  }

  setLife(
      life: number,
  ) {
    if (life > this.maxLife) return;
    this.life.set(life);
  }

  getLife() {
    return this.life();
  }

  increment() {
    this.life.update((life) => {
      if (life < this.maxLife) {
        return life + 1;
      } else {
        return this.maxLife;
      }
    });
  }

  decrement() {
    this.life.update((life) => {
      if (life > 0) {
        return life - 1;
      } else {
        return 0;
      }
    });
  }
}
