"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function spaceIfNull(obj) {
    if (!obj) {
        obj = " ";
    }
    return obj;
}
exports.default = spaceIfNull;
