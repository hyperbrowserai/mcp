# Example: Downloading Files with HyperBrowser MCP

This example demonstrates how to use the HyperBrowser MCP server to automate file downloads from a website.

## Scenario

Download a report from a website and save it locally.

## Step 1: Create a Browser Session with Downloads Enabled

First, use one of the browser automation agents to perform the download task. The key is to set `saveDownloads: true` in the session options.

### Using browser_use_agent

```json
{
  "tool": "browser_use_agent",
  "params": {
    "task": "Navigate to https://example.com/reports, find the 'Q4 2024 Financial Report' and download it",
    "sessionOptions": {
      "saveDownloads": true
    },
    "maxSteps": 30
  }
}
```

### Response

The agent will complete the task and return a response that includes the session ID:

```json
{
  "status": "completed",
  "sessionId": "session_abc123xyz456",
  "result": "Successfully downloaded Q4 2024 Financial Report",
  "steps": [...],
  ...
}
```

**Important**: Make note of the `sessionId` - you'll need it in the next step.

## Step 2: Retrieve the Downloaded Files

Now use the `get_session_downloads` tool to retrieve the files that were downloaded during the session.

### Option A: Get the Download URL Only

```json
{
  "tool": "get_session_downloads",
  "params": {
    "sessionId": "session_abc123xyz456"
  }
}
```

**Response:**
```json
{
  "status": "completed",
  "downloadsUrl": "https://hyperbrowser-storage.s3.amazonaws.com/downloads/abc123.zip?expires=..."
}
```

You can then download the file manually from this URL, or pass it to another tool for processing.

### Option B: Download the Files Locally (Recommended)

```json
{
  "tool": "get_session_downloads",
  "params": {
    "sessionId": "session_abc123xyz456",
    "downloadZip": true,
    "outputPath": "./reports/q4-2024-financial-report.zip"
  }
}
```

**Response:**
```json
{
  "status": "completed",
  "message": "Downloads zip file saved to: ./reports/q4-2024-financial-report.zip"
}
```

The ZIP file now contains all files downloaded during the session. You can extract it:

```bash
unzip ./reports/q4-2024-financial-report.zip -d ./reports/q4-2024/
```

## Complete Workflow in Code

If you're calling this programmatically, here's a complete Node.js example:

```javascript
// 1. Start browser session and download files
const browserResult = await mcpClient.callTool('browser_use_agent', {
  task: 'Go to https://example.com/reports and download the Q4 2024 report',
  sessionOptions: {
    saveDownloads: true
  },
  maxSteps: 30
});

// Extract session ID from response
const sessionId = browserResult.data.sessionId;
console.log('Browser session completed:', sessionId);

// 2. Retrieve the downloaded files
const downloadResult = await mcpClient.callTool('get_session_downloads', {
  sessionId: sessionId,
  downloadZip: true,
  outputPath: './reports/q4-report.zip'
});

console.log('Files downloaded:', downloadResult);

// 3. Now you can process the downloaded files
// Extract, parse, analyze, etc.
```

## Advanced Example: Downloading Multiple Files

Download all monthly reports from a dashboard:

```json
{
  "tool": "browser_use_agent",
  "params": {
    "task": "Go to https://example.com/dashboard, navigate to the Reports section, and download all monthly reports for 2024 (January through December)",
    "sessionOptions": {
      "saveDownloads": true
    },
    "maxSteps": 100
  }
}
```

Then retrieve all downloads in a single ZIP file:

```json
{
  "tool": "get_session_downloads",
  "params": {
    "sessionId": "session_xyz789",
    "downloadZip": true,
    "outputPath": "./reports/2024-monthly-reports.zip"
  }
}
```

The resulting ZIP will contain all 12 monthly reports that were downloaded during the session.

## Using with Claude Computer Use Agent

You can also use the more sophisticated Claude Computer Use agent for complex download scenarios:

```json
{
  "tool": "claude_computer_use_agent",
  "params": {
    "task": "Go to https://data.example.com, log in with the credentials I provided earlier, navigate to Data Exports, select 'All Data' and 'CSV format', then download the export",
    "sessionOptions": {
      "saveDownloads": true,
      "profile": {
        "id": "my-profile-with-credentials"
      }
    },
    "maxSteps": 50
  }
}
```

Then retrieve the export:

```json
{
  "tool": "get_session_downloads",
  "params": {
    "sessionId": "session_data_export_123",
    "downloadZip": true,
    "outputPath": "./exports/data-export-$(date +%Y%m%d).zip"
  }
}
```

## Error Handling

Always check the status before attempting to download:

```javascript
const downloadResult = await mcpClient.callTool('get_session_downloads', {
  sessionId: sessionId
});

if (downloadResult.status === 'completed') {
  // Now download the zip
  const zipResult = await mcpClient.callTool('get_session_downloads', {
    sessionId: sessionId,
    downloadZip: true,
    outputPath: './downloads/files.zip'
  });
  console.log('Downloaded:', zipResult);
} else if (downloadResult.status === 'pending' || downloadResult.status === 'in_progress') {
  console.log('Session still processing, try again later');
} else {
  console.error('Download failed:', downloadResult.error);
}
```

## Tips

1. **Enable saveDownloads Early**: Always set `saveDownloads: true` when creating the session. You can't enable it later.

2. **Use Descriptive Paths**: Name your output files descriptively so you know what they contain:
   ```
   ./downloads/financial-reports/q4-2024-report.zip
   ./exports/customer-data-2024-12-09.zip
   ```

3. **Handle Timeouts**: If the download task takes a long time, the session might timeout. Increase `maxSteps` if needed.

4. **Extract and Verify**: After downloading, extract the ZIP and verify the contents:
   ```javascript
   const extract = require('extract-zip');
   await extract('./reports/q4-report.zip', { dir: './reports/q4-extracted' });
   ```

5. **Clean Up**: Delete the ZIP files after extraction to save disk space.

6. **Retry Logic**: If downloads fail, implement retry logic with exponential backoff.

## Next Steps

- Integrate this into your automation pipelines
- Set up scheduled downloads with cron jobs
- Process downloaded files automatically (parse PDFs, load CSVs into databases, etc.)
- Send notifications when downloads complete
- Archive downloaded files to cloud storage
