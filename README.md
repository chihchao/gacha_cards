<div align="center">
  <a href="#english">English</a> | <a href="#chinese">中文</a>
</div>

<a id="english"></a>

# Classroom Gacha Cards 🎫

A modern, interactive classroom management tool built with React. This application allows teachers to manage student rewards through a fun and engaging "Gacha" (capsule toy) interface, seamlessly synced with Google Sheets.

## ✨ Features

- **📊 Student Dashboard**: View all students, their seating arrangement, and current inventory of reward cards at a glance.
- **🎫 Gacha System**: An exciting card drawing implementation with animations and sound effects.
- **🔄 Google Sheets Sync**: Two-way synchronization with Google Sheets for easy data management and persistence.
- **📱 Responsive Design**: Optimized for both desktop and tablet use in the classroom.
- **⚙️ Customizable Pool**: Adjust the quantity of each reward card in the gacha pool on the fly.
- **🎲 Reset Function**: One-click reset to reshuffle the card pool for a new round.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Google Sheets (via Apps Script)

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd classroom-gacha-cards
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
The app will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```
Artifacts will be generated in the `dist` directory.

## 📖 Usage Guide

### 1. Dashboard Mode
- View all students as card items.
- Click on a student to view details or manually adjust their rewards.
- Indicators show current synchronization status (Online, Local, or Error).

### 2. Gacha Mode
- Switch to Gacha mode using the top-left toggle button.
- Select a student's seat to "pick" them for the draw.
- Click a card to reveal the prize!
- **Reset Pool**: Click the orange reset button in the header to reshuffle all cards.

### 3. Settings
- **Pool Settings**: Click the sliders icon to adjust how many of each card type are in the deck.
- **Sync Settings**: Click the database icon to connect your Google Sheet.

## ☁️ Google Sheets & Apps Script Setup

This project uses Google Sheets as a backend database. Follow these steps to set it up:

### 1. Prepare Google Sheet
Create a new Google Sheet. The first row must contain headers. Recommended structure:
- `id` (or `學號`): Unique identifier for the student.
- `seat` (or `座號`): Seat number.
- `name` (or `姓名`): Student name.
- `avatar` (or `照片`): Optional URL for student photo.
- **Reward Columns**: Any other columns (e.g., `音樂卡`, `2x卡`) will be treated as reward items (integers).

### 2. Deploy Apps Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Paste the following code into the editor:

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

3. Click **Deploy** > **New deployment**.
4. Select type **Web app**.
5. Set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. Click **Deploy** and copy the **Web app URL**.

### 3. Connect App
Paste the copied URL into the app's Sync Settings (Database icon) to start syncing.

## 📦 Deployment

This project includes a GitHub Action for automatic deployment to **GitHub Pages**.

1. Go to repository **Settings** > **Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Push to the `main` branch to trigger deployment.

---

<a id="chinese"></a>

# Classroom Gacha Cards 🎫 (中文指南)

這是一個使用 React 構建的現代化課堂管理工具。此應用程式讓老師能夠透過有趣且互動性高的「抽卡機」介面來管理學生獎勵，並能與 Google Sheets 無縫同步資料。

## ✨ 功能特色

- **📊 學生儀表板**：一覽所有學生狀態、座位安排以及目前持有的獎勵卡庫存。
- **🎫 抽卡系統**：具備動畫與音效的刺激抽卡體驗，提升學生參與感。
- **🔄 Google Sheets 同步**：透過 Google Sheets 進行雙向資料同步，輕鬆管理與保存資料。
- **📱 響應式設計**：針對課堂中的桌機與平板操作進行了優化。
- **⚙️ 自定義卡池**：可隨時調整卡池中各種獎勵卡的數量配置。
- **🎲 重置功能**：一鍵重置並重新洗牌，開啟新的一輪抽獎。

## 🛠️ 技術架構

- **框架**: React 18 + Vite
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **圖示**: Lucide React
- **後端**: Google Sheets (透過 Apps Script)

## 🚀 快速開始

### 前置需求

- Node.js (建議 v20 或更高版本)
- npm 或 yarn

### 安裝步驟

1. 複製專案庫：
   ```bash
   git clone <repository-url>
   cd classroom-gacha-cards
   ```

2. 安裝依賴套件：
   ```bash
   npm install
   ```

### 開發模式

啟動本地開發伺服器：
```bash
npm run dev
```
應用程式將會在 `http://localhost:3000` 運行。

