# Session Downloads Feature

This document explains how to use the `get_session_downloads` tool to retrieve files downloaded during a HyperBrowser session.

## Overview

The `get_session_downloads` tool allows you to retrieve files that were downloaded by the browser during a HyperBrowser session. This is useful for automating downloads of reports, documents, images, or any other files from websites.

## Prerequisites

For this feature to work, you **must** enable download tracking when creating your session:

```json
{
  "task": "Download the latest report from example.com",
  "sessionOptions": {
    "saveDownloads": true
  }
}
```

The `saveDownloads: true` option tells HyperBrowser to capture and store any files downloaded during the session.

## How It Works

1. **Create a session with downloads enabled**: Use any browser automation tool (browser_use_agent, openai_computer_use_agent, claude_computer_use_agent) with `saveDownloads: true` in sessionOptions
2. **Complete the task**: Let the agent complete the task that involves downloading files
3. **Retrieve the downloads**: Use `get_session_downloads` with the session ID to get access to the downloaded files

## API Response

When you call the HyperBrowser downloads API, you get a response like:

```json
{
  "status": "completed",
  "downloadsUrl": "https://temporary-url-to-downloads.zip",
  "error": null
}
```

### Status Values

- `pending`: Session is still running
- `in_progress`: Downloads are being processed
- `completed`: Downloads are ready to retrieve
- `failed`: Something went wrong

## Using the Tool

### Basic Usage (Get Download URL)

```json
{
  "sessionId": "session_abc123xyz"
}
```

This returns the status and a temporary URL to download the zip file containing all session downloads.

### Download Files Locally

```json
{
  "sessionId": "session_abc123xyz",
  "downloadZip": true,
  "outputPath": "./downloads/my-session-files.zip"
}
```

This will:
1. Get the downloads URL from the API
2. Download the zip file
3. Save it to the specified local path

## Complete Example Workflow

### Step 1: Create a session and download files

```typescript
// Using browser_use_agent
{
  "task": "Go to https://example.com/reports and download the Q4 2024 report",
  "sessionOptions": {
    "saveDownloads": true  // IMPORTANT: Enable download tracking
  },
  "maxSteps": 25
}

// Response includes session ID
{
  "sessionId": "session_abc123xyz",
  // ... other response data
}
```

### Step 2: Retrieve the downloaded files

```typescript
// Option A: Just get the download URL
{
  "sessionId": "session_abc123xyz"
}

// Response
{
  "status": "completed",
  "downloadsUrl": "https://temporary-storage.hyperbrowser.ai/downloads/abc123.zip"
}

// Option B: Download the zip file locally
{
  "sessionId": "session_abc123xyz",
  "downloadZip": true,
  "outputPath": "./reports/q4-2024-report.zip"
}

// Response
{
  "status": "completed",
  "message": "Downloads zip file saved to: ./reports/q4-2024-report.zip"
}
```

## Important Notes

1. **Temporary URLs**: The `downloadsUrl` is temporary and will expire after some time. Download the file promptly if you need it.

2. **Session Options**: You must set `saveDownloads: true` in the session options BEFORE running the task. You cannot enable it retroactively.

3. **File Format**: All downloaded files are packaged into a single ZIP file.

4. **Tool Compatibility**: The `saveDownloads` option works with all browser automation tools:
   - `browser_use_agent`
   - `openai_computer_use_agent`
   - `claude_computer_use_agent`

5. **Path Requirements**: When using `downloadZip: true`, you must provide an `outputPath`. The directory will be created automatically if it doesn't exist.

## Error Handling

### Common Errors

**"No downloads available"**
- The session hasn't completed yet, or
- No files were actually downloaded during the session, or
- `saveDownloads` was not enabled for the session

**"Session not found"**
- Invalid session ID
- Session has expired

**"API Error: 404"**
- The session ID doesn't exist
- Downloads have expired

## Use Cases

1. **Report Downloads**: Automate downloading financial reports, analytics dashboards, or business intelligence exports
2. **Data Collection**: Download CSV/Excel files from data portals
3. **Document Retrieval**: Download PDFs, invoices, or contracts from web applications
4. **Media Downloads**: Save images, videos, or audio files from websites
5. **Batch Processing**: Download multiple files in a single session and process them locally

## Example: Downloading Multiple Files

```typescript
// Step 1: Create session with multiple downloads
{
  "task": "Go to https://example.com/documents, download all PDFs from January 2024",
  "sessionOptions": {
    "saveDownloads": true
  },
  "maxSteps": 50
}

// Step 2: Wait for completion, then retrieve
{
  "sessionId": "session_xyz789",
  "downloadZip": true,
  "outputPath": "./jan-2024-documents.zip"
}

// Step 3: Extract and process locally
// All downloaded PDFs will be in the zip file
```

## Technical Details

### API Endpoint

The tool uses the HyperBrowser API endpoint:
```
GET https://api.hyperbrowser.ai/v1/sessions/{sessionId}/downloads
```

### Authentication

Uses the same API key as other HyperBrowser tools (from environment variables `HB_API_KEY` or `HYPERBROWSER_API_KEY`).

### Dependencies

- `axios`: For making HTTP requests
- Node.js `fs` module: For file system operations when downloading zip files
- Node.js `path` module: For handling file paths

## Troubleshooting

**Q: I'm getting "No downloads available" but files were downloaded**

A: Make sure you set `saveDownloads: true` in the sessionOptions when creating the session. This cannot be added after the session starts.

**Q: The download URL expired**

A: Download URLs are temporary. Use the `downloadZip: true` option immediately after the session completes, or download from the URL quickly.

**Q: Can I retrieve downloads from an old session?**

A: There's a retention period for session downloads. Very old sessions may have expired downloads. Check with HyperBrowser documentation for the current retention policy.

**Q: The zip file is empty**

A: This means no files were actually downloaded during the session. Verify that your automation task correctly triggered file downloads in the browser.

## Support

For issues specific to the HyperBrowser API or download functionality, consult:
- [HyperBrowser Documentation](https://docs.hyperbrowser.ai/)
- [HyperBrowser API Reference](https://docs.hyperbrowser.ai/api-reference)
