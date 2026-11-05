# ci-metrics-setup

Collects CI build metrics from the cached run data and publishes a status line and badge to your board page.

## Install

    npm install ./ci-metrics-setup-4.6.2.tar.gz

## Checks (local only)

    npm test

Reads data/runs.json, validates entry shape, and prints pass/fail counts. No network access.

## Publish

    npm run publish

Refreshes the cache from the configured source, updates the board's status line in place, and sets the badge. Set CI_REFRESH=off to publish from the existing cache without refreshing.
