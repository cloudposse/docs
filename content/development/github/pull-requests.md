---
title: Pull Requests
description: ''
---

# Submitting a Pull Request

Prior to submitting your pull request, you might want to do a few things to clean up your branch and make it as simple as possible for the original repo's maintainer to test, accept, and merge your work. If any commits have been made to the upstream master branch, you should rebase your development branch so that merging it will be a simple fast-forward that won't require any conflict resolution work.

```
# Fetch upstream master and merge with your repo's master branch
git pull origin master --rebase
```

Follow the prompts to correct any code conflicts. Any file that is conflicted needs to be manually reviewed. After you fix the problems run:

```
git add filename
git rebase --continue
```

Once that is happy, push the rebased changes back to the origin.

```
git push origin newfeature -f
```

Then follow these instructions once you're ready: <https://help.github.com/articles/creating-a-pull-request/>

# Pull Request Template

Use the following markdown template to describe the Pull Request.

```
## what
* ...high-level explanation of what this PR accomplishes...

## why
* ...business justifications for making the changes...

## references
* ...related pull requests, issues, documents, or research...
```

**Pro Tip:** Use a `.github/pull_request_template.md` file to automatically populate this template when creating new Pull Requests.

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
<https://help.github.com/articles/creating-a-pull-request-template-for-your-repository/>
{{% /dialog %}}
