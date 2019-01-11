import { Injectable } from '@angular/core';
import { GridService } from './grid.service';


@Injectable()
export class GameManagerService {
  size;
  inputManager;
  htmlManager;
  storageManager;
  startTiles = 2;
  keep;
  over;
  won;
  score;
  grid;
  Math;

  constructor(
    private gridService: GridService
  ) {}

  init(
    size : number, 
    inputManager : any, 
    htmlManager : any, 
    storageManager: any
  ) {
    this.Math = window.Math;

    this.size = size;
    this.inputManager = inputManager;
    this.htmlManager = htmlManager;
    this.storageManager = storageManager;

    this.htmlManager.init();
    this.inputManager.init();

    // subscribe on input events
    this.inputManager.on("move", () => this.move());
    this.inputManager.on("restart", () => this.restart());
    this.inputManager.on("keepPlaying", () => this.keepPlaying());

    console.log('game manager init', size, this.size);

    this.setup();
  }

  // настройка игры
  setup():void {
    //var previousState = this.storageManager.getGameState();
    var previousState = false;
    // Reload the game from a previous game if present
    if (previousState) {

      // this.grid        = this.grid.generateGrid(previousState.grid.size,
      //                             previousState.grid.cells); 
      // this.score       = previousState.score;
      // this.over        = previousState.over;
      // this.won         = previousState.won;
      // this.keep = previousState.keepPlaying;

    } else {

      this.grid        = this.gridService.generateGrid(this.size);
      this.score       = 0;
      this.over        = false;
      this.won         = false;
      this.keep = false;

      // Add the initial tiles
      this.addStartTiles();

    }

    console.log('game-manager setup', this.grid)

    // Update the actuator
    this.actuate();
  }

  // start new game
  restart():void {
    console.log('game manager restart');
    //this.storageManager.clearGameState();
    //this.htmlManager.continueGame(); // Clear the game won/lost message
    this.setup();
  }

  // Sends the updated grid to the actuator
  actuate():void {
    if (this.storageManager.getBestScore() < this.score) {
      this.storageManager.setBestScore(this.score);
    }

    // Clear the state when the game is over (game over only, not win)
    if (this.over) {
      this.storageManager.clearGameState();
    } else {
      this.storageManager.setGameState(this.serialize());
    }

    this.htmlManager.actuate(this.grid, {
      score:      this.score,
      over:       this.over,
      won:        this.won,
      bestScore:  this.storageManager.getBestScore(),
      terminated: this.isTerminated()
    });
  }

  // Set up the initial tiles to start the game with
  addStartTiles():void {
    for (var i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }

  // Adds a tile in a random position
  addRandomTile():void {
    if (this.grid.cellsAvailable()) {
      var value = this.Math.random() < 0.9 ? 2 : 4;
      var tile = this.gridService.generateTile(this.grid.randomAvailableCell(), value);

      this.grid.insertTile(tile);
    }
  }

  // Save all tile positions and remove merger info
  prepareTiles = function () {
    this.grid.eachCell(function (x, y, tile) {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    });
  };

  // Move a tile and its representation
  moveTile(tile, cell):void {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
  }

  // Move tiles on the grid in the specified direction
  move():void {

    // 0: up, 
    // 1: right, 
    // 2: down, 
    // 3: left

    var self = this;

    if (this.isTerminated()) return; // Don't do anything if the game's over

    var cell, tile;

    var vector     = this.getVector(direction);
    var traversals = this.buildTraversals(vector);
    var moved      = false;

    // Save the current tile positions and remove merger information
    this.prepareTiles();

    // Traverse the grid in the right direction and move tiles
    traversals.x.forEach(function (x) {
      traversals.y.forEach(function (y) {
        cell = { x: x, y: y };
        tile = self.grid.cellContent(cell);

        if (tile) {
          var positions = self.findFarthestPosition(cell, vector);
          var next      = self.grid.cellContent(positions.next);

          // Only one merger per row traversal?
          if (next && next.value === tile.value && !next.mergedFrom) {
            var merged = this.gridService.generateTile(positions.next, tile.value * 2);
            merged.mergedFrom = [tile, next];

            self.grid.insertTile(merged);
            self.grid.removeTile(tile);

            // Converge the two tiles' positions
            tile.updatePosition(positions.next);

            // Update the score
            self.score += merged.value;

            // The mighty 2048 tile
            if (merged.value === 2048) self.won = true;
          } else {
            self.moveTile(tile, positions.farthest);
          }

          if (!self.positionsEqual(cell, tile)) {
            moved = true; // The tile moved from its original cell!
          }
        }
      });
    });

    if (moved) {
      this.addRandomTile();

      if (!this.movesAvailable()) {
        this.over = true; // Game over!
      }

      this.actuate();
    }
  }

  // Keep playing after winning (allows going over 2048)
  keepPlaying():void {
    console.log('game manager keep playing');
    this.keep = true;
    //this.htmlManager.continueGame(); // Clear the game won/lost message
  }

  // Return true if the game is lost, or has won and the user hasn't kept playing
  isTerminated():boolean {
    return this.over || (this.won && !this.keep);
  }

  // Represent the current game as an object
  serialize():object {
    return {
      grid:        this.grid.serialize(),
      score:       this.score,
      over:        this.over,
      won:         this.won,
      keepPlaying: this.keepPlaying
    };
  }

  // Get the vector representing the chosen direction
  getVector(direction) {
    // Vectors representing tile movement
    var map = {
      0: { x: 0,  y: -1 }, // Up
      1: { x: 1,  y: 0 },  // Right
      2: { x: 0,  y: 1 },  // Down
      3: { x: -1, y: 0 }   // Left
    };

    return map[direction];
  };

  // Build a list of positions to traverse in the right order
  buildTraversals(vector) {
    var traversals = { 
      x: [], 
      y: [] 
    };

    for (var pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }

    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();

    return traversals;
  };

  findFarthestPosition(cell, vector) {
    var previous;

    // Progress towards the vector direction until an obstacle is found
    do {
      previous = cell;
      cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) &&
            this.grid.cellAvailable(cell));

    return {
      farthest: previous,
      next: cell // Used to check if a merge is required
    };
  };

  movesAvailable() {
    return this.grid.cellsAvailable() || this.tileMatchesAvailable();
  };

  // Check for available matches between tiles (more expensive check)
  tileMatchesAvailable() {
    var self = this;

    var tile;

    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        tile = this.grid.cellContent({ x: x, y: y });

        if (tile) {
          for (var direction = 0; direction < 4; direction++) {
            var vector = self.getVector(direction);
            var cell   = { x: x + vector.x, y: y + vector.y };

            var other  = self.grid.cellContent(cell);

            if (other && other.value === tile.value) {
              return true; // These two tiles can be merged
            }
          }
        }
      }
    }

    return false;
  };

  positionsEqual(first, second) {
    return first.x === second.x && first.y === second.y;
  };

}