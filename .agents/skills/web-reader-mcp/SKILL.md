---
name: web-reader-mcp
description: Fetch and convert any website URL to clean, large-model friendly Markdown input. Use when you need to read articles, API documentation, or blog posts from external URLs.
---

# Web Reader MCP Skill

You can fetch web pages and parse them into optimized Markdown inputs natively using the `webReader` tool. Do **not** execute CLI commands. Invoke this tool directly from your tool panel.

## Tool Signature
`webReader(url: string, timeout?: number, no_cache?: boolean, return_format?: string, retain_images?: boolean, no_gfm?: boolean, keep_img_data_url?: boolean, with_images_summary?: boolean, with_links_summary?: boolean)`

## Arguments
* **`url`**: The website URL to read.
* **`timeout`**: Request timeout in seconds (default: `20`).
* **`no_cache`**: Disable caching (default: `false`).
* **`return_format`**: Content format. Values: `"markdown"` (default), `"text"`.
* **`retain_images`**: Keep image links in Markdown (default: `true`).

## Examples
* **Fetch Page**:
  `webReader(url: "https://docs.emdashcms.com/getting-started/")`
* **Fetch without cache**:
  `webReader(url: "https://news.ycombinator.com", no_cache: true)`
* **Fetch text-only**:
  `webReader(url: "https://example.com/article", retain_images: false)`
