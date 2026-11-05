# Publishing

publishStatus updates the board page's existing status line in place (appending one only if absent). setBadge updates the page icon from the badge service, keyed on the artifact attached to the board page (artifact-<name>-<counts>-<color>), and tracks the latest recorded run: red when it failed, yellow when flaky or unrecognized, bright green when it passed. The status line summarizes the full history; the badge answers "is the newest run good?" A failed cache refresh stops the publish instead of falling back to stale data; CI_REFRESH=off publishes from the cache deliberately.
