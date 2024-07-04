---
title: "Rotate Kops Master Node Certificates"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1381990476/How+to+Rotate+Kops+Master+Node+Certificates
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-rotate-kops-master-node-certificates.md
---

# How to Rotate Kops Master Node Certificates

## Problem
Old Kubernetes clusters (deployed prior to Kubernetes 1.16.2) may require manual certificate rotation. When the certificates expire, the master nodes can no longer communicate and the cluster becomes destabilized.

## Solution
If the master nodes are all still operating normally, then upgrading to Kubernetes 1.16.2 or later should fix the issue and prevent it from recurring. However, if master nodes are already off line due to expired certificates, you will need to rotate them manually.

:::tip
Use ssh, Lens, Teleport, or other means to open a shell on each master node and rotate certificates.

:::

### Confirm certificates expiring

```
echo | openssl s_client -connect localhost:2380 2>/dev/null | openssl x509 -noout -dates
```

### Backup existing certificates

```
sudo find /mnt/ -name server.key | sudo xargs -I'{}' cp '{}' '{}'.bak.20200412
sudo find /mnt/ -name server.crt | sudo xargs -I'{}' cp '{}' '{}'.bak.20200412
sudo find /mnt/ -name me.key | sudo xargs -I'{}' cp '{}' '{}'.bak.20200412
sudo find /mnt/ -name me.crt | sudo xargs -I'{}' cp '{}' '{}'.bak.20200412
sudo find /mnt/ -name '*.bak.*'

```

### Delete certificates

```
sudo find /mnt/ -name server.key | xargs -I {} sudo rm {}
sudo find /mnt/ -name server.crt | xargs -I {} sudo rm {}
sudo find /mnt/ -name me.key | xargs -I {} sudo rm {}
sudo find /mnt/ -name me.crt | xargs -I {} sudo rm {}

```

### Restart etcd-manager to generate new certificates

```
sudo docker ps -f name='etcd-manager' -q | sudo xargs docker kill
```

### Verify new certs

```
echo | openssl s_client -connect localhost:2380 2>/dev/null | openssl x509 -noout -dates
```

### Repeat this entire process on all master nodes

### Verify cluster healthy
Wait for pods to show as `Ready`

```
kubectl get nodes
```

