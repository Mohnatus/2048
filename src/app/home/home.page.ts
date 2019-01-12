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
    this.playground.restart();
  }
}
