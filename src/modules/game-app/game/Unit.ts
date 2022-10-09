import { ArmorData } from "./Armor";
import { Entity } from "./Entity";
import { Brain, PLAYSTYLE } from "./Brain";
import { WeaponData } from "./Weapon";
import { AttackAction } from "./AttackAction";
import Config from "./data/config";
import { MoveAction } from "./MoveAction";
import { ACTION_TYPE } from "./Action";
import { BoardManager } from "./BoardManager";

enum ARMOR_TYPE {
  LIGHT = "light",
  MEDIUM = "medium",
  HEAVY = "heavy",
}

interface ArmorTypeBonuses {
  quickness: number;
}

export interface UnitStats {
  str: number;
  dex: number;
  hp: number;
  maxHp: number;
  armorHp: number;
  maxArmorHp: number;
  quickness: number;
  ap: number;
  mainHandDamage: {
    min: number;
    max: number;
  };
  weight: number;
  armorType: ARMOR_TYPE;
  atkRange: number;
}

export interface BackgroundData {
  name: string;
  str: number;
  dex: number;
  hp: number;
  quickness: number;
}

export interface Equipment {
  mainHandWeapon: WeaponData;
  chest: ArmorData;
  head: ArmorData;
}

interface UnitData {
  backgrounds: BackgroundData[];
  equipment: Equipment;
  playstyle: PLAYSTYLE;
}

export class Unit extends Entity {
  stats: UnitStats;
  backgrounds: BackgroundData[];
  equipment: Equipment;
  brain: Brain;
  currentAction: AttackAction | MoveAction | null;
  // Temporary implementation of owner
  owner: "P1" | "P2";
  TEST_attacksCounter = 0;

  preSerialize() {
    return {
      owner: this.owner,
      backgrounds: this.backgrounds,
      equipment: this.equipment,
      stats: this.stats,
      pos: {
        row: this.row,
        col: this.col,
      },
    };
  }

  // todo: spread all sub-obj properties (ie equipment.mainHandWeapon), else it will use reference
  serialize() {
    return {
      owner: this.owner,
      backgrounds: [...this.backgrounds],
      currentAction: this.currentAction?.type,
      actionTarget: this.currentAction ? { col: this.currentAction.getTarget()?.col, row: this.currentAction.getTarget()?.row } : undefined,
      equipment: {
        mainHandWeapon: {
          ...this.equipment.mainHandWeapon,
          damage: { ...this.equipment.mainHandWeapon.damage },
        },
        chest: { ...this.equipment.chest },
        head: { ...this.equipment.head },
      },
      stats: {
        ...this.stats,
        mainHandDamage: { ...this.stats.mainHandDamage },
      },
      row: this.row,
      col: this.col,
    };
  }

  constructor(
    owner: "P1" | "P2",
    col: number,
    row: number,
    { backgrounds, equipment, playstyle }: UnitData
  ) {
    super(col, row);
    this.owner = owner;
    this.backgrounds = backgrounds;
    this.equipment = equipment;
    this.brain = new Brain(playstyle);
    this.currentAction = null;

    const { mainHandWeapon } = equipment;

    const totalStr = backgrounds.reduce((acc, current) => acc + current.str, 0);
    const totalDex = backgrounds.reduce((acc, current) => acc + current.dex, 0);
    const totalHp = backgrounds.reduce((acc, current) => acc + current.hp, 0);
    const totalArmorHp = equipment.chest.armorHp + equipment.head.armorHp;
    const totalWeight =
      equipment.chest.weight +
      equipment.head.weight +
      equipment.mainHandWeapon.weight;

    const armorType = this.getArmorType(totalWeight);
    const { quickness: quicknessFromArmorTypeBonus } =
      this.getArmorTypeBonuses(armorType);

    const totalQuickness =
      backgrounds.reduce((acc, current) => acc + current.quickness, 0) +
      mainHandWeapon.quickness +
      quicknessFromArmorTypeBonus;

    this.stats = {
      str: totalStr,
      dex: totalDex,
      hp: totalHp,
      maxHp: totalHp,
      armorHp: totalArmorHp,
      maxArmorHp: totalArmorHp,
      quickness: totalQuickness,
      ap: 0,
      atkRange: mainHandWeapon.atkRange,
      /* mainHandDamage: {
                min: Math.floor(
                    mainHandWeapon.damage.min + totalStr * mainHandWeapon.strScale + totalDex * mainHandWeapon.dexScale
                ),
                max: Math.ceil(
                    mainHandWeapon.damage.max + totalStr * mainHandWeapon.strScale + totalDex * mainHandWeapon.dexScale
                )
            }, */
      weight: totalWeight,
      armorType: armorType,
      mainHandDamage: {
        min: Math.floor(
          (mainHandWeapon.damage.min + mainHandWeapon.damage.max) / 2 +
          totalStr * mainHandWeapon.strScale +
          totalDex * mainHandWeapon.dexScale
        ),
        max: Math.floor(
          (mainHandWeapon.damage.min + mainHandWeapon.damage.max) / 2 +
          totalStr * mainHandWeapon.strScale +
          totalDex * mainHandWeapon.dexScale
        ),
      },
    };
  }

