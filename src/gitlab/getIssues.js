"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("./request"));
function getIssues(projectFullPath, to, from, apiKey, user, client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("получаю issues");
        const getIssues = `query {
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
        }`;
        const data = yield (0, request_1.default)(getIssues, apiKey, client);
        return data.project.issues.nodes;
    });
}
exports.default = getIssues;
