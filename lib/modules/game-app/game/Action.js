"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.ACTION_TYPE = void 0;
var ACTION_TYPE;
(function (ACTION_TYPE) {
    ACTION_TYPE["MOVE"] = "move";
    ACTION_TYPE["ATTACK"] = "attack";
})(ACTION_TYPE = exports.ACTION_TYPE || (exports.ACTION_TYPE = {}));
class Action {
    constructor() {
        this.actionCost = 1000;
    }
    afterExecute(unit) {
        unit.stats.ap -= this.actionCost;
    }
}
exports.Action = Action;
