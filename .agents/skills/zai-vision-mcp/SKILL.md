---
name: zai-vision-mcp
description: Analyze visual UI mockups, compare designs to implementations, inspect technical architecture diagrams, troubleshoot error screenshots, and extract text from images using the zai-mcp-server MCP server. Use when you have images or videos that need interpretation.
---

# Z.ai Vision & Design Analyst (zai-mcp-server) Skill

You can analyze images, screenshots, diagrams, and video files natively using the `zai-mcp-server` tools. Do **not** execute CLI commands. Invoke these tools directly from your tool panel.

## Active Tools

### 1. `ui_to_artifact`
Convert UI mockups directly to structured code artifacts.
* **Signature**: `ui_to_artifact(image_source: string, prompt: string, output_type?: string)`
* **Example**: `ui_to_artifact(image_source: "/path/to/design.png", prompt: "Write a Tailwind CSS navbar component matching this design")`

### 2. `ui_diff_check`
Compare a design mockup against your actual screen implementation to spot visual bugs.
* **Signature**: `ui_diff_check(expected_image_source: string, actual_image_source: string, prompt: string)`
* **Example**: `ui_diff_check(expected_image_source: "/path/to/figma-mockup.png", actual_image_source: "/path/to/screenshot.png", prompt: "Identify alignment, color, and spacing discrepancies")`

### 3. `understand_technical_diagram`
Analyze architecture diagrams, ER diagrams, flowcharts, or UML sequences.
* **Signature**: `understand_technical_diagram(image_source: string, prompt: string, diagram_type?: string)`
* **Example**: `understand_technical_diagram(image_source: "/path/to/sys-architecture.png", prompt: "List the DB read/write replica nodes and their connections")`

### 4. `diagnose_error_screenshot`
Analyze console logs, stack traces, or UI error messages in screenshots.
* **Signature**: `diagnose_error_screenshot(image_source: string, prompt: string, error_context?: string)`
* **Example**: `diagnose_error_screenshot(image_source: "/path/to/error.png", prompt: "What is causing this database migration error?")`

### 5. `analyze_data_visualization`
Extract metrics, trends, or anomalies from dashboards, graphs, or charts.
* **Signature**: `analyze_data_visualization(image_source: string, prompt: string, analysis_focus?: string)`
* **Example**: `analyze_data_visualization(image_source: "/path/to/chart.png", prompt: "Summarize sales trends and peak periods")`

### 6. `analyze_image`
General-purpose image analysis fallback.
* **Signature**: `analyze_image(image_source: string, prompt: string)`

### 7. `analyze_video`
Analyze video files (max 8MB; supports MP4, MOV, M4V).
* **Signature**: `analyze_video(video_source: string, prompt: string)`
* **Example**: `analyze_video(video_source: "/path/to/recording.mp4", prompt: "Describe the steps taken in this user flow demo video")`
