#!/usr/bin/env bash

set -e
#set -x

main_dir=$(pwd)
modules_dir=${main_dir}/tmp/components/terraform-aws-components/modules
docs_dir=${main_dir}/content/components

function generate_doc {
    local component_name=$1
    local input_dir=$2
    local output_dir=$3

    cd ${main_dir}/scripts/docs-collator/

		python3 collator.py \
		  --input ${input_dir} \
		  --output ${output_dir} \
		  --component-name ${component_name} \
		  --recursive=True
}

modules=$(ls -1 ${modules_dir})

for component_name in $modules
do
    input_dir=${modules_dir}/${component_name}
    output_dir=${docs_dir}/${component_name}

		generate_doc ${component_name} ${input_dir} ${output_dir}
done
