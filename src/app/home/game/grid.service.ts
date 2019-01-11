var Math = window.Math;

class Tile {
  x;
  y;
  value;
  previousPosition;
  mergedFrom;

  constructor(position, value) {
    this.x                = position.x;
    this.y                = position.y;
    this.value            = value || 2;

    this.previousPosition = null;
    this.mergedFrom       = null; // Tracks tiles that merged together
  }

  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  };

  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  };

  serialize() {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      value: this.value
    };
  };
}

class Grid {
  size;
  cells;

  constructor(size, previousState) {
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();

    console.log('new grid', this)
  }

  fromState(state: object): object {
    var cells = [];

    for (var x = 0; x < this.size; x++) {
      var row = cells[x] = [];

      for (var y = 0; y < this.size; y++) {
        var tile = state[x][y];
        row.push(tile ? new Tile(tile.position, tile.value) : null);
      }
    }

    return cells;
  }

  // Build a grid of the specified size
  empty(): object {
    var cells = [];

    for (var x = 0; x < this.size; x++) {
      var row = cells[x] = [];

      for (var y = 0; y < this.size; y++) {
        row.push(null);
      }
    }

    return cells;
  }

  // Find the first available random position
  randomAvailableCell() {
    var cells = this.availableCells();

    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  };

  availableCells():object {
    var cells = [];

    this.eachCell(function (x, y, tile) {
      if (!tile) {
        cells.push({ x: x, y: y });
      }
    });

    return cells;
  };

  // Call callback for every cell
  eachCell(callback) {
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  };

  // Check if there are any cells available
  cellsAvailable():boolean {
    return !!this.availableCells().length;
  };

  // Check if the specified cell is taken
  cellAvailable(cell):boolean {
    return !this.cellOccupied(cell);
  };

  cellOccupied(cell):boolean {
    return !!this.cellContent(cell);
  };

  cellContent(cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y];
    } else {
      return null;
    }
  };

  // Inserts a tile at its position
  insertTile(tile) {
    this.cells[tile.x][tile.y] = tile;
  };

  removeTile(tile) {
    this.cells[tile.x][tile.y] = null;
  };

  withinBounds(position):boolean {
    return position.x >= 0 && position.x < this.size &&
          position.y >= 0 && position.y < this.size;
  }

  serialize() {
    var cellState = [];

    for (var x = 0; x < this.size; x++) {
      var row = cellState[x] = [];

      for (var y = 0; y < this.size; y++) {
        row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
      }
    }

    return {
      size: this.size,
      cells: cellState
    };
  }
}

export class GridService {
  generateGrid(size, previousState = null):object {
    return new Grid(size, previousState);
  }
  generateTile(position, value):object {
    return new Tile(position, value);
  }
}