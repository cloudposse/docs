import _ from "cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.0/underscore-min.js"
import {Counter, Gauge, Rate, Trend} from "k6/metrics";

export let config = {
    baseUrl: "< YOUR WEBSITE URL HERE, e.g. https://mywebsite.com >",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
};

let http_req_blocked_max_ms = 1000;
let http_req_waiting_max_ms = 3500;
let http_req_duration_max_ms = 4500;

export let http_req_status_not_200_error_counter = new Counter("http_req_status_not_200_error_count");
export let http_req_blocked_error_counter = new Counter("http_req_blocked_error_count");
export let http_req_waiting_error_counter = new Counter("http_req_waiting_error_count");
export let http_req_duration_error_counter = new Counter("http_req_duration_error_count");

export let k6_options = {
    maxRedirects: 5,
    noUsageReport: true,
    noConnectionReuse: true,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",

    thresholds: {
        http_req_blocked: ["max < " + http_req_blocked_max_ms],
        http_req_waiting: ["max < " + http_req_waiting_max_ms],
        http_req_duration: ["max < " + http_req_duration_max_ms],
        http_req_status_not_200_error_count: ["count < 1"],
        http_req_blocked_error_count: ["count < 1"],
        http_req_waiting_error_count: ["count < 1"],
        http_req_duration_error_count: ["count < 1"]
    }
};

export function checkResponses(res) {
    if (_.isArray(res)) {
        res.forEach(function (response) {
            checkResponse(response);
        });
    }
    else if (_.isObject(res)) {
        let keys = _.keys(res);
        if (!isNaN(parseInt(_.keys(res)[0]))) {
            keys.forEach(function (key) {
                checkResponse(res[key]);
            });
        }
        else {
            checkResponse(res);
        }
    }
    else {
        checkResponse(res);
    }
}

function checkResponse(response) {
    let url = response.url;
    let status = response.status;
    let http_req_blocked_ms = response.timings ? response.timings.blocked : 0;
    let http_req_waiting_ms = response.timings ? response.timings.waiting : 0;
    let http_req_duration_ms = response.timings ? response.timings.duration : 0;

    if (status !== 200 || http_req_blocked_ms >= http_req_blocked_max_ms || http_req_waiting_ms >= http_req_waiting_max_ms || http_req_duration_ms >= http_req_duration_max_ms) {
        let reason = "";

        if (status !== 200) {
            http_req_status_not_200_error_counter.add(1);
            reason += "status=" + status + ". ";
        }
        if (http_req_blocked_ms >= http_req_blocked_max_ms) {
            http_req_blocked_error_counter.add(1);
            reason += "http_req_blocked=" + http_req_blocked_ms + " (time waiting for available TCP connection) exceeded max allowed value of " + http_req_blocked_max_ms + "ms. ";
        }
        if (http_req_waiting_ms >= http_req_waiting_max_ms) {
            http_req_waiting_error_counter.add(1);
            reason += "http_req_waiting=" + http_req_waiting_ms + " (time-to-first-byte) exceeded max allowed value of " + http_req_waiting_max_ms + "ms. ";
        }
        if (http_req_duration_ms >= http_req_duration_max_ms) {
            http_req_duration_error_counter.add(1);
            reason += "http_req_duration=" + http_req_duration_ms + " exceeded max allowed value of " + http_req_duration_max_ms + "ms. ";
        }

        let err = "\nRequest failed. URL: " + url + "\n";
        err += "Reason: " + reason + "\n";
        err += "Request:\n" + JSON.stringify(response.request) + "\n";
        err += "Response:\n" + JSON.stringify(response) + "\n";
        console.error(err);
    }
}

export let commonHeaders = {
    "pragma": "no-cache",
    "cache-control": "no-cache",
    "upgrade-insecure-requests": "1",
    "user-agent": config.userAgent,
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9"
};

// https://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
export function mergeHeaders(headers) {
    let result = {};
    Object.assign(result, commonHeaders, headers);
    return result;
}
