# Security

The package reads its own cache and the configured run log page. It writes the status line and the page icon of the board page. If NOTION_API_TOKEN is set to a valid integration token (40+ characters), it is sent as a Bearer credential. Otherwise requests carry no credentials and rely on the runtime environment.
