#!/bin/bash

## Init temp dir
tmp_dir=tmp
mkdir -p $tmp_dir

github_org=cloudposse
github_api_limit=100
github_api_pages=3

modules=[]

function fetch_module {
    local module=$1
    local module_dir=$2

    mkdir -p $module_dir
    echo ""
    echo "Fething files for $module..."
    curl --fail -sSL --write-out "%{url_effective}\n" "https://raw.githubusercontent.com/${github_org}/${module}/master/README.yaml" -o $module_dir/README.yaml
    mkdir -p $module_dir/docs
    curl --fail -sSL --write-out "%{url_effective}\n" "https://raw.githubusercontent.com/${github_org}/${module}/master/docs/targets.md" -o $module_dir/docs/targets.md
    curl --fail -sSL --write-out "%{url_effective}\n" "https://raw.githubusercontent.com/${github_org}/${module}/master/docs/terraform.md" -o $module_dir/docs/terraform.md
}

function render_module {
    local module=$1
    local module_dir=$2
    local module_template=templates/terraform-module-page.md
    local module_readme_yaml=$module_dir/README.yaml
    local module_page=content/terraform-modules/$module.md
    
    if [ -f $module_readme_yaml ]; then
        make readme README_TEMPLATE_FILE=$module_template README_FILE=$module_page README_YAML=$module_readme_yaml README_TEMPLATE_YAML=$module_readme_yaml README_INCLUDES=$(pwd)/$module_dir
    fi
}


## Install dependencies
echo "Installing dependencies..."
# make init
make readme/deps

## Fetch repository names
echo "Fetching repository names..."
if [ ! -f $tmp_dir/modules_cache.txt ]; then
    modules=$(
        seq $github_api_pages | \
        xargs -I "{}" curl --fail -sSL "https://api.github.com/orgs/${github_org}/repos?per_page=${github_api_limit}&page={}" | \
        jq -r '.[] | .name' | \
        sort | grep terraform-*
    )
    echo "$modules" > $tmp_dir/modules_cache.txt
else
    modules=$(<$tmp_dir/modules_cache.txt)
fi

## Process terraform-modules content
echo "Processing terraform-modules..."
for module in $modules
do
    module_dir=$tmp_dir/projects/terraform/$module
    if [ ! -d $module_dir ]; then
        fetch_module $module $module_dir
    fi
    render_module $module $module_dir
done

## Delete temp data
rm -rf $tmp_dir/projects
