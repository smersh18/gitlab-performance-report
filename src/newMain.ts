import yargs, {Argv} from 'yargs';
import gql from 'graphql-tag';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import fetch from 'cross-fetch'
import moment, {Moment} from "moment";
import excelJS from "exceljs";

function getOptions() {
    let argv = yargs
        .usage("Usage: -n <name>")
        .option("n", {alias: "name", describe: "Your name", type: "string", demandOption: true})
        .option("b", {alias: "branch", describe: "Your branch", type: "string", demandOption: true})
        .option("t", {alias: "time", describe: "Sum of time", type: "number", demandOption: true})
        .option("a", {alias: "api", describe: "Your api key", type: "string", demandOption: true})
        .option("f", {alias: "file", describe: "Your file name", type: "string", demandOption: true})
        .argv
    return argv
}

function addWorksheet(worksheet: any, id: number) {
    return workbook.addWorksheet(worksheet[id])
}

function prettyDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().substring(2)

    return `${day}.${month}.${year}`;
}

function getCountSize(mergeInfo: any) {
    let countSize
    if (mergeInfo.diffStatsSummary.fileCount > 10) {
        countSize = "XXL"
    } else if (mergeInfo.diffStatsSummary.fileCount >= 8) {
        countSize = "XL"
    } else if (mergeInfo.diffStatsSummary.fileCount >= 6) {
        countSize = "L"
    } else if (mergeInfo.diffStatsSummary.fileCount >= 4) {
        countSize = "M"
    } else if (mergeInfo.diffStatsSummary.fileCount >= 1) {
        countSize = "S"
    } else if (mergeInfo.diffStatsSummary.fileCount === 0) {
        countSize = "XS"
    }
    return countSize
}

function getTimes(data: any) {
    const hours: number = data.getHours().toString().padStart(2, '0')
    const minutes: number = data.getMinutes().toString().padStart(2, '0')

    return `${prettyDate(data)} ${hours}:${minutes}`
}
function generateBorder(id: number, columName: any, sheetName: any, column: number) {
    sheetName.getCell(columName[id] + column).border = {
        top: {style: 'thin', color: {argb: '000000'}},
        left: {style: 'thin', color: {argb: '000000'}},
        bottom: {style: 'thin', color: {argb: '000000'}},
        right: {style: 'thin', color: {argb: '000000'}}
    };
}
// function isWorkDay(date: Moment): boolean {
//     const dayOfWeek: number = date.day()
//     return dayOfWeek !== 0 && dayOfWeek !== 6
// }

// function getWorkingHours(fromDate: string, toDate: string): number | string {
//     let workHours: number = 0
//     let from: Moment = moment(fromDate)
//     let to: Moment = moment(toDate)
//
//     if (from.isSame(to, 'day')) {
//         if (to.hour() < from.hour()) {
//             return 'error'
//         }
//         if (from.hour() < 9 && to.hour() < 9) {
//             return 0
//         } else {
//             if (to.hour() - from.hour() > 8) {
//                 return 8
//             } else {
//                 return to.hour() - from.hour()
//             }
//         }
//     }
//
//     if (from.hour() < 18 && isWorkDay(from)) {
//         if (from.hour() <= 9) {
//             workHours = workHours + 8
//         } else {
//             workHours = workHours + 18 - from.hour()
//         }
//     }
//
//     from.add(1, 'day')
//     while (!from.isSame(to, 'day')) {
//         if (isWorkDay(from)) {
//             workHours = workHours + 8
//         }
//         from.add(1, 'day')
//     }
//
//     if (isWorkDay(to)) {
//         if (to.hour() > 9 && to.hour() >= 18) {
//             workHours = workHours + 8
//         } else if (to.hour() >= 9) {
//             workHours = workHours + to.hour() - 9
//         }
//     }
//     return workHours
// }
async function generateReport(tableData: any, page: any, fileName: string, tableData1: any, infoWorksheet: any) {
    const heading = ["Date", "Summary", "State", "Description", "Changes", "Url", "fullPath"]
    let columName = ["A", "B", "C", "D", "E", "F", "G"]
    let column = 1
    page.columns = [
        {header: heading[0], key: heading[0], width: 20},
        {header: heading[1], key: heading[1], width: 30},
        {header: heading[2], key: heading[2], width: 10},
        {header: heading[3], key: heading[3], width: 18},
        {header: heading[4], key: heading[4], width: 15},
        {header: heading[5], key: heading[5], width: 15},
        {header: heading[6], key: heading[6], width: 20}
    ];


    for (let e = 0; e < tableData.length; e++) {
        if (column >= e) {
            column = column + 1
        }

        page.addRow(tableData[e])
        for (let id = 0; id < columName.length; id++) {
            generateBorder(id, columName, page, column)
        }
        if (tableData[e][5]) {
            page.getCell("F" + column).value = {
                hyperlink: `${tableData[e][5]}`,
                text: `Открыть МР`,
                tooltip: `${tableData[e][5]}`,
            };
        }
    }
    await workbook.xlsx.writeFile(`${fileName}.xls`);
}

