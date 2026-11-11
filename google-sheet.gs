/**
 * Google Apps Script that receives website registrations and appends them to this sheet.
 * Each email and each mobile number can register only once: GET ?action=exists&email=…&mobile=… tells the
 * site whether either is already in the sheet (checked before an OTP is sent), and a POST for an email or
 * mobile number that is already there is refused.
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
 * A sheet created before the "Email verified" column existed needs that header typed into column K by hand.
 */

const SECRET = "";
const SHEET_NAME = "Registrations";
const HEADERS = [
  "Submitted at", "Student name", "Email", "Mobile", "Parent's number",
  "School", "Passing year", "State", "City", "Stream", "Email verified",
];

const EMAIL_COLUMN = 3;
const MOBILE_COLUMN = 4;

function doGet(e) {
  try {
    const p = e.parameter;
    if (SECRET && p.secret !== SECRET) return reply({ ok: false, error: "unauthorised" });
    if (p.action !== "exists") return reply({ ok: false, error: "unknown action" });
    const taken = takenField(getSheet(), p.email, p.mobile);
    return reply({ ok: true, exists: !!taken, field: taken });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (SECRET && d.secret !== SECRET) return reply({ ok: false, error: "unauthorised" });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet();
      // Checked again under the lock so two submits at once can't both get in.
      const taken = takenField(sheet, d.email, d.whatsapp);
      if (taken) return reply({ ok: false, error: "duplicate", field: taken });
      sheet.appendRow([
        new Date(d.submittedAt || Date.now()),
        d.name, d.email,
        // keep leading digits intact and stop Sheets treating numbers as formulas
        "'" + d.whatsapp, "'" + d.parent,
        d.school, d.passingYear, d.state, d.city, d.stream, d.verified || "",
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

/** "email" or "mobile" when that value is already registered, otherwise "". */
function takenField(sheet, email, mobile) {
  if (inColumn(sheet, EMAIL_COLUMN, email)) return "email";
  if (inColumn(sheet, MOBILE_COLUMN, mobile)) return "mobile";
  return "";
}

/** True when the value (any letter case, whole cell) is already in that column below the header. */
function inColumn(sheet, column, value) {
  value = String(value || "").trim();
  if (!value || sheet.getLastRow() < 2) return false;
  return !!sheet
    .getRange(2, column, sheet.getLastRow() - 1, 1)
    .createTextFinder(value)
    .matchCase(false)
    .matchEntireCell(true)
    .findNext();
}

/** Blocks formula injection: values starting with = + - @ are stored as text. */
function clean(v) {
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
