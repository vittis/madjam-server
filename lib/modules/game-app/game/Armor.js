"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Armor = exports.ARMOR_SLOT_TYPE = void 0;
var ARMOR_SLOT_TYPE;
(function (ARMOR_SLOT_TYPE) {
    ARMOR_SLOT_TYPE["CHEST"] = "CHEST";
    ARMOR_SLOT_TYPE["HEAD"] = "HEAD";
})(ARMOR_SLOT_TYPE = exports.ARMOR_SLOT_TYPE || (exports.ARMOR_SLOT_TYPE = {}));
class Armor {
    constructor(data) {
        this.data = data;
    }
}
exports.Armor = Armor;
