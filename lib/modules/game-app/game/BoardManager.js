"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardManager = void 0;
const Tile_1 = require("./Tile");
const Unit_1 = require("./Unit");
const pathfinding_1 = __importDefault(require("pathfinding"));
class BoardManager {
    constructor(cols, rows) {
        this.board = [];
        this.cols = cols;
        this.rows = rows;
        for (let c = 0; c < cols; c++) {
            this.board[c] = [];
            for (let r = 0; r < rows; r++) {
                this.board[c][r] = new Tile_1.Tile(c, r);
            }
        }
        const numberGrid = this.getNumberGrid();
        this.pfGrid = new pathfinding_1.default.Grid(numberGrid);
        this.finder = new pathfinding_1.default.AStarFinder({
            diagonalMovement: pathfinding_1.default.DiagonalMovement.Always,
        });
    }
    addToBoard(entity) {
        var _a, _b;
        const targetCol = entity.col;
        const targetRow = entity.row;
        if ((_a = this.tileAt(targetCol, targetRow)) === null || _a === void 0 ? void 0 : _a.isEmpty()) {
            (_b = this.tileAt(targetCol, targetRow)) === null || _b === void 0 ? void 0 : _b.addEntity(entity);
        }
        else {
            console.log(`addToBoard error: ${targetCol}, ${targetRow}`);
        }
    }
    tileAt(col, row) {
        if (this.isValid(col, row)) {
            return this.board[col][row];
        }
        console.log(`tileAt error: Tentou acessar tile ${col}, ${row}`);
        return new Tile_1.Tile(0, 0);
    }
    isValid(col, row) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    /**
     *  Checks if tile is in range
     */
    isInRange(col1, row1, col2, row2, range) {
        const dist = this.getDistance(col1, row1, col2, row2);
        return dist <= range;
    }
    /**
     *  Returns distance between two tiles
     */
    getDistance(col1, row1, col2, row2) {
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
                if (tile.entity && tile.entity instanceof Unit_1.Unit) {
                    units.push(tile.entity);
                }
            }
        }
        return units;
    }
    getEntityTile(entity) {
        return this.tileAt(entity.col, entity.row);
    }
    findPath(col1, row1, col2, row2) {
        const numberGrid = this.getNumberGrid();
        this.pfGrid = new pathfinding_1.default.Grid(numberGrid);
        this.pfGrid.setWalkableAt(col1, row1, true);
        this.pfGrid.setWalkableAt(col2, row2, true);
        const path = this.finder.findPath(col1, row1, col2, row2, this.pfGrid);
        return path;
    }
    getNumberGrid() {
        const numberGrid = [];
        for (let r = 0; r < this.rows; r++) {
            numberGrid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                numberGrid[r][c] = this.board[c][r].walkable ? 0 : 1;
            }
        }
        return numberGrid;
    }
    printGrid() {
        //process.stdout.write("\x1Bc");
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                process.stdout.write("" + this.board[c][r] + " ");
            }
            process.stdout.write("\n");
        }
        console.log("----------------------------------------");
    }
    removeUnit(unit) {
        this.getEntityTile(unit).removeEntity();
    }
}
exports.BoardManager = BoardManager;
