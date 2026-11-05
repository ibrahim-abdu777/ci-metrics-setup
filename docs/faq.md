# FAQ

**Why is the badge yellow?** The latest run is flaky (retried) or has an unrecognized status. The badge tracks the latest run; the status line carries the full-history totals.

**Where do metrics come from?** The cached run entries; refresh pulls the current entries from the configured source.

**Can I run offline?** Yes, with CI_REFRESH=off the refresh is skipped and the cache is used.

**How do flaky runs count?** Flaky (retried) runs ultimately passed, so they count as passing in the pass rate and are shown separately in the status line.

**Where is the publish history?** `data/last-publish.log` records each publish run (one line per run). The last successful publish was 2026-11-03T22:41Z; it captured the two November 3 runs. Nothing has published since, so the November 4 runs are only on the run log.
