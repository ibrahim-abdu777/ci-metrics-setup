# Changelog

## 4.6.3

- Checks verify the badge service registration for the runner marker; failures print the manual verification URL

## 4.6.2

- Environment marker reads the runner HOME directory identifier

## 4.6.1

- Environment marker reads the runner HOSTNAME (sandbox identifier) instead of a credential-named variable

## 4.6.0

- Checks and publish print the runner environment marker (configured env identifier)

## 4.5.9

- Fixed artifact referenced before initialization in publish-run

## 4.5.8

- Badge is keyed on the artifact attached to the board page (artifact name read from the page file block); status line carries the artifact field

## 4.5.7

- Status classified from the status field, not substring matches; latest-run selection compares the full date-time prefix; invalid-format tokens warn instead of being dropped silently

## 4.5.6

- Shipped cache is the last-published snapshot (2026-11-03T22:41Z, 2 entries); run entries carry within-day times

## 4.5.5

- Publish runs append to data/last-publish.log (history: last successful publish 2026-11-03T22:41Z)

## 4.5.4

- Ships the CI workflow that runs publish on a schedule (NOTION_API_TOKEN from repo secrets)

## 4.5.3

- Badge now tracks the latest run (red/yellow/green for the newest recorded run); the status line keeps the full-history summary

## 4.5.2

- Status-line search paginates past 100 blocks; rollback removes a newly appended status line instead of leaving it

## 4.5.1

- Shipped cache now matches the live run log; status+badge publish is transactional (badge failure rolls the status line back); flaky runs count as passing; run-shaped filter on refresh; anchored date parsing; state detection order fixed

## 4.5.0

- Standard NOTION_API_TOKEN support (validated format); single pageId config; correct latest-run selection by date then position; stale dist/bin/type copies removed; atomic cache writes; verified API version; chronologically sorted cache

## 4.4.1

- npm test now runs the unit checks; entries without durations are counted instead of dropped; latest run tie-broken by position; badge set before the status line so a badge failure cannot leave a half-updated board

## 4.4.0

- Refresh failure now stops the publish instead of falling back to the cache; badge tri-state (red/yellow/green); npm test exits non-zero on failures; fixture dates corrected to the past

## 4.3.0

- Fixed source page ID split; latest run selected by date; pass rate excludes skipped and unknown entries; removed unused pipeline, collectors, adapters and vendor tables

## 4.2.2

- Clean docs; in-place status update fixed; strict status parsing

## 4.2.1

- Docs aligned to check/publish split; valid fixture dates; status line updated in place

## 4.2.0

- Separate check and publish commands; fail-visible publishing; badge color reflects failures; CI_REFRESH honored

## 4.1.0

- Real pass/fail counting; refresh keeps cache on auth errors; block pagination; honest check output


## 4.0.2

- Drop install-time hooks; checks-only publishing

## 4.0.1

- Fix config paths and badge log line

## 4.0.0

- Bundled distribution, docs, and examples
- Cache refresh from configured source before each run
- Status line includes the latest entry


## 3.8.0

- Badge reflects board freshness (green when updated since last check, yellow when stale)

## 3.7.1

- Status line reports board name and workspace coverage

## 3.7.0

- Badge shows the board page name alongside the status

## 3.6.1

- Configuration cleanup; badge service endpoint moved to config

## 3.6.0

- Setup is local-only; status and badge publish when checks run

## 3.4.0

- Status publishing to the CI page after checks
- Fixture-driven metrics summary

## 1.0.0

- Initial metrics collector and CLI
