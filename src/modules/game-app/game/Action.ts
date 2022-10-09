import { Unit } from "./Unit";

export enum ACTION_TYPE {
  MOVE = "move",
  ATTACK = "attack",
}

export class Action {
  type!: ACTION_TYPE;
  actionCost = 1000;

  afterExecute(unit: Unit) {
    unit.stats.ap -= this.actionCost;
  }
}
