/**
 * Google Apps Script that receives website registrations and appends them to this sheet.
 *
 * Setup (one time):
 * 1. Create a Google Sheet. Open Extensions → Apps Script, delete the sample code, paste this file.
 * 2. Optional: set SECRET below to a random string (leave it "" to accept every submission).
 * 3. Deploy → New deployment → type "Web app".
 *    Execute as: Me. Who has access: Anyone. Deploy, authorise, and copy the Web app URL (ends in /exec).
 * 4. In Vercel → Project → Settings → Environment Variables, add (Production and Preview):
 *      SHEET_WEBHOOK_URL    = the /exec URL
 *      SHEET_WEBHOOK_SECRET = the same SECRET value (only if you set one)
 *    Then redeploy so the site picks them up.
 *
 * After editing this script, use Deploy → Manage deployments → Edit → New version (the URL stays the same).
 */

const SECRET = "";
const SHEET_NAME = "Registrations";
const HEADERS = [
  "Submitted at", "Student name", "Email", "WhatsApp", "Parent's number",
  "School", "Passing year", "State", "City", "Stream",
];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (SECRET && d.secret !== SECRET) return reply({ ok: false, error: "unauthorised" });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet();
      sheet.appendRow([
        new Date(d.submittedAt || Date.now()),
        d.name, d.email,
        // keep leading digits intact and stop Sheets treating numbers as formulas
        "'" + d.whatsapp, "'" + d.parent,
        d.school, d.passingYear, d.state, d.city, d.stream,
      ].map(clean));
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Blocks formula injection: values starting with = + - @ are stored as text. */
function clean(v) {
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
