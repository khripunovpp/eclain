import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {BroadcastComponent} from "./layers/broadcast/broadcast.component";
import {PageComponent} from "./page/page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BroadcastComponent, PageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'camera-points';
}
