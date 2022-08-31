"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateBorder(id, columName, sheetName, column) {
    console.log("создаю границы в файле эксель");
    sheetName.getCell(columName[id] + column).border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
    };
}
exports.default = generateBorder;
