"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = exports.SKILL_TYPE = void 0;
const AttackAction_1 = require("./AttackAction");
const MoveAction_1 = require("./MoveAction");
var SKILL_TYPE;
(function (SKILL_TYPE) {
    SKILL_TYPE["ATTACK_CLOSEST_ENEMY"] = "Attack closest enemy";
    SKILL_TYPE["MOVE_TOWARDS_CLOSEST_ENEMY"] = "Move towards closest enemy";
    SKILL_TYPE["MOVE_AWAY_FROM_ENEMY"] = "Move away from enemy";
})(SKILL_TYPE = exports.SKILL_TYPE || (exports.SKILL_TYPE = {}));
class Skill {
    constructor(type) {
        this.action = null;
        this.type = type;
    }
    use(brain, bm, unit, closestEnemyUnit, moveAwayRange) {
        switch (this.type) {
            case SKILL_TYPE.ATTACK_CLOSEST_ENEMY:
                this.attackClosestEnemy(bm, unit, closestEnemyUnit);
                break;
            case SKILL_TYPE.MOVE_TOWARDS_CLOSEST_ENEMY:
                this.moveTowardsClosestEnemy(bm, unit, closestEnemyUnit);
                break;
            case SKILL_TYPE.MOVE_AWAY_FROM_ENEMY:
                this.moveAwayFromEnemy(brain, bm, unit, closestEnemyUnit, moveAwayRange);
                break;
            default:
                this.action = null;
        }
        return this.action;
    }
    attackClosestEnemy(bm, unit, closestEnemyUnit) {
        if (bm.isInRange(unit.col, unit.row, closestEnemyUnit.col, closestEnemyUnit.row, unit.stats.atkRange)) {
            this.action = new AttackAction_1.AttackAction(closestEnemyUnit);
        }
        else {
            this.action = null;
        }
    }
    moveTowardsClosestEnemy(bm, unit, closestEnemyUnit) {
        /* const actionTarget = unit.currentAction?.getTarget();
        if (
          actionTarget &&
          !bm.tileAt(actionTarget.col, actionTarget.row).walkable
        ) { */
        this.action = new MoveAction_1.MoveAction(bm.getEntityTile(unit), bm.getEntityTile(closestEnemyUnit), bm);
        //console.log(this.action);
        /* } else {
          this.action = null;
        } */
    }
    moveAwayFromEnemy(brain, bm, unit, closestEnemyUnit, moveAwayRange) {
        const safeTile = brain.getTileAwayFromEnemies(bm, unit, moveAwayRange);
        if (bm.isInRange(unit.col, unit.row, closestEnemyUnit.col, closestEnemyUnit.row, moveAwayRange) &&
            safeTile) {
            this.action = new MoveAction_1.MoveAction(bm.getEntityTile(unit), safeTile, bm);
        }
        else {
            this.action = null;
        }
    }
}
exports.Skill = Skill;
