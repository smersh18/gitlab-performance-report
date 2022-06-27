import getProjects from "./gitlab/getProjects";
import getMergeRequestsIds from "./gitlab/getMergeRequestIds";
import getMergeRequestInfo from "./gitlab/getMergeRequestInfo";
import {getTimes} from './util/dateUtil';
import getCountSize from "./util/getCountSize";
import generateReport from "./report/generateReport";

async function main(timeAfter: string, timeBefore: string, worksheet: any, fileName: string, apiKey: string, user: string, branch: string, client: any, workbook: any) {
    let tableData: any = []
    let mergeRquestSizes: any = []
    try {
        console.log("получаю названия проектов")
        const allProjects = await getProjects(apiKey, client);
        console.log("получаю id всех МР")
        for (const project of allProjects) {
            const mergeRequestIds = await getMergeRequestsIds(project.fullPath, timeAfter, timeBefore, apiKey, user, branch, client)
            mergeRquestSizes.push(mergeRequestIds.length)

            for (const mrId of mergeRequestIds) {
                const mergeInfo = await getMergeRequestInfo(project.fullPath, mrId, apiKey, client);
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
        generateReport(tableData, worksheet, fileName, workbook)
    } catch (err) {
        console.log(err);
    }
}
export default main