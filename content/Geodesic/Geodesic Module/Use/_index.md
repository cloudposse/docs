---
title: "Use"
excerpt: ""
---
# Prerequisites
 
* Follow the "Quick Start" for [Quick start](doc:geodesic-quick-start) 

##### :information_source: Examples
> All examples are based on use cases provided in [Agenda](doc:agenda)

# Run shell

<<glossary:Module>> is docker container that extends <<glossary:Geodesic>> and used as a shell.

<<glossary:Module>> have a unique name. The shell can be easily started any time by simply running that name in a terminal.  
The name is a shell script in `/usr/local/bin`. Make sure this path is in your `PATH` environment variable.

## Development mode

If you create <<glossary:Module>> with [scaffolding](doc:quickstart) there would be `/conf` directory in <<glossary:Module>> directory.
'/conf' dir used to store [Backing Services](doc:scafflod).
If you run <<glossary:Module>> shell with flag `--dev` it will share local `./conf` directory into <<glossary:Module>> container `/conf`.
This is very useful when you developing [Backing Services](doc:scafflod).

When the development finished, you need rebuild <<glossary:Module>> container to add [Backing Services](doc:scafflod) in the module container.

# Build new version

To build <<glossary:Module>> just run `make build` in the module directory

# Use shell

When you run into the shell you need to authorize on AWS by assuming a correct role and then you can work with tools build in <<glossary:Geodesic>> 

##### Example
```shell
> staging.example.com
# Mounting /home/goruha into container
# Starting new staging.example.com session from   cloudposse/staging.example.com:dev
# Exposing port 48934
* Started EC2 metadata service at http://169.254.169.254/latest
         _              _                                              _      
     ___| |_ __ _  __ _(_)_ __   __ _    _____  ____ _ _ __ ___  _ __ | | ___ 
    / __| __/ _` |/ _` | | '_ \ / _` |  / _ \ \/ / _` | '_ ` _ \| '_ \| |/ _ \
    \__ \ || (_| | (_| | | | | | (_| | |  __/>  < (_| | | | | | | |_) | |  __/
    |___/\__\__,_|\__, |_|_| |_|\__, |  \___/_/\_\__,_|_| |_| |_| .__/|_|\___|
                  |___/         |___/                           |_|           

IMPORTANT:
* Your $HOME directory has been mounted to `/localhost`
* Use `aws-vault` to manage your sessions
* Run `assume-role` to start a session


-> Run 'assume-role' to login to AWS
⧉  staging example
> ❌   (none) ~ ➤  assume-role
Enter passphrase to unlock /conf/.awsvault/keys/: 
Enter token for arn:aws:iam::xxxxxxx:mfa/goruha: 365322
* Assumed role arn:aws:iam::xxxxxxx:role/OrganizationAccountAccessRole
⧉  staging example
> ✅   (example-staging-admin) ~ ➤  

```
