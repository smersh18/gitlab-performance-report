const yargs = require("yargs");
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
    const data: string = await request(getProjects, apiKey);
    console.log(data.projects.nodes) ;
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