### 生產環境建置

```bash
npm run build
```
建置後的檔案將會產生在 `dist` 目錄中。

## 📖 使用指南

### 1. 儀表板模式 (Dashboard)
- 以卡片形式檢視所有學生列表。
- 點擊學生卡片可查看詳細資訊或手動調整其獎勵數量。
- 頂部指示燈會顯示目前的連線同步狀態（線上 Online、本地 Local 或 錯誤 Error）。

### 2. 抽卡模式 (Gacha)
- 點擊左上角的切換按鈕進入抽卡模式。
- 選擇畫面下方的學生座位號碼來「選中」該名學生。
- 點擊畫面上的卡背進行抽卡！
- **重置卡池**：點擊標頭區的橙色重置按鈕，即可將所有卡片重新洗牌。

### 3. 設定
- **卡池設定**：點擊滑桿圖示，可調整卡池中每種獎勵卡的數量。
- **同步設定**：點擊資料庫圖示，貼上 Google Apps Script 網址以進行連線。

## ☁️ Google Sheets 與 Apps Script 設定指南

本專案使用 Google Sheets 作為後端資料庫。請依照以下步驟進行設定：

### 1. 準備 Google Sheet
建立一個新的 Google Sheet。第一列必須包含標題，建議結構如下：
- `id` (或 `學號`)：學生的唯一識別碼。
- `seat` (或 `座號`)：座位號碼。
- `name` (或 `姓名`)：學生姓名。
- `avatar` (或 `照片`)：選填，學生大頭照的圖片網址。
- **獎勵欄位**：任何其他欄位（例如 `音樂卡`、`2x卡`）都將被視為獎勵項目（請填入數字代表數量）。

### 2. 部署 Apps Script
1. 在您的 Google Sheet 中，點擊選單 **擴充功能 (Extensions)** > **Apps Script**。
2. 將下方程式碼貼入編輯器中：

```javascript
// 取得資料 (GET)
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var headers = data[0]; // 取得第一列所有標題
  var json = [];
  
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      // 確保值正確映射到對應標題
      obj[headers[j]] = data[i][j];
    }
    json.push(obj);
  }
  
  return ContentService.createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}

// 寫入資料 (POST)
function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // 清除舊資料（保留標題列）
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  
  // 根據標題順序重新排列資料，確保寫入正確欄位
  var dataToStore = contents.map(function(item) {
    return headers.map(function(header) {
      return item[header] !== undefined ? item[header] : "";
    });
  });
  
  sheet.getRange(2, 1, dataToStore.length, headers.length).setValues(dataToStore);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
```

3. 點擊右上角 **部署 (Deploy)** > **新增部署 (New deployment)**。
4. 點擊「選取類型」旁的齒輪圖示 > 選擇 **網頁應用程式 (Web app)**。
5. 設定如下：
   - **執行身分 (Execute as)**: `我 (Me)`
   - **誰可以存取 (Who has access)**: `任何人 (Anyone)` (重要！這讓 React APP 能在免登入情況下存取資料)
6. 點擊 **部署** 並複製產生的 **網頁應用程式網址 (Web app URL)**。

### 3. 連接應用程式
回到 Classroom Gacha Cards 應用程式，點擊上方的 **資料庫圖示 (同步設定)**，將複製的網址貼入欄位並儲存。

## 📦 部署指南

本專案已包含 GitHub Action 設定，可自動部署至 **GitHub Pages**。

1.前往 GitHub 儲存庫的 **Settings** > **Pages**。
2.在 **Build and deployment** > **Source** 下方選擇 **GitHub Actions**。
3.只要將程式碼推送到 `main` 分支，就會觸發自動部署。
