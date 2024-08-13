#!/bin/bash

# Array of broken links and corresponding correct links
broken_links=(
    "/reference/license/;/reference/license/"
    "/learn/toolchain/;/learn/toolchain/"
    "/reference/glossary/;/reference/glossary/"
    "/learn/maintenance/tutorials/;/learn/maintenance/tutorials/"
    "/components/library/aws/tgw/;/components/library/aws/tgw/"
    "/components/library/aws/eks/datadog-agent/;/components/library/aws/eks/datadog-agent/"
    "/components/library/aws/eks/storage-class/;/components/library/aws/eks/storage-class/"
    "/components/library/aws/eks/karpenter-node-pool/;/components/library/aws/eks/karpenter-node-pool/"
    "/components/library/aws/eks/karpenter/;/components/library/aws/eks/karpenter/"
    "/components/library/aws/eks/cluster/#adding-and-configuring-a-new-eks-addon;/components/library/aws/eks/cluster/#adding-and-configuring-a-new-eks-addon"
    "/components/library/aws/eks/cluster/#using-addons;/components/library/aws/eks/cluster/#using-addons"
    "/learn/;/learn/"
    "/jumpstart/kick-off/;/jumpstart/kick-off/"
    "/layers/accounts/deploy-accounts/;/layers/accounts/deploy-accounts/"
    "/layers/project/create-repository/;/layers/project/create-repository/"
    "/learn/maintenance/tutorials/;/learn/maintenance/tutorials/"
    "/layers/identity/aws-saml/#-export-an-identity-provider-idp-metadata-file-from-the-chosen-provider;/layers/identity/aws-saml/#-export-an-identity-provider-idp-metadata-file-from-the-chosen-provider"
    "/layers/network/faq/#what-is-the-difference-between-a-vanity-and-a-service-domain;/layers/network/faq/#what-is-the-difference-between-a-vanity-and-a-service-domain"
    "/layers/spacelift/tutorials/how-to-sign-up/;/layers/spacelift/tutorials/how-to-sign-up/"
    "/reference/adrs/adopted/use-aws-region-codes/;/reference/adrs/adopted/use-aws-region-codes/"
    "/components/library/aws/vpc/;/components/library/aws/vpc/"
    "/reference/;/reference/"
    "/tags/;/tags/"
    "/learn/component-development/terraform-in-depth/terraform-unknown-at-plan-time/#what-is-known-and-unknown-at-plan-time-part-1-the-obvious;/learn/component-development/terraform-in-depth/terraform-unknown-at-plan-time/#what-is-known-and-unknown-at-plan-time-part-1-the-obvious"
)

# Function to replace broken links with the correct ones
replace_links() {
    for link_pair in "${broken_links[@]}"; do
        IFS=';' read -r broken_link correct_link <<< "$link_pair"

        # Escape special characters in the links
        escaped_broken_link=$(printf '%s\n' "$broken_link" | sed 's|[&/]|\\&|g')
        escaped_correct_link=$(printf '%s\n' "$correct_link" | sed 's|[&/]|\\&|g')

        # Find files containing the broken link and replace it, excluding certain directories and backup files
        grep -rl "$broken_link" . --exclude-dir={components,modules,github-actions} --exclude=*.bak | while read -r file; do
            echo "Fixing $broken_link in $file"
            cp "$file" "$file.bak" # Create a backup with a .bak extension
            sed -i '' "s|$escaped_broken_link|$escaped_correct_link|g" "$file"
        done
    done
}

# Run the replacement function
replace_links

echo "Broken links have been replaced. Please review the changes."
