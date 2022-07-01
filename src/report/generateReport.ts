import generateBorder from "./generateBorder";

async function generateReport(tableData: any, page: any, fileName: string, workbook: any) {
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

}
export default generateReport