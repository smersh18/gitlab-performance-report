import yargs from 'yargs/yargs';
const gql = require("graphql-tag");
const apolloClient = require("apollo-client").ApolloClient;
const createHttpLink = require("apollo-link-http").createHttpLink;
const inMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
function getOptions() {
    return yargs
        .usage("Usage: -n <name>")
        .option("a", {alias: "api", describe: "Your api key", type: "Integer", demandOption: true})
        .argv
}
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
const httpLink = createHttpLink({
    uri: "https://git.mnxsc.tech:444/api/graphql",
    fetch: fetch
});
const client = new apolloClient({
    link: httpLink,
    cache: new inMemoryCache()
});
const options: any = getOptions()
const apiKey: any = options.api
getProjects(apiKey)