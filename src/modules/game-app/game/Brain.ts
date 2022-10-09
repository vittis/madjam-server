import { Action } from "./Action";
import { AttackAction } from "./AttackAction";
import { BoardManager } from "./BoardManager";
import { MoveAction } from "./MoveAction";
import { Skill, SKILL_TYPE } from "./Skill";
import { Tile } from "./Tile";
import { Unit } from "./Unit";

export enum PLAYSTYLE {
  AGGRESSIVE = "aggressive",
  PASSIVE = "passive",
}

/** Aggressive action priority:
 *  1. Attack closest enemy if in range
 *  2. Move towards closest enemy if not in range
 */
/** Passive action priority:
 *  1. Move away from enemy if he's in moveAwayRange
 *  2. Attack closest enemy if in range
 *  3. Move towards closest enemy if not in range
 */

export class Brain {
  skillSet: Skill[];

  constructor(playstyle: PLAYSTYLE) {
    this.skillSet = [];
    if (playstyle === PLAYSTYLE.AGGRESSIVE) {
      this.skillSet.push(new Skill(SKILL_TYPE.ATTACK_CLOSEST_ENEMY));
      this.skillSet.push(new Skill(SKILL_TYPE.MOVE_TOWARDS_CLOSEST_ENEMY));
    } else if (playstyle === PLAYSTYLE.PASSIVE) {
      this.skillSet.push(new Skill(SKILL_TYPE.MOVE_AWAY_FROM_ENEMY));
      this.skillSet.push(new Skill(SKILL_TYPE.ATTACK_CLOSEST_ENEMY));
      this.skillSet.push(new Skill(SKILL_TYPE.MOVE_TOWARDS_CLOSEST_ENEMY));
    }
  }

  chooseAction(bm: BoardManager, unit: Unit): AttackAction | MoveAction | null {
    const closestEnemyUnitTile = this.getClosestTileWithEnemy(bm, unit);
    if (!closestEnemyUnitTile) {
      return;
    }

    const closestEnemyUnit = closestEnemyUnitTile.entity as Unit;

    const moveAwayRange = 1;

    let newAction: AttackAction | MoveAction | null = null;

    this.skillSet.every((skill) => {
      newAction = skill.use(this, bm, unit, closestEnemyUnit, moveAwayRange);

      if (newAction) return false;
      return true;
    });

    return newAction;
  }

  /**
   *  Returns closest tile with an enemy entity in it
   */
  getClosestTileWithEnemy(bm: BoardManager, unit: Unit): Tile {
    let targetTile: Tile | null = null;
    let shortestDistance = 100;

    bm.getAllUnits().forEach((otherUnit) => {
      if (otherUnit.owner !== unit.owner) {
        const dist = bm.getDistance(
          unit.col,
          unit.row,
          otherUnit.col,
          otherUnit.row
        );

        if (dist < shortestDistance) {
          targetTile = bm.tileAt(otherUnit.col, otherUnit.row);
          shortestDistance = dist;
        }
      }
    });

    if (!targetTile) {
      //throw Error("getClosestTileWithEnemy: Não encontrou targetTile");
    }

    return targetTile;
  }

  /**
   *  Returns tile away from enemies
   */
  getTileAwayFromEnemies(
    bm: BoardManager,
    unit: Unit,
    moveAwayRange: number
  ): Tile | null {
    const possibleTargets: Tile[] = [];

    /** Iterate every tile checking if tile:
     *  1. Is in move range
     *  2. Is walkable
     *  3. Isn't in move away range from any enemy
     *  Save tiles that fulfills conditions
     *  Return a random one or null if none
     */
    for (let c = 0; c < bm.cols; c++) {
      for (let r = 0; r < bm.rows; r++) {
        const tile = bm.tileAt(c, r);
        if (
          bm.isInRange(unit.col, unit.row, tile.col, tile.row, 1) &&
          tile.walkable
        ) {
          bm.getAllUnits().forEach((otherUnit) => {
            if (otherUnit.owner !== unit.owner) {
              if (
                !bm.isInRange(
                  otherUnit.col,
                  otherUnit.row,
                  tile.col,
                  tile.row,
                  moveAwayRange
                )
              ) {
                possibleTargets.push(tile);
              }
            }
          });
        }
      }
    }

    if (possibleTargets.length === 0) {
      //console.log("getTileAwayFromEnemy: ", unit.getName(), " não encontrou targetTile");
      return null;
    } else {
      const targetTile =
        possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
      return targetTile;
    }
  }
}
