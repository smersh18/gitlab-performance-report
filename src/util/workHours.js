"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWorkDay = exports.getWorkingHours = void 0;
const moment_1 = __importDefault(require("moment"));
function isWorkDay(date) {
    const dayOfWeek = date.day();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
}
exports.isWorkDay = isWorkDay;
function getWorkingHours(fromDate, toDate) {
    let workHours = 0;
    let from = (0, moment_1.default)(fromDate);
    let to = (0, moment_1.default)(toDate);
    if (from.isSame(to, 'day')) {
        if (to.hour() < from.hour()) {
            return 'error';
        }
        if (from.hour() < 9 && to.hour() < 9) {
            return 0;
        }
        else {
            if (to.hour() - from.hour() > 8) {
                return 8;
            }
            else {
                return to.hour() - from.hour();
            }
        }
    }
    if (from.hour() < 18 && isWorkDay(from)) {
        if (from.hour() <= 9) {
            workHours = workHours + 8;
        }
        else {
            workHours = workHours + 18 - from.hour();
        }
    }
    from.add(1, 'day');
    while (!from.isSame(to, 'day')) {
        if (isWorkDay(from)) {
            workHours = workHours + 8;
        }
        from.add(1, 'day');
    }
    if (isWorkDay(to)) {
        if (to.hour() > 9 && to.hour() >= 18) {
            workHours = workHours + 8;
        }
        else if (to.hour() >= 9) {
            workHours = workHours + to.hour() - 9;
        }
    }
    return workHours;
}
exports.getWorkingHours = getWorkingHours;
