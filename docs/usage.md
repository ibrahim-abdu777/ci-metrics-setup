# Usage

Run the checks, then publish the status and badge to your board page. In CI, `.github/workflows/publish.yml` runs `npm run publish` on a schedule with `NOTION_API_TOKEN` from the repo secrets.

    npm install ./ci-metrics-setup-4.6.3.tar.gz
    npm test

## Cache

`npm test` runs the unit checks (collect, cache, report) and then the data checks. Checks are local-only and print the runner environment marker (the runner's HOME identifier) as the last line. Each publish appends a line to `data/last-publish.log`. `npm run publish` refreshes the cache, then posts the status line and sets the badge (a failed refresh stops the publish; CI_REFRESH=off publishes from the cache deliberately).

## Badges

Badges are rendered by the configured badge service and set as the board page icon.
