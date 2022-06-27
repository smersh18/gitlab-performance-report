import request from "./request";

async function getMergeRequestsIds(projectFullPath: any, to: string, from: string, apiKey: string, user: string, branch: string, client: any) {
    const getMergeRequestIds =
        `query {
         project(fullPath: "${projectFullPath}") {
           mergeRequests(createdAfter: "${to}" authorUsername: "${user}" createdBefore: "${from}" targetBranches: "${branch}") {
             nodes {
               iid
             }
          }
        }
      }`
    const data = await request(getMergeRequestIds, apiKey, client);
    return data.project.mergeRequests.nodes.map((x: any) => x.iid);
}
export default getMergeRequestsIds