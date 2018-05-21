
# `Secret` Resources

Kubernetes ships with native support for encrypted secrets.

# AWS IAM Roles

The [`kube2iam`](https://github.com/jtblin/kube2iam) service provides a mechanism for for pods running under Kubernetes to "assume roles" much the same way that EC2 instances can leverage instance profiles.

## Helm

### Helm Charts

### Helm & Helmfile

Whether invoking `helm` directly or via `helmfile` all secrets should be passed using environment variables. We use `chamber` to to accomplish this. When runnig as part of CI/CD,

# Kubernetes API Credentials

The kubernetes TLS keys are stored by `kops` in a private, encrypted S3 bucket. When using the geodesic shell, you'll need to export these credentials in order to access the kubernetes cluster using `kubectl` or `helm`.

This is done by running `kubectl export kubecfg $KOPS_CLUSTER_NAME`

# SSH Access

The master SSH keys for all EC2 instances are stored in a private, encrypted S3 bucket associated with the `kops` state backend. To access any server, you'll need to connect to the bastion instance and use it as a jump host to access other machines in the cluster. In the geodesic shell, we provide a means to mount the S3 bucket so that the private SSH key can be added to the local `ssh-agent`.
