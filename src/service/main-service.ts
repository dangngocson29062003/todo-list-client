import { api } from "../lib/api-client";

export function getHomeData(limit?:number) {
    return api("/home", {
        method: "GET",
        params:{
            limit
        }
    })
}