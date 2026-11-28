/**
 * Google Apps Script that receives website registrations and appends them to this sheet (the master sheet).
 * Each mobile number can register only once (it is the number the student verifies with an OTP; emails may repeat):
 * GET ?action=exists&mobile=… tells the site whether the number is already in the sheet (checked before an OTP is
 * sent), and a POST for a number that is already there is refused.
 *
 * Partner institutes: the "Institutes" tab lists each institute's code, name and its own spreadsheet. A student
 * who arrives through an institute's link (…/National-Commerce-Olympiad-2026/?ref=<code>) is saved here with that
 * institute's name in the "Referral Institution" column and is also copied into the institute's spreadsheet. Everyone
 * else is saved with "Direct". The site's admin page (/National-Commerce-Olympiad-2026/admin) adds institutes and
 * switches them on or off through this script; adding one creates its spreadsheet in the Drive of the account that
 * deployed the script, and shares it view-only with the institute's email when one is given.
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
 * If Google asks to authorise again (creating and sharing institute spreadsheets needs it), allow it.
 * Missing headers ("Email verified" in K) are filled in by the script on the next registration. The "Referral Institution",
 * "Mobile verified" and "Mobile verified at" columns are found by their headings; when one isn't there, the script adds it
 * after the last used column (existing columns are left alone). "Email verified" stays for registrations made before
 * mobile OTP; new registrations fill the two mobile columns instead.
 */

const SECRET = "";
const SHEET_NAME = "Registrations";
const HEADERS = [
  "Submitted at", "Student name", "Email", "WhatsApp", "Parent's number",
  "School", "Passing year", "State", "City", "Stream", "Email verified",
];
// An institute's own spreadsheet gets the same columns; the master sheet also has a "Referral Institution" column (see instituteColumn).
const INSTITUTE_HEADER = "Referral Institution";
const MOBILE_VERIFIED_HEADER = "Mobile verified";
const MOBILE_VERIFIED_AT_HEADER = "Mobile verified at";
const INSTITUTE_HEADERS = HEADERS.concat([MOBILE_VERIFIED_HEADER, MOBILE_VERIFIED_AT_HEADER]);

const MOBILE_COLUMN = 4;
const DIRECT = "Direct";

const INSTITUTES_SHEET = "Institutes";
const INSTITUTES_HEADERS = ["Code", "Institute", "Sheet URL", "Sheet ID", "Contact email", "Active", "Added at"];
const CODE = /^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/;

function doGet(e) {
  try {
    const p = e.parameter;
    if (SECRET && p.secret !== SECRET) return reply({ ok: false, error: "unauthorised" });
    if (p.action === "exists") {
      const taken = takenField(getSheet(), p.mobile);
      return reply({ ok: true, exists: !!taken, field: taken });
    }
    if (p.action === "institute") {
      const inst = findInstitute(p.ref);
      return reply({ ok: true, institute: inst && inst.active ? { code: inst.code, name: inst.name } : null });
    }
    if (p.action === "institutes") return reply({ ok: true, institutes: listInstitutes() });
    return reply({ ok: false, error: "unknown action" });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (SECRET && d.secret !== SECRET) return reply({ ok: false, error: "unauthorised" });

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      if (d.action === "addInstitute") return reply(addInstitute(d.name, d.email));
      if (d.action === "setInstituteActive") return reply(setInstituteActive(d.code, d.active === true));
      if (d.action && d.action !== "register") return reply({ ok: false, error: "unknown action" });
      return reply(register(d));
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

/** Saves one registration to the master sheet and, when it came through an active institute, to that institute's sheet. */
function register(d) {
  const sheet = getSheet();
  // Checked again under the lock so two submits at once can't both get in.
  const taken = takenField(sheet, d.whatsapp);
  if (taken) return { ok: false, error: "duplicate", field: taken };

  const found = d.ref ? findInstitute(d.ref) : null;
  const inst = found && found.active ? found : null;
  const row = [
    new Date(d.submittedAt || Date.now()),
    d.name, d.email,
    // keep leading digits intact and stop Sheets treating numbers as formulas
    "'" + d.whatsapp, "'" + d.parent,
    d.school, d.passingYear, d.state, d.city, d.stream, d.verified || "",
  ].map(clean);
  const verified = clean(d.mobileVerified || "");
  const verifiedAt = d.mobileVerifiedAt ? new Date(d.mobileVerifiedAt) : "";

  // Columns found by heading, so their place in the master sheet doesn't matter.
  const extra = [
    [instituteColumn(sheet), clean(inst ? inst.name : DIRECT)],
    [headerColumn(sheet, MOBILE_VERIFIED_HEADER), verified],
    [headerColumn(sheet, MOBILE_VERIFIED_AT_HEADER), verifiedAt],
  ];
  const width = Math.max(row.length, ...extra.map((e) => e[0]));
  const full = row.concat(Array(width - row.length).fill(""));
  extra.forEach(([column, value]) => (full[column - 1] = value));
  sheet.appendRow(full);

  // The master row is what counts; a failure here is logged and doesn't refuse the student.
  if (inst) {
    try {
      instituteSheet(inst.sheetId).appendRow(row.concat([verified, verifiedAt]));
    } catch (err) {
      console.error("could not copy registration to institute sheet " + inst.code + ": " + err);
    }
  }
  return { ok: true, institute: inst ? inst.name : DIRECT };
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  ensureHeaders(sheet, HEADERS);
  return sheet;
}

/** Writes the header row on an empty sheet, or fills in header cells that were added after the sheet was made. */
function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    return;
  }
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  headers.forEach((h, i) => {
    if (current[i] === "") sheet.getRange(1, i + 1).setValue(h).setFontWeight("bold");
  });
}

