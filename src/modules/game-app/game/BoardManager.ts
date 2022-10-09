import { Entity } from "./Entity";
import { Tile } from "./Tile";
import { Unit } from "./Unit";
import PF from "pathfinding";

export class BoardManager {
  board: Tile[][] = [];
  cols: number;
  rows: number;
  pfGrid: PF.Grid;
  finder: PF.AStarFinder;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;

    for (let c = 0; c < cols; c++) {
      this.board[c] = [];
      for (let r = 0; r < rows; r++) {
        this.board[c][r] = new Tile(c, r);
      }
    }

    const numberGrid = this.getNumberGrid();
    this.pfGrid = new PF.Grid(numberGrid);
    this.finder = new PF.AStarFinder({
      diagonalMovement: PF.DiagonalMovement.Always,
    });
  }

  addToBoard(entity: Entity) {
    const targetCol = entity.col;
    const targetRow = entity.row;

    if (this.tileAt(targetCol, targetRow)?.isEmpty()) {
      this.tileAt(targetCol, targetRow)?.addEntity(entity);
    } else {
      console.log(`addToBoard error: ${targetCol}, ${targetRow}`);
    }
  }

  tileAt(col: number, row: number) {
    if (this.isValid(col, row)) {
      return this.board[col][row];
    }
    console.log(`tileAt error: Tentou acessar tile ${col}, ${row}`);
    return new Tile(0, 0);
  }

  isValid(col: number, row: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  /**
   *  Checks if tile is in range
   */
  isInRange(
    col1: number,
    row1: number,
    col2: number,
    row2: number,
    range: number
  ) {
    const dist = this.getDistance(col1, row1, col2, row2);
    return dist <= range;
  }

  /**
   *  Returns distance between two tiles
   */
  getDistance(col1: number, row1: number, col2: number, row2: number) {
    return Math.max(Math.abs(col1 - col2), Math.abs(row1 - row2));
  }

  getAllEntities() {
    const entities = [];
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const tile = this.tileAt(c, r);
        if (tile.entity) {
          entities.push(tile.entity);
        }
      }
    }
    return entities;
  }

  getAllUnits() {
    const units = [];
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const tile = this.tileAt(c, r);
        if (tile.entity && tile.entity instanceof Unit) {
          units.push(tile.entity);
        }
      }
    }
    return units;
  }

  getEntityTile(entity: Entity) {
    return this.tileAt(entity.col, entity.row);
  }

  findPath(col1: number, row1: number, col2: number, row2: number) {
    const numberGrid = this.getNumberGrid();
    this.pfGrid = new PF.Grid(numberGrid);

    this.pfGrid.setWalkableAt(col1, row1, true);
    this.pfGrid.setWalkableAt(col2, row2, true);

    const path = this.finder.findPath(col1, row1, col2, row2, this.pfGrid);

    return path;
  }

  getNumberGrid(): number[][] {
    const numberGrid: number[][] = [];

    for (let r = 0; r < this.rows; r++) {
      numberGrid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        numberGrid[r][c] = this.board[c][r].walkable ? 0 : 1;
      }
    }

    return numberGrid;
  }

  printGrid(): void {
    //process.stdout.write("\x1Bc");
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        process.stdout.write("" + this.board[c][r] + " ");
      }
      process.stdout.write("\n");
    }
    console.log("----------------------------------------");
  }

  removeUnit(unit: Unit) {
    this.getEntityTile(unit).removeEntity();
  }
}
