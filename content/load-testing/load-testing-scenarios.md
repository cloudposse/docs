---
title: "Load Testing Scenarios"
description: "Implement load testing scenarios and scripts"
weight: 2
---

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
All load testing scenarios described here are just examples and are provided for reference.
Consider updating them to reflect your environment.
{{% /dialog %}}


## Utilities Module

All our load testing scripts use the utilities module [`utils.js`](https://github.com/cloudposse/load-testing/blob/master/scenarios/utils.js) which provides reusable data structures and functions.


## Establish Baseline

To establish a baseline, first we'll load test the website's home page with one concurrent user.

This will allow us to see the best performing numbers, against which we'd compare more advanced scenarios involving more pages and more concurrent users.

We created this simple script to load test the home page of a website:

{{% include-github org="cloudposse" repo="load-testing" ref="master" file="scenarios/scenario_01.js" title="Load Testing Scenario 1" language="js" type="code-block" %}}


## Run the Tests

```sh
docker-compose run -v $PWD/scenarios:/scenarios k6 run \
    --vus 1 /scenarios/scenario_01.js
```

{{% include-code-block title="k6 run scenario_01 1 user 1 iteration" file="load-testing/examples/k6_run_scenario_01_1_user_1_iteration.txt" %}}

Open the `Grafana` dashboard at `localhost:3000` to see the load test results

![Load Scenario 01 Grafana Dashboard](/assets/load-testing-grafana-scenario-01.png)

We assume that we want the website to handle 50 concurrent users.

Let's hit the home page with 50 concurrent users, each doing one iteration

```sh
docker-compose run -v $PWD/scenarios:/scenarios k6 run \
    --vus 50 -i 50 /scenarios/scenario_01.js
```

{{% include-code-block title="k6 run scenario_01 50 users 50 iterations" file="load-testing/examples/k6_run_scenario_01_50_users_50_iterations.txt" %}}

We just loaded the website with `41.106944` requests per second.

Let's increase the number of iterations to hit the home page with approximately 50 requests per second.

```sh
docker-compose run -v $PWD/scenarios:/scenarios k6 run \
    --vus 50 -i 80 /scenarios/scenario_01.js
```

{{% include-code-block title="k6 run scenario_01 50 users 80 iterations" file="load-testing/examples/k6_run_scenario_01_50_users_80_iterations.txt" %}}


## Review Results

Check the Kubernetes pods' CPU and memory consumption in the Kubernetes `Grafana` dashboard

![Load Scenario 01 Grafana Portal Dashboard](/assets/load-testing-portal-grafana-scenario-01.png)

We can conclude that with the current CPU and memory configurations for Kubernetes pods, the site can handle 50 requests per second to the home page.