  step(bm: BoardManager) {
    const apRate = 50 + (50 * this.stats.quickness) / 100;
    this.stats.ap += apRate;

    if (this.currentAction && !this.isActionValid(bm)) {
      /* console.log(
        this.getName(),
        "queria ",
        this.currentAction.type === ACTION_TYPE.ATTACK
          ? "atacar "
          : "mover para ",
        this.currentAction.getTarget()?.getName(),
        " porém não é mais uma ação válida"
      ); */
      this.currentAction = null;
    }

    if (!this.currentAction) {
      this.currentAction = this.brain.chooseAction(bm, this);
    }

    if (this.currentAction && this.canAct()) {
      this.currentAction?.execute(this);

      if (this.currentAction?.type === ACTION_TYPE.ATTACK) {
        this.TEST_attacksCounter++;
      }
      this.currentAction = null;
      //bm.printGrid();
    }

    bm.getAllUnits().forEach((unit) => {
      if (unit.stats.hp <= 0) {
        bm.removeUnit(unit);
      }
    });
  }

  canAct() {
    return this.stats.ap >= 1000;
  }

  isActionValid(bm: BoardManager) {
    const actionTarget = this.currentAction?.getTarget();
    if (this.currentAction?.type === ACTION_TYPE.ATTACK) {
      if (
        actionTarget &&
        !bm.isInRange(
          this.col,
          this.row,
          actionTarget.col,
          actionTarget.row,
          this.stats.atkRange
        )
      ) {
        return false;
      }
    } else if (this.currentAction?.type === ACTION_TYPE.MOVE) {
      if (
        actionTarget &&
        !bm.tileAt(actionTarget.col, actionTarget.row).walkable
      ) {
        return false;
      }
    }
    return true;
  }

  receiveDamage(damage: number, penetration: number, armorShred: number) {
    if (this.stats.armorHp > 0) {
      const damageToDealOnArmor = Math.min(
        damage + (damage * armorShred) / 100,
        this.stats.armorHp
      );
      /* console.log(
        this.getName(),
        " levou ",
        damageToDealOnArmor,
        " de dano na armor"
      ); */

      this.stats.armorHp -= Math.round(damageToDealOnArmor);

      //eslint-disable-next-line prettier/prettier
      /* console.log(
        this.getName(),
        " levou ",
        (damageToDealOnArmor * penetration) / 100,
        " de dano no hp por penetração"
      ); */

      this.stats.hp -= Math.round((damageToDealOnArmor * penetration) / 100);

      if (this.stats.armorHp <= 0) {
        const damageSpent = damageToDealOnArmor / (1 + armorShred / 100);
        const damageAfterArmor = damage - damageSpent;

        //eslint-disable-next-line prettier/prettier
        /* console.log(
          this.getName(),
          " levou ",
          damageAfterArmor + (damageAfterArmor * penetration) / 100,
          " de dano excedente"
        ); */

        this.stats.hp -= Math.round(
          damageAfterArmor + (damageAfterArmor * penetration) / 100
        );
      }
    } else {
      /* console.log(
        this.getName(),
        " levou ",
        damage + (damage * penetration) / 100,
        " de dano no hp"
      ); */
      this.stats.hp -= Math.round(damage + (damage * penetration) / 100);
    }
  }

  getArmorType(weight?: number) {
    const finalWeight = weight || this.stats.weight;
    if (finalWeight <= Config.ArmorType.light.max) return ARMOR_TYPE.LIGHT;
    if (finalWeight <= Config.ArmorType.medium.max) return ARMOR_TYPE.MEDIUM;
    return ARMOR_TYPE.HEAVY;
  }

  getArmorTypeBonuses(armorType: ARMOR_TYPE): ArmorTypeBonuses {
    return Config.ArmorType[armorType].bonuses;
  }

  printAp() {
    let bar = "|";
    for (let i = 0; i < 20; i++) {
      if (i / 20 <= this.stats.ap / 1000) bar += "-";
      else bar += " ";
    }
    bar += "|";
    console.log(bar);
  }

  getName() {
    return this.backgrounds.reduce(
      (acc, current) => acc + current.name + " ",
      ""
    );
  }

  public toString = (): string => {
    return this.backgrounds?.[1]
      ? this.backgrounds?.[1].name[0]
      : this.backgrounds[0].name[0];
  };
}
