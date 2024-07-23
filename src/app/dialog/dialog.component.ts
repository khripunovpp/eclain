import {Component, Input} from '@angular/core';

@Component({
  selector: 'game-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input({required: true}) title!: string
}
