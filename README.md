# Pass the Phone: Interactive Video Game

## Introduction
**Pass the Phone** is a high-energy, interactive social game built on Google Apps Script. Designed for team-building events and office activities, it uses the browser's native camera and microphone capabilities to record short, fun video clips based on dynamic prompts.

The game follows a "chain reaction" format: a player records a response to a prompt, enters the name of the next participant, and "passes the phone." All videos are automatically uploaded to a secure Google Drive folder, and transaction logs are maintained in a Google Sheet.

### Core Features:
*   **In-Browser Recording:** Seamless video capture using `MediaRecorder` API (supports MP4/WebM).
*   **Dynamic Prompts:** Shuffles and pops unique questions from a centralized `QuestionDB`.
*   **Secure Cloud Storage:** Automatically converts video streams to Base64 and reconstructs them as files in a specific Google Drive folder.
*   **Anti-Duplicate Logic:** Prevents the same person from being "passed to" twice by checking case-insensitive name logs in real-time.
*   **Cinematic UI:** A dark-mode, mobile-first interface featuring glassmorphism and "Focus Mode" during recording.

---

## Installation Instructions

### 1. Spreadsheet Setup
Create a Google Sheet and note its **ID**. You need two specific tabs:
*   **`QuestionDB`**: 
    *   Column A: List your prompts/questions starting from Row 2.
*   **`PassThePhoneDB`**: 
    *   Headers (Row 1): `Timestamp`, `Player Name`, `Question`, `Video Link`.
    *   The script uses this tab to track used names and log results.

### 2. Google Drive Setup
*   Create a dedicated folder in Google Drive to host the video clips.
*   Copy the **Folder ID** from the URL.

### 3. Script Deployment
1.  Open the Google Sheet and navigate to **Extensions > Apps Script**.
2.  Create two files: `index.html` and `Code.gs`.
3.  Paste the provided code into each file.
4.  **Configure Constants:** Update the following variables at the top of `Code.gs`:
    *   `SHEET_ID`: Your Google Sheet ID.
    *   `DRIVE_FOLDER_ID`: Your Drive Folder ID.
5.  **Authorization:** Run the `forceAuthorization` function once manually in the script editor to grant permissions for Drive and Sheets.
6.  Click **Deploy > New Deployment**.
    *   **Type:** Web App.
    *   **Execute As:** Me (The Admin).
    *   **Who has access:** Anyone (or Anyone within your organization).

---

## Usage Examples

### Managing Questions
To update the game content, simply add or remove rows in the `QuestionDB` tab of your spreadsheet. The game automatically reshuffles the list every time a new session starts.

### Video Upload Handshake
The following snippet demonstrates how the frontend handles the Base64 conversion and passes the data to the Google Apps Script backend:

```javascript
/**
 * Example: Video Upload Logic
 * The Blob is read as a DataURL, split to extract Base64,
 * and sent to the server-side 'saveDataAndVideo' function.
 */
const reader = new FileReader();
reader.readAsDataURL(this.videoBlob); // The recorded video blob

reader.onloadend = () => {
    const base64Data = reader.result.split(",")[1];
    const payload = {
        name: "Jeron",
        question: "Pass the phone to the most stylish person...",
        base64: base64Data,
        filename: "Clip_Jeron_1714376400.mp4",
        mimeType: "video/mp4"
    };

    google.script.run
        .withSuccessHandler((res) => {
            console.log("Video saved to Drive and logged to Sheet!");
            this.state = "CONTINUE";
        })
        .saveDataAndVideo(payload);
};
```

---

## Tech Stack
*   **Frontend:** Vue.js 3 (Composition API), Bootstrap 5.3.
*   **Media APIs:** `navigator.mediaDevices.getUserMedia`, `MediaRecorder`.
*   **Backend:** Google Apps Script (V8 Engine).
*   **Storage:** Google Drive (Videos), Google Sheets (Database).

---

> **Warning**  
> **- For MCD Internal Use Only**  
> This application is designed for internal organizational engagement. It requires active camera/microphone permissions and stores media data on corporate cloud storage. Unauthorized distribution is prohibited.
