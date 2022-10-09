export enum WEAPON_SLOT_TYPE {
  MAIN_HAND = "MAIN_HAND",
  OFF_HAND = "OFF_HAND",
  TWO_HANDED = "TWO_HANDED",
}

export interface WeaponStats {
  damage: {
    min: number;
    max: number;
  };
  atkRange: number;
  weight: number;
  quickness: number;
  slot: WEAPON_SLOT_TYPE[];
  penetration: number;
  armorShred: number;
  strScale: number;
  dexScale: number;
}

export interface WeaponData extends WeaponStats {
  name: string;
}

export abstract class Weapon {
  data: WeaponData;

  constructor(data: WeaponData) {
    this.data = data;
  }
}
