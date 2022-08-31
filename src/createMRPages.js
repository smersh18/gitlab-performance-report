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
const getProjects_1 = __importDefault(require("./gitlab/getProjects"));
const getMergeRequestIds_1 = __importDefault(require("./gitlab/getMergeRequestIds"));
const getMergeRequestInfo_1 = __importDefault(require("./gitlab/getMergeRequestInfo"));
const dateUtil_1 = require("./util/dateUtil");
const getCountSize_1 = __importDefault(require("./util/getCountSize"));
const generateReport_1 = __importDefault(require("./report/generateReport"));
const addWorksheets_1 = __importDefault(require("./util/addWorksheets"));
function createMRPages(timeAfter, timeBefore, fileName, apiKey, user, branch, client, workbook, id, times) {
    return __awaiter(this, void 0, void 0, function* () {
        let tableData = [];
        let worksheet = [];
        let mergeRquestSizes = [];
        let mergeRequestWorksheet = [];
        for (let id in times) {
            let dataFrom = new Date(times[id].from);
            let dataTo = new Date(times[id].to);
            worksheet.push(`${(0, dateUtil_1.prettyDate)(dataFrom)} - ${(0, dateUtil_1.prettyDate)(dataTo)}`);
        }
        for (let id = 0; id < worksheet.length; id++) {
            mergeRequestWorksheet.push((0, addWorksheets_1.default)(worksheet, id, workbook));
        }
        try {
            console.log("получаю названия проектов");
            const allProjects = yield (0, getProjects_1.default)(apiKey, client);
            console.log("получаю id всех МР");
            for (const project of allProjects) {
                const mergeRequestIds = yield (0, getMergeRequestIds_1.default)(project.fullPath, timeAfter, timeBefore, apiKey, user, branch, client);
                mergeRquestSizes.push(mergeRequestIds.length);
                for (const mrId of mergeRequestIds) {
                    const mergeInfo = yield (0, getMergeRequestInfo_1.default)(project.fullPath, mrId, apiKey, client);
                    let data = new Date(mergeInfo.createdAt);
                    let createdAt = (0, dateUtil_1.getTimes)(data);
                    tableData.push([createdAt, mergeInfo.title, mergeInfo.state, mergeInfo.description, (0, getCountSize_1.default)(mergeInfo), mergeInfo.webUrl, project.fullPath]);
                }
            }
            try {
                let boo = false;
                for (let id in mergeRquestSizes) {
                    if (mergeRquestSizes[id].length === 0) {
                        boo = true;
                    }
                }
                if (boo === true) {
                    throw new Error("Invalid Data");
                }
            }
            catch (e) {
                console.log("[ERR] Введены неверные данные");
                yield workbook.xlsx.writeFile(`${fileName}.xls`);
            }
            console.log("[INFO] Cоздаю файл эксель");
            for (let id = 0; id < mergeRequestWorksheet.length; id++) {
                (0, generateReport_1.default)(tableData, mergeRequestWorksheet[id], fileName, workbook);
            }
        }
        catch (err) {
            console.log(err);
        }
        return workbook;
    });
}
exports.default = createMRPages;
