import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { GamePlayground } from './game/game.playground';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage {
  @ViewChild(GamePlayground)
  private playground: GamePlayground; 

  restart(): void {
    console.log('start')
    this.playground.restart();
  }

  showRules(): void {
    console.log('show rules');
  }
}
