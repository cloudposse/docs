---
title: "Minikube"
excerpt: ""
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/a58bf7c-minikube.png",
        "minikube.png",
        1044,
        296,
        "#629ce8"
      ]
    }
  ]
}
[/block]
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