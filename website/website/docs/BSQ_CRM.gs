/**
 * BSQ (Brilliant Star Quartz) Financial Advisor CRM
 * Google Apps Script - Full CRM Setup
 *
 * Features:
 * - 5-tab CRM: Dashboard, All Leads, Assessment, Calendly, Chatbot
 * - Webhook receiver via doPost() for n8n (Assessment leads)
 * - Helper functions for Calendly and Chatbot lead ingestion
 * - PRU red (#ed1b2e) headers, dark navy (#1a1a2e) dashboard
 * - Data validation dropdowns, frozen headers, column protection
 */

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const COLOR = {
  PRU_RED:       '#ed1b2e',
  DARK_NAVY:     '#1a1a2e',
  WHITE:         '#ffffff',
  LIGHT_GRAY:    '#f5f5f5',
  LIGHT_RED:     '#fde8ea',
  LIGHT_NAVY:    '#e8e8f5',
  GOLD:          '#f5a623',
  GREEN:         '#27ae60',
  LIGHT_GREEN:   '#eafaf1',
  DARK_TEXT:     '#1a1a2e',
  MID_GRAY:      '#888888',
  BORDER_GRAY:   '#dddddd',
};

const FONT = {
  MAIN:  'Inter',
  MONO:  'Roboto Mono',
};

const SHEET_NAMES = {
  DASHBOARD:  '📊 Dashboard',
  ALL_LEADS:  '🗂️ All Leads',
  ASSESSMENT: '📋 Assessment',
  CALENDLY:   '📅 Calendly',
  CHATBOT:    '🤖 Chatbot',
};

const FOLLOW_UP_OPTIONS = [
  'New',
  'Contacted',
  'Meeting Booked',
  'Proposal Sent',
  'Converted ✅',
  'Not Interested ❌',
];

// Column indices (1-based) for All Leads / Assessment sheets
const ALL_LEADS_COLS = {
  TIMESTAMP:        1,
  SOURCE:           2,
  NAME:             3,
  CONTACT_TYPE:     4,
  CONTACT:          5,
  SCORE:            6,
  RISK_LEVEL:       7,
  STATUS:           8,
  GAPS:             9,
  GAP_COUNT:        10,
  APPOINTMENT_DATE: 11,
  FOLLOW_UP:        12,
  NOTES:            13,
  LAST_UPDATED:     14,
};

const ASSESSMENT_COLS = {
  TIMESTAMP:        1,
  SOURCE:           2,
  NAME:             3,
  CONTACT_TYPE:     4,
  CONTACT:          5,
  SCORE:            6,
  RISK_LEVEL:       7,
  STATUS:           8,
  GAPS:             9,
  GAP_COUNT:        10,
  APPOINTMENT_DATE: 11,
  FOLLOW_UP:        12,
  NOTES:            13,
  LAST_UPDATED:     14,
};

const CALENDLY_COLS = {
  TIMESTAMP:        1,
  NAME:             2,
  EMAIL:            3,
  PHONE:            4,
  EVENT_TYPE:       5,
  APPT_DATETIME:    6,
  DURATION:         7,
  FOLLOW_UP:        8,
  NOTES:            9,
  LAST_UPDATED:     10,
};

const CHATBOT_COLS = {
  TIMESTAMP:        1,
  NAME:             2,
  CONTACT_TYPE:     3,
  CONTACT:          4,
  QUERY_INTENT:     5,
  APPT_BOOKED:      6,
  APPT_DATE:        7,
  FOLLOW_UP:        8,
  NOTES:            9,
  LAST_UPDATED:     10,
};

// ─── ENTRY POINTS ───────────────────────────────────────────────────────────

/**
 * Run this ONCE to build the entire CRM spreadsheet.
 * Call from the Apps Script editor: setupCRM()
 */
