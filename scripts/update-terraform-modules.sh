#!/bin/bash

## Init temp dir
tmp_dir=tmp
mkdir -p $tmp_dir

github_org=cloudposse
github_api_limit=100
github_api_pages=3

modules=[]

## Fetch repository names
echo "Fetching repository names..."
if [ ! -f $tmp_dir/modules_cache.txt ]; then
    modules=$(seq $github_api_pages | \
        xargs -I "{}" curl -sSL "https://api.github.com/orgs/${github_org}/repos?per_page=${github_api_limit}&page={}" | \
        jq -r '.[] | .name' | \
        sort | grep terraform-*)
    echo "$modules" > $tmp_dir/modules_cache.txt
else
    modules=$(<$tmp_dir/modules_cache.txt)
fi

## Clone repositories
echo "Cloning repositories..."
mkdir -p $tmp_dir/projects/terraform
for module in $modules
do
    module_dir=$tmp_dir/projects/terraform/$module
    if [ ! -d $module_dir ]; then
        git clone https://github.com/$github_org/$module.git $module_dir
    fi
done

## Render pages
echo "Rendering pages..."
make init
make readme/deps
module_template=templates/terraform-module-page.md
for module_dir in $tmp_dir/projects/terraform/*
do
    module=$(basename $module_dir)
    module_readme_yaml=$module_dir/README.yaml
    module_page=content/terraform-modules/$module.md
    if [ -f $module_readme_yaml ]; then
        make readme README_TEMPLATE_FILE=$module_template README_FILE=$module_page README_YAML=$module_readme_yaml README_INCLUDES=$(pwd)/$module_dir
    fi
done
