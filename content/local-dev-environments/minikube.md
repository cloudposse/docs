---
title: "Minikube"
description: ""
---
![Minikube](/assets/a58bf7c-minikube.png)

# Setting Up “minikube" on OSX

Just run...
```
brew install kubectl
brew cask install minikube
```

To start `minikube`, run

```
minikube start
```

Now you should be able to get a list of namespaces:

```
kubectl get namespaces
```
