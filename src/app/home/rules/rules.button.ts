import { Component } from '@angular/core';

@Component({
  selector: 'rules-button',
  templateUrl: 'rules.button.html',
  styleUrls: ['rules.button.scss'],
})
export class RulesButton {
  isVisible = false;

  show(): void {
    this.isVisible = true;
  }

  hide(): void {
    this.isVisible = false;
  }
}
