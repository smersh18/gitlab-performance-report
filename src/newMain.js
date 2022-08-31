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
const yargs_1 = __importDefault(require("yargs"));
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const apollo_link_http_1 = require("apollo-link-http");
const apollo_client_1 = __importDefault(require("apollo-client"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const exceljs_1 = __importDefault(require("exceljs"));
const firstPage_1 = __importDefault(require("./firstPage"));
const createMRPages_1 = __importDefault(require("./createMRPages"));
console.log("ввожу входные данные");
function getOptions() {
    let argv = yargs_1.default
        .usage("Usage: -n <name>")
        .option("n", { alias: "name", describe: "Your name", type: "string", demandOption: true })
        .option("b", { alias: "branch", describe: "Your branch", type: "string", demandOption: true })
        .option("t", { alias: "time", describe: "Sum of time", type: "string", demandOption: true })
        .option("a", { alias: "api", describe: "Your api key", type: "string", demandOption: true })
        .option("f", { alias: "file", describe: "Your file name", type: "string", demandOption: true })
        .argv;
    return argv;
}
const link = new apollo_link_http_1.HttpLink({
    uri: "https://git.mnxsc.tech:444/api/graphql",
    fetch: cross_fetch_1.default
});
const client = new apollo_client_1.default({
    link: link,
    cache: new apollo_cache_inmemory_1.InMemoryCache()
});
let workbook = new exceljs_1.default.Workbook();
const options = getOptions();
const apiKey = options.api;
let time = [];
time = options.time.split(',');
if (time.length % 2 !== 0) {
    time.pop();
}
let times = [];
for (let i = 0; i < time.length; i++) {
    times.push({ from: time[i], to: time[i + 1] });
    i++;
}
let branch = options.branch;
let user = options.name;
let fileName = options.file;
function fullFile(apiKey, times) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let id = 0; id < times.length; id++) {
            workbook = yield (0, firstPage_1.default)(apiKey, times[id].from, times[id].to, workbook, user, client);
        }
        console.log("создаю основную страницу");
        for (let id = 0; id < times.length; id++) {
            workbook = yield (0, createMRPages_1.default)(times[id].from, times[id].to, options.file, apiKey, user, branch, client, workbook, id, times);
        }
        yield workbook.xlsx.writeFile(`${fileName}.xls`);
    });
}
fullFile(apiKey, times);
