import { Component, ViewEncapsulation } from '@angular/core';

import { GameManagerService } from './game-manager.service';
import { KeyboardInputManagerService } from './keyboard-input-manager.service';
import { HTMLActuatorService } from './html-actuator.service';
import { LocalStorageManagerService } from './local-storage-manager.service';
import { GridService } from './grid.service';

@Component({
  selector: 'game-playground',
  templateUrl: 'game.playground.html',
  providers: [
    GameManagerService,
    KeyboardInputManagerService,
    HTMLActuatorService,
    LocalStorageManagerService,
    GridService
  ],
  encapsulation: ViewEncapsulation.None
})
export class GamePlayground {
  size = 4;

  constructor(
    private gameManager: GameManagerService,
    private inputManager: KeyboardInputManagerService,
    private htmlManager: HTMLActuatorService,
    private storageManager: LocalStorageManagerService
  ) {}
  

  ngOnInit(): void {
    // Wait till the browser is ready to render the game (avoids glitches)
    window.requestAnimationFrame(() => {
      this.gameManager.init(this.size, this.inputManager, this.htmlManager, this.storageManager);
    });
  }

  restart(): void {
    console.log(123)
    this.gameManager.restart();
  }

  keepPlaying(): void {
    this.gameManager.keepPlaying();
  }

  next(): void {

  }
}
