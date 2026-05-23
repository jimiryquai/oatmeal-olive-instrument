---
name: web-search-mcp
description: Search the web for current information, tutorials, or document references using the web-search-prime MCP server. Use when you need real-time data beyond your training knowledge.
---

# Web Search MCP Skill

You can perform search queries against the web natively using the `web_search_prime` tool. Do **not** execute CLI commands. Invoke this tool directly from your tool panel.

## Tool Signature
`web_search_prime(search_query: string, search_domain_filter?: string, search_recency_filter?: string, content_size?: string, location?: string)`

## Arguments
* **`search_query`**: The query string (it is recommended to keep it under 70 characters).
* **`search_domain_filter`**: Restricts results to specific domain(s), e.g. `"docs.emdashcms.com"`.
* **`search_recency_filter`**: Filters by time range. Values: `"oneDay"`, `"oneWeek"`, `"oneMonth"`, `"oneYear"`, `"noLimit"` (default).
* **`content_size`**: Amount of context in summaries. Values: `"medium"` (default), `"high"` (max context, higher token usage).
* **`location`**: Guess region. Values: `"cn"` (default), `"us"`.

## Examples
* **Simple Search**:
  `web_search_prime(search_query: "TypeScript 5.0 updates")`
* **Targeted Search**:
  `web_search_prime(search_query: "middleware setup", search_domain_filter: "docs.emdashcms.com")`
* **Recent Search**:
  `web_search_prime(search_query: "Astro framework release notes", search_recency_filter: "oneMonth")`
