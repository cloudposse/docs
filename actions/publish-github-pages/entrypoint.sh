# this is the gist of the cloudposse/docs/actions/publish-github-pages

#echo $GITHUB_PAGES_BRANCH
#echo $HUGO_CONFIG
#echo $CONTENT
#
#GITHUB_PAGES_REPO=github.com/cloudposse/docs.git # or for customer github.com/customer/infrastructure.git
#GITHUB_PAGES_BRANCH=production # or for customer, it will be docs
#GITHUB_PAGES_PATH=/tmp/$GITHUB_PAGES_BRANCH/
#HUGO_REPO=github.com/cloudposse/docs.git
#
## Checkout the cloudposse/docs as the "Reference docs"
#git clone --branch master $HUGO_REPO hugo/
#git clone --branch production $GITHUB_PAGES_REPO $GITHUB_PAGES_PATH
#
## create a customer "docs" like cloudposse/docs
#mkdir customer-docs
#cp $HUGO_CONFIG ./config.yaml
#mkdir customer-docs/content
#cp cloudposse-docs/$configfiles customer-docs
#
## install the customer docs (.md pages) to the content folder
#find $GITHUB_PAGES_PATH -type f -name '*.md' | xargs (strip the prefix) (copy to $HUGO_REPO/content/)
#
## rename all `README.md` to `_index.md`
## categories with no subfolders, and only a single `_index.md`: `mv foobar/_index.md foobar.md`
#
## publish the hugo generated HTML to $GITHUB_PAGES_PATH
#make release OUTPUT_DIR=/tmp/production
#git -C /tmp/production add -A
#git -C /tmp/production commit -a --message 'Updating content to $GIT_REF'

echo "Hello, World!"
