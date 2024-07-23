import {inject, Injectable, signal} from '@angular/core';
import {AssetsService} from "./assets.service";
import {CanvasRendererService} from "./canvas-renderer.service";
import {Enemy} from "../objects/enemy";

@Injectable({
  providedIn: 'root'
})
export class EnemiesService {

  constructor() {
  }

  enemies: Enemy[] = []
  enemiesCount = 3;
  enemiesShowed = signal(0);
  private readonly assetsService = inject(AssetsService);
  private readonly cr = inject(CanvasRendererService);
  private _lastEnemy?: Enemy;

  reset() {
    this.enemies = [];
    this.enemiesShowed.set(0);
  }

  async createEnemies() {
    try {
      this.enemies = [];
      for (let i = 0; i < this.enemiesCount; i++) {
        this._lastEnemy = new Enemy(this.cr.renderer, i, this.cr.renderer.createVector(
            this.cr.renderer.random(this.cr.renderer.width),
            -this.cr.renderer.random(0, 200),
        ));
        this._lastEnemy.setImage(this.assetsService.get('pop'));
        this.enemies.push(this._lastEnemy);
      }
      this.enemiesShowed.set(this.enemiesCount);
    } catch (e) {
      console.error(e);
    }
  }

  // runEclairAgain(eclair: Eclair) {
  //   eclair.reset(this._getPositionByLastEclair(this._lastEnemy));
  //   eclair.setOutOfScreen();
  //   const goldenVal = this.cr.renderer.random();
  //   const golden = !this._lastEnemy?.golden && goldenVal <= 0.5;
  //   eclair.setGolden(golden);
  //
  //   this._lastEnemy = eclair;
  //   this.enemiesShowed.update((count) => count + 1);
  // }

  // hitEclair(eclair: Eclair) {
  //   this.runEclairAgain(eclair);
  // }

  update() {
    for (let enemy of this.enemies) {
      enemy.display();
      enemy.update(this.cr.renderer);
    }
  }

  //
  // private _getPositionByLastEclair(lastEclair?: Eclair) {
  //   if (!lastEclair?.pos) {
  //     return this.cr.renderer.createVector(
  //         this.cr.renderer.random(this.cr.renderer.width),
  //         -this.cr.renderer.random(0, 200),
  //     );
  //   }
  //   return this.cr.renderer.createVector(
  //       this.cr.renderer.random(this.cr.renderer.width),
  //       -this.cr.renderer.random(Math.abs(lastEclair.pos.y) + 50, Math.abs(lastEclair.pos.y) + 300),
  //   );
  // }
}
