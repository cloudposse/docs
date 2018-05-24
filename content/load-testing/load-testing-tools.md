---
title: "Load Testing Tools"
weight: 1
---

We use [k6](https://github.com/loadimpact/k6) from [Load Impact](https://loadimpact.com/) for the following reasons:

* Open-source, well documented (see [docs](https://docs.k6.io/docs)) and with simple command line usage
* Allows to easily create load test scenarios based on virtual users and simulated traffic configurations
* It's implemented in [Go](https://golang.org/), which has exelent support for concurrency - tests will not consume too much CPU and memory on the test machine even with a large number of consurrent sessions
* Scenario scripting in `JavaScript` ES2015/ES6 - with support for local and remote modules
* Everything as code: test logic and configuration options are both in JS for version control friendliness
* Can be run from the command line with command & control through CLI
* Has a built-in [HAR](http://www.softwareishard.com/blog/har-12-spec/) converter that will read HAR files and convert them to `k6` scripts that can then be executed ([session-recording-har-support](https://docs.k6.io/docs/session-recording-har-support))
* Can be easily integrated into CI/CD processes
* Provides a comprehensive set of built-in [metrics](https://docs.k6.io/docs/result-metrics)
* Can stream metrics into [InfluxDB](https://www.influxdata.com/) for storage and visualization with [Grafana](https://grafana.com/) ([influxdb-grafana](https://docs.k6.io/docs/influxdb-grafana))

Read more about k6's features and metrics:

* https://docs.k6.io/docs/welcome#section-features
* http://support.loadimpact.com/knowledgebase/articles/174121-how-do-i-interpret-test-results


# Installation

We use [Docker Compose](https://docs.docker.com/compose/) for defining and running multi-container Docker applications

{{% include-code-block title="docker-compose.yml" file="load-testing/docker-compose.yml" language="yaml" %}}

It builds three Docker images:

* [InfluxDB](https://www.influxdata.com/)
* [Grafana](https://grafana.com/)
* [k6](https://github.com/loadimpact/k6)

And uses these Dockerfiles

{{% include-code-block title="Dockerfile.influxdb" file="load-testing/Dockerfile.influxdb" language="yaml" %}}

{{% include-code-block title="Dockerfile.grafana" file="load-testing/Dockerfile.grafana" language="yaml" %}}

{{% include-code-block title="init.sh" file="load-testing/init.sh" language="bash" %}}

{{% include-code-block title="Dockerfile.k6" file="load-testing/Dockerfile.k6" language="dockerfile" %}}

Run [docker-compose up](https://docs.docker.com/compose/reference/up/) to build the containers and run `InfluxDB` and `Grafana` in the background

```sh
docker-compose up -d influxdb grafana
```

Open `localhost:3000` to see `Grafana` running.

By default, `Grafana` does not come with any pre-configured dashboards.

We will install this dashboard to visualize `k6` metrics https://grafana.com/dashboards/2587

Go to `+/Import` menu and paste `https://grafana.com/dashboards/2587` URL into the `Grafana.com Dashboard` field, then click `Load` button.
Then select `myinfluxdb` from the `Select a InfluxDB data source` dropdown and click `Import`.

![Import Grafana Dashboard](/assets/load-testing-grafana-setup-01.png)
