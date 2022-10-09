"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicArmor_json_1 = __importDefault(require("../../data/equipment/armor/chest/basicArmor.json"));
const standardArmor_json_1 = __importDefault(require("../../data/equipment/armor/chest/standardArmor.json"));
const plateArmor_json_1 = __importDefault(require("../../data/equipment/armor/chest/plateArmor.json"));
exports.default = { BasicArmor: basicArmor_json_1.default, StandardArmor: standardArmor_json_1.default, PlateArmor: plateArmor_json_1.default };
