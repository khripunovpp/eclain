import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {BroadcastComponent} from "./broadcast/broadcast.component";
import {CumeraPageComponent} from "./cumera-page/cumera-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BroadcastComponent, CumeraPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'camera-points';
}
