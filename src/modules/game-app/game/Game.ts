import { BoardManager } from "./BoardManager";
import { Unit } from "./Unit";
import { WeaponData } from "./Weapon";
import Backgrounds from "./data/backgrounds";
import Weapons from "./data/weapons";
import Chests from "./data/chests";
import Heads from "./data/heads";
import { ArmorData } from "./Armor";
import { PLAYSTYLE } from "./Brain";

export class Game {
  boardManager: BoardManager;
  history: any[] = [];

  constructor() {
    this.boardManager = new BoardManager(7, 5);

    const heavyNobleSwordsman = new Unit("P1", 0, 0, {
      backgrounds: [Backgrounds.Noble, Backgrounds.Swordsman],
      equipment: {
        mainHandWeapon: Weapons.Longsword as WeaponData,
        head: Heads.PlateHelmet as ArmorData,
        chest: Chests.PlateMail as ArmorData,
      },
      playstyle: PLAYSTYLE.AGGRESSIVE,
    });

    const lightNobleSwordsman = new Unit("P2", 1, 1, {
      backgrounds: [Backgrounds.Noble, Backgrounds.Swordsman],
      equipment: {
        mainHandWeapon: Weapons.Longsword as WeaponData,
        head: Heads.PlateHelmet as ArmorData,
        chest: Chests.LeatherShirt as ArmorData,
      },
      playstyle: PLAYSTYLE.AGGRESSIVE,
    });

    const lightNobleHunter = new Unit("P1", 1, 2, {
      backgrounds: [Backgrounds.Noble, Backgrounds.Hunter],
      equipment: {
        mainHandWeapon: Weapons.Longbow as WeaponData,
        head: Heads.ClothHat as ArmorData,
        chest: Chests.BasicArmor as ArmorData,
      },
      playstyle: PLAYSTYLE.PASSIVE,
    });

    const mediumNobleHunter = new Unit("P2", 0, 4, {
      backgrounds: [Backgrounds.Noble, Backgrounds.Hunter],
      equipment: {
        mainHandWeapon: Weapons.Longbow as WeaponData,
        head: Heads.LeatherHat as ArmorData,
        chest: Chests.LeatherShirt as ArmorData,
      },
      playstyle: PLAYSTYLE.PASSIVE,
    });

    const lightPeasantHunter = new Unit("P1", 4, 4, {
      backgrounds: [Backgrounds.Noble, Backgrounds.Hunter],
      equipment: {
        mainHandWeapon: Weapons.Dagger as WeaponData,
        head: Heads.ClothHat as ArmorData,
        chest: Chests.LeatherShirt as ArmorData,
      },
      playstyle: PLAYSTYLE.AGGRESSIVE,
    });

    const heavyPeasant = new Unit("P2", 0, 3, {
      backgrounds: [Backgrounds.Peasant, Backgrounds.Swordsman],
      equipment: {
        mainHandWeapon: Weapons.Greatsword as WeaponData,
        head: Heads.PlateHelmet as ArmorData,
        chest: Chests.PlateMail as ArmorData,
      },
      playstyle: PLAYSTYLE.AGGRESSIVE,
    });

    this.boardManager.addToBoard(heavyPeasant); // P2
    this.boardManager.addToBoard(lightPeasantHunter); // P1
    this.boardManager.addToBoard(mediumNobleHunter); // P2
    this.boardManager.addToBoard(lightNobleHunter); // P1
    this.boardManager.addToBoard(lightNobleSwordsman); // P2
    this.boardManager.addToBoard(heavyNobleSwordsman); // P1
  }

  preSerialize() {
    return this.boardManager.getAllUnits().map((unit) => unit.preSerialize());
  }

  async startGame() {
    const unit1 = this.boardManager.getAllUnits()[0];
    const unit2 = this.boardManager.getAllUnits()[1];

    this.boardManager.printGrid();

    console.time("loop");

    do {
      //await wait(100);
      this.boardManager.getAllUnits().forEach((unit) => {
        unit.step(this.boardManager);
      });

      const serializedUnits = this.boardManager
        .getAllUnits()
        .map((unit) => unit.serialize());

      this.history.push({ units: serializedUnits });

      /* this.boardManager.getAllUnits().forEach((unit) => {
          unit.printAp();
          console.log({ hp: unit.stats.hp, armorHp: unit.stats.armorHp });
      }); */
    } while (!this.hasGameEnded());

    console.log("final do loop", this.history[0].units[0].stats.hp);
    console.table([
      {
        name: unit1.getName(),
        hp: unit1.stats.hp + "/" + unit1.stats.maxHp,
        armor: unit1.stats.armorHp + "/" + unit1.stats.maxArmorHp,
        weapon: unit1.equipment.mainHandWeapon.name,
        chest: unit1.equipment.chest.name,
        head: unit1.equipment.head.name,
        weight: unit1.stats.weight,
        armorType: unit1.stats.armorType,
        qcknss: unit1.stats.quickness,
        str: unit1.stats.str,
        dex: unit1.stats.dex,
        atkDmg: unit1.stats.mainHandDamage.min,
        attacks: unit1.TEST_attacksCounter,
      },
      {
        name: unit2.getName(),
        hp: unit2.stats.hp + "/" + unit2.stats.maxHp,
        armor: unit2.stats.armorHp + "/" + unit2.stats.maxArmorHp,
        weapon: unit2.equipment.mainHandWeapon.name,
        chest: unit2.equipment.chest.name,
        head: unit2.equipment.head.name,
        weight: unit2.stats.weight,
        armorType: unit2.stats.armorType,
        qcknss: unit2.stats.quickness,
        str: unit2.stats.str,
        dex: unit2.stats.dex,
        atkDmg: unit2.stats.mainHandDamage.min,
        attacks: unit2.TEST_attacksCounter,
      },
    ]);
    console.timeEnd("loop");
  }

  hasGameEnded() {
    const allP1Units = this.boardManager
      .getAllUnits()
      .filter((unit) => unit.owner === "P1");

    const allP2Units = this.boardManager
      .getAllUnits()
      .filter((unit) => unit.owner === "P2");

    return (
      allP1Units.every((unit) => unit.stats.hp <= 0) ||
      allP2Units.every((unit) => unit.stats.hp <= 0)
    );
  }
}
