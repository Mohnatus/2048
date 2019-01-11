import { Component, ViewChild } from '@angular/core';
import { GamePlayground } from './game/game.playground';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(GamePlayground)
  private playground: GamePlayground; 

  startNewGame(): void {
    this.playground.start();
  }

  showRules(): void {
    console.log('show rules');
  }
}