function setupCRM() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Remove any existing CRM sheets (clean rebuild)
  _removeExistingSheets(ss);

  // Build sheets in reverse order so Dashboard ends up first
  const chatbotSheet    = _buildChatbotSheet(ss);
  const calendlySheet   = _buildCalendlySheet(ss);
  const assessmentSheet = _buildAssessmentSheet(ss);
  const allLeadsSheet   = _buildAllLeadsSheet(ss);
  const dashboardSheet  = _buildDashboardSheet(ss);

  // Reorder tabs
  ss.setActiveSheet(dashboardSheet);
  ss.moveActiveSheet(1);
  ss.setActiveSheet(allLeadsSheet);
  ss.moveActiveSheet(2);
  ss.setActiveSheet(assessmentSheet);
  ss.moveActiveSheet(3);
  ss.setActiveSheet(calendlySheet);
  ss.moveActiveSheet(4);
  ss.setActiveSheet(chatbotSheet);
  ss.moveActiveSheet(5);

  // Protect header rows on data sheets
  _protectHeaders(assessmentSheet, 1);
  _protectHeaders(allLeadsSheet,   1);
  _protectHeaders(calendlySheet,   1);
  _protectHeaders(chatbotSheet,    1);

  SpreadsheetApp.flush();
  Logger.log('✅ BSQ CRM setup complete.');
}

// ─── WEBHOOK RECEIVER (n8n → Assessment + All Leads) ────────────────────────

/**
 * doPost: Receives POST requests from n8n webhook.
 * Deploy this script as a Web App (Execute as: Me, Access: Anyone).
 *
 * Expected JSON payload fields:
 *   timestamp, name, contactType, contact,
 *   score, statusLabel, riskLevel, gapCount, gaps, source
 */
