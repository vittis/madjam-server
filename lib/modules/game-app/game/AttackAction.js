"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackAction = void 0;
const Action_1 = require("./Action");
const rng_1 = require("./utils/rng");
class AttackAction extends Action_1.Action {
    constructor(targetUnit) {
        super();
        this.type = Action_1.ACTION_TYPE.ATTACK;
        this.targetUnit = targetUnit;
    }
    changeTarget(newTarget) {
        this.targetUnit = newTarget;
    }
    clearTarget() {
        this.targetUnit = null;
    }
    getTarget() {
        return this.targetUnit;
    }
    execute(unit) {
        if (this.targetUnit) {
            this.attackWithMainHand(unit, this.targetUnit);
            this.clearTarget();
            this.afterExecute(unit);
        }
        else {
            console.log("TENTOU ATACAR TARGET NULL");
        }
    }
    attackWithMainHand(unit, target) {
        const baseDamage = (0, rng_1.randomIntFromInterval)(unit.stats.mainHandDamage.min, unit.stats.mainHandDamage.max);
        //console.log(unit.getName(), " atacando com ", baseDamage);
        target.receiveDamage(baseDamage, unit.equipment.mainHandWeapon.penetration, unit.equipment.mainHandWeapon.armorShred);
    }
}
exports.AttackAction = AttackAction;
