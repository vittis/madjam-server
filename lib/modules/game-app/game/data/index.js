"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backgrounds_1 = __importDefault(require("./backgrounds"));
const weapons_1 = __importDefault(require("./weapons"));
const chests_1 = __importDefault(require("./chests"));
const heads_1 = __importDefault(require("./heads"));
exports.default = { backgrounds: backgrounds_1.default, weapons: weapons_1.default, chests: chests_1.default, heads: heads_1.default };
