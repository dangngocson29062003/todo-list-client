import { api } from "../lib/api-client";

export function getHomeData() {
    return api("/home", {
        method: "GET"
    })
}