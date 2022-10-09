import { Action, ACTION_TYPE } from "./Action";
import { BoardManager } from "./BoardManager";
import { Unit } from "./Unit";
import { randomIntFromInterval } from "./utils/rng";

export class AttackAction extends Action {
  targetUnit: Unit | null;

  constructor(targetUnit: Unit) {
    super();
    this.type = ACTION_TYPE.ATTACK;
    this.targetUnit = targetUnit;
  }

  changeTarget(newTarget: Unit) {
    this.targetUnit = newTarget;
  }

  clearTarget() {
    this.targetUnit = null;
  }

  getTarget() {
    return this.targetUnit;
  }

  execute(unit: Unit) {
    if (this.targetUnit) {
      this.attackWithMainHand(unit, this.targetUnit);
      this.clearTarget();
      this.afterExecute(unit);
    } else {
      console.log("TENTOU ATACAR TARGET NULL");
    }
  }

  attackWithMainHand(unit: Unit, target: Unit) {
    const baseDamage = randomIntFromInterval(
      unit.stats.mainHandDamage.min,
      unit.stats.mainHandDamage.max
    );
    //console.log(unit.getName(), " atacando com ", baseDamage);
    target.receiveDamage(
      baseDamage,
      unit.equipment.mainHandWeapon.penetration,
      unit.equipment.mainHandWeapon.armorShred
    );
  }
}
