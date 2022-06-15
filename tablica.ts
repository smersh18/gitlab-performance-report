#!/usr/bin/env node
const yargs = require("yargs");
import moment from 'moment'
const gql = require("graphql-tag");
const apolloClient = require("apollo-client").ApolloClient;
const fetch = require("node-fetch");
const createHttpLink = require("apollo-link-http").createHttpLink;
const inMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
const excelJS = require('exceljs');


function getOptions() {
    return yargs
        .usage("Usage: -n <name>")
        .option("n", {alias: "name", describe: "Your name", type: "string", demandOption: true})
        .option("b", {alias: "branch", describe: "Your branch", type: "string", demandOption: true})
        .option("t", {alias: "time", describe: "Sum of time", type: "Integer", demandOption: true})
        .option("a", {alias: "api", describe: "Your api key", type: "Integer", demandOption: true})
        .option("f", {alias: "file", describe: "Your file name", type: "Integer", demandOption: true})
        .argv
}

function prettyDate(date: any): string {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().substring(2)

    return `${day}.${month}.${year}`;
}

const httpLink = createHttpLink({
    uri: "https://git.mnxsc.tech:444/api/graphql",
    fetch: fetch
});

const client = new apolloClient({
    link: httpLink,
    cache: new inMemoryCache()
});

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

async function getProjects(apiKey: string): &&&&&& {
    const getProjects =
        `query {
          projects(first: 1000) {
              nodes {
                fullPath
              }
            }
       }`
    const data = await request(getProjects: string, apiKey: string);
    return data.projects.nodes;
}

async function getMergeRequestsIds(projectFullPath: string, to: string, from: string, apiKey: string): &&&&&&&& {
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
    const data = await request(getMergeRequestIds: string, apiKey: string);
    return data.project.mergeRequests.nodes.map(x => x.iid);
}

async function getIssues(projectFullPath: string, to: string, from: string): &&&&&&& {
    const getIssues =
        `query {
         project(fullPath: "${projectFullPath}") {
           issues(createdAfter: "${to}" authorUsername: "${user}" createdBefore: "${from}") {
             nodes {
               createdAt
                 closedAt
                 author{
                     name
                        }
                 assignees{
                      nodes{
                         name
                           }
                        }
                        title
                    }
                }
            }
        }`
    const data = await request(getIssues: string, apiKey: string);
    return data.project.issues.nodes
}


async function getMergeRequestInfo(projectFullPath: string, mrId: string, apiKey: string): &&&&&& {
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
    const data = await request(getMergeInfo: string, apiKey: string);
    return data.project.mergeRequest;
}

function generateBorder(id: number, columName: string, sheetName: any, column: number) {
    sheetName.getCell(columName[id] + column).border = {
        top: {style: 'thin', color: {argb: '000000'}},
        left: {style: 'thin', color: {argb: '000000'}},
        bottom: {style: 'thin', color: {argb: '000000'}},
        right: {style: 'thin', color: {argb: '000000'}}
    };
}

function isWorkday(date: any) {
    const dayOfWeek = date.day()
    return dayOfWeek !== 0 && dayOfWeek !== 6
}

function getWorkingHours(fromDate: string, toDate: string) {
    let workHours = 0
    let from = moment(fromDate)
    let to = moment(toDate)
    if (from.diff(to)  > 0 ) {
        return "error"
    }
    if (from.isSame(to, "day")) {
        if (from.hour() < 9 && to.hour() < 9) {
            return 0
        } else {
            if (to.hour() - from.hour() > 8) {
                return 8
            } else {
                return to.hour() - from.hour()
            }
        }
    }
    if (from.hour() < 18) {
        if (isWorkday(from) === true) {
            if (from.hour() <= 9) {
                workHours = workHours + 8
            } else {
                workHours = workHours + 18 - from.hour()
            }
        }
    }
    from.add(1, "day")
    while (from.isSame(to, "day") === false) {
        if (isWorkday(from) === true) {
            workHours = workHours + 8
        }
        from.add(1, "day")
    }
    if (isWorkday(to) === true) {
        if (to.hour() <= 9) {
            if (to.hour() >= 18) {
                workHours = workHours + 8
            } else if (to.hour() >= 9) {
                workHours = workHours + to.hour() - 9
            }
        }
    }
    return workHours
}

async function generateReportIssues(infoWorksheet: any, tableData: any) {
    const heading = ["Title", "Created", "Closed", "Author", "Assignees", "Hours spent"]
    let columName = ["A", "B", "C", "D", "E", "F"]
    let column = 1
    infoWorksheet.columns = [
        {header: heading[0], key: heading[0], width: 50},
        {header: heading[1], key: heading[1], width: 15},
        {header: heading[2], key: heading[2], width: 15},
        {header: heading[3], key: heading[3], width: 18},
        {header: heading[4], key: heading[4], width: 35},
        {header: heading[5], key: heading[5], width: 15},
    ];

    for (let e = 0; e < tableData.length; e++) {
        if (column >= e) {
            column = column + 1
        }
        infoWorksheet.addRow(tableData[e])
        for (let id in columName) {
            generateBorder(id, columName, infoWorksheet, column)
        }
    }
}

async function generateReport(tableData: any, page: any, fileName: string) {
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
        for (let id in columName) {
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

function addWorksheet(worksheet: any, id: any) {
    return workbook.addWorksheet(worksheet[id])
}

function spaceIfNull(obj: any) {
    if (!obj) {
        obj = " "
    }

    return obj
}

function getTimes(data: any) {
    const day1 = data.getDate().toString().padStart(2, '0')
    const month1 = (data.getMonth() + 1).toString().padStart(2, '0')
    const year1 = data.getFullYear().toString().substring(2)
    const hours1 = data.getHours().toString().padStart(2, '0')
    const minutes1 = data.getMinutes().toString().padStart(2, '0')
    return `${day1}.${month1}.${year1} ${hours1}:${minutes1}`
}

async function main(timea: string, timeb: string, worksheet: string, fileName: string, infoWorksheet: string, apiKey: string) {
    let tableData = []
    let tableData1 = []
    let flag = false
    let mergeRquestSizes = []
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
                let createdAt = getTimes(data)

                tableData.push([createdAt, mergeInfo.title, mergeInfo.state, mergeInfo.description, getCountSize(mergeInfo), mergeInfo.webUrl, project.fullPath])
            }


        }
        try {
            let boo = false
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

async function firstPage(apiKey: string, timea: string, timeb: string, infoWorksheet: string) {
    let tableData1 = []
    const allProjects = await getProjects(apiKey);

    for (const project of allProjects) {
        const issues = await getIssues(project.fullPath, timea, timeb)

        if (issues) {

            for (let issue of issues) {
                let createdAt = spaceIfNull(issue.createdAt)
                let closedAt = spaceIfNull(issue.closedAt)
                let author = spaceIfNull(issue.author.name)
                let title = spaceIfNull(issue.title)

                let names = " "
                if (issue.assignees.nodes !== []) {
                    let assignees = issue.assignees.nodes.map(o => o.name)
                    names = assignees.reduce((accum, value) => accum + ", " + value)
                }


                let createdAtDate = new Date(createdAt)
                let closedAtDate = new Date(closedAt)


                if (closedAt === " ") {
                    tableData1.push([title, getTimes(createdAtDate), " ", author, names, " "])
                } else {
                    let workHours = getWorkingHours(
                        createdAt,
                        closedAt,
                    )
                    // TODO: Rename vars to something more meaningful
                    tableData1.push([
                        title,
                        getTimes(createdAtDate),
                        getTimes(closedAtDate),
                        author,
                        names,
                        workHours
                    ])
                }
            }
        }
    }
    generateReportIssues(infoWorksheet, tableData1)
}

// Entry point
console.log("[INFO] Ввожу входные данные")
const workbook = new excelJS.Workbook();
let worksheet = []
let infoWorksheet = workbook.addWorksheet("Issues Summary")
const options = getOptions()
const apiKey = options.api
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
let branch = options.branch
let user = options.name
for (let id in times) {
    let data = new Date(times[id].from)
    let data1 = new Date(times[id].to)

    worksheet.push(`${prettyDate(data)} - ${prettyDate(data1)}`)
}
for (let id in worksheet) {
    firstPage(apiKey, times[id].from, times[id].to, infoWorksheet)
}
for (let id in worksheet) {
    main(times[id].from, times[id].to, addWorksheet(worksheet, id), options.file, infoWorksheet, apiKey)
}