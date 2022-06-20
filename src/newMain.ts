// import yargs, {Argv} from 'yargs';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import fetch from "node-fetch";

// function getOptions() {
//     let argv = yargs
//         .usage("Usage: -n <name>")
//         .option("a", {alias: "api", describe: "Your api key", type: "string", demandOption: true})
//         .argv
// return argv
// }
const apiKey: any = "glpat-AePyJyMCyksNgsYGYQQV"
async function getProjects(apiKey: string){
    const getProjects: string =
        `query {
          projects(first: 1000) {
              nodes {
                fullPath
              }
            }
       }`
    const data = await request(getProjects, apiKey);
    console.log(data.projects);
}
async function request(query: string, apiKey: string) {
    let variables: object = {};
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
const httpLink1 = new HttpLink({
    uri: "https://git.mnxsc.tech:444/api/graphql",
    fetchOptions: fetch
});
const client = new ApolloClient({
    link: httpLink1,
    cache: new InMemoryCache()
});
// const options: any = getOptions()
// const apiKey: any = options.api
getProjects(apiKey)