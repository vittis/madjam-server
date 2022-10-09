"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
const Entity_1 = require("./Entity");
const Brain_1 = require("./Brain");
const config_1 = __importDefault(require("./data/config"));
const Action_1 = require("./Action");
var ARMOR_TYPE;
(function (ARMOR_TYPE) {
    ARMOR_TYPE["LIGHT"] = "light";
    ARMOR_TYPE["MEDIUM"] = "medium";
    ARMOR_TYPE["HEAVY"] = "heavy";
})(ARMOR_TYPE || (ARMOR_TYPE = {}));
class Unit extends Entity_1.Entity {
    constructor(owner, col, row, { backgrounds, equipment, playstyle }) {
        var _a, _b, _c, _d, _e;
        super(col, row);
        this.TEST_attacksCounter = 0;
        this.toString = () => {
            var _a, _b;
            return ((_a = this.backgrounds) === null || _a === void 0 ? void 0 : _a[1])
                ? (_b = this.backgrounds) === null || _b === void 0 ? void 0 : _b[1].name[0]
                : this.backgrounds[0].name[0];
        };
        this.owner = owner;
        this.backgrounds = backgrounds;
        this.equipment = equipment;
        this.brain = new Brain_1.Brain(playstyle);
        this.currentAction = null;
        const { mainHandWeapon } = equipment;
        const totalStr = backgrounds.reduce((acc, current) => acc + current.str, 0);
        const totalDex = backgrounds.reduce((acc, current) => acc + current.dex, 0);
        const totalHp = backgrounds.reduce((acc, current) => acc + current.hp, 0);
        const totalArmorHp = (((_a = equipment === null || equipment === void 0 ? void 0 : equipment.chest) === null || _a === void 0 ? void 0 : _a.armorHp) || 0) + (((_b = equipment === null || equipment === void 0 ? void 0 : equipment.head) === null || _b === void 0 ? void 0 : _b.armorHp) || 0);
        const totalWeight = (((_c = equipment === null || equipment === void 0 ? void 0 : equipment.chest) === null || _c === void 0 ? void 0 : _c.weight) || 0) +
            (((_d = equipment === null || equipment === void 0 ? void 0 : equipment.head) === null || _d === void 0 ? void 0 : _d.weight) || 0) +
            ((_e = equipment === null || equipment === void 0 ? void 0 : equipment.mainHandWeapon) === null || _e === void 0 ? void 0 : _e.weight);
        const armorType = this.getArmorType(totalWeight);
        const { quickness: quicknessFromArmorTypeBonus } = this.getArmorTypeBonuses(armorType);
        const totalQuickness = backgrounds.reduce((acc, current) => acc + current.quickness, 0) +
            ((mainHandWeapon === null || mainHandWeapon === void 0 ? void 0 : mainHandWeapon.quickness) || 0) +
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
            mainHandDamage: {
                min: Math.floor(mainHandWeapon.damage.min + totalStr * mainHandWeapon.strScale + totalDex * mainHandWeapon.dexScale),
                max: Math.ceil(mainHandWeapon.damage.max + totalStr * mainHandWeapon.strScale + totalDex * mainHandWeapon.dexScale)
            },
            weight: totalWeight,
            armorType: armorType,
            /* mainHandDamage: {
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
            }, */
        };
    }
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
        var _a, _b, _c;
        return {
            owner: this.owner,
            backgrounds: [...this.backgrounds],
            currentAction: (_a = this.currentAction) === null || _a === void 0 ? void 0 : _a.type,
            actionTarget: this.currentAction ? { col: (_b = this.currentAction.getTarget()) === null || _b === void 0 ? void 0 : _b.col, row: (_c = this.currentAction.getTarget()) === null || _c === void 0 ? void 0 : _c.row } : undefined,
            equipment: {
                mainHandWeapon: Object.assign(Object.assign({}, this.equipment.mainHandWeapon), { damage: Object.assign({}, this.equipment.mainHandWeapon.damage) }),
                chest: Object.assign({}, this.equipment.chest),
                head: Object.assign({}, this.equipment.head),
            },
            stats: Object.assign(Object.assign({}, this.stats), { mainHandDamage: Object.assign({}, this.stats.mainHandDamage) }),
            row: this.row,
            col: this.col,
        };
    }
    step(bm) {
        var _a, _b;
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
            (_a = this.currentAction) === null || _a === void 0 ? void 0 : _a.execute(this);
            if (((_b = this.currentAction) === null || _b === void 0 ? void 0 : _b.type) === Action_1.ACTION_TYPE.ATTACK) {
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
    isActionValid(bm) {
        var _a, _b, _c;
        const actionTarget = (_a = this.currentAction) === null || _a === void 0 ? void 0 : _a.getTarget();
        if (((_b = this.currentAction) === null || _b === void 0 ? void 0 : _b.type) === Action_1.ACTION_TYPE.ATTACK) {
            if (actionTarget &&
                !bm.isInRange(this.col, this.row, actionTarget.col, actionTarget.row, this.stats.atkRange)) {
                return false;
            }
        }
        else if (((_c = this.currentAction) === null || _c === void 0 ? void 0 : _c.type) === Action_1.ACTION_TYPE.MOVE) {
            if (actionTarget &&
                !bm.tileAt(actionTarget.col, actionTarget.row).walkable) {
                return false;
            }
        }
        return true;
    }
    receiveDamage(damage, penetration, armorShred) {
        if (this.stats.armorHp > 0) {
            const damageToDealOnArmor = Math.min(damage + (damage * armorShred) / 100, this.stats.armorHp);
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
                this.stats.hp -= Math.round(damageAfterArmor + (damageAfterArmor * penetration) / 100);
            }
        }
        else {
            /* console.log(
              this.getName(),
              " levou ",
              damage + (damage * penetration) / 100,
              " de dano no hp"
            ); */
            this.stats.hp -= Math.round(damage + (damage * penetration) / 100);
        }
    }
    getArmorType(weight) {
        var _a;
        console.log('stats', this.stats);
        const finalWeight = weight || ((_a = this.stats) === null || _a === void 0 ? void 0 : _a.weight) || 0;
        if (finalWeight <= config_1.default.ArmorType.light.max)
            return ARMOR_TYPE.LIGHT;
        if (finalWeight <= config_1.default.ArmorType.medium.max)
            return ARMOR_TYPE.MEDIUM;
        return ARMOR_TYPE.HEAVY;
    }
    getArmorTypeBonuses(armorType) {
        return config_1.default.ArmorType[armorType].bonuses;
    }
    printAp() {
        let bar = "|";
        for (let i = 0; i < 20; i++) {
            if (i / 20 <= this.stats.ap / 1000)
                bar += "-";
            else
                bar += " ";
        }
        bar += "|";
        console.log(bar);
    }
    getName() {
        return this.backgrounds.reduce((acc, current) => acc + current.name + " ", "");
    }
}
exports.Unit = Unit;
