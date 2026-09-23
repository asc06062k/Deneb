import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rows = [
  ["KPI-001", "ยอดขายช่องทางหน้าร้าน", 60, 100, 58, 0, 70, 90, 100, 1, "THB", "ต่ำกว่า 70% ของเป้าหมาย"],
  ["KPI-002", "ยอดขายออนไลน์", 70, 100, 65, 0, 70, 90, 100, 2, "THB", "ขอบ Warning ที่ 70%"],
  ["KPI-003", "อัตราส่งมอบตรงเวลา", 89999, 100000, 88000, 0, 70000, 90000, 100000, 3, "%", "89.999% ต้องแสดง <90.0%"],
  ["KPI-004", "คะแนนความพึงพอใจ", 90, 100, 88, 0, 70, 90, 100, 4, "%", "ขอบ Good ที่ 90%"],
  ["KPI-005", "กำไรขั้นต้น", 100, 100, 96, 0, 70, 90, 100, 5, "THB", "Actual เท่ากับ Target"],
  ["KPI-006", "จำนวนสมาชิกใหม่", 125, 100, 92, 0, 70, 90, 100, 6, "คน", "Actual สูงกว่า Target"],
  ["KPI-007", "อัตราเคลมสินค้า", 50, 0, 40, 0, 0, 0, 0, 7, "%", "Target เป็นศูนย์; Achievement เป็น N/A"],
  ["KPI-008", "จำนวนคำสั่งซื้อที่รอส่ง", null, 100, 30, 0, 70, 90, 100, 8, "รายการ", "Actual Blank; ไม่วาด bar"],
  ["KPI-009", "ต้นทุนการจัดส่ง", 80, null, 75, 0, 70, 90, 100, 9, "THB", "Target Blank; ไม่วาด marker"],
  ["KPI-010", "รายได้จากลูกค้าองค์กรที่มีชื่อยาวเพื่อทดสอบการจัดวาง", 1234567890.5, 1500000000, 1100000000, 0, 1050000000, 1350000000, 1500000000, 10, "THB", "ค่าขนาดใหญ่และ Category ยาว 80 อักขระ"],
  ["KPI-011", "การเปลี่ยนแปลงสุทธิ", -20, 100, -15, -50, 70, 90, 100, 11, "%", "Actual ติดลบ; bar อยู่ซ้ายศูนย์"],
  ["KPI-012", "เป้าหมายติดลบที่ไม่รองรับ", -80, -100, -70, -120, -100, -90, -80, 12, "หน่วย", "Target ติดลบ; สถานะ Target N/A"]
];
const headers = ["KPI_ID","Category","Actual","Target","Previous","Range_Min","Range_Low","Range_Mid","Range_High","Sort_Order","Unit","Tooltip_Detail"];
const workbook = Workbook.create();
const sheet = workbook.worksheets.add("KPI_Data");
sheet.showGridLines = false;
sheet.getRange("A1:L13").values = [headers, ...rows];
sheet.getRange("A1:L1").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, wrapText: true, verticalAlignment: "center" };
sheet.getRange("A2:L13").format.font = { name: "Arial", size: 10, color: "#1F2937" };
sheet.getRange("C2:I13").format.numberFormat = "#,##0.0";
sheet.getRange("J2:J13").format.numberFormat = "0";
sheet.getRange("A1:L13").format.borders = { preset: "insideHorizontal", style: "thin", color: "#D9E2F3" };
sheet.getRange("A1:L13").format.autofitColumns();
sheet.getRange("A:A").format.columnWidth = 14;
sheet.getRange("B:B").format.columnWidth = 42;
sheet.getRange("L:L").format.columnWidth = 34;
sheet.getRange("A1:L13").format.autofitRows();
sheet.freezePanes.freezeRows(1);
const qa = workbook.worksheets.add("QA_Expected");
qa.showGridLines = false;
qa.getRange("A1:D13").values = [
  ["KPI_ID","Expected_Status","Scenario","Range_Validity"],
  ["KPI-001","Bad","Actual < 70%", "Valid"],
  ["KPI-002","Warning","Actual = 70%", "Valid"],
  ["KPI-003","Warning","89.999% label <90.0%", "Valid"],
  ["KPI-004","Good","Actual = 90%", "Valid"],
  ["KPI-005","Good","Actual = Target", "Valid"],
  ["KPI-006","Good","Actual > Target", "Valid"],
  ["KPI-007","Target N/A","Target = 0", "Valid"],
  ["KPI-008","Actual Missing","Actual Blank", "Valid"],
  ["KPI-009","Target N/A","Target Blank", "Valid"],
  ["KPI-010","Good","Large value / long category", "Valid"],
  ["KPI-011","Bad","Actual negative / Target positive", "Valid"],
  ["KPI-012","Target N/A","Target negative unsupported", "Valid"]
];
qa.getRange("A1:D1").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
qa.getRange("A1:D13").format.font = { name: "Arial", size: 10, color: "#1F2937" };
qa.getRange("A1:D13").format.autofitColumns();
qa.getRange("C:C").format.columnWidth = 34;
qa.freezePanes.freezeRows(1);
const outDir = "D:/DATA/Deneb/eBook/data";
await fs.mkdir(outDir, { recursive: true });
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(`${outDir}/Deneb_Workshop_Data.xlsx`);
const csv = [headers, ...rows].map(r => r.map(v => v === null ? "" : typeof v === "string" && /[",\n]/.test(v) ? `"${v.replaceAll('"','""')}"` : String(v)).join(",")).join("\n") + "\n";
await fs.writeFile(`${outDir}/Deneb_Workshop_Data.csv`, csv, "utf8");
const preview = await workbook.render({ sheetName: "KPI_Data", range: "A1:L13", scale: 1, format: "png" });
await fs.writeFile(`${outDir}/Deneb_Workshop_Data_preview.png`, new Uint8Array(await preview.arrayBuffer()));
console.log(JSON.stringify({ xlsx: `${outDir}/Deneb_Workshop_Data.xlsx`, csv: `${outDir}/Deneb_Workshop_Data.csv`, rows: rows.length }));
