import request from "./request";

async function getMergeRequestInfo(projectFullPath: any, mrId: string, apiKey: string, client: any) {
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
    const data = await request(getMergeInfo, apiKey, client);
    return data.project.mergeRequest;
}
export default getMergeRequestInfo