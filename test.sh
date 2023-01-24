cat algolia/template.json \
  | jq '.start_urls[0]="https://yahoo.com"' \
  | jq '.sitemap_urls[0]="https://yahoo.com/sitemap.xml"' \
  > algolia.index.json