"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weapon = exports.WEAPON_SLOT_TYPE = void 0;
var WEAPON_SLOT_TYPE;
(function (WEAPON_SLOT_TYPE) {
    WEAPON_SLOT_TYPE["MAIN_HAND"] = "MAIN_HAND";
    WEAPON_SLOT_TYPE["OFF_HAND"] = "OFF_HAND";
    WEAPON_SLOT_TYPE["TWO_HANDED"] = "TWO_HANDED";
})(WEAPON_SLOT_TYPE = exports.WEAPON_SLOT_TYPE || (exports.WEAPON_SLOT_TYPE = {}));
class Weapon {
    constructor(data) {
        this.data = data;
    }
}
exports.Weapon = Weapon;