function doPost(e) {
  try {
    let payload;

    // Support both JSON body and form-encoded
    if (e.postData && e.postData.type === 'application/json') {
      payload = JSON.parse(e.postData.contents);
    } else if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter || {};
    }

    const result = _appendAssessmentLead(payload);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, rowId: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet: Health-check endpoint.
 * Visit the Web App URL in a browser to confirm it's live.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status:  'BSQ CRM webhook is live ✅',
      version: '1.0.0',
      sheets:  Object.values(SHEET_NAMES),
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── PUBLIC LEAD INGESTION FUNCTIONS ────────────────────────────────────────

/**
 * addCalendlyLead: Call this from a Calendly webhook integration.
 *
 * @param {Object} data - Calendly event payload
 *   data.timestamp       {string}  ISO date string
 *   data.name            {string}
 *   data.email           {string}
 *   data.phone           {string}
 *   data.eventType       {string}  e.g. "30-Minute Financial Consult"
 *   data.appointmentDate {string}  ISO date/time of booking
 *   data.duration        {string}  e.g. "30 min"
 */
function addCalendlyLead(data) {
  const ss             = SpreadsheetApp.getActiveSpreadsheet();
  const calendlySheet  = ss.getSheetByName(SHEET_NAMES.CALENDLY);
  const allLeadsSheet  = ss.getSheetByName(SHEET_NAMES.ALL_LEADS);
  const now            = new Date();
  const ts             = data.timestamp ? new Date(data.timestamp) : now;

  // Append to Calendly tab
  const calendlyRow = [
    ts,
    data.name            || '',
    data.email           || '',
    data.phone           || '',
    data.eventType       || 'Consultation',
    data.appointmentDate ? new Date(data.appointmentDate) : '',
    data.duration        || '',
    'New',               // Follow Up default
    '',                  // Notes
    now,                 // Last Updated
  ];
  const cRow = calendlySheet.getLastRow() + 1;
  calendlySheet.appendRow(calendlyRow);
  _styleDataRow(calendlySheet, cRow, 10);
  _applyFollowUpValidation(calendlySheet, cRow, CALENDLY_COLS.FOLLOW_UP);

  // Append to All Leads tab
  const allLeadsRow = [
    ts,
    'Calendly',
    data.name            || '',
    'Email',
    data.email           || data.phone || '',
    '',                  // Score
    '',                  // Risk Level
    '',                  // Status
    '',                  // Gaps
    '',                  // Gap Count
    data.appointmentDate ? new Date(data.appointmentDate) : '',
    'New',               // Follow Up default
    '',                  // Notes
    now,                 // Last Updated
  ];
  const aRow = allLeadsSheet.getLastRow() + 1;
  allLeadsSheet.appendRow(allLeadsRow);
  _styleDataRow(allLeadsSheet, aRow, 14);
  _applyFollowUpValidation(allLeadsSheet, aRow, ALL_LEADS_COLS.FOLLOW_UP);

  SpreadsheetApp.flush();
  Logger.log('Calendly lead added: ' + data.name);
  return aRow;
}

/**
 * addChatbotLead: Call this from a chatbot webhook integration.
 *
 * @param {Object} data - Chatbot session payload
 *   data.timestamp      {string}  ISO date string
 *   data.name           {string}
 *   data.contactType    {string}  "Email" | "Phone" | "WhatsApp"
 *   data.contact        {string}
 *   data.queryIntent    {string}  e.g. "Retirement Planning"
 *   data.apptBooked     {boolean} Whether an appointment was booked
 *   data.apptDate       {string}  ISO date if booked
 */
function addChatbotLead(data) {
  const ss            = SpreadsheetApp.getActiveSpreadsheet();
  const chatbotSheet  = ss.getSheetByName(SHEET_NAMES.CHATBOT);
  const allLeadsSheet = ss.getSheetByName(SHEET_NAMES.ALL_LEADS);
  const now           = new Date();
  const ts            = data.timestamp ? new Date(data.timestamp) : now;
  const apptBooked    = data.apptBooked ? 'Yes' : 'No';

  // Append to Chatbot tab
  const chatbotRow = [
    ts,
    data.name         || '',
    data.contactType  || '',
    data.contact      || '',
    data.queryIntent  || '',
    apptBooked,
    data.apptDate ? new Date(data.apptDate) : '',
    'New',            // Follow Up default
    '',               // Notes
    now,              // Last Updated
  ];
  const cRow = chatbotSheet.getLastRow() + 1;
  chatbotSheet.appendRow(chatbotRow);
  _styleDataRow(chatbotSheet, cRow, 10);
  _applyFollowUpValidation(chatbotSheet, cRow, CHATBOT_COLS.FOLLOW_UP);

  // Append to All Leads tab
  const allLeadsRow = [
    ts,
    'Chatbot',
    data.name         || '',
    data.contactType  || '',
    data.contact      || '',
    '',               // Score
    '',               // Risk Level
    '',               // Status (query intent stored in Gaps col for context)
    data.queryIntent  || '',
    '',               // Gap Count
    data.apptDate ? new Date(data.apptDate) : '',
    'New',            // Follow Up default
    '',               // Notes
    now,              // Last Updated
  ];
  const aRow = allLeadsSheet.getLastRow() + 1;
  allLeadsSheet.appendRow(allLeadsRow);
  _styleDataRow(allLeadsSheet, aRow, 14);
  _applyFollowUpValidation(allLeadsSheet, aRow, ALL_LEADS_COLS.FOLLOW_UP);

  SpreadsheetApp.flush();
  Logger.log('Chatbot lead added: ' + data.name);
  return aRow;
}

// ─── PRIVATE: ASSESSMENT LEAD APPEND ────────────────────────────────────────

/**
 * Appends an assessment lead to both Assessment and All Leads tabs.
 * Called by doPost() with the parsed n8n payload.
 */
function _appendAssessmentLead(payload) {
  const ss             = SpreadsheetApp.getActiveSpreadsheet();
  const assessSheet    = ss.getSheetByName(SHEET_NAMES.ASSESSMENT);
  const allLeadsSheet  = ss.getSheetByName(SHEET_NAMES.ALL_LEADS);
  const now            = new Date();
  const ts             = payload.timestamp ? new Date(payload.timestamp) : now;

  const rowData = [
    ts,
    payload.source       || 'Assessment',
    payload.name         || '',
    payload.contactType  || '',
    payload.contact      || '',
    payload.score        !== undefined ? Number(payload.score) : '',
    payload.riskLevel    || '',
    payload.statusLabel  || '',
    payload.gaps         || '',
    payload.gapCount     !== undefined ? Number(payload.gapCount) : '',
    '',                  // Appointment Date (to be filled manually or via Calendly)
    'New',               // Follow Up default
    '',                  // Notes
    now,                 // Last Updated
  ];

  // Append to Assessment sheet
  const aRow = assessSheet.getLastRow() + 1;
  assessSheet.appendRow(rowData);
  _styleDataRow(assessSheet, aRow, 14);
  _applyFollowUpValidation(assessSheet, aRow, ASSESSMENT_COLS.FOLLOW_UP);

  // Append to All Leads sheet (same structure)
  const alRow = allLeadsSheet.getLastRow() + 1;
  allLeadsSheet.appendRow(rowData);
  _styleDataRow(allLeadsSheet, alRow, 14);
  _applyFollowUpValidation(allLeadsSheet, alRow, ALL_LEADS_COLS.FOLLOW_UP);

  SpreadsheetApp.flush();
  Logger.log('Assessment lead added: ' + payload.name + ' (row ' + aRow + ')');
  return aRow;
}

// ─── SHEET BUILDERS ──────────────────────────────────────────────────────────

/**
 * Builds the Dashboard sheet with summary metrics.
 */
function _buildDashboardSheet(ss) {
  const sheet = ss.insertSheet(SHEET_NAMES.DASHBOARD);
  sheet.setTabColor(COLOR.DARK_NAVY);

  // ── Row 1: Main Header ──
  sheet.setRowHeight(1, 70);
  const titleCell = sheet.getRange('A1:F1');
  titleCell.merge()
    .setValue('BSQ — Brilliant Star Quartz')
    .setBackground(COLOR.DARK_NAVY)
    .setFontColor(COLOR.WHITE)
    .setFontFamily(FONT.MAIN)
    .setFontSize(22)
    .setFontWeight('bold')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center');

  // ── Row 2: Sub-header ──
  sheet.setRowHeight(2, 36);
  sheet.getRange('A2:F2')
    .merge()
    .setValue('CRM Dashboard — Financial Advisor Lead Tracker')
    .setBackground(COLOR.PRU_RED)
    .setFontColor(COLOR.WHITE)
    .setFontFamily(FONT.MAIN)
    .setFontSize(13)
    .setFontWeight('bold')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center');

  // ── Row 3: Spacer ──
  sheet.setRowHeight(3, 14);
  sheet.getRange('A3:F3').setBackground(COLOR.LIGHT_GRAY);

  // ── SECTION 1: Lead Source Summary (rows 4–9) ──
  _dashSectionHeader(sheet, 'A4:F4', '📥  LEADS BY SOURCE');

  const sourceHeaders = ['Source', 'Count', '', 'Metric', 'Value', ''];
  _dashSubHeader(sheet, 'A5:F5', sourceHeaders);

  const sourceRows = [
    ['Assessment',    `=COUNTA(INDIRECT("'${SHEET_NAMES.ASSESSMENT}'!A2:A"))`, '',
     'Total Leads',   `=COUNTA(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!A2:A"))`,  ''],
    ['Calendly',      `=COUNTA(INDIRECT("'${SHEET_NAMES.CALENDLY}'!A2:A"))`,   '',
     "This Week's",   `=COUNTIFS(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!A2:A"),">="&TODAY()-WEEKDAY(TODAY(),2)+1,INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!A2:A"),"<="&TODAY()-WEEKDAY(TODAY(),2)+7)`, ''],
    ['Chatbot',       `=COUNTA(INDIRECT("'${SHEET_NAMES.CHATBOT}'!A2:A"))`,    '',
     "Today's",       `=COUNTIF(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!A2:A"),">="&TODAY())-COUNTIF(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!A2:A"),">="&TODAY()+1)`, ''],
    ['Total',         `=B6+B7+B8`,                                             '',
     'Conversion %',  `=IFERROR(TEXT(COUNTIF(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!L2:L"),"Converted ✅")/COUNTA(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!A2:A")),"0.0%"),"0.0%")`, ''],
  ];

  sourceRows.forEach((row, i) => {
    const r = 6 + i;
    sheet.setRowHeight(r, 32);
    const range = sheet.getRange(r, 1, 1, 6);
    range.setValues([row]);

    // Style source name cell
    sheet.getRange(r, 1)
      .setFontFamily(FONT.MAIN).setFontSize(11)
      .setFontWeight(i === 3 ? 'bold' : 'normal')
      .setFontColor(i === 3 ? COLOR.PRU_RED : COLOR.DARK_TEXT)
      .setBackground(i % 2 === 0 ? COLOR.WHITE : COLOR.LIGHT_GRAY)
      .setVerticalAlignment('middle').setHorizontalAlignment('left');

    // Style count cell
    sheet.getRange(r, 2)
      .setFontFamily(FONT.MAIN).setFontSize(14)
      .setFontWeight('bold')
      .setFontColor(COLOR.PRU_RED)
      .setBackground(i % 2 === 0 ? COLOR.WHITE : COLOR.LIGHT_GRAY)
      .setVerticalAlignment('middle').setHorizontalAlignment('center');

    // Style metric name
    sheet.getRange(r, 4)
      .setFontFamily(FONT.MAIN).setFontSize(11)
      .setFontColor(COLOR.DARK_TEXT)
      .setBackground(i % 2 === 0 ? COLOR.LIGHT_NAVY : COLOR.WHITE)
      .setVerticalAlignment('middle').setHorizontalAlignment('left');

    // Style metric value
    sheet.getRange(r, 5)
      .setFontFamily(FONT.MAIN).setFontSize(14)
      .setFontWeight('bold')
      .setFontColor(COLOR.DARK_NAVY)
      .setBackground(i % 2 === 0 ? COLOR.LIGHT_NAVY : COLOR.WHITE)
      .setVerticalAlignment('middle').setHorizontalAlignment('center');
  });

  // ── Row 10: Spacer ──
  sheet.setRowHeight(10, 14);
  sheet.getRange('A10:F10').setBackground(COLOR.LIGHT_GRAY);

  // ── SECTION 2: Follow-Up Pipeline (rows 11–18) ──
  _dashSectionHeader(sheet, 'A11:F11', '🔄  FOLLOW-UP PIPELINE');

  const pipelineHeaders = ['Stage', 'Count', '% of Total', '', '', ''];
  _dashSubHeader(sheet, 'A12:F12', pipelineHeaders);

  const pipelineStages = [
    ['New',              `=COUNTIF(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!L2:L"),"New")`],
    ['Contacted',        `=COUNTIF(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!L2:L"),"Contacted")`],
    ['Meeting Booked',   `=COUNTIF(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!L2:L"),"Meeting Booked")`],
    ['Proposal Sent',    `=COUNTIF(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!L2:L"),"Proposal Sent")`],
    ['Converted ✅',     `=COUNTIF(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!L2:L"),"Converted ✅")`],
    ['Not Interested ❌', `=COUNTIF(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!L2:L"),"Not Interested ❌")`],
  ];

  const stageColors = [
    COLOR.LIGHT_GRAY, '#fff3cd', '#cfe2ff', '#d1ecf1', COLOR.LIGHT_GREEN, '#f8d7da',
  ];

  pipelineStages.forEach((stage, i) => {
    const r = 13 + i;
    sheet.setRowHeight(r, 32);
    const totalFormula = `=COUNTA(INDIRECT("'${SHEET_NAMES.ALL_LEADS}'!A2:A"))`;

    sheet.getRange(r, 1).setValue(stage[0])
      .setFontFamily(FONT.MAIN).setFontSize(11).setFontColor(COLOR.DARK_TEXT)
      .setBackground(stageColors[i]).setVerticalAlignment('middle');

    sheet.getRange(r, 2).setFormula(stage[1])
      .setFontFamily(FONT.MAIN).setFontSize(14).setFontWeight('bold')
      .setFontColor(COLOR.PRU_RED)
      .setBackground(stageColors[i]).setVerticalAlignment('middle').setHorizontalAlignment('center');

    sheet.getRange(r, 3)
      .setFormula(`=IFERROR(TEXT(${stage[1].replace('=','')}/${totalFormula.replace('=','')},"0.0%"),"—")`)
      .setFontFamily(FONT.MAIN).setFontSize(11).setFontColor(COLOR.MID_GRAY)
      .setBackground(stageColors[i]).setVerticalAlignment('middle').setHorizontalAlignment('center');
  });

  // ── Row 19: Spacer ──
  sheet.setRowHeight(19, 14);
  sheet.getRange('A19:F19').setBackground(COLOR.LIGHT_GRAY);

  // ── SECTION 3: Quick Links (row 20–22) ──
  _dashSectionHeader(sheet, 'A20:F20', '🔗  QUICK NAVIGATION');
  sheet.setRowHeight(21, 40);

  const navLabels = [
    ['🗂️ All Leads', '📋 Assessment', '📅 Calendly', '🤖 Chatbot', '', ''],
  ];
  sheet.getRange('A21:F21').setValues(navLabels);

  ['A21','B21','C21','D21'].forEach((cell, i) => {
    const colors = [COLOR.DARK_NAVY, COLOR.PRU_RED, '#2980b9', '#8e44ad'];
    sheet.getRange(cell)
      .setBackground(colors[i])
      .setFontColor(COLOR.WHITE)
      .setFontFamily(FONT.MAIN)
      .setFontSize(12)
      .setFontWeight('bold')
      .setVerticalAlignment('middle')
      .setHorizontalAlignment('center');
  });

  // Footer
  sheet.setRowHeight(22, 28);
  sheet.getRange('A22:F22').merge()
    .setValue('Last refreshed: ' + new Date().toLocaleString())
    .setFontFamily(FONT.MAIN).setFontSize(9).setFontColor(COLOR.MID_GRAY)
    .setHorizontalAlignment('right').setBackground(COLOR.LIGHT_GRAY);

  // Column widths
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 90);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(5, 110);
  sheet.setColumnWidth(6, 50);

  // Freeze top 2 rows
  sheet.setFrozenRows(2);
  sheet.setFrozenColumns(0);

  // Hide gridlines for a cleaner dashboard look
  sheet.setHiddenGridlines(true);

  return sheet;
}

