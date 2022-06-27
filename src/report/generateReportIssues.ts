import generateBorder from "./generateBorder";

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

        for (let id = 0; id < columName.length; id++) {
            generateBorder(id, columName, infoWorksheet, column)
        }
    }
}
export default generateReportIssues