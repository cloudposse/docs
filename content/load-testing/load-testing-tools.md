---
title: "Load Testing Tools"
description: "Select and configure load testing tools"
weight: 1
---

We use [k6](https://github.com/loadimpact/k6) from [Load Impact](https://loadimpact.com/) for the following reasons:

* **Open Source** - well documented (see [docs](https://docs.k6.io/docs)) and with simple command line usage
* **Synthetic Testing** - allows to easily create load test scenarios based on virtual users and simulated traffic configurations
* **Small Footprint** - implemented in [Go](https://golang.org/), which has excellent support for concurrency and small memory footprint
* **JavaScript DSL** - scenario scripting in `JavaScript` ES2015/ES6 with support for local and remote modules
* **Testing as Code** - test logic and configuration options are both in JS for version control friendliness
* **Command-line Driven** - can be run from the command line with command & control through CLI
* **Compatible with [HAR](http://www.softwareishard.com/blog/har-12-spec/)** - has a built-in [HAR](http://www.softwareishard.com/blog/har-12-spec/) converter that will read HAR files and convert them to `k6` scripts (see [session recording](https://docs.k6.io/docs/session-recording-har-support))
* **Automated Testing** - can be easily integrated into CI/CD pipelines
* **Comprehensive Metrics** - provides a comprehensive set of built-in [metrics](https://docs.k6.io/docs/result-metrics)
* **Beautiful Visualizations** - can stream metrics into [InfluxDB](https://www.influxdata.com/) for storage and visualization with [Grafana](https://grafana.com/) (see [influxdb-grafana](https://docs.k6.io/docs/influxdb-grafana))

Read more about k6's features and metrics:

* [Features](https://docs.k6.io/docs/welcome#section-features)
* [Interpret test results](http://support.loadimpact.com/knowledgebase/articles/174121-how-do-i-interpret-test-results)


# Installation

We use [Docker Compose](https://docs.docker.com/compose/) for defining and running multi-container Docker applications

{{% include-github org="cloudposse" repo="load-testing" ref="master" file="docker-compose.yml" title="docker-compose.yml" language="yaml" type="code-block" %}}

It builds three Docker images:

* [InfluxDB](https://www.influxdata.com/)
* [Grafana](https://grafana.com/)
* [k6](https://github.com/loadimpact/k6)

And uses these Dockerfiles

{{% include-github org="cloudposse" repo="load-testing" ref="master" file="Dockerfile.influxdb" title="Dockerfile.influxdb" language="dockerfile" type="code-block" %}}

{{% include-github org="cloudposse" repo="load-testing" ref="master" file="Dockerfile.grafana" title="Dockerfile.grafana" language="dockerfile" type="code-block" %}}

{{% include-github org="cloudposse" repo="load-testing" ref="master" file="init.sh" title="init.sh" language="bash" type="code-block" %}}

{{% include-github org="cloudposse" repo="load-testing" ref="master" file="Dockerfile.k6" title="Dockerfile.k6" language="dockerfile" type="code-block" %}}

Run [docker-compose up](https://docs.docker.com/compose/reference/up/) to build the containers and run `InfluxDB` and `Grafana` in the background

```sh
docker-compose up -d influxdb grafana
```

Open `localhost:3000` to see `Grafana` running.

By default, `Grafana` does not come with any pre-configured dashboards.

We will install this dashboard to visualize `k6` metrics [dashboards-2587](https://grafana.com/dashboards/2587)

Go to `+/Import` menu and paste `https://grafana.com/dashboards/2587` URL into the `Grafana.com Dashboard` field, then click `Load` button.
Then select `myinfluxdb` from the `Select a InfluxDB data source` dropdown and click `Import`.

![Import Grafana Dashboard](/assets/load-testing-grafana-setup-01.png)
