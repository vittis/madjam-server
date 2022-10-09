"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
class Tile {
    constructor(col, row) {
        this.entity = null;
        this.toString = () => {
            return this.entity == null ? "*" : "" + this.entity;
        };
        this.col = col;
        this.row = row;
    }
    get walkable() {
        return this.isEmpty();
    }
    addEntity(entity) {
        this.entity = entity;
        entity.col = this.col;
        entity.row = this.row;
    }
    removeEntity() {
        this.entity = null;
    }
    isEmpty() {
        return !this.entity;
    }
    getName() {
        return "(" + this.col + "," + this.row + ")";
    }
}
exports.Tile = Tile;
