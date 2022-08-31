"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCountSize(mergeInfo) {
    console.log("определяю размер изменений");
    let countSize;
    if (mergeInfo.diffStatsSummary.fileCount > 10) {
        countSize = "XXL";
    }
    else if (mergeInfo.diffStatsSummary.fileCount >= 8) {
        countSize = "XL";
    }
    else if (mergeInfo.diffStatsSummary.fileCount >= 6) {
        countSize = "L";
    }
    else if (mergeInfo.diffStatsSummary.fileCount >= 4) {
        countSize = "M";
    }
    else if (mergeInfo.diffStatsSummary.fileCount >= 1) {
        countSize = "S";
    }
    else if (mergeInfo.diffStatsSummary.fileCount === 0) {
        countSize = "XS";
    }
    return countSize;
}
exports.default = getCountSize;
