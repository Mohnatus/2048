import { Component } from '@angular/core';

import { GameManagerService } from './game-manager.service';
import { KeyboardInputManagerService } from './keyboard-input-manager.service';
import { HTMLActuatorService } from './html-actuator.service';
import { LocalStorageManagerService } from './local-storage-manager.service';
import { GridService } from './grid.service';

@Component({
  selector: 'game-playground',
  templateUrl: 'game.playground.html',
  styleUrls: ['game.playground.scss'],
  providers: [
    GameManagerService,
    KeyboardInputManagerService,
    HTMLActuatorService,
    LocalStorageManagerService,
    GridService
  ]
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
    console.log(this.size, 555)
    // Wait till the browser is ready to render the game (avoids glitches)
    window.requestAnimationFrame(() => {
      console.log(this, this.size)
      this.gameManager.init(this.size, this.inputManager, this.htmlManager, this.storageManager);
    });
  }

  start(): void {
    console.log(this.size)
    this.gameManager.restart();
  }

  next(): void {

  }
}
