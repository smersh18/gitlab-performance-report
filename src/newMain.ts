import yargs from 'yargs';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import fetch from 'cross-fetch'
import excelJS, {Workbook} from "exceljs";
import firstPage from "./firstPage";
import createMRPages from "./createMRPages";
import {timesType} from "./util/types";

console.log("ввожу входные данные");

function getOptions() {
    let argv = yargs
        .usage("Usage: -n <name>")
        .option("n", {alias: "name", describe: "Your name", type: "string", demandOption: true})
        .option("b", {alias: "branch", describe: "Your branch", type: "string", demandOption: true})
        .option("t", {alias: "time", describe: "Sum of time", type: "string", demandOption: true})
        .option("a", {alias: "api", describe: "Your api key", type: "string", demandOption: true})
        .option("f", {alias: "file", describe: "Your file name", type: "string", demandOption: true})
        .argv
    return argv
}

const link = new HttpLink({
    uri: "https://git.mnxsc.tech:444/api/graphql",
    fetch: fetch
});
const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});

let workbook: Workbook = new excelJS.Workbook();
const options: any = getOptions()
const apiKey: any = options.api
let time = []
time = options.time.split(',')
if (time.length % 2 !== 0) {
    time.pop()
}

let times: timesType[] = []
for (let i = 0; i < time.length; i++) {
    times.push({from: time[i], to: time[i + 1]})
    i++
}

let branch = options.branch
let user = options.name
let fileName = options.file

async function fullFile(apiKey: string, times: any){
    for (let id = 0; id < times.length; id++) {
        workbook = await firstPage(apiKey, times[id].from, times[id].to, workbook, user, client)
    }

    console.log("создаю основную страницу");
    for (let id = 0; id < times.length; id++) {
        workbook = await createMRPages(times[id].from, times[id].to, options.file, apiKey, user, branch, client, workbook, id, times)
    }
    await workbook.xlsx.writeFile(`${fileName}.xls`);
}

fullFile(apiKey, times)

m