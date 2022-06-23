import yargs, {Argv} from 'yargs';
import gql from 'graphql-tag';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import fetch from 'cross-fetch'

function getOptions() {
    let argv = yargs
        .usage("Usage: -n <name>")
        .option("a", {alias: "api", describe: "Your api key", type: "string", demandOption: true})
        .argv
    return argv
}

async function request(query: string, apiKey: string) {
    let variables = {};
    const {data: result} = await client.query({
        query: gql(query),
        variables,
        context: {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        }
    });
    return result
}

async function getProjects(apiKey: string) {
    const getProjects: string =
        `query {
          projects(first: 1000) {
              nodes {
                fullPath
              }
            }
       }`
    const data = await request(getProjects, apiKey);
    return data.projects.nodes;
}

async function getMergeRequestsIds(projectFullPath: any, to: string, from: string, apiKey: string) {
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
    const data = await request(getMergeRequestIds, apiKey);
    return data.project.mergeRequests.nodes.map(x => x.iid);
}

async function getMergeRequestInfo(projectFullPath: any, mrId: string, apiKey: string) {
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
    const data = await request(getMergeInfo, apiKey);
    console.log(data.project.mergeRequest);
}

const httpLink1 = new HttpLink({
    uri: "https://git.mnxsc.tech:444/api/graphql",
    fetchOptions: fetch
});
const client = new ApolloClient({
    link: httpLink1,
    cache: new InMemoryCache()
});
const options: any = getOptions()
const apiKey: any = options.api
const from: string = "2021-03-09T14:58:50+00:00"
const to: string = "2021-04-09T14:58:50+00:00"
const user: string = "lukoyanov"
const branch: string = "master"

async function main() {
    for (const project of (await getProjects(apiKey))) {
        const mergeRequestIds = await getMergeRequestsIds(project.fullPath, from, to, apiKey)
        for (const mrId of mergeRequestIds) {
            getMergeRequestInfo(project.fullPath, mrId, apiKey)
        }
    }
}

main()
