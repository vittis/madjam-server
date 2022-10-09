import { Action, ACTION_TYPE } from "./Action";
import { BoardManager } from "./BoardManager";
import { Tile } from "./Tile";
import { Unit } from "./Unit";

export class MoveAction extends Action {
  currentTile: Tile;
  targetTile: Tile | null;

  path: Tile[];

  constructor(currentTile: Tile, targetTile: Tile, boardManager: BoardManager) {
    super();
    this.type = ACTION_TYPE.MOVE;
    this.currentTile = currentTile;

    // remove first element
    const [, ...path] = boardManager.findPath(
      currentTile.col,
      currentTile.row,
      targetTile.col,
      targetTile.row
    );
    const tilesPath = path.map((pos: any) =>
      boardManager.tileAt(pos[0], pos[1])
    );

    this.path = tilesPath;
    this.targetTile = tilesPath[0];
  }

  changeCurrent(newCurrent: Tile) {
    this.currentTile = newCurrent;
  }

  changeTarget(newTarget: Tile) {
    this.targetTile = newTarget;
  }

  getTarget() {
    return this.targetTile;
  }

  clearTarget() {
    this.targetTile = null;
  }

  execute(unit: Unit) {
    if (this.currentTile && this.targetTile) {
      this.move(unit);
      this.afterExecute(unit);
    } else {
      console.log("-------------");
      console.log(this.currentTile);
      console.log(this.targetTile);
      throw Error("TENTOU EXECUTAR MOVE TARGET OU CURRENT NULL");
    }
  }

  move(unit: Unit) {
    const tileToMove = this.path[0];

    if (tileToMove.isEmpty()) {
      tileToMove.addEntity(unit);
      this.currentTile.removeEntity();
      this.changeCurrent(tileToMove);
      this.clearTarget();
    } else {
      throw Error(
        "Tentou mover pra lugar não vazio " + tileToMove.col + tileToMove.row
      );
    }
  }
}
