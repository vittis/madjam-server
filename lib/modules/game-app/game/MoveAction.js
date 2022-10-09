"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveAction = void 0;
const Action_1 = require("./Action");
class MoveAction extends Action_1.Action {
    constructor(currentTile, targetTile, boardManager) {
        super();
        this.type = Action_1.ACTION_TYPE.MOVE;
        this.currentTile = currentTile;
        // remove first element
        const [, ...path] = boardManager.findPath(currentTile.col, currentTile.row, targetTile.col, targetTile.row);
        const tilesPath = path.map((pos) => boardManager.tileAt(pos[0], pos[1]));
        this.path = tilesPath;
        this.targetTile = tilesPath[0];
    }
    changeCurrent(newCurrent) {
        this.currentTile = newCurrent;
    }
    changeTarget(newTarget) {
        this.targetTile = newTarget;
    }
    getTarget() {
        return this.targetTile;
    }
    clearTarget() {
        this.targetTile = null;
    }
    execute(unit) {
        if (this.currentTile && this.targetTile) {
            this.move(unit);
            this.afterExecute(unit);
        }
        else {
            console.log("-------------");
            console.log(this.currentTile);
            console.log(this.targetTile);
            throw Error("TENTOU EXECUTAR MOVE TARGET OU CURRENT NULL");
        }
    }
    move(unit) {
        const tileToMove = this.path[0];
        if (tileToMove.isEmpty()) {
            tileToMove.addEntity(unit);
            this.currentTile.removeEntity();
            this.changeCurrent(tileToMove);
            this.clearTarget();
        }
        else {
            throw Error("Tentou mover pra lugar não vazio " + tileToMove.col + tileToMove.row);
        }
    }
}
exports.MoveAction = MoveAction;
