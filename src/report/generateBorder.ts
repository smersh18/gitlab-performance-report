function generateBorder(id: number, columName: any, sheetName: any, column: number) {
    console.log("создаю границы в файле эксель");
    sheetName.getCell(columName[id] + column).border = {
        top: {style: 'thin', color: {argb: '000000'}},
        left: {style: 'thin', color: {argb: '000000'}},
        bottom: {style: 'thin', color: {argb: '000000'}},
        right: {style: 'thin', color: {argb: '000000'}}
    };

}
export default generateBorder