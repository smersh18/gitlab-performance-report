import getIssues from "./getIssues";
import spaceIfNull from "./spaceIfNull";
import getTimes from "./getTimes";
import {getWorkingHours} from "./workHours";
import generateReportIssues from "./generateReportIssues";
import getProjects from "./getProjects";

async function firstPage(apiKey: string, timea: string, timeb: string, infoWorksheet: any, user: string, client: any) {
    let tableData1 = []
    const allProjects = await getProjects(apiKey, client);

    for (const project of allProjects) {
        const issues = await getIssues(project.fullPath, timea, timeb, apiKey, user, client)

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
                    tableData1.push([title, getTimes(createdAtDate), " ", author, names, " "])
                } else {
                    let workHours = getWorkingHours(
                        createdAt,
                        closedAt,
                    );
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
export default firstPage