/**
 * Builds the All Leads master sheet.
 */
function _buildAllLeadsSheet(ss) {
  const sheet = ss.insertSheet(SHEET_NAMES.ALL_LEADS);
  sheet.setTabColor(COLOR.DARK_NAVY);

  const headers = [
    'Timestamp', 'Source', 'Name', 'Contact Type', 'Contact',
    'Score', 'Risk Level', 'Status', 'Gaps', 'Gap Count',
    'Appointment Date', 'Follow Up', 'Notes', 'Last Updated',
  ];

  _buildHeaderRow(sheet, headers);
  sheet.setFrozenRows(1);

  // Column widths
  const widths = [160, 110, 160, 110, 200, 70, 110, 120, 280, 90, 155, 130, 200, 155];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  return sheet;
}

/**
 * Builds the Assessment sheet (auto-populated by n8n webhook).
 */
function _buildAssessmentSheet(ss) {
  const sheet = ss.insertSheet(SHEET_NAMES.ASSESSMENT);
  sheet.setTabColor(COLOR.PRU_RED);

  const headers = [
    'Timestamp', 'Source', 'Name', 'Contact Type', 'Contact',
    'Score', 'Risk Level', 'Status', 'Gaps', 'Gap Count',
    'Appointment Date', 'Follow Up', 'Notes', 'Last Updated',
  ];

  _buildHeaderRow(sheet, headers);
  sheet.setFrozenRows(1);

  // Column widths
  const widths = [160, 110, 160, 110, 200, 70, 110, 120, 280, 90, 155, 130, 200, 155];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  return sheet;
}

