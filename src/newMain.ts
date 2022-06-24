import yargs, {Argv} from 'yargs';
import gql from 'graphql-tag';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import fetch from 'cross-fetch'

function getOptions() {
    let argv = yargs
        .usage("Usage: -n <name>")
        .option("n", {alias: "name", describe: "Your name", type: "string", demandOption: true})
        .option("b", {alias: "branch", describe: "Your branch", type: "string", demandOption: true})
        .option("t", {alias: "time", describe: "Sum of time", type: "number", demandOption: true})
        .option("a", {alias: "api", describe: "Your api key", type: "string", demandOption: true})
        .argv
    return argv
}

function prettyDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().substring(2)

    return `${day}.${month}.${year}`;
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
    return data.project.mergeRequests.nodes.map((x: any) => x.iid);
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
    fetch: fetch
});
const client = new ApolloClient({
    link: httpLink1,
    cache: new InMemoryCache()
});

let worksheet: any = []
const options: any = getOptions()
const apiKey: any = options.api
let time = []
time = options.time.split(',')
if (time.length % 2 !== 0) {
    time.pop()
}
let times = []
for (let i = 0; i < time.length; i++) {
    times.push({from: time[i], to: time[i + 1]})
    i++
}
for (let id in times) {
    let data = new Date(times[id].from)
    let data1 = new Date(times[id].to)

    worksheet.push(`${prettyDate(data)} - ${prettyDate(data1)}`)
}
let branch = options.branch
let user = options.name

async function main(from: string, to: string) {
    for (const project of (await getProjects(apiKey))) {
        const mergeRequestIds = await getMergeRequestsIds(project.fullPath, from, to, apiKey)
        for (const mrId of mergeRequestIds) {
            getMergeRequestInfo(project.fullPath, mrId, apiKey)
        }
    }
}
for (let id in worksheet) {
    main(times[id].from, times[id].to)
}