"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brain = exports.PLAYSTYLE = void 0;
const Skill_1 = require("./Skill");
var PLAYSTYLE;
(function (PLAYSTYLE) {
    PLAYSTYLE["AGGRESSIVE"] = "aggressive";
    PLAYSTYLE["PASSIVE"] = "passive";
})(PLAYSTYLE = exports.PLAYSTYLE || (exports.PLAYSTYLE = {}));
/** Aggressive action priority:
 *  1. Attack closest enemy if in range
 *  2. Move towards closest enemy if not in range
 */
/** Passive action priority:
 *  1. Move away from enemy if he's in moveAwayRange
 *  2. Attack closest enemy if in range
 *  3. Move towards closest enemy if not in range
 */
class Brain {
    constructor(playstyle) {
        this.skillSet = [];
        if (playstyle === PLAYSTYLE.AGGRESSIVE) {
            this.skillSet.push(new Skill_1.Skill(Skill_1.SKILL_TYPE.ATTACK_CLOSEST_ENEMY));
            this.skillSet.push(new Skill_1.Skill(Skill_1.SKILL_TYPE.MOVE_TOWARDS_CLOSEST_ENEMY));
        }
        else if (playstyle === PLAYSTYLE.PASSIVE) {
            this.skillSet.push(new Skill_1.Skill(Skill_1.SKILL_TYPE.MOVE_AWAY_FROM_ENEMY));
            this.skillSet.push(new Skill_1.Skill(Skill_1.SKILL_TYPE.ATTACK_CLOSEST_ENEMY));
            this.skillSet.push(new Skill_1.Skill(Skill_1.SKILL_TYPE.MOVE_TOWARDS_CLOSEST_ENEMY));
        }
    }
    chooseAction(bm, unit) {
        const closestEnemyUnitTile = this.getClosestTileWithEnemy(bm, unit);
        if (!closestEnemyUnitTile) {
            return;
        }
        const closestEnemyUnit = closestEnemyUnitTile.entity;
        const moveAwayRange = 1;
        let newAction = null;
        this.skillSet.every((skill) => {
            newAction = skill.use(this, bm, unit, closestEnemyUnit, moveAwayRange);
            if (newAction)
                return false;
            return true;
        });
        return newAction;
    }
    /**
     *  Returns closest tile with an enemy entity in it
     */
    getClosestTileWithEnemy(bm, unit) {
        let targetTile = null;
        let shortestDistance = 100;
        bm.getAllUnits().forEach((otherUnit) => {
            if (otherUnit.owner !== unit.owner) {
                const dist = bm.getDistance(unit.col, unit.row, otherUnit.col, otherUnit.row);
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
    getTileAwayFromEnemies(bm, unit, moveAwayRange) {
        const possibleTargets = [];
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
                if (bm.isInRange(unit.col, unit.row, tile.col, tile.row, 1) &&
                    tile.walkable) {
                    bm.getAllUnits().forEach((otherUnit) => {
                        if (otherUnit.owner !== unit.owner) {
                            if (!bm.isInRange(otherUnit.col, otherUnit.row, tile.col, tile.row, moveAwayRange)) {
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
        }
        else {
            const targetTile = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
            return targetTile;
        }
    }
}
exports.Brain = Brain;
