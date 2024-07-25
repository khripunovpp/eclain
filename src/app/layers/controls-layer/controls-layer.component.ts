import {ChangeDetectionStrategy, Component, computed, inject, OnInit} from '@angular/core';
import {GameService, GameStates} from "../../services/game.service";
import {DialogComponent} from "../../dialog/dialog.component";
import {ScoreService} from "../../services/score.service";
import {LifeService} from "../../services/life.service";

@Component({
  selector: 'app-controls-layer',
  standalone: true,
  imports: [
    DialogComponent
  ],
  templateUrl: './controls-layer.component.html',
  styleUrl: './controls-layer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsLayerComponent
    implements OnInit {
   readonly gameService = inject(GameService);
   readonly scoreService = inject(ScoreService);
   readonly lifeService = inject(LifeService);
  readonly gameIsOver = computed(() => this.gameService.gameState() === GameStates.Failed);
  readonly gameIsWon = computed(() => this.gameService.gameState() === GameStates.Win);
  readonly gamePaused = computed(() => this.gameService.gameState() === GameStates.Paused);

  ngOnInit() {
  }
}
