import yargs, {Argv} from 'yargs';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import fetch from 'cross-fetch'
import excelJS from "exceljs";
import prettyDate from "./prettyDate";
import addWorksheet from "./addWorksheet";
import firstPage from "./firstPage";
import main from "./main";

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
const workbook = new excelJS.Workbook();
let infoWorksheet = workbook.addWorksheet("Issues Summary")
let worksheet: any = []
const options: any = getOptions()
const apiKey: any = options.api
let time = []
time = options.time.split(',')
if (time.length % 2 !== 0) {
    time.pop()
}
let times = []
for (let i = 0; i < time.length; i++) {
    times.push({from: time[i], to: time[i + 1]})
    i++
}
for (let id in times) {
    let dataFrom = new Date(times[id].from)
    let dataTo = new Date(times[id].to)

    worksheet.push(`${prettyDate(dataFrom)} - ${prettyDate(dataTo)}`)
}
let branch = options.branch
let user = options.name

for (let id = 0; id < worksheet.length; id++) {
    firstPage(apiKey, times[id].from, times[id].to, infoWorksheet, user, client)
}
for (let id = 0; id < worksheet.length; id++) {
    main(times[id].from, times[id].to, addWorksheet(worksheet, id, workbook), options.file, infoWorksheet, apiKey, user, branch, client, workbook)
}