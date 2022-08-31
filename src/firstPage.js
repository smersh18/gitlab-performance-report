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
const getIssues_1 = __importDefault(require("./gitlab/getIssues"));
const spaceIfNull_1 = __importDefault(require("./util/spaceIfNull"));
const dateUtil_1 = require("./util/dateUtil");
const workHours_1 = require("./util/workHours");
const generateReportIssues_1 = __importDefault(require("./report/generateReportIssues"));
const getProjects_1 = __importDefault(require("./gitlab/getProjects"));
function firstPage(apiKey, timeAfter, timeBefore, workbook, user, client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("создаю первую страницу");
        let infoWorksheet = workbook.addWorksheet("Issues Summary");
        let tableData = [];
        const allProjects = yield (0, getProjects_1.default)(apiKey, client);
        for (const project of allProjects) {
            const issues = yield (0, getIssues_1.default)(project.fullPath, timeAfter, timeBefore, apiKey, user, client);
            if (issues) {
                for (let issue of issues) {
                    let createdAt = (0, spaceIfNull_1.default)(issue.createdAt);
                    let closedAt = (0, spaceIfNull_1.default)(issue.closedAt);
                    let author = (0, spaceIfNull_1.default)(issue.author.name);
                    let title = (0, spaceIfNull_1.default)(issue.title);
                    let names = " ";
                    if (issue.assignees.nodes !== []) {
                        let assignees = issue.assignees.nodes.map((o) => o.name);
                        names = assignees.reduce((accum, value) => accum + ", " + value);
                    }
                    let createdAtDate = new Date(createdAt);
                    let closedAtDate = new Date(closedAt);
                    if (closedAt === " ") {
                        tableData.push([title, (0, dateUtil_1.getTimes)(createdAtDate), " ", author, names, " "]);
                    }
                    else {
                        let workHours = (0, workHours_1.getWorkingHours)(createdAt, closedAt);
                        tableData.push([
                            title,
                            (0, dateUtil_1.getTimes)(createdAtDate),
                            (0, dateUtil_1.getTimes)(closedAtDate),
                            author,
                            names,
                            workHours
                        ]);
                    }
                }
            }
        }
        (0, generateReportIssues_1.default)(infoWorksheet, tableData);
        return workbook;
    });
}
exports.default = firstPage;