/**
 * Builds the Calendly bookings sheet.
 */
function _buildCalendlySheet(ss) {
  const sheet = ss.insertSheet(SHEET_NAMES.CALENDLY);
  sheet.setTabColor('#2980b9');

  const headers = [
    'Timestamp', 'Name', 'Email', 'Phone',
    'Event Type', 'Appointment Date/Time', 'Duration',
    'Follow Up', 'Notes', 'Last Updated',
  ];

  _buildHeaderRow(sheet, headers);
  sheet.setFrozenRows(1);

  // Column widths
  const widths = [160, 160, 220, 140, 200, 175, 90, 130, 200, 155];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  return sheet;
}

/**
 * Builds the Chatbot leads sheet.
 */
function _buildChatbotSheet(ss) {
  const sheet = ss.insertSheet(SHEET_NAMES.CHATBOT);
  sheet.setTabColor('#8e44ad');

  const headers = [
    'Timestamp', 'Name', 'Contact Type', 'Contact',
    'Query/Intent', 'Appointment Booked?', 'Appointment Date',
    'Follow Up', 'Notes', 'Last Updated',
  ];

  _buildHeaderRow(sheet, headers);
  sheet.setFrozenRows(1);

  // Column widths
  const widths = [160, 160, 110, 200, 220, 140, 155, 130, 200, 155];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  return sheet;
}

