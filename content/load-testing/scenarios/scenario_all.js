import {check, group, sleep} from 'k6';
import http from 'k6/http';
import {checkResponses, commonHeaders, config, k6_options, mergeHeaders} from "./utils.js";

export let options = k6_options;

export function setup() {
    console.log("k6 options: " + JSON.stringify(options) + "\n");
}

export function teardown(data) {
}

export default function (data) {
    group("page_01 - home", function () {
        let req, res;
        req = [{
            "method": "get",
            "url": config.baseUrl + "/",
            "params": {
                "headers": commonHeaders
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(2.00);
        req = [{
            "method": "get",
            "url": config.baseUrl + "/zip/33305",
            "params": {
                "headers": mergeHeaders({
                    "referer": config.baseUrl
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.02);
    });
    group("page_02 - /profile", function () {
        let req, res;
        req = [{
            "method": "post",
            "url": config.baseUrl + "/profile",
            "body": {
                "utf8": "✓",
                "zip": "33305"
            },
            "params": {
                "headers": mergeHeaders({
                    "content-length": "165",
                    "content-type": "application/x-www-form-urlencoded",
                    "referer": config.baseUrl
                })
            }
        }, {
            "method": "get",
            "url": config.baseUrl + "/info",
            "params": {
                "headers": mergeHeaders({
                    "referer": config.baseUrl
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.65);
    });
    group("page_03 - /save_profile", function () {
        let req, res;
        req = [{
            "method": "post",
            "url": config.baseUrl + "/save_profile",
            "body": {
                "utf8": "✓",
                "age": "37",
                "spouse_age": "35"
            },
            "params": {
                "headers": mergeHeaders({
                    "content-length": "259",
                    "content-type": "application/x-www-form-urlencoded",
                    "referer": config.baseUrl + "/info"
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.77);
    });
    group("page_04 - /add_categories", function () {
        let req, res;
        req = [{
            "method": "post",
            "url": config.baseUrl + "/add_categories",
            "body": {
                "utf8": "✓",
                "categories": "1,2,3"
            },
            "params": {
                "headers": mergeHeaders({
                    "content-length": "126",
                    "content-type": "application/x-www-form-urlencoded"
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.80);
    });
    group("page_05 - /add_features", function () {
        let req, res;
        req = [{
            "method": "get",
            "url": config.baseUrl + "/add_features",
            "params": {
                "headers": mergeHeaders({
                    "referer": config.baseUrl + "/add_categories"
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.74);
    });
    group("page_06 - /add_details", function () {
        let req, res;
        req = [{
            "method": "post",
            "url": config.baseUrl + "/add_details",
            "body": {
                "utf8": "✓",
                "details_count": "5"
            },
            "params": {
                "headers": mergeHeaders({
                    "content-length": "200",
                    "content-type": "application/x-www-form-urlencoded"
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.73);
    });
    group("page_07 - /add_details2", function () {
        let req, res;
        req = [{
            "method": "post",
            "url": config.baseUrl + "/add_details2",
            "body": {
                "utf8": "✓",
                "count": "4"
            },
            "params": {
                "headers": mergeHeaders({
                    "content-length": "103",
                    "content-type": "application/x-www-form-urlencoded",
                    "referer": config.baseUrl + "/add_details"
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.68);
    });
    group("page_08 - /users", function () {
        let req, res;
        const email = `user+${__VU}@test123.org`;
        req = [{
            "method": "post",
            "url": config.baseUrl + "/users",
            "body": {
                "utf8": "✓",
                "email": email
            },
            "params": {
                "headers": mergeHeaders({
                    "content-length": "143",
                    "content-type": "application/x-www-form-urlencoded",
                    "referer": config.baseUrl + "/add_details2"
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.80);
    });
    group("page_09 - /enrollment", function () {
        let req, res;
        req = [{
            "method": "post",
            "url": config.baseUrl + "/enrollment",
            "body": {
                "id": "123456789"
            },
            "params": {
                "headers": mergeHeaders({
                    "content-length": "67",
                    "content-type": "application/x-www-form-urlencoded"
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.79);
    });
    group("page_10 - /enrollment2", function () {
        let req, res;
        req = [{
            "method": "get",
            "url": config.baseUrl + "/enrollment2",
            "params": {
                "headers": mergeHeaders({
                    "referer": config.baseUrl + "/enrollment"
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
        sleep(0.65);
    });
    group("page_11 - /update_profile", function () {
        let req, res;
        req = [{
            "method": "post",
            "url": config.baseUrl + "/update_profile",
            "body": {
                "utf8": "✓",
                "first_name": "Test",
                "last_name": "Test"
            },
            "params": {
                "headers": mergeHeaders({
                    "content-length": "212",
                    "content-type": "application/x-www-form-urlencoded",
                    "referer": config.baseUrl + "/enrollment2"
                })
            }
        }];
        res = http.batch(req);
        checkResponses(res);
    });
}
