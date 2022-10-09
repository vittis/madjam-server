export enum ARMOR_SLOT_TYPE {
  CHEST = "CHEST",
  HEAD = "HEAD",
}

interface ArmorStats {
  armorHp: number;
  weight: number;
  quickness: number;
  slot: ARMOR_SLOT_TYPE;
}

export interface ArmorData extends ArmorStats {
  name: string;
}

export abstract class Armor {
  data: ArmorData;

  constructor(data: ArmorData) {
    this.data = data;
  }
}
