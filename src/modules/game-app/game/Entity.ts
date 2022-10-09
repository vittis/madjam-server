export abstract class Entity {
  col: number;
  row: number;

  constructor(col: number, row: number) {
    this.col = col;
    this.row = row;
  }
}
