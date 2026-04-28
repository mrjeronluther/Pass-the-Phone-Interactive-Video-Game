// --- CONFIGURATION ---
const SHEET_ID = '1UJJeg3l6zuCdZMVH7iN4bO0ZbDCHxegBRXubX-8f4eg'; 
const DRIVE_FOLDER_ID = '17A5WqpngSiiAzMC5_eBSEXoSX46ZE5r_'; 
const QUESTION_TAB = 'QuestionDB';
const LOG_TAB = 'PassThePhoneDB';

function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Pass the Phone V6')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

// Fetch both Questions and Used Names in one go for efficiency
function getAppData() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // 1. Get Questions
  const qSheet = ss.getSheetByName(QUESTION_TAB);
  const qLast = qSheet.getLastRow();
  let questions = [];
  if (qLast > 1) {
    questions = qSheet.getRange(2, 1, qLast - 1, 1).getValues().flat().filter(q => q !== "");
  } else {
    questions = ["Tell a joke!", "Sing a song!", "Do a dance!"]; // Fallbacks
  }

  // 2. Get Used Names (to prevent duplicates)
  const lSheet = ss.getSheetByName(LOG_TAB);
  const lLast = lSheet.getLastRow();
  let usedNames = [];
  if (lLast > 1) {
    // Assuming Name is in Column B (Index 2)
    usedNames = lSheet.getRange(2, 2, lLast - 1, 1).getValues().flat().filter(n => n !== "");
  }

  return {
    questions: questions,
    usedNames: usedNames
  };
}

function saveDataAndVideo(payload) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const decoded = Utilities.base64Decode(payload.base64);
    
    // Create Blob
    const blob = Utilities.newBlob(decoded, payload.mimeType, payload.filename);
    
    // Save to Drive
    const file = folder.createFile(blob);
    const fileUrl = file.getUrl();
    
    // Log to Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(LOG_TAB);
    sheet.appendRow([new Date(), payload.name, payload.question, fileUrl]);
    
    return { success: true };
    
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function forceAuthorization() {
  // 1. Connect to folder
  const folder = DriveApp.getFolderById("17A5WqpngSiiAzMC5_eBSEXoSX46ZE5r_");
  
  // 2. Create a dummy file (Force WRITE permission)
  const file = folder.createFile("permission_check_temp.txt", "It works!");
  
  // 3. Connect to Sheet
  SpreadsheetApp.openById("1UJJeg3l6zuCdZMVH7iN4bO0ZbDCHxegBRXubX-8f4eg");
  
  // 4. Cleanup (Delete the dummy file immediately)
  file.setTrashed(true);
  
  Logger.log("Permissions granted successfully!");
}
