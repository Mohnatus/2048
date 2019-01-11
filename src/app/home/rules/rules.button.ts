import { Component } from '@angular/core';

@Component({
  selector: 'rules-button',
  templateUrl: 'rules.button.html',
  styleUrls: ['rules.button.scss'],
})
export class RulesButton {
  isVisible = false;

  show(): void {
    console.log('show rules modal');
    this.isVisible = true;
  }

  hide(): void {
    console.log('hide rules modal');
    this.isVisible = false;
  }
}
