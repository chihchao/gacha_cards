# Classroom Gacha Cards

A React application for classroom gacha cards management.

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default).

### Building

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist` directory.

### Linting & Formatting

To run the linter and check for code quality issues:

```bash
npm run lint
```

To format code with Prettier:

```bash
npm run format
```

## Deployment

This project is configured to deploy to **GitHub Pages** using GitHub Actions.

1. Go to your repository **Settings**.
2. Navigate to **Pages** (under Code and automation).
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. The deployment will automatically trigger on every push to the `main` branch.

### Workflow File

The deployment workflow is defined in `.github/workflows/deploy.yml`.

## Google Sheets & Apps Script Setup

To sync student data and rewards, you need to set up a Google Sheet and deploy a Google Apps Script.

### 1. Google Sheet Setup

Create a new Google Sheet with the following headers in the first row (order doesn't matter, but names must match roughly):

- `id` (or `學號`, `編碼`)
- `seat` (or `座號`)
- `name` (or `姓名`)
- `avatar` (or `照片`, `頭像`) - Optional, URL to image
- Any other columns will be treated as **Reward Items** (e.g., `音樂卡`, `2x卡`, `午餐卡`, etc.) and their values should be numbers representing quantity.

### 2. Google Apps Script Setup

1. Open your Google Sheet.
2. Go to **Extensions** > **Apps Script**.
3. Clear the editor and paste the following code:

```javascript
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var headers = data[0]; // Get all headers from the first row
  var json = [];
  
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      // Ensure values are correctly mapped to headers
      obj[headers[j]] = data[i][j];
    }
    json.push(obj);
  }
  
  return ContentService.createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Clear old data (keep headers)
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  
  // Re-map data based on headers to ensure correct column placement
  var dataToStore = contents.map(function(item) {
    return headers.map(function(header) {
      return item[header] !== undefined ? item[header] : "";
    });
  });
  
  sheet.getRange(2, 1, dataToStore.length, headers.length).setValues(dataToStore);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
```

4. Click **Deploy** > **New deployment**.
5. Click **Select type** (cog icon) > **Web app**.
6. Set the following:
   - **Description**: `v1` (or anything you like)
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (Important! This allows the React app to access the data without OAuth)
7. Click **Deploy**.
8. Copy the **Web app URL** (starts with `https://script.google.com/macros/s/...`).

### 3. Connect to App

1. Open the Classroom Gacha Cards app.
2. Click the **Database Icon** in the header.
3. Paste the **Web app URL** into the input field.
4. Click **Save Sync Settings**.

The app will now fetch student data from your Google Sheet and sync inventory changes back to it automatically.