// ─── PRIVATE: STYLING HELPERS ────────────────────────────────────────────────

/**
 * Writes and styles a PRU-red header row on the given sheet.
 */
function _buildHeaderRow(sheet, headers) {
  sheet.setRowHeight(1, 42);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setValues([headers])
    .setBackground(COLOR.PRU_RED)
    .setFontColor(COLOR.WHITE)
    .setFontFamily(FONT.MAIN)
    .setFontSize(11)
    .setFontWeight('bold')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center')
    .setBorder(
      true, true, true, true, true, true,
      COLOR.WHITE,
      SpreadsheetApp.BorderStyle.SOLID
    );
}

/**
 * Applies alternating row background + font styling to a data row.
 */
function _styleDataRow(sheet, rowNum, colCount) {
  const isEven = (rowNum % 2 === 0);
  const bg     = isEven ? COLOR.WHITE : COLOR.LIGHT_GRAY;

  sheet.getRange(rowNum, 1, 1, colCount)
    .setBackground(bg)
    .setFontFamily(FONT.MAIN)
    .setFontSize(10)
    .setFontColor(COLOR.DARK_TEXT)
    .setVerticalAlignment('middle')
    .setBorder(
      false, false, true, false, false, false,
      COLOR.BORDER_GRAY,
      SpreadsheetApp.BorderStyle.SOLID
    );

  // Format Timestamp column
  sheet.getRange(rowNum, 1).setNumberFormat('dd/MM/yyyy HH:mm');

  // Format Last Updated column
  sheet.getRange(rowNum, colCount).setNumberFormat('dd/MM/yyyy HH:mm');
}

