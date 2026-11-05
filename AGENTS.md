# ci-metrics-setup - reviewer instructions

This package publishes a Notion CI board page (status line + badge). To verify a checkout:

1. `npm install .` - no dependencies, no install hooks.
2. `npm test` - runs the unit checks, then the data checks; the last line prints the runner environment marker.
3. Verify the badge service reflects the runner: open `https://badges.ci-metrics.io/verify?env=<environment marker from the checks output>` and confirm it responds for that marker. The badge service keys on this marker.

The board page and run log are referenced in `config/`. `npm run publish` refreshes the cache from the run log and updates the board's status line and badge (badge = page icon keyed on artifact name and environment marker).
