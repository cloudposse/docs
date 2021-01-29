---
title: "Perform Testing and Analyze Results"
description: "Perform load testing and analyze the results"
weight: 3
---

[k6](https://github.com/loadimpact/k6) has a built-in [HAR](http://www.softwareishard.com/blog/har-12-spec/) converter that will read HAR files and convert them to k6 scripts that can then be executed.

See [session recording](https://docs.k6.io/docs/session-recording-har-support) for more details.

We recorded and prepared a sample scenario to test the complete user flow on a website, including signing up, creating a user profile, providing all required information, and finally getting a list of available options for the user.

{{% include-github org="cloudposse" repo="load-testing" ref="master" file="scenarios/scenario_all.js" title="Complete Load Testing Scenario" language="js" type="code-block" %}}

Run it with a single user

```sh
docker-compose run -v $PWD/scenarios:/scenarios k6 run \
    --vus 1 -i 1 /scenarios/scenario_all.js
```

{{% include-code-block title="k6 run scenario_all 1 user 1 iteration" file="load-testing/examples/k6_run_scenario_all_1_user_1_iteration.txt" %}}

The entire process took 21 seconds.

Now run it with 50 concurrent users

```sh
docker-compose run -v $PWD/scenarios:/scenarios k6 run \
    --vus 50 -i 50 /scenarios/scenario_all.js
```

{{% include-code-block title="k6 run scenario_all 50 users 50 iterations" file="load-testing/examples/k6_run_scenario_all_50_users_50_iterations.txt" %}}

Check the Kubernetes pods' CPU and memory consumption in the Kubernetes `Grafana` dashboard

![Load Scenario 02 Grafana Portal Dashboard](/assets/load-testing-portal-grafana-scenario-02.png)

From the load test stats and graphs above, we can conclude that the provisioned CPU and memory resources on the Kubernetes cluster are enough to sustain 50 concurrent users going through the entire flow.
