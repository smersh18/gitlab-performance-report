import getProjects from "./gitlab/getProjects";
import getMergeRequestsIds from "./gitlab/getMergeRequestIds";
import getMergeRequestInfo from "./gitlab/getMergeRequestInfo";
import {getTimes, prettyDate} from './util/dateUtil';
import getCountSize from "./util/getCountSize";
import generateReport from "./report/generateReport";
import addWorksheets from "./util/addWorksheets";
import {Workbook} from "exceljs";

async function createMRPages(timeAfter: string, timeBefore: string, fileName: string, apiKey: string, user: string, branch: string, client: any, workbook: Workbook, id: number, worksheet: string[], times: any) {
    let tableData: any = []
    let mergeRquestSizes: any = []
    let mergeRequestWorksheet = []
    for (let id in times) {
        let dataFrom = new Date(times[id].from)
        let dataTo = new Date(times[id].to)

        worksheet.push(`${prettyDate(dataFrom)} - ${prettyDate(dataTo)}`)
    }
    for (let id = 0; id < worksheet.length; id++) {
        mergeRequestWorksheet.push(addWorksheets(worksheet, id, workbook))
    }
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
        for (let id = 0; id < mergeRequestWorksheet.length; id++){
            generateReport(tableData, mergeRequestWorksheet[id], fileName, workbook)
        }

    } catch (err) {
        console.log(err);
    }
    return workbook
}
export default createMRPages