"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomIntFromInterval = void 0;
// min and max included
const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomIntFromInterval = randomIntFromInterval;