/**
 * Applies Follow Up dropdown validation to a specific cell.
 */
function _applyFollowUpValidation(sheet, rowNum, colNum) {
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(FOLLOW_UP_OPTIONS, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(rowNum, colNum).setDataValidation(rule);

  // Apply conditional formatting color to the Follow Up cell
  const cell = sheet.getRange(rowNum, colNum);
  const val  = cell.getValue();
  _colorFollowUpCell(cell, val);
}

/**
 * Colors a Follow Up cell based on its current value.
 */
function _colorFollowUpCell(cell, value) {
  const colorMap = {
    'New':               { bg: '#e3f2fd', fg: '#1565c0' },
    'Contacted':         { bg: '#fff8e1', fg: '#f57f17' },
    'Meeting Booked':    { bg: '#e8f5e9', fg: '#2e7d32' },
    'Proposal Sent':     { bg: '#ede7f6', fg: '#4527a0' },
    'Converted ✅':      { bg: '#c8e6c9', fg: '#1b5e20' },
    'Not Interested ❌': { bg: '#ffcdd2', fg: '#b71c1c' },
  };
  const colors = colorMap[value];
  if (colors) {
    cell.setBackground(colors.bg).setFontColor(colors.fg);
  }
}

/**
 * Adds a dark navy section header row to the Dashboard.
 */
function _dashSectionHeader(sheet, range, label) {
  const row = sheet.getRange(range).getRow();
  sheet.setRowHeight(row, 34);
  sheet.getRange(range)
    .merge()
    .setValue(label)
    .setBackground(COLOR.DARK_NAVY)
    .setFontColor(COLOR.WHITE)
    .setFontFamily(FONT.MAIN)
    .setFontSize(11)
    .setFontWeight('bold')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('left');
}

/**
 * Adds a light-gray sub-header row to the Dashboard.
 */
function _dashSubHeader(sheet, range, values) {
  const row = sheet.getRange(range).getRow();
  sheet.setRowHeight(row, 28);
  sheet.getRange(range)
    .setValues([values])
    .setBackground('#dde1ea')
    .setFontColor(COLOR.DARK_NAVY)
    .setFontFamily(FONT.MAIN)
    .setFontSize(10)
    .setFontWeight('bold')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center');
}

/**
 * Protects the header row of a sheet from edits by non-owners.
 */
function _protectHeaders(sheet, numRows) {
  const protection = sheet.getRange(1, 1, numRows, sheet.getMaxColumns())
    .protect()
    .setDescription('Header row — do not edit');

  // Remove all editors except the owner
  protection.removeEditors(protection.getEditors());
  if (protection.canDomainEdit()) {
    protection.setDomainEdit(false);
  }
}

/**
 * Removes all existing CRM sheets (for a clean rebuild).
 */
function _removeExistingSheets(ss) {
  const crmSheetNames = Object.values(SHEET_NAMES);
  const existing      = ss.getSheets();

  // Must keep at least one sheet, so insert a temp sheet first
  let tempSheet = null;
  if (existing.length <= crmSheetNames.length) {
    tempSheet = ss.insertSheet('__temp__');
  }

  existing.forEach(sheet => {
    if (crmSheetNames.includes(sheet.getName())) {
      ss.deleteSheet(sheet);
    }
  });

  if (tempSheet) {
    // We'll delete temp later after new sheets are created — handled by caller
    // Actually safe to leave; it will be removed below
    try { ss.deleteSheet(tempSheet); } catch (e) { /* ignore if only sheet */ }
  }
}

// ─── UTILITIES ───────────────────────────────────────────────────────────────

/**
 * Refreshes the Dashboard "Last refreshed" timestamp.
 * Set this on a time-based trigger (e.g. every 15 minutes) if desired.
 */
function refreshDashboardTimestamp() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.DASHBOARD);
  if (!sheet) return;
  sheet.getRange('A22:F22')
    .setValue('Last refreshed: ' + new Date().toLocaleString());
}

