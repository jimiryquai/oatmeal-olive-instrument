---
name: zread-mcp
description: Search documentation, inspect folder structures, and read the code files of public GitHub repositories using the zread MCP server. Use when you need to research upstream open-source code libraries or inspect project setups.
---

# GitHub Repo Reader (zread) MCP Skill

You can explore and read code from public GitHub repositories natively using the `zread` tools. Do **not** execute CLI commands. Invoke these tools directly from your tool panel.

## Active Tools

### 1. `search_doc`
Search documentation, issues, and commits of a GitHub repository.
* **Signature**: `search_doc(repo_name: string, query: string, language?: string)`
* **Example**: `search_doc(repo_name: "vitejs/vite", query: "how is plugin resolved")`

### 2. `get_repo_structure`
Get the directory structure and file list of a GitHub repository.
* **Signature**: `get_repo_structure(repo_name: string, dir_path?: string)`
* **Example**: `get_repo_structure(repo_name: "vitejs/vite", dir_path: "packages/vite/src")`

### 3. `read_file`
Read the full code content of a specific file in a GitHub repository.
* **Signature**: `read_file(repo_name: string, file_path: string)`
* **Example**: `read_file(repo_name: "vitejs/vite", file_path: "packages/vite/src/node/plugins/resolve.ts")`