/** 1-based column headed "Referral Institution" in the master sheet; added after the last used column when it isn't there yet. */
function instituteColumn(sheet) {
  return headerColumn(sheet, INSTITUTE_HEADER);
}

/** 1-based column with this heading in the master sheet; added after the last used column when it isn't there yet. */
function headerColumn(sheet, title) {
  const lastColumn = Math.max(sheet.getLastColumn(), HEADERS.length);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const found = headers.findIndex((h) => String(h).trim().toLowerCase() === title.toLowerCase());
  if (found >= 0) return found + 1;
  let column = lastColumn;
  while (column > HEADERS.length && String(headers[column - 1]).trim() === "") column--;
  column += 1;
  sheet.getRange(1, column).setValue(title).setFontWeight("bold");
  return column;
}

/** "mobile" when the mobile number is already registered, otherwise "". */
function takenField(sheet, mobile) {
  return inColumn(sheet, MOBILE_COLUMN, mobile) ? "mobile" : "";
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

// ---- Institutes ----

function institutesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(INSTITUTES_SHEET) || ss.insertSheet(INSTITUTES_SHEET);
  ensureHeaders(sheet, INSTITUTES_HEADERS);
  return sheet;
}

/** Every institute row as an object; `row` is its 1-based row number in the Institutes tab. */
function readInstitutes() {
  const sheet = institutesSheet();
  if (sheet.getLastRow() < 2) return [];
  return sheet
    .getRange(2, 1, sheet.getLastRow() - 1, INSTITUTES_HEADERS.length)
    .getValues()
    .map((r, i) => ({
      row: i + 2,
      code: String(r[0]).trim().toLowerCase(),
      name: String(r[1]).trim(),
      sheetUrl: String(r[2]),
      sheetId: String(r[3]),
      email: String(r[4]),
      active: r[5] === true || String(r[5]).toLowerCase() === "yes",
      addedAt: r[6] instanceof Date ? r[6].toISOString() : String(r[6]),
    }))
    .filter((inst) => inst.code);
}

function findInstitute(code) {
  code = String(code || "").trim().toLowerCase();
  if (!CODE.test(code)) return null;
  return readInstitutes().find((inst) => inst.code === code) || null;
}

/** Institutes for the admin page, each with how many students registered through it (from the master sheet). */
function listInstitutes() {
  const sheet = getSheet();
  const counts = {};
  if (sheet.getLastRow() >= 2) {
    sheet
      .getRange(2, instituteColumn(sheet), sheet.getLastRow() - 1, 1)
      .getValues()
      .forEach((r) => {
        const name = String(r[0]).trim();
        if (name) counts[name] = (counts[name] || 0) + 1;
      });
  }
  return readInstitutes().map((inst) => ({
    code: inst.code,
    name: inst.name,
    sheetUrl: inst.sheetUrl,
    email: inst.email,
    active: inst.active,
    addedAt: inst.addedAt,
    registrations: counts[inst.name] || 0,
  }));
}

/** Adds an institute, creates its spreadsheet and shares it view-only with `email` when given. */
function addInstitute(name, email) {
  name = String(name || "").trim().replace(/\s+/g, " ");
  email = String(email || "").trim();
  if (!name || name.length > 120) return { ok: false, error: "Please enter the institute's name (up to 120 characters)." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (name.toLowerCase() === DIRECT.toLowerCase()) return { ok: false, error: "That name is reserved." };

  const existing = readInstitutes();
  if (existing.some((inst) => inst.name.toLowerCase() === name.toLowerCase())) {
    return { ok: false, error: "An institute with this name already exists." };
  }
  const base = slug(name) || "institute";
  let code = base;
  for (let n = 2; existing.some((inst) => inst.code === code); n++) code = base.slice(0, 55) + "-" + n;

  const ss = SpreadsheetApp.create(name + " · National Commerce Olympiad 2026 registrations");
  // Same locale and time zone as the master sheet, so dates read the same in both.
  const master = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetLocale(master.getSpreadsheetLocale());
  ss.setSpreadsheetTimeZone(master.getSpreadsheetTimeZone());
  const sheet = ss.getSheets()[0].setName(SHEET_NAME);
  ensureHeaders(sheet, INSTITUTE_HEADERS);
  let shareError = "";
  if (email) {
    try {
      ss.addViewer(email);
    } catch (err) {
      shareError = "The sheet was created but couldn't be shared with " + email + ". Share it from Google Sheets.";
    }
  }

  const addedAt = new Date();
  institutesSheet().appendRow([code, clean(name), ss.getUrl(), ss.getId(), clean(email), "Yes", addedAt]);
  return {
    ok: true,
    warning: shareError,
    institute: { code, name, sheetUrl: ss.getUrl(), email, active: true, addedAt: addedAt.toISOString(), registrations: 0 },
  };
}

function setInstituteActive(code, active) {
  const inst = findInstitute(code);
  if (!inst) return { ok: false, error: "Institute not found." };
  institutesSheet().getRange(inst.row, 6).setValue(active ? "Yes" : "No");
  return { ok: true };
}

/** The Registrations tab of an institute's spreadsheet, with its header row. */
function instituteSheet(id) {
  const ss = SpreadsheetApp.openById(id);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  ensureHeaders(sheet, INSTITUTE_HEADERS);
  return sheet;
}

/** "St. Xavier's College, Mumbai" → "st-xaviers-college-mumbai". */
function slug(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

/** Blocks formula injection: values starting with = + - @ are stored as text. */
function clean(v) {
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
