import request from "./request";

async function getProjects(apiKey: string, client: any) {
    console.log("получаю проекты");
    const getProjects: string =
        `query {
          projects(first: 1000) {
              nodes {
                fullPath
              }
            }
       }`
    const data = await request(getProjects, apiKey, client);
    return data.projects.nodes;
}
export default getProjects