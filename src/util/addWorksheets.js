"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addWorksheets(worksheet, id, workbook) {
    console.log("создаю пустую страницу");
    return workbook.addWorksheet(worksheet[id]);
}
exports.default = addWorksheets;