async function request(query: string, apiKey: string) {
    let variables = {};
    const {data: result} = await client.query({
        query: gql(query),
        variables,
        context: {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        }
    });
    return result
}

async function getProjects(apiKey: string) {
    const getProjects: string =
        `query {
          projects(first: 1000) {
              nodes {
                fullPath
              }
            }
       }`
    const data = await request(getProjects, apiKey);
    return data.projects.nodes;
}

async function getMergeRequestsIds(projectFullPath: any, to: string, from: string, apiKey: string) {
    const getMergeRequestIds =
        `query {
         project(fullPath: "${projectFullPath}") {
           mergeRequests(createdAfter: "${to}" authorUsername: "${user}" createdBefore: "${from}" targetBranches: "${branch}") {
             nodes {
               iid
             }
          }
        }
      }`
    const data = await request(getMergeRequestIds, apiKey);
    return data.project.mergeRequests.nodes.map((x: any) => x.iid);
}

async function getMergeRequestInfo(projectFullPath: any, mrId: string, apiKey: string) {
    const getMergeInfo =
        `query {
          project(fullPath: "${projectFullPath}") {
          fullPath
             mergeRequest(iid: "${mrId}") {
               title
               createdAt
               state
               description
               webUrl
            diffStatsSummary {
                changes
                additions
                deletions
                fileCount
            }
             }
           }
       }`
    const data = await request(getMergeInfo, apiKey);
    return data.project.mergeRequest;
}

const httpLink1 = new HttpLink({
    uri: "https://git.mnxsc.tech:444/api/graphql",
    fetch: fetch
});
const client = new ApolloClient({
    link: httpLink1,
    cache: new InMemoryCache()
});
const workbook = new excelJS.Workbook();
let infoWorksheet = workbook.addWorksheet("Issues Summary")
let worksheet: any = []
const options: any = getOptions()
const apiKey: any = options.api
let time = []
time = options.time.toString().split(',')
if (time.length % 2 !== 0) {
    time.pop()
}
let times = []
for (let i = 0; i < time.length; i++) {
    times.push({from: time[i], to: time[i + 1]})
    i++
}
for (let id in times) {
    let data = new Date(times[id].from)
    let data1 = new Date(times[id].to)

    worksheet.push(`${prettyDate(data)} - ${prettyDate(data1)}`)
}
let branch = options.branch
let user = options.name

async function main(timea: string, timeb: string, worksheet: any, fileName: string, infoWorksheet: any, apiKey: string) {
    let tableData: any = []
    let tableData1: any = []
    let mergeRquestSizes: any = []
    try {
        console.log("получаю названия проектов")
        const allProjects = await getProjects(apiKey);
        console.log("получаю id всех МР")
        for (const project of allProjects) {
            const mergeRequestIds = await getMergeRequestsIds(project.fullPath, timea, timeb, apiKey)
            mergeRquestSizes.push(mergeRequestIds.length)

            for (const mrId of mergeRequestIds) {
                const mergeInfo = await getMergeRequestInfo(project.fullPath, mrId, apiKey);
                let data = new Date(mergeInfo.createdAt)
                let createdAt: any = getTimes(data)

                tableData.push([createdAt, mergeInfo.title, mergeInfo.state, mergeInfo.description, getCountSize(mergeInfo), mergeInfo.webUrl, project.fullPath])
            }


        }
        try {
            let boo: boolean = false
            for (let id in mergeRquestSizes) {
                if (mergeRquestSizes[id].length === 0) {
                    boo = true
                }
            }
            if (boo === true) {
                throw new Error("Invalid Data")
            }
        } catch (e) {
            console.log("[ERR] Введены неверные данные")
            await workbook.xlsx.writeFile(`${fileName}.xls`)
        }
        console.log("[INFO] Cоздаю файл эксель")
        generateReport(tableData, worksheet, fileName, tableData1, infoWorksheet)
    } catch (err) {
        console.log(err);
    }
}
for (let id = 0; id < worksheet.length; id++) {
    main(times[id].from, times[id].to, addWorksheet(worksheet, id), options.file, infoWorksheet, apiKey)
}