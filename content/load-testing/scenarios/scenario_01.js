import http from "k6/http";
import {checkResponses, config, k6_options} from "./utils.js";

export let options = k6_options;

export function setup() {
    console.log("k6 options: " + JSON.stringify(options) + "\n");
}

export function teardown(data) {
}

export default function (data) {
    let res = http.get(config.baseUrl);
    checkResponses(res);
}
