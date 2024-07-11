---
title: "ArgoCD"
sidebar_position: 10
tags:
  - argocd
---

ArgoCD is an open-source declarative, GitOps continuous delivery tool for Kubernetes applications. It enables developers to manage and deploy applications on Kubernetes clusters using Git repositories as the source of truth for configuration and definitions. ArgoCD follows the GitOps methodology, which means that the entire application configuration, including manifests, parameters, and even application state, is stored in a Git repository.

Key features of ArgoCD include:

1. *Declarative Configuration:* ArgoCD uses declarative YAML manifests to define the desired state of applications. These manifests are stored in a Git repository, making it easy to version control and manage changes.

2. *Automated Synchronization:* ArgoCD continuously monitors the Git repository for changes in the application configuration. When changes are detected, it automatically synchronizes the target Kubernetes cluster to match the desired state defined in the Git repository.

3. *Multi-Environment Support:* ArgoCD supports the management of applications across multiple environments, such as development, staging, and production, using the same GitOps principles.

4. *Rollback and Roll Forward:* ArgoCD facilitates rollbacks to previous versions of applications in case of issues. It also supports roll-forward operations to apply newer configurations.

5. *User Interface (UI) and Command-Line Interface (CLI):* ArgoCD provides a web-based user interface for visualizing and managing applications. Additionally, it offers a command-line interface for automation and integration with CI/CD pipelines.

6. *Integration with CI/CD Pipelines:* ArgoCD can be integrated with continuous integration and continuous delivery (CI/CD) tools, allowing for automated deployment workflows triggered by changes in the Git repository.

7. *Security and RBAC:* ArgoCD provides features for managing access control and securing the deployment process through role-based access control (RBAC) mechanisms.

8. *Helm Chart Support:* ArgoCD supports Helm charts, allowing users to deploy and manage applications that are packaged as Helm packages.

ArgoCD simplifies the deployment and management of applications on Kubernetes by leveraging GitOps principles, providing a clear separation between the desired state of applications and the operational state of the cluster. This approach enhances collaboration, repeatability, and traceability in the deployment process.

# References
- [Setting up ArgoCD](/reference-architecture/setup/argocd/)
