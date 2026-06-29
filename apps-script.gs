/**
 * Prize Nova — Spin & Win — Google Sheets logger
 * ------------------------------------------------
 * SETUP:
 * 1. Create (or open) the Google Sheet you want entries to land in.
 * 2. In the Sheet, go to Extensions > Apps Script.
 * 3. Delete any placeholder code and paste this whole file in.
 * 4. Click "Deploy" > "New deployment".
 *    - Type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 5. Click Deploy, authorize the permissions when prompted.
 * 6. Copy the Web app URL it gives you.
 * 7. Paste that URL into CONFIG.SHEET_WEBHOOK_URL inside index.html.
 *
 * This script writes one row per event:
 *   - "signup"      -> when someone submits username + mobile
 *   - "spin_result" -> when the wheel finishes spinning
 *
 * Sheet columns created automatically on first run:
 * Timestamp | Type | Username | Mobile | Prize | Code | Client Timestamp
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add header row once, if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Server Timestamp", "Type", "Username", "Mobile",
        "Prize", "Code", "Client Timestamp"
      ]);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.type || "",
      data.username || "",
      data.mobile || "",
      data.prize || "",
      data.code || "",
      data.timestamp || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you sanity-check the deployment by visiting the URL directly
function doGet(e) {
  return ContentService
    .createTextOutput("Prize Nova webhook is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}
