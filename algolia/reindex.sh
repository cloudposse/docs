#!/usr/bin/env bash

ALGOLIA_INDEX_NAME=${ALGOLIA_INDEX_NAME:-test}
DEPLOYMENT_HOST=${DEPLOYMENT_HOST:-'docs.cloudposse.com'}
ALGOLIA_APP_ID=${ALGOLIA_APP_ID:-'32YOERUX83'}
ALGOLIA_CRAWLER_USER=${ALGOLIA_CRAWLER_USER:-test}
ALGOLIA_CRAWLER_PASSWORD=${ALGOLIA_CRAWLER_PASSWORD:-test}

[ -z "$ALGOLIA_SCRAPER_API_KEY" ] && echo "Need to set ALGOLIA_SCRAPER_API_KEY" && exit 1;

# prepare algolia config
cat algolia/template.json \
  | jq '.index_name="'${ALGOLIA_INDEX_NAME}'"' \
  | jq '.start_urls[0]="https://'${DEPLOYMENT_HOST}'/"' \
  | jq '.sitemap_urls[0]="https://'${DEPLOYMENT_HOST}'/sitemap.xml"' \
  | jq '.sitemap_urls[1]="https://'${DEPLOYMENT_HOST}'/reference-architecture/sitemap.xml"' \
  > algolia.index.json

cat algolia.index.json

# do actual scraping
docker run \
  --env APPLICATION_ID="${ALGOLIA_APP_ID}" \
  --env API_KEY="${ALGOLIA_SCRAPER_API_KEY}" \
  --env DOCSEARCH_BASICAUTH_USERNAME="${ALGOLIA_CRAWLER_USER}" \
  --env DOCSEARCH_BASICAUTH_PASSWORD="${ALGOLIA_CRAWLER_PASSWORD}" \
  --env "CONFIG=$(cat algolia.index.json | jq -r tostring)" \
  algolia/docsearch-scraper
