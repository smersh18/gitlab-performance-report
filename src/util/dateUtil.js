"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimes = exports.prettyDate = void 0;
function prettyDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substring(2);
    return `${day}.${month}.${year}`;
}
exports.prettyDate = prettyDate;
function getTimes(data) {
    console.log("получаю точное время и дату");
    const hours = data.getHours().toString().padStart(2, '0');
    const minutes = data.getMinutes().toString().padStart(2, '0');
    return `${prettyDate(data)} ${hours}:${minutes}`;
}
exports.getTimes = getTimes;
