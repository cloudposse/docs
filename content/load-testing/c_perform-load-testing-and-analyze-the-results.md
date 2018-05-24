---
title: "Perform load testing and analyze the results"
---

k6 has a built-in HAR converter that will read HAR files and convert them to k6 scripts that can then be executed.

See [session-recording-har-support](https://docs.k6.io/docs/session-recording-har-support) for more details.

We recorded and prepared a sample scenario to test the complete user flow on a website, including signing up, creating a user profile, providing all required information,
and finally getting a list of available options for the user.

```js
import {check, group, sleep} from 'k6';
import http from 'k6/http';
import {checkResponses, commonHeaders, config, k6_options, mergeHeaders} from "./utils.js";

export let options = k6_options;

export function setup() {
}

export function teardown(data) {
}

export default function (data) {
    group("page_01 - home", function () {
        let req, res;
        req = [{
            "method": "get",
            "url": config.baseUrl,
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
```

Run it with a single user

```sh
docker-compose run -v $PWD/scenarios:/scenarios k6 run --vus 1 -i 1 /scenarios/scenario_all.js
```

```
execution: local
     output: influxdb=http://influxdb:8086/k6 (http://influxdb:8086)
     script: /scenarios/scenario_all.js

    duration: -,  iterations: 1
         vus: 1, max: 1

    done [==========================================================] 1 / 1

    █ page_01 - home

    █ page_02 - /profile

    █ page_03 - /save_profile

    █ page_04 - /add_categories

    █ page_05 - /add_features

    █ page_06 - /add_details

    █ page_07 - /add_details2

    █ page_08 - /users

    █ page_09 - /enrollment

    █ page_10 - /enrollment2

    █ page_11 - /update_profile

    data_received..............: 14 MB  630 kB/s
    data_sent..................: 234 kB 11 kB/s
    group_duration.............: avg=1.96s    min=106.14ms med=1.75s    max=4.91s    p(90)=3.76s    p(95)=4.34s
    http_req_blocked...........: avg=33.98ms  min=0s       med=0s       max=443.45ms p(90)=0s       p(95)=441.04ms
    http_req_connecting........: avg=7.36ms   min=0s       med=0s       max=96.85ms  p(90)=0s       p(95)=95.41ms
    http_req_duration..........: avg=227.61ms min=95.64ms  med=148.8ms  max=1.27s    p(90)=464.57ms p(95)=806.93ms
    http_req_receiving.........: avg=34.44ms  min=76.3µs   med=1.12ms   max=1.11s    p(90)=102.9ms  p(95)=117.98ms
    http_req_sending...........: avg=224.35µs min=83.5µs   med=178.1µs  max=1.45ms   p(90)=346.46µs p(95)=545.93µs
    http_req_tls_handshaking...: avg=17.26ms  min=0s       med=0s       max=225.33ms p(90)=0s       p(95)=224.26ms
    http_req_waiting...........: avg=192.94ms min=95.41ms  med=105.15ms max=998.45ms p(90)=374.83ms p(95)=652.32ms
    http_reqs..................: 130    6.027408/s
    iteration_duration.........: avg=21.56s   min=21.56s   med=21.56s   max=21.56s   p(90)=21.56s   p(95)=21.56s
    iterations.................: 1      0.046365/s
    vus........................: 1      min=1 max=1
    vus_max....................: 1      min=1 max=1

```

The entire process took 21 seconds.

Now run it with 50 concurrent users

```sh
docker-compose run -v $PWD/scenarios:/scenarios k6 run --vus 50 -i 50 /scenarios/scenario_all.js
```

```
execution: local
     output: influxdb=http://influxdb:8086/k6 (http://influxdb:8086)
     script: /scenarios/scenario_all.js

    duration: -,   iterations: 50
         vus: 50, max: 50

    done [==========================================================] 50 / 50

    █ page_01 - home

    █ page_02 - /profile

    █ page_03 - /save_profile

    █ page_04 - /add_categories

    █ page_05 - /add_features

    █ page_06 - /add_details

    █ page_07 - /add_details2

    █ page_08 - /users

    █ page_09 - /enrollment

    █ page_10 - /enrollment2

    █ page_11 - /update_profile

    data_received..............: 679 MB 6.6 MB/s
    data_sent..................: 12 MB  115 kB/s
    group_duration.............: avg=5.78s    min=104.4ms    med=3.02s    max=1m6s     p(90)=10.88s   p(95)=13.51s
    http_req_blocked...........: avg=230.04ms min=0s         med=0s       max=5.64s    p(90)=0s       p(95)=2.93s
    http_req_connecting........: avg=10.63ms  min=0s         med=0s       max=321.33ms p(90)=0s       p(95)=123.46ms
    http_req_duration..........: avg=953.25ms min=128.3µs    med=292.67ms max=59.93s   p(90)=2.22s    p(95)=3.19s
    http_req_receiving.........: avg=223.82ms min=-15.0602ms med=2.04ms   max=59.78s   p(90)=389.02ms p(95)=1.14s
    http_req_sending...........: avg=221.58µs min=70.8µs     med=155.4µs  max=8.2ms    p(90)=337µs    p(95)=469.13µs
    http_req_tls_handshaking...: avg=206.19ms min=0s         med=0s       max=5.24s    p(90)=0s       p(95)=2.59s
    http_req_waiting...........: avg=729.2ms  min=0s         med=199.58ms max=59.7s    p(90)=1.96s    p(95)=2.86s
    http_reqs..................: 6500   63.046647/s
    iteration_duration.........: avg=1m3s     min=31.83s     med=50.92s   max=1m43s    p(90)=1m39s    p(95)=1m40s
    iterations.................: 50     0.484974/s
    vus........................: 50     min=50 max=50
    vus_max....................: 50     min=50 max=50

```

Check the Kubernetes pods CPU and memory consumption in the Kubernetes `Grafana` dashboard

![Load Scenario 02 Grafana Portal Dashboard](/assets/load-testing-portal-grafana-scenario-02.png)

From the load test stats and graphs above, we can conclude that the provisioned CPU and memory resources on the Kubernetes cluster are enough to sustain 50 concurrent users going through the entire flow.
