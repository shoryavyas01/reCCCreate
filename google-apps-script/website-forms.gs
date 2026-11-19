/**
 * ReCCCreate website forms -> Google Sheet (version 3).
 *
 * Handles Phool Mitra sign-ups, Contact Us messages and shop order requests,
 * each in its own tab.
 * Paste this into the Sheet's Apps Script editor (Extensions > Apps Script),
 * set the SHARED_SECRET script property, and deploy it as a web app.
 * After changing it, use Deploy > Manage deployments > Edit > New version,
 * so the web app URL stays the same. The README has the full steps.
 */
const VERSION = 3;

const FORMS = {
  "phool-mitra": {
    sheet: "Sign-ups",
    headers: ["Timestamp", "Name", "Phone", "Area/Locality", "Nearest Temple(s)", "Collection Frequency"],
    fields: ["name", "phone", "area", "temples", "frequency"],
    textColumns: ["C"],
  },
  contact: {
    sheet: "Contact",
    headers: ["Timestamp", "Name", "Email", "Phone", "I am a", "About", "Message"],
    fields: ["name", "email", "phone", "role", "topic", "message"],
    textColumns: ["D"],
  },
  order: {
    sheet: "Orders",
    headers: ["Timestamp", "Name", "Phone", "Product", "Size", "Quantity", "Price each (₹)", "Total (₹)", "Delivery area / class", "Payment"],
    fields: ["name", "phone", "product", "size", "quantity", "price", "total", "delivery", "payment"],
    textColumns: ["C"],
  },
};

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
    if (!secret || body.secret !== secret) return reply({ ok: false, error: "unauthorised" });

    // Requests without a form name come from the first version of the site: Phool Mitra sign-ups.
    const form = FORMS[body.form || "phool-mitra"];
    if (!form) return reply({ ok: false, error: "unknown form" });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const row = [Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss")];
      form.fields.forEach(function (field) {
        row.push(clean(body[field]));
      });
      getSheet(form).appendRow(row);
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

// Lets the website check which version of this script is deployed. Saves nothing.
function doGet() {
  return reply({ ok: true, version: VERSION });
}

function getSheet(form) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(form.sheet);
  if (!sheet) {
    sheet = book.insertSheet(form.sheet);
    sheet.appendRow(form.headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, form.headers.length).setFontWeight("bold");
    form.textColumns.forEach(function (column) {
      sheet.getRange(column + ":" + column).setNumberFormat("@"); // keep phone numbers as text
    });
  }
  return sheet;
}

// Stops a value such as "=IMPORTXML(...)" or "+91..." being read as a formula.
function clean(value) {
  const text = String(value == null ? "" : value).trim().slice(0, 5000);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