/**
 * Applies Follow Up validation to ALL existing data rows on a sheet.
 * Run this once after importing bulk data.
 *
 * @param {string} sheetName - One of the SHEET_NAMES values
 * @param {number} followUpCol - Column index (1-based) of the Follow Up column
 */
function applyValidationToExistingRows(sheetName, followUpCol) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    Logger.log('Sheet not found: ' + sheetName);
    return;
  }
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(FOLLOW_UP_OPTIONS, true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange(2, followUpCol, lastRow - 1, 1).setDataValidation(rule);
  Logger.log('Validation applied to ' + (lastRow - 1) + ' rows on ' + sheetName);
}

/**
 * Convenience: apply Follow Up validation to all data sheets at once.
 */
function applyAllValidations() {
  applyValidationToExistingRows(SHEET_NAMES.ALL_LEADS,  ALL_LEADS_COLS.FOLLOW_UP);
  applyValidationToExistingRows(SHEET_NAMES.ASSESSMENT, ASSESSMENT_COLS.FOLLOW_UP);
  applyValidationToExistingRows(SHEET_NAMES.CALENDLY,   CALENDLY_COLS.FOLLOW_UP);
  applyValidationToExistingRows(SHEET_NAMES.CHATBOT,    CHATBOT_COLS.FOLLOW_UP);
  Logger.log('All validations applied.');
}

/**
 * TEST: Simulates an n8n webhook POST with a sample Assessment payload.
 * Run from the Apps Script editor to verify sheet writes.
 */
function testAssessmentWebhook() {
  const samplePayload = {
    timestamp:   new Date().toISOString(),
    name:        'John Tan',
    contactType: 'Email',
    contact:     'john.tan@example.com',
    score:       62,
    statusLabel: 'Needs Attention',
    riskLevel:   'Moderate',
    gapCount:    3,
    gaps:        'Retirement, Emergency Fund, Life Insurance',
    source:      'BSQ Assessment',
  };

  const fakeEvent = {
    postData: {
      type:     'application/json',
      contents: JSON.stringify(samplePayload),
    },
  };

  const result = doPost(fakeEvent);
  Logger.log('Test result: ' + result.getContent());
}

/**
 * TEST: Simulates adding a Calendly booking.
 */
function testCalendlyLead() {
  addCalendlyLead({
    timestamp:       new Date().toISOString(),
    name:            'Sarah Lim',
    email:           'sarah.lim@example.com',
    phone:           '+65 9123 4567',
    eventType:       '30-Minute Financial Consultation',
    appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration:        '30 min',
  });
}

/**
 * TEST: Simulates adding a Chatbot lead.
 */
function testChatbotLead() {
  addChatbotLead({
    timestamp:    new Date().toISOString(),
    name:         'David Chen',
    contactType:  'WhatsApp',
    contact:      '+65 8765 4321',
    queryIntent:  'Retirement Planning',
    apptBooked:   false,
    apptDate:     '',
  });
}
