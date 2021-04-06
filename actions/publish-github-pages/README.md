# CloudPosse's "Publish Docs to GitHub Pages" GitHub Action

Publish auto-generated documentation on your repo to a GitHub Pages site.

## Conceptual Background

### Repositories

This GitHub Action brings together three different repositories:

1. A repository containing all of the resources needed to compile a Hugo (https://gohugo.io/) static site  

Relevant inputs: `hugo_repo`, `hugo_branch`

2. A repository containing for which a documentation website should be built  

Relevant inputs: `github_pages_repo`, `github_pages_pull_branch`

3. A repository which is setup to deploy to GitHub Pages (https://pages.github.com/)  

Relevant inputs: `github_pages_repo`, `github_pages_push_branch`

NB: For now, repositories `2` and `3` are just different branches of the same repository (assumed to be the repository this GitHub Action is being executed from). This is because, in general, this GitHub Action would require special GitHub tokens in order to pull/push from other repositories.

### Environment inside the GitHub Actions runner

There are 5 folders of interest inside the GitHub Actions runner:

1. The local copy of the `hugo_repo`  

Relevant input: `github_pages_hugo_path`

2. The local copy of the `github_pages_pull_branch` of the `github_pages_repo`  

Relevant input: `github_pages_pull_path`

3. The staging directory, where the essential Hugo build files from `hugo_repo` will be combined with the documentation files from the `github_pages_pull_branch` of the `github_pages_repo`  

Relevant input: `staging_dir`

4. The build directory, where all of the HTML, CSS, etc. file for the documentation website will be written  

Relevant input: `hugo_publish_dir`

5. The local copy of the `github_pages_push_branch` of the `github_pages_repo`  

Relevant input: `github_pages_push_path`

The general flow of files in this workflow is `1 & 2` -> `3` -> `4` -> `5`.

### Website Configuration and Build Process Configuration

Please see `action.yml` for descriptions of the following configuration inputs: `content`, `hugo_url`, `css`, `config`, `debug`, `hugo_content`, `hugo_config`, `htmltest_config`

## Usage

1. Set up your credentials as secrets in your repository settings using `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY`, `TWILIO_API_SECRET`

2. Add the following to your workflow

```yml
- name: 'Sending SMS Notification'
  uses: twilio-labs/actions-sms@v1
  with:
    fromPhoneNumber: '+1(234)5678901'
    toPhoneNumber: '+1(234)3334444'
    message: 'Hello from Twilio'
  env:
    TWILIO_ACCOUNT_SID: ${{ secrets.TWILIO_ACCOUNT_SID }}
    TWILIO_API_KEY: ${{ secrets.TWILIO_API_KEY }}
    TWILIO_API_SECRET: ${{ secrets.TWILIO_API_SECRET }}
```

## Inputs

### `content`

**Required** Comma-separated list of directories in the top level of the repo that contains documentation

### `hugo_url`

**Required** URL of the Hugo site after deployment

### `github_pages_push_path`

**Required** Location where the repo/branch that deploys to GitHub Pages will be cloned

### `github_pages_pull_branch`

**Required** The branch of the repo which contains the documentation

### `github_pages_repo`

**Required** Repo containing documentation to be deployed to GitHub Pages

### `github_pages_push_branch`

**Required** The branch of the repo which GitHub Pages will deploy from

### `css`

**Required** Custom CSS to customize the look and feel of the docs website

### `config`

**Required** Hugo YAML configuration overrides. The overrides should be either space- or newline-separated and must follow the following conventions. They must provide a YAML path in dot notation, have an equals sign, and have the override value be quoted, all with no interior spaces. E.g., .baseURL="test.url.com" enableEmoji="True"

### `debug`

Toggle to turn on any available debug functionality

### `hugo_content`

Folders of generic documentation to build into the final docs website. Default: "tutorials,howto,fundamentals,reference"

### `hugo_publish_dir`

Directory within the staging directory that the built Hugo website files will be written to. Default: "docs"

### `hugo_config`

Location of to-be-written Hugo config file (actual location not important). Default: "hugo.config.new.yml"

### `htmltest_config`

Location to write the htmltest config file (actual location not important). Default: ".htmltest.new.yml"

### `hugo_repo`

Repo containing Hugo build files. Default: "https://github.com/cloudposse/docs"

### `hugo_branch`

Branch of hugo_repo containing Hugo build files. Default: "master"

### `github_pages_hugo_path`

Location where the repo containing the Hugo files will be cloned.

### `github_pages_pull_path`

Location where the repo/branch containing the raw documentation will be cloned. Default: "/tmp/pull"

### `staging_dir`

Directory where all documentation files will be combined with Hugo configuration files, and the Hugo site will be built. Default: "/tmp/staging"
