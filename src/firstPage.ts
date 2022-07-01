import getIssues from "./gitlab/getIssues";
import spaceIfNull from "./util/spaceIfNull";
import {getTimes} from './util/dateUtil';
import {getWorkingHours} from "./util/workHours";
import generateReportIssues from "./report/generateReportIssues";
import getProjects from "./gitlab/getProjects";
import {Workbook} from "exceljs";

async function firstPage(apiKey: string, timeAfter: string, timeBefore: string, workbook: Workbook, user: string, client: any) {
    console.log("создаю первую страницу");
    let infoWorksheet = workbook.addWorksheet("Issues Summary")
    let tableData = []
    const allProjects = await getProjects(apiKey, client);

    for (const project of allProjects) {
        const issues = await getIssues(project.fullPath, timeAfter, timeBefore, apiKey, user, client)

        if (issues) {
            for (let issue of issues) {
                let createdAt = spaceIfNull(issue.createdAt)
                let closedAt = spaceIfNull(issue.closedAt)
                let author = spaceIfNull(issue.author.name)
                let title = spaceIfNull(issue.title)
                let names: any = " "
                if (issue.assignees.nodes !== []) {
                    let assignees: any = issue.assignees.nodes.map((o: any) => o.name)
                    names = assignees.reduce((accum: any, value: any) => accum + ", " + value)
                }
                let createdAtDate = new Date(createdAt)
                let closedAtDate = new Date(closedAt)

                if (closedAt === " ") {
                    tableData.push([title, getTimes(createdAtDate), " ", author, names, " "])
                } else {
                    let workHours = getWorkingHours(
                        createdAt,
                        closedAt,
                    );
                    tableData.push([
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
    generateReportIssues(infoWorksheet, tableData)
    return workbook
}
export default firstPage