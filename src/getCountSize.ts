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
export default getCountSize