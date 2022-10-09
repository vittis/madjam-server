import { Entity } from "./Entity";

export class Tile {
  col: number;
  row: number;

  entity: Entity | null = null;

  get walkable(): boolean {
    return this.isEmpty();
  }

  addEntity(entity: Entity) {
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

  public toString = (): string => {
    return this.entity == null ? "*" : "" + this.entity;
  };

  constructor(col: number, row: number) {
    this.col = col;
    this.row = row;
  }
}
