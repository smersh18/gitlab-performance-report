import request from "./request";

async function getIssues(projectFullPath: string, to: string, from: string, apiKey: string, user: string, client: any) {
    const getIssues =
        `query {
         project(fullPath: "${projectFullPath}") {
           issues(createdAfter: "${to}" authorUsername: "${user}" createdBefore: "${from}") {
             nodes {
               createdAt
                 closedAt
                 author{
                     name
                        }
                 assignees{
                      nodes{
                         name
                           }
                        }
                        title
                    }
                }
            }
        }`
    const data = await request(getIssues, apiKey, client);
    return data.project.issues.nodes
}
export default getIssues