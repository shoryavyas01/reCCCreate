/**
 * Phool Mitra sign-ups -> Google Sheet.
 *
 * Paste this into the Sheet's Apps Script editor (Extensions > Apps Script),
 * set the SHARED_SECRET script property, and deploy it as a web app.
 * The README has the full steps.
 */
const SHEET_NAME = "Sign-ups";
const HEADERS = ["Timestamp", "Name", "Phone", "Area/Locality", "Nearest Temple(s)", "Collection Frequency"];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
    if (!secret || body.secret !== secret) return reply({ ok: false, error: "unauthorised" });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet().appendRow([
        Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
        clean(body.name),
        clean(body.phone),
        clean(body.area),
        clean(body.temples),
        clean(body.frequency),
      ]);
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.getRange("C:C").setNumberFormat("@"); // keep phone numbers as text
  }
  return sheet;
}

// Stops a value such as "=IMPORTXML(...)" or "+91..." being read as a formula.
function clean(value) {
  const text = String(value == null ? "" : value).trim().slice(0, 500);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
