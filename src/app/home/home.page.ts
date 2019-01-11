import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  startNewGame(): void {
    console.log('start new game');
  }

  showRules(): void {
    console.log('show rules');
  }
}
