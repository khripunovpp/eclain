import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'game-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input({required: true}) title!: string
  @Output() continue = new EventEmitter<void>()

  onContinue() {
    this.continue.emit()
  }
}
