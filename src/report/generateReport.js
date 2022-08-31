"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateBorder_1 = __importDefault(require("./generateBorder"));
function generateReport(tableData, page, fileName, workbook) {
    return __awaiter(this, void 0, void 0, function* () {
        const heading = ["Date", "Summary", "State", "Description", "Changes", "Url", "fullPath"];
        let columName = ["A", "B", "C", "D", "E", "F", "G"];
        let column = 1;
        page.columns = [
            { header: heading[0], key: heading[0], width: 20 },
            { header: heading[1], key: heading[1], width: 30 },
            { header: heading[2], key: heading[2], width: 10 },
            { header: heading[3], key: heading[3], width: 18 },
            { header: heading[4], key: heading[4], width: 15 },
            { header: heading[5], key: heading[5], width: 15 },
            { header: heading[6], key: heading[6], width: 20 }
        ];
        for (let e = 0; e < tableData.length; e++) {
            if (column >= e) {
                column = column + 1;
            }
            page.addRow(tableData[e]);
            for (let id = 0; id < columName.length; id++) {
                (0, generateBorder_1.default)(id, columName, page, column);
            }
            if (tableData[e][5]) {
                page.getCell("F" + column).value = {
                    hyperlink: `${tableData[e][5]}`,
                    text: `Открыть МР`,
                    tooltip: `${tableData[e][5]}`,
                };
            }
        }
    });
}
exports.default = generateReport;
