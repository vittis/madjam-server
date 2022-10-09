import { AttackAction } from "./AttackAction";
import { BoardManager } from "./BoardManager";
import { Brain } from "./Brain";
import { MoveAction } from "./MoveAction";
import { Unit } from "./Unit";

export enum SKILL_TYPE {
  ATTACK_CLOSEST_ENEMY = "Attack closest enemy",
  MOVE_TOWARDS_CLOSEST_ENEMY = "Move towards closest enemy",
  MOVE_AWAY_FROM_ENEMY = "Move away from enemy",
}

export class Skill {
  action: AttackAction | MoveAction | null;
  type: SKILL_TYPE;

  constructor(type: SKILL_TYPE) {
    this.action = null;
    this.type = type;
  }

  use(
    brain: Brain,
    bm: BoardManager,
    unit: Unit,
    closestEnemyUnit: Unit,
    moveAwayRange: number
  ): AttackAction | MoveAction | null {
    switch (this.type) {
      case SKILL_TYPE.ATTACK_CLOSEST_ENEMY:
        this.attackClosestEnemy(bm, unit, closestEnemyUnit);
        break;
      case SKILL_TYPE.MOVE_TOWARDS_CLOSEST_ENEMY:
        this.moveTowardsClosestEnemy(bm, unit, closestEnemyUnit);
        break;

      case SKILL_TYPE.MOVE_AWAY_FROM_ENEMY:
        this.moveAwayFromEnemy(
          brain,
          bm,
          unit,
          closestEnemyUnit,
          moveAwayRange
        );
        break;

      default:
        this.action = null;
    }
    return this.action;
  }

  attackClosestEnemy(bm: BoardManager, unit: Unit, closestEnemyUnit: Unit) {
    if (
      bm.isInRange(
        unit.col,
        unit.row,
        closestEnemyUnit.col,
        closestEnemyUnit.row,
        unit.stats.atkRange
      )
    ) {
      this.action = new AttackAction(closestEnemyUnit);
    } else {
      this.action = null;
    }
  }

  moveTowardsClosestEnemy(
    bm: BoardManager,
    unit: Unit,
    closestEnemyUnit: Unit
  ) {
    /* const actionTarget = unit.currentAction?.getTarget();
    if (
      actionTarget &&
      !bm.tileAt(actionTarget.col, actionTarget.row).walkable
    ) { */
    this.action = new MoveAction(
      bm.getEntityTile(unit),
      bm.getEntityTile(closestEnemyUnit),
      bm
    );
    //console.log(this.action);
    /* } else {
      this.action = null;
    } */
  }

  moveAwayFromEnemy(
    brain: Brain,
    bm: BoardManager,
    unit: Unit,
    closestEnemyUnit: Unit,
    moveAwayRange: number
  ) {
    const safeTile = brain.getTileAwayFromEnemies(bm, unit, moveAwayRange);
    if (
      bm.isInRange(
        unit.col,
        unit.row,
        closestEnemyUnit.col,
        closestEnemyUnit.row,
        moveAwayRange
      ) &&
      safeTile
    ) {
      this.action = new MoveAction(bm.getEntityTile(unit), safeTile, bm);
    } else {
      this.action = null;
    }
  }
}
