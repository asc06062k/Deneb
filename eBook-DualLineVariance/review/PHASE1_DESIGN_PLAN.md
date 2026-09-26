# Phase 1 Design Plan — Dual-Line Variance Chart eBook

สถานะ: **`PASS`** จาก Codex CLI รอบที่ 13 ([qa/PHASE1_CODEX_VERDICT_R13.md](../qa/PHASE1_CODEX_VERDICT_R13.md)) — ผ่านทุก Mandatory finding (M-01 ถึง M-23R) หลังแก้ไข 13 รอบ ประวัติการแก้ไขทั้งหมดอยู่ในหัวข้อ 0 ด้านล่างและไฟล์ `qa/PHASE1_CODEX_VERDICT*.md`

## 0.8 สรุปการแก้จากรอบ 10

| Finding | การแก้ |
| --- | --- |
| M-23 | ถอนคำกล่าวอ้างทั้งหมดว่า `Category=Blank` ทำให้ Area-click cross-filter ไปที่ `"(Blank)"` อย่างปลอดภัย — วิเคราะห์ใหม่ว่าจริงๆ จะ propagate `Filter_Key` หลายค่าผ่าน Relationship แบบ `Both` กลายเป็นกรองผิดหลาย Category ตัด "ลด opacity" ออกจาก mitigation list ทั้งหมด (ไม่มีผลต่อ hit-testing) ขยาย T18 ให้ตรวจผลจริงหลังคลิก Area ว่า Visual อื่นเหลือ Category ใดบ้าง และเพิ่ม Phase 2 gate บังคับเปลี่ยน interaction architecture (เช่น Advanced cross-filtering mode) ถ้าพบว่ากรองผิดจริง

## 0.7 สรุปการแก้จากรอบ 8

| Finding | การแก้ |
| --- | --- |
| M-19 | แก้ `PROJECT_PLAN.md` แถว "Category axis type" ให้ตรงกับ Design Lock: ใช้ `Plot_Position: quantitative` ทุก layer ไม่ใช่ `Category: nominal/ordinal` ตรงๆ ระบุเหตุผล (รองรับตำแหน่งเศษส่วนของจุดตัด) และที่มาของ Axis label (`labelExpr`) |
| M-20 | ขยาย T13 ให้มี Expected assertion ตรง 4 ข้อ: normalize ก่อน stamp, ทุก Row_Type ได้ค่าเดียวกัน, `DISTINCTCOUNT=1`, ไม่มีค่านอก allow-list หลงเหลือ |
| M-21 | เพิ่ม T34 (กว้าง-เตี้ย 1200×220) และ T35 (แคบ-สูง 320×700) ครอบคลุม aspect ratio ที่ Style guide สัญญาไว้ อัปเดต T25/T26 ให้รวมสองขนาดนี้ด้วย |

## 0.6 สรุปการแก้จากรอบ 7

| Finding | การแก้ |
| --- | --- |
| M-18 | เพิ่ม T33 ทดสอบกรณีตัด Category ฝั่งซ้าย (`row[i]`) ของ segment เดียวกับ T29 (คู่กัน) ยืนยันว่า Boundary/Crossing ทุกแถวถูกตัดออกทั้งหมดเมื่อฝั่งซ้ายถูกกรอง ต่างจาก T29 ที่ฝั่งขวาถูกกรองแล้ว fill ยังค้าง — ครบทั้งสองกรณีของกฎ `Filter_Key` แล้ว |

## 0.5 สรุปการแก้จากรอบ 6

| Finding | การแก้ |
| --- | --- |
| M-13 (ปิดสมบูรณ์) | เพิ่ม field-level assertion ตรงใน Expected ของ T04/T31/T32 (Row_Type, Plot_Actual, Plot_Reference ที่คาดหวังพอดี) ไม่ใช่แค่บรรยายไว้ก่อนตาราง |
| M-14 (ปิดสมบูรณ์) | แก้ข้อความ Business_Type stamp ให้รวม `Boundary` ด้วย ("Original, Boundary, และ Crossing") |
| M-16 | เพิ่ม T31, T32 เข้ารายการ static test ให้ตรงกับตาราง (เดิมตกหล่นจากข้อความสรุป) |
| M-17 | แยก Relationship key ออกเป็นคอลัมน์ใหม่ `Filter_Key` (ไม่ Blank, = key ของ `row[i]` ฝั่งซ้ายของ segnemt) คนละคอลัมน์จาก `Category` (ยัง Blank บน Fill-only เพื่อ mitigate M-01R) แก้ T29 ให้ตรงกับพฤติกรรม dangling-ฝั่งขวาที่ถูกต้องตามกลไกใหม่ |

## 0.4 สรุปการแก้จากรอบ 5

| Finding | การแก้ |
| --- | --- |
| M-13 (ส่วนที่เหลือ) | แก้ invariant ให้ถูกต้อง: Boundary ที่ปลาย `diff=0` มี `Plot_Actual=Plot_Reference` ได้อย่างถูกต้อง (ไม่ใช่ error) equality ไม่ใช่สิ่งที่พบได้เฉพาะ Crossing เท่านั้น เพิ่มเงื่อนไขให้ T04/T31/T32 ตรวจ zero-diff Boundary ด้วย |
| M-14 | เขียนตาราง Field contract ในหัวข้อ 5 ใหม่ให้มีคอลัมน์ Original/Boundary/Crossing แยกครบทุก field (เหมือนหัวข้อ 2.1 ไม่ใช่คนละชุดที่ขัดกัน) และแก้ relationship key ในหัวข้อ 2.2.1 ให้ Blank บนแถว Fill-only ทั้งสองประเภท ไม่ใช่ Blank เฉพาะ Crossing |
| M-15 | แก้ `PROJECT_PLAN.md` Phase 1 ข้อ 4 ให้เป็นการ Lock แนวทางเท่านั้น (ไม่ใช่พิสูจน์จริง) และย้าย prototype proof ทั้งสามไปเป็น **Phase 2 ข้อ 6 ใหม่** (บังคับก่อน Phase 2 PASS) พร้อม renumber ข้อ Codex review เป็นข้อ 7 |

## 0.3 สรุปการแก้จากรอบ 4

| Finding | การแก้ |
| --- | --- |
| M-01R | เพิ่ม `transform: filter Row_Type IN ('Boundary','Crossing')` บน Area layer จริง (เดิมไม่มี filter ทำให้ Original rows หลุดเข้าไปด้วย) ระบุชัดว่า `tooltip:null` ไม่ปิด click/context-menu event เป็นเพียงการลด UX สับสน ไม่ใช่กลไกป้องกัน selection |
| M-12 | แก้ Phase 1 ข้อ 3 ของ `PROJECT_PLAN.md` ที่ยังเขียน "Business_Type Blank หรือไม่ตรงกันระหว่างแถว" เป็น "ต้นทาง Blank/ไม่ตรง allow-list ก่อน stamp และ DISTINCTCOUNT=1 หลังสร้าง query" และแก้ Features กลุ่ม B ที่เขียน "fallback เมื่อไม่ผูก field" เป็น "ต้อง bind Column เสมอ ไม่มีสถานะไม่ผูก field; fallback ใช้เมื่อค่าต้นทาง Blank/ไม่ตรง allow-list ก่อน stamp" |
| M-13 (Critical) | แก้ schema table และ pseudocode ให้ `Boundary.Plot_Reference = Reference` ของ Original ต้นทาง (ไม่ใช่ `= Plot_Actual`) เพิ่ม invariant ว่าแถว Boundary ที่ `Actual≠Reference` ต้องมี `Plot_Actual≠Plot_Reference` เสมอ มีเฉพาะแถว Crossing เท่านั้นที่ทั้งสองค่าเท่ากัน |

## 0.2 สรุปการแก้จากรอบ 3

| Finding | การแก้ |
| --- | --- |
| M-01R | ตรวจสอบแล้วว่า `interactive` ไม่ใช่ property ของ Vega-Lite MarkDef จริง (ยืนยันกับเอกสาร Vega-Lite) **ถอนคำกล่าวอ้างทั้งหมด** เปลี่ยนเป็น `tooltip: null` (property ที่มีจริง แต่ปิดเฉพาะ Tooltip ไม่ปิด click/selection) + ยอมรับตรงๆ ว่าพฤติกรรม Area interaction เป็นคำถามเปิดที่ต้องพิสูจน์ใน Phase 2 (T18, T22) — *(หมายเหตุรอบ 11: แนวคิด "Category Blank = soft-fail" ที่เคยเขียนไว้ที่นี่ถูกถอนแล้วโดย M-23 เพราะพิสูจน์ว่าไม่ปลอดภัยจริง ดูหัวข้อ 0.8)* |
| M-10R | แก้ cross-reference "Phase 2 ข้อ 6" เป็น "Phase 2 ข้อ 5" ใน `PROJECT_PLAN.md` แล้ว |
| M-11 | ทิ้งแนวคิด "Run" ข้าม segment ทั้งหมด เปลี่ยนเป็นอัลกอริทึม **per-segment** ที่ประมวลผลทีละคู่ Category ติดกันแบบเดียวกับ `segmentFill.ts` เป๊ะ (กรณี A/B/C) ไม่มีสูตรปิดที่ขัดแย้งกันได้อีก เพิ่ม T31/T32 ทดสอบ `+,0,0,-` และ `+,0,0,+` โดยเฉพาะ |
| M-12 | แก้ `PROJECT_PLAN.md` ทุกจุดที่ยังล็อก `Business_Type` เป็น DAX Measure ให้ตรงกับ Power Query Column architecture (Field contract, Features กลุ่ม B, บทที่ 4/6, Phase 1/2, Definition of Done) |

## 0.1 สรุปการแก้จากรอบ 2

| Finding | การแก้ |
| --- | --- |
| M-01R | *(บันทึกประวัติ — แนวทางนี้ถูกถอนแล้ว)* รอบ 2 เคยเสนอตั้ง `"interactive": false` บน Area/Line โดยอ้างว่า Point เป็น layer เดียวที่รับ event — **ถูกถอนในรอบ 3** เพราะ `interactive` ไม่ใช่ Vega-Lite MarkDef property ที่มีอยู่จริง หลัง M-23 ถือว่า Area interaction เป็นคำถามเปิดที่ต้องพิสูจน์ด้วย T18/T22 และ Phase 2 ข้อ 7 ของ `PROJECT_PLAN.md` เท่านั้น ส่วนที่ยังใช้จริงจากรอบนี้คือหัวข้อ 2.2.1 (Semantic-model relationship แบบ Bidirectional ที่จำเป็นให้ cross-filter ทิศทางออกไปถึง Visual อื่นได้จริง) |
| M-10R | แก้ `PROJECT_PLAN.md` จริงแล้ว (Phase 1 ข้อ 2 ตัดคำว่า "หน้าจอ Editor จริง", เพิ่ม Phase 2 ข้อ 5 ใหม่เป็น Gate, ปรับ cross-reference อื่นให้ตรงกัน) |
| M-11 | เพิ่มหัวข้อ 2.0 กำหนดสูตรจำนวนแถวที่ไม่ขัดกันเอง (`N + 2S + Z`) พร้อม Row_Type ที่ 3 คือ `Boundary` สำหรับจุด `diff=0` ที่เป็นขอบ run และกฎ flat-run/endpoint ครบ — **แก้ต่อในรอบ 3**: ทิ้งแนวคิด Run/Z ทั้งหมด เปลี่ยนเป็นอัลกอริทึม per-segment ที่ตรงกับ `segmentFill.ts` เป๊ะ ไม่มีสูตรปิด (closed-form) ที่ขัดแย้งกันได้อีก |

## 0 สรุปการแก้จากรอบ 1

| Finding | การแก้ |
| --- | --- |
| M-01 (Critical) | ออกแบบ **Dataset เดียว** ที่มี `Row_Type` แยก Original/Crossing ทุก layer อ่านจาก dataset เดียวกัน โดย layer ที่ไม่ต้องใช้ crossing row filter ด้วย `transform: filter Row_Type == 'Original'` — ดูหัวข้อ 2 |
| M-02 | เพิ่มขอบเขตชัดเจน: ฟีเจอร์ crossing-case ใช้ได้เมื่อไม่มี Filter/Slicer ที่ตัด Category ออกจาก Visual นี้ระหว่างใช้งานจริง (Power Query คำนวณตอน Refresh เท่านั้น) — ดูหัวข้อ 2 |
| M-03 | เปลี่ยน `Business_Type` จาก DAX Measure เป็น **Column บนตารางเฉพาะที่ Power Query สร้าง** ค่าเดียวถูก stamp ซ้ำทุกแถวตอนเตรียมข้อมูล ไม่มีทางเกิดค่าไม่ตรงกันระหว่างแถวโดยโครงสร้าง — ดูหัวข้อ 3 |
| M-04 | ยอมรับและระบุเป็นข้อจำกัดตรงไปตรงมา: Category label lookup เป็น array คงที่ต่อ Workshop dataset ไม่ใช่ dynamic lookup ทั่วไป — ดูหัวข้อ 4 |
| M-05 | ลดสถานะ 280×180px เป็น **Provisional** และขยาย Test matrix ให้มีขนาด viewport ที่เป็นตัวเลขจริงหลายค่า — ดูหัวข้อ 4, 7 |
| M-06 | ตัด `KPI_ID` ออกจาก Field contract | 
| M-07 | แยก Text contrast (มีตัวเลขยืนยัน) ออกจาก Non-text/CVD distinguishability (เพิ่ม pattern เส้นขอบ ไม่ claim CVD-verified) — ดูหัวข้อ 6 |
| M-08 | เพิ่ม Test ID ที่ขาด (รวมเป็น 30 รายการ) — ดูหัวข้อ 7 |
| M-09 | เพิ่มฟิลด์ Evidence record — ดูหัวข้อ 8 |
| M-10 | เสนอแก้ขอบเขต Phase 1/Phase 2 ใน `PROJECT_PLAN.md` อย่างเป็นทางการ (ไม่ใช่เลื่อนแบบไม่มีเหตุผล) — ดูหัวข้อ 1 |

## 1 Version Lock และขอบเขตการยืนยัน UI

| เครื่องมือ | เวอร์ชันที่ Lock | ที่มา |
| --- | --- | --- |
| Power BI Desktop | `2.157.1354.0` (64-bit) | ผู้ใช้ยืนยันให้ใช้ค่าเดียวกับโครงการ Bullet Chart (`D:\DATA\Deneb\eBook\README.md`) |
| Deneb | `2.0.0.0` | เดียวกับข้างต้น |

### แก้ M-10 — ขอบเขต Phase 1 vs Phase 2 สำหรับการยืนยัน UI จริง

`PROJECT_PLAN.md` Phase 1 ข้อ 2 เขียนว่าต้องยืนยันกลไก "จากเอกสารทางการ**และ**หน้าจอ Editor จริง" ซึ่ง Claude/Codex ไม่มีสิทธิ์เข้าถึง Power BI Desktop/Deneb Editor จริงของผู้ใช้ (ระบุไว้แล้วในหัวข้อ 9 ของ `PROJECT_PLAN.md`) การยืนยันด้วยภาพจริงจึงทำไม่ได้ในทางปฏิบัติจนกว่าจะถึงขั้นที่ผู้ใช้ทดสอบ Power BI จริง — ซึ่งตรงกับ Phase 2 อยู่แล้ว (Phase 2 ข้อ 3–4 กำหนดให้ทดสอบ Cross-filtering/Cross-highlighting/Context menu บน Power BI จริงพร้อม Evidence record)

**แก้ `PROJECT_PLAN.md` แล้วจริง (ไม่ใช่แค่เสนอในเอกสารนี้)** — ตัด "และหน้าจอ Editor จริง" ออกจาก Phase 1 ข้อ 2 (ใช้เอกสารทางการเป็นหลักฐานของ Phase 1 เท่านั้น) และเพิ่ม **Phase 2 ข้อ 5 ใหม่** เป็นเงื่อนไขบังคับก่อน Phase 2 จะ `PASS`: ผู้ใช้ต้องเปิด Deneb 2.0.0.0 จริงและยืนยันด้วยภาพหน้าจอว่าชื่อ/ตำแหน่ง UI ทั้งหมดตรงกับที่อ้างจากเอกสาร พร้อมปรับ cross-reference ในหัวข้อ 4 (features กลุ่ม A) ให้ชี้ไปที่ Phase 2 ข้อ 5 แทน Phase 1 ข้อ 5 — เพิ่ม Test ID T30 ในหัวข้อ 7 ตรงกับ Phase 2 ข้อ 5

## 2 Crossing-case Variance Area — Design Lock (แก้ M-01, M-02)

**พิสูจน์แนวคิดแล้วใน Vega-Lite ล้วนๆ** ([qa/PHASE1_PROTOTYPE_TEST_LOG.md](../qa/PHASE1_PROTOTYPE_TEST_LOG.md) P1-T01, spec: [specs/phase1-proto-variance-crossing.vl.json](../specs/phase1-proto-variance-crossing.vl.json)) — prototype รอบนี้ใช้ inline data สองชุดเพื่อพิสูจน์ concept เท่านั้น ยังไม่ใช่โครงสร้างที่ใช้งานจริง โครงสร้างจริงที่ Lock ในหัวข้อนี้คือของใหม่ที่แก้ M-01

### 2.1 Dataset เดียว (แก้ M-01)

Deneb ผูก `dataset` ได้จาก **Values well เดียว** ของ Visual ดังนั้นทุก layer ต้องอ่านจาก `dataset` เดียวกัน ไม่ใช่ inline data คนละชุดแบบ prototype Lock schema ดังนี้ (สร้างจาก Power Query query ใหม่ชื่อ `DualLine_PlotData` ที่ **ไม่ใช่** ตารางหลักที่ Measure อื่นในรายงานใช้ — ดูเหตุผลในหัวข้อ 2.2)

### 2.0 อัลกอริทึมสร้าง Fill dataset แบบ per-segment (แก้ M-11 รอบ 3 — ทิ้งแนวคิด "Run" เดิมที่ขัดกันเอง ใช้ per-segment ตรงตาม `segmentFill.ts` แทน)

รอบ 2 พยายามจัดกลุ่มหลาย segment ที่เครื่องหมายเดียวกันเป็น "Run" เดียว ทำให้เกิดกรณีขอบ (`+,0,0,-` เทียบกับ `+,0,0,+`) ที่นิยามขัดกันเอง (M-11) **แนวทางใหม่: ไม่จัดกลุ่มข้าม segment เลย ประมวลผลทีละคู่ Category ที่ติดกัน (segment) แบบเดียวกับ `segmentFill.ts` เป๊ะ** วิธีนี้ deterministic เต็มร้อยและไม่ต้องนิยาม "Run"/"Z" อีกต่อไป

ให้ Original rows เรียงตาม `Sort_Order` เป็น `row[1], row[2], ..., row[N]` และ `diff[i] = Actual[i] - Reference[i]` สำหรับแต่ละ `i` มี **segment** ระหว่าง `row[i]` กับ `row[i+1]` (รวม `N-1` segment) ประมวลผลแต่ละ segment อิสระจากกันโดยสิ้นเชิง:

```text
สำหรับ segment ระหว่าง row[i] และ row[i+1], ให้ d0 = diff[i], d1 = diff[i+1]:

กรณี A — d0 == 0 และ d1 == 0 (flat แท้ทั้งสองปลาย):
  ไม่สร้าง fill-row ใดๆ สำหรับ segment นี้ (0 แถว) — ไม่มีพื้นที่ต้องทาสี

กรณี B — d0 × d1 < 0 (strict crossing, ทั้งสองฝั่งไม่เท่ากับ 0 และเครื่องหมายต่างกัน):
  คำนวณจุดตัด t = d0 / (d0 - d1), Plot_Position = pos[i] + t × (pos[i+1] - pos[i]), ค่า Y ที่จุดตัด (เท่ากันทั้ง Actual/Reference ที่จุดนี้) = interpolate เชิงเส้น
  สร้าง 4 fill-rows แบ่งเป็น 2 กลุ่ม (Segment_ID ต่างกัน) — "สำเนาค่า row[i]" หมายถึงคัดลอกทั้ง Plot_Actual=Actual[i] **และ** Plot_Reference=Reference[i] แยกกันสองค่า (ห้ามเท่ากัน เว้นแต่ Actual[i]=Reference[i] พอดี):
    กลุ่ม "i-a": {Plot_Position=pos[i], Plot_Actual=Actual[i], Plot_Reference=Reference[i], Segment_ID="i-a", Run_Sign=sign(d0)}, {Plot_Position=จุดตัด, Plot_Actual=Plot_Reference=ค่า Y ที่จุดตัด, Segment_ID="i-a", Run_Sign=sign(d0)}
    กลุ่ม "i-b": {Plot_Position=จุดตัด, Plot_Actual=Plot_Reference=ค่า Y ที่จุดตัด (สำเนาที่สอง คนละแถวจาก i-a), Segment_ID="i-b", Run_Sign=sign(d1)}, {Plot_Position=pos[i+1], Plot_Actual=Actual[i+1], Plot_Reference=Reference[i+1], Segment_ID="i-b", Run_Sign=sign(d1)}

กรณี C — อื่นๆ ทั้งหมด (เครื่องหมายเดียวกันทั้งคู่ หรือฝั่งใดฝั่งหนึ่งเป็น 0 แต่อีกฝั่งไม่ใช่):
  สร้าง 2 fill-rows กลุ่มเดียว (Segment_ID="i") — Plot_Actual/Plot_Reference คัดลอกจาก Actual/Reference จริงของแต่ละแถว แยกกันสองค่าเสมอ (ไม่ยุบเป็นค่าเดียว):
    {Plot_Position=pos[i], Plot_Actual=Actual[i], Plot_Reference=Reference[i], Segment_ID="i", Run_Sign=sign(d0 != 0 ? d0 : d1)}, {Plot_Position=pos[i+1], Plot_Actual=Actual[i+1], Plot_Reference=Reference[i+1], Segment_ID="i", Run_Sign=sign(d0 != 0 ? d0 : d1)}
```

**Invariant (แก้ M-13, ฉบับแก้รอบ 5)**:

- ทุกแถว `Boundary` ต้องรักษา `Plot_Actual = Actual` และ `Plot_Reference = Reference` ของแถว Original ต้นทางเสมอ (คัดลอกตรงๆ ไม่คำนวณใหม่)
- ถ้า Original ต้นทางมี `Actual ≠ Reference` → `Plot_Actual ≠ Plot_Reference` บนแถว Boundary นั้นด้วย (กรณีปกติ ส่วนใหญ่ของ Boundary)
- ถ้า Original ต้นทางมี `Actual = Reference` พอดี (เช่น endpoint ของ segment กรณี C ที่ `diff=0`) → `Plot_Actual = Plot_Reference` บนแถว Boundary นั้น**ได้อย่างถูกต้อง** เพราะค่าจริงเท่ากันอยู่แล้ว ไม่ใช่ข้อผิดพลาด — **ไม่ใช่ว่า equality พบได้เฉพาะแถว Crossing เท่านั้น** (แก้คำกล่าวที่ผิดในรอบ 4)
- ทุกแถว `Crossing` ต้องมี `Plot_Actual = Plot_Reference` เสมอ (นิยามของจุดตัด)

เพิ่ม QA invariant นี้ในหัวข้อ Test matrix — **T04, T31, T32 ต้องตรวจ Boundary ที่ปลาย `diff=0` ด้วยว่า `Plot_Actual = Plot_Reference` ถูกต้องตามกฎข้างต้น ไม่ใช่ตรวจเฉพาะ Boundary ที่ค่าไม่เท่ากัน**

**สมบัติสำคัญที่ทำให้ deterministic ไม่มีขอบกรณีขัดกัน**: แต่ละ segment ตัดสินใจอิสระจาก segment ข้างเคียงโดยสิ้นเชิง ไม่มีการ "จัดกลุ่มข้าม segment" จึงไม่ต้องนิยาม Run/Z แยกต่างหาก — `+,0,0,-` ให้ segment(+,0)=กรณีC(2 แถว,เขียว), segment(0,0)=กรณีA(0 แถว), segment(0,-)=กรณีC(2 แถว,แดง) รวม 4 แถว มีช่องว่างไม่มีสีตรงกลางพอดี — `+,0,0,+` ให้ผลแบบเดียวกันแต่ทั้งสอง segment ที่ไม่ใช่กรณีA เป็นสีเขียวทั้งคู่ (มีช่องว่างสีคั่นกลางเช่นกัน ไม่เชื่อมเป็นโพลิกอนเดียว) **ตรงกับพฤติกรรมต้นแบบเป๊ะ** เพราะ `segmentFill.ts` เองก็ไม่เคยรวม segment ข้ามกันเป็น polygon เดียวเช่นกัน (วน loop สร้าง exactly 1 หรือ 2 polygon ต่อ 1 segment เสมอ ไม่เคยมี logic รวมหลาย segment)

**ทุกแถวที่สร้างจาก segment (ทั้งกรณี B และ C) ใช้ `Row_Type = "Boundary"` ถ้าเป็นสำเนาค่า Original ที่มีอยู่แล้ว หรือ `Row_Type = "Crossing"` ถ้าเป็นจุด interpolate ใหม่ — ไม่มี Row_Type ใดของ Fill dataset ที่เป็น `"Original"` โดยตรง** (แถว `Row_Type = "Original"` ที่แท้จริงมีไว้สำหรับ Identity เท่านั้น ดูหัวข้อ 2.1) แยกกันเด็ดขาดจาก Fill dataset เพื่อไม่ให้ "จำนวนครั้งที่ปรากฏเพื่อ plotting" ปนกับ "จำนวนครั้งที่ปรากฏเพื่อ identity" อีกต่อไป

**จำนวนแถว Fill dataset รวม** = Σ ต่อ segment (0 ถ้ากรณี A, 4 ถ้ากรณี B, 2 ถ้ากรณี C) — คำนวณตรงไปตรงมาจากการวน loop ทีละ segment ไม่มีสูตรปิด (closed-form) ที่อาจขัดแย้งกันอีก เพราะ "คำนวณจาก algorithm" คือ single source of truth เดียว

**QA invariant ที่ต้องตรวจอัตโนมัติหลังสร้าง `DualLine_PlotData`** (Phase 2): `COUNT(Row_Type='Original') = จำนวน Category ไม่ซ้ำ`, `COUNT(Row_Type='Crossing') = 2 × (จำนวน segment กรณี B)`, `COUNT(Row_Type='Boundary') = 2 × (จำนวน segment กรณี B) + 2 × (จำนวน segment กรณี C)` (นับสำเนา Original ที่ segment กรณี B ก็ต้องมี 2 สำเนาเช่นกัน — 1 ที่ Segment_ID="i-a" ประกบค่า row[i]), `DISTINCTCOUNT(Business_Type) = 1`

**Test case ใหม่ที่ต้องเพิ่ม (ตอบ Required fix ของ M-11)**: T31 = `+,0,0,-` (2 segment สี, 1 segment ว่างตรงกลาง, 2 สี), T32 = `+,0,0,+` (เขียวสองช่วงแยกกัน มีช่องว่างตรงกลาง ไม่เชื่อมเป็นโพลิกอนเดียว)

| Field | Original (Identity เท่านั้น) | Boundary (Fill, สำเนาค่า Original) | Crossing (Fill, interpolate) | ประเภท |
| --- | --- | --- | --- | --- |
| `Row_Type` | `"Original"` | `"Boundary"` | `"Crossing"` | Text |
| `Category` | ชื่อ Category | Blank | Blank | Text |
| `Sort_Order` | ลำดับเดิม (1,2,3,...) | Blank | Blank | Whole number |
| `Actual` | ค่าจริง | Blank | Blank | Decimal |
| `Reference` | ค่าเปรียบเทียบ | Blank | Blank | Decimal |
| `Plot_Position` | = `Sort_Order` | = `Sort_Order` ของแถว Original ต้นทาง (ไม่ interpolate) | ตำแหน่ง interpolate (เศษส่วน) | Decimal |
| `Plot_Actual` | = `Actual` | = `Actual` ของแถว Original ต้นทาง | ค่า interpolate ที่จุดตัด | Decimal |
| `Plot_Reference` | = `Reference` | **= `Reference` ของแถว Original ต้นทาง** (แก้ M-13 — ไม่ใช่ `= Plot_Actual`; ถ้า `Actual ≠ Reference` ที่จุดนั้น `Plot_Actual` ต้อง**ไม่เท่ากับ** `Plot_Reference` มิฉะนั้นพื้นที่ Variance จะยุบเป็นศูนย์ที่ปลาย polygon) | = `Plot_Actual` (เท่ากันที่จุดตัดเท่านั้น เพราะเป็นจุดที่ Actual=Reference จริง) | Decimal |
| `Segment_ID` | ไม่มีความหมาย (ไม่ใช้ layer นี้) | `"i"` หรือ `"i-a"`/`"i-b"` ของ segment ต้นทาง | `"i-a"`/`"i-b"` ของ segment ต้นทาง | Text |
| `Run_Sign` | ไม่มีความหมาย (ไม่ใช้ layer นี้) | ตามกรณี B/C ข้างต้น | ตามกรณี B ข้างต้น | Whole number |
| `Business_Type` | ค่าเดียวที่ stamp ทั้งตาราง | เดียวกัน | เดียวกัน | Text |
| `Filter_Key` | **ค่า Key ของ Category นั้นเอง** | **ค่า Key ของ `row[i]` (ฝั่งซ้ายของ segment) — ไม่ Blank** | **ค่า Key ของ `row[i]` (ฝั่งซ้ายของ segment) — ไม่ Blank** | Text/Date ตามชนิดของ Dimension ร่วม (แก้ M-17 — แยกจาก `Category` เพื่อไม่ให้ Relationship ตัดแถว Fill ทั้งหมดออก ดูหัวข้อ 2.2.1) |

#### 2.1.1 Amendment จากหลักฐาน Power BI จริง (Phase 2, 24 ก.ย. 2026) — measure กันแถวหาย

**ปัญหาที่พบ (T23 รอบที่ 1)**: ผูก `Actual`/`Reference` เข้า Values แบบ Sum (implicit measure — จำเป็นเพื่อให้ Deneb สร้าง `Actual__highlight`/`__highlightStatus` สำหรับ Cross-highlight) แล้ว Deneb `dataset` เหลือ **12 แถว** แทน 52 — แถว Boundary/Crossing หายทั้งหมดและไม่มีพื้นที่สี เพราะแถวเหล่านี้มี `Actual`/`Reference` = Blank ตามตารางด้านบน และ Power BI ตัดแถวที่ measure ทุกตัวเป็น Blank ทิ้งก่อนส่งให้ Visual

**พิสูจน์สาเหตุแล้วบนเครื่องจริง**: (1) เอา `Actual`/`Reference` ออกจาก Values → 52 แถว (2) ใส่กลับพร้อม measure ที่ไม่ Blank ทุกแถว → 52 แถว และพื้นที่สีแสดงครบ (หลักฐาน `qa/evidence/phase2-powerbi/T23-02-*.png`, `T23-03-*.png`)

**Lock เพิ่ม**: ต้องมี measure บนตาราง `DualLine_PlotData` ใน Values ของ Deneb เสมอ:

```dax
DualLine Row Count = COUNTROWS ( DualLine_PlotData )
```

- ไม่แก้ Field contract ของ `Actual`/`Reference` (ยังคง Blank ในแถว Boundary/Crossing — ไม่เติมค่าเพื่อกันแถวหาย เพราะจะทำให้ผลรวม `Actual` บนตารางนี้ผิดถ้ามี Visual อื่นใช้)
- spec ไม่อ่าน field นี้ (มีไว้กันแถวหายเท่านั้น) — ห้ามลบออกจาก Values; บทที่ 4/5 ต้องอธิบายเหตุผล และบทที่ 9 (Template) ต้องระบุว่าผู้ใช้ Template ต้องสร้าง measure นี้กับข้อมูลของตนเองด้วย
- **ทางเลือกที่ยังไม่ได้ทดสอบ** (ห้ามสอนจนกว่าจะมีหลักฐาน): ผูก `Actual`/`Reference` แบบ Don't summarize เมื่อไม่ต้องการ Cross-highlight — หลักฐาน T23-02 พิสูจน์เฉพาะกรณี *เอาสอง field ออกจาก Values* ไม่ใช่กรณี Don't summarize
- `DualLine Row Count` เป็น measure จึงอาจมี Supporting highlight fields ของตัวเอง (`DualLine Row Count__highlight` ฯลฯ ถ้าเปิด) — spec ต้องไม่อ้างถึง fields เหล่านั้น

### 2.2 การ bind layer และ Interaction ownership (แก้ M-01, แก้ไข M-01R รอบ 3 — ถอนคำกล่าวอ้างเรื่อง `interactive:false`)

**แก้ไขจากรอบ 2**: ตรวจสอบแล้วว่า **`interactive` ไม่ใช่ property ที่ Vega-Lite MarkDef รองรับ** ([Vega-Lite Mark docs](https://vega.github.io/vega-lite/docs/mark.html) ไม่มี property นี้ แม้ Vega เองจะมี) การเขียน `"mark": {"type": "area", "interactive": false}` ใน Vega-Lite spec **ไม่มีหลักฐานว่าจะทำงาน** จึงถอนคำกล่าวอ้างนี้ทั้งหมด และออกแบบใหม่ที่ไม่พึ่ง property ที่ไม่มีอยู่จริง

- **Area/fill layer**: เพิ่ม `transform: [{"filter": "datum.Row_Type == 'Boundary' || datum.Row_Type == 'Crossing'"}]` อย่างชัดเจน (แก้ M-01R รอบ 4 — เดิมเขียนว่า "ใช้ dataset เต็ม ไม่ filter" ซึ่งทำให้ Original rows หลุดเข้า Area layer ด้วย) หลัง filter นี้แล้ว ทุกแถวที่เข้า Area layer จริงมี `Category = Blank` เสมอ (Lock ไว้แล้วในหัวข้อ 2.0) ใช้ `x: Plot_Position`, `y: Plot_Actual`, `y2: Plot_Reference`, `detail: Segment_ID`, สีจาก `test` ที่รวม `Run_Sign` กับ `Business_Type` และตั้ง `"tooltip": null` บน layer นี้ (property ที่ Vega-Lite เอกสารรองรับจริง — ปิดเฉพาะการแสดง Tooltip **ไม่ได้ปิด click/selection/context-menu event**)
- **แก้ M-23 — ถอนคำกล่าวอ้างเรื่อง soft-fail ที่ผิด**: รอบก่อนอ้างว่า `Category = Blank` บน Area จะทำให้ cross-filter (ถ้าเกิด) ไปที่ `"(Blank)"` และ "จำกัดความเสียหาย" **ข้อสรุปนี้ผิดและถอนออกทั้งหมด** เหตุผล: ถ้า Deneb สร้าง filter `DualLine_PlotData[Category] = Blank` จริงจากการคลิก Area, filter นี้จะเหลือ**ทุกแถว Boundary/Crossing ทั้งตาราง** (ไม่ใช่แถวเดียว) เพราะทุกแถวเหล่านี้มี `Category = Blank` เหมือนกัน แถวที่เหลือเหล่านี้มี `Filter_Key` **หลายค่าต่างกัน** (ค่า Key ของ `row[i]` ฝั่งซ้ายของแต่ละ segment) เมื่อ Relationship เป็น `Both` (bidirectional) ค่า `Filter_Key` ที่หลากหลายเหล่านี้จะ propagate ไปยัง Dimension และ Visual อื่น กลายเป็นการกรองไปยัง**หลาย Category พร้อมกัน** (ใกล้เคียงกับ "แสดงทุก Category ยกเว้นบางตัว") ไม่ใช่กรองไปที่ `"(Blank)"` เพียงค่าเดียวตามที่เคยอ้างไว้ผิด
- **Line (Actual), Line (Reference)**: เพิ่ม `transform: [{"filter": "datum.Row_Type == 'Original'"}]` และตั้ง `"tooltip": null` เช่นเดียวกับ Area — เพราะ filter ไปที่ `Row_Type == 'Original'` แล้ว มาร์กนี้จึงต่อให้ resolve ได้ก็ resolve ไปยังแถว Original จริงเสมอ (Category ไม่ Blank, `Filter_Key` มีค่าเดียวตรงกับ Category นั้นเอง) **ไม่ใช่ความเสี่ยงแบบเดียวกับ Area**
- **Connector (rule), Point (hit-target), Data label**: เพิ่ม `transform` filter เดียวกัน (`Row_Type == 'Original'`) ผูก Tooltip ไว้ที่ **Point layer เท่านั้น** เป็น layer ที่ตั้งใจให้เป็นเป้าหมายหลักของ click/hover/context-menu — ไม่อ้างว่าเป็น "จุดเดียวที่รับ event ทั้ง spec" (Connector/rule ก็มีโอกาส resolve ได้) แต่ทุก layer ที่เหลือใช้เฉพาะแถว `Row_Type == 'Original'` จึง resolve ไปยัง Category จริงที่ถูกต้องเสมอ ไม่ใช่ปัญหา — ปัญหาจริงมีเฉพาะที่ Area/fill layer เท่านั้น และยังไม่มี mitigation ที่พิสูจน์แล้วว่าได้ผล (ดูด้านล่าง)
- **ยังเป็นคำถามเปิดที่แท้จริงสำหรับ Phase 2 (T18, T22) — ไม่มีข้อสรุปที่ Lock แล้วอีกต่อไปหลังแก้ M-23**: (1) คลิก/right-click บน Area จริงๆ เกิด selection/filter หรือไม่ (2) ถ้าเกิด — filter/selection ที่สร้างคืออะไรกันแน่ ตรวจสอบว่า Dimension และ Visual อื่นเหลือ Category ใดบ้างหลังคลิก ไม่ใช่แค่ดูว่า Category ที่ resolve ได้เป็น Blank หรือไม่ (3) **Phase 2 gate บังคับ**: ถ้าคลิก Area ทำให้ Visual อื่นถูกกรองผิด (ตามที่วิเคราะห์ไว้ข้างต้นว่ามีความเป็นไปได้สูง) ต้องเปลี่ยน interaction architecture ก่อน Phase 2 จะ `PASS` — ทางเลือกที่ต้องพิจารณา: ใช้ **Advanced cross-filtering mode** ของ Deneb (ผู้เขียน spec กำหนด filter เองแทนการพึ่ง auto-resolve ของ Simple mode) หรือวิธีอื่นที่มีหลักฐานพิสูจน์ว่าตัด Area ออกจาก hit-testing ได้จริง — **ตัด "ลด opacity ของ Area" ออกจากรายการ mitigation โดยสมบูรณ์** เพราะการลด opacity ไม่ทำให้ mark หยุดรับ click/hit-testing แต่อย่างใด (ไม่มีความสัมพันธ์กับ interactivity)

### 2.2.1 Semantic-model relationship สำหรับ Cross-filter ทิศทางออก (แก้ M-01R ข้อ 4)

ตาราง `DualLine_PlotData` เป็นตารางที่ Power Query สร้างขึ้นเฉพาะสำหรับ Visual นี้ (หัวข้อ 2.1) **ไม่มีความสัมพันธ์กับตารางอื่นในโมเดลโดยอัตโนมัติ** ถ้าไม่มี Relationship การเลือก Category บน Visual นี้จะไม่ส่งผลต่อ Visual อื่นเลย (Power BI คำนวณ cross-filter ผ่าน Relationship graph ของ Semantic model เท่านั้น ไม่ใช่แค่มี Visual สองตัวอยู่หน้าเดียวกัน)

**Design Lock (แก้ M-17 — แยก Key สำหรับ Relationship ออกจาก `Category` ซึ่งเป็น field แสดงผล/identity ธรรมดา ไม่ใช่กลไกป้องกัน Area interaction ตามที่ M-23 ถอนคำกล่าวอ้างไปแล้ว)**:

Codex ชี้ถูกต้องว่าถ้าใช้คอลัมน์เดียว (`Category`, Blank บนแถว Fill-only) เป็นทั้ง relationship key **และ** ตัว mitigation ของ M-01R พร้อมกัน จะทำให้ Filter/Slicer ที่กรองผ่าน Relationship ตัดแถว Fill-only (Boundary/Crossing) **ทั้งหมด** ออกทันทีที่มี Filter ใดๆ มาถึง (เพราะ Blank ไม่ match ค่าที่เลือกไว้เลย) ไม่ใช่แค่ "ค้าง" เฉพาะจุดที่ชนกับ Category ที่ถูกกรองตามที่ระบุไว้เดิมในหัวข้อ 2.3/T29 — ขัดกันเอง จึงต้อง **แยกเป็นสองคอลัมน์คนละบทบาท**:

1. **`Category`** (field แสดงผล/tooltip/identity ธรรมดา — **ไม่ใช่กลไกป้องกัน Area interaction**, ดู M-23): Blank บนแถว Fill-only ทั้งสองประเภท เหมือนเดิม — ไม่เกี่ยวกับ Relationship ใดๆ
2. **`Filter_Key`** (field ใหม่ ใช้เฉพาะเป็น Relationship key): มีค่า**เสมอทุกแถวไม่มี Blank** — บนแถว `Original` = ค่า Key ของ Category นั้นเอง; บนแถว `Boundary`/`Crossing` ของ segment ระหว่าง `row[i]` และ `row[i+1]` = **ค่า Key ของ `row[i]`** (ฝั่งซ้าย/`Sort_Order` น้อยกว่าของ segment นั้นเสมอ ไม่ว่าแถวนั้นจะมาจากกรณี B หรือ C) — เลือกใช้ `Filter_Key` (ไม่ใช่ `Category`) เป็นคอลัมน์ที่สร้าง Relationship กับ Dimension ร่วมในข้อ 2 ด้านล่าง
3. ผลลัพธ์ที่ตั้งใจ: เมื่อ Filter/Slicer กรอง Category ผ่าน Dimension ลงมาที่ `Filter_Key` — segment ที่ `row[i]` (ฝั่งซ้าย) ถูกกรองออก จะทำให้แถว Fill ของ segment นั้นถูกตัดออกทั้งชุด (สอดคล้องและคาดเดาได้) แต่ segment ที่ `row[i]` ยังอยู่ (แม้ `row[i+1]` ฝั่งขวาจะถูกกรองออกไปแล้ว) แถว Fill ของ segment นั้นจะ**ยังไม่ถูกตัด** เพราะ `Filter_Key` ยังตรงกับ Category ที่เหลืออยู่ — เกิดพื้นที่สี "ค้าง" (dangling) ที่ปลายด้านขวาจริงตามที่ T29 อธิบายไว้เดิม ไม่ใช่การหายไปทั้งหมดแบบที่ M-17 ชี้ปัญหา
4. **แก้ M-23 — ถอนคำกล่าวอ้างเดิม**: `Category = Blank` บน Area **ไม่ได้ทำให้ผลลัพธ์ปลอดภัยแบบที่เคยอ้างไว้** เพราะแม้ Deneb จะผูก data role "Category" เข้ากับ field `Category` (ไม่ใช่ `Filter_Key`) การคลิกที่ resolve เป็น `Category=Blank` จะทำให้ filter ครอบคลุมแถว Boundary/Crossing **ทั้งหมด** ที่มี `Filter_Key` หลายค่าต่างกัน แล้ว propagate หลายค่านั้นผ่าน Relationship แบบ `Both` ไปยัง Dimension/Visual อื่น (ดูหัวข้อ 2.2) — ไม่ใช่ soft-fail ที่ปลอดภัยอีกต่อไป เป็นคำถามเปิดที่ต้องพิสูจน์และอาจต้องเปลี่ยนสถาปัตยกรรม interaction ก่อน Phase 2 PASS
5. สร้าง Relationship ระหว่าง `DualLine_PlotData` กับ Dimension ร่วม โดยตั้ง **Cross-filter direction เป็น `Both` (Bidirectional)** ไม่ใช่ Single — เหตุผล: Relationship ทิศทางเดียว (Dimension → Fact) กรองจาก Dimension ลง Fact ได้ตามปกติ (inbound cross-filter/cross-highlight เข้า Visual นี้) แต่ **ไม่กรองย้อนกลับ** จาก Fact ขึ้นไป Dimension จึงไม่ส่งต่อไปยัง Visual อื่นที่ผูกกับ Dimension เดียวกัน (outbound cross-filter ที่ต้องพิสูจน์ใน T18) ต้องเป็น `Both` เท่านั้นจึงจะครบทั้งสองทิศทาง
6. **ข้อควรระวังที่ต้องทดสอบใน Phase 2**: Bidirectional relationship อาจทำให้ Power BI แจ้ง Ambiguity ถ้าโมเดลมี path เชื่อมซ้ำอยู่แล้ว — บทที่ 8/10 ต้องมีขั้นตอนตรวจและแก้ปัญหานี้ถ้าเกิดขึ้นจริงกับ Workshop dataset (ซึ่งควรมีแค่ตารางเดียวไม่ซับซ้อน จึงมีโอกาสเกิด Ambiguity ต่ำ แต่ยังไม่ยืนยันจนกว่าจะทดสอบจริง)
7. เพิ่ม Evidence ที่ต้องพิสูจน์ใน T18 (ขยายตาม M-23): (ก) คลิกจุดข้อมูลที่ Point layer บน Dual-Line Variance Chart แล้ว Visual อื่นที่ผูกกับ Dimension เดียวกันต้องถูกกรองถูกต้องตาม Category ที่คลิกจริง (ข) คลิกกลางแถบสี Area (ไม่มี Point/Connector คาบเกี่ยว) แล้วบันทึกผลจริงว่า Visual อื่นเหลือ Category ใดบ้าง — ถ้าพบว่า Visual อื่นถูกกรองผิด (เช่น เหลือหลาย Category ที่ไม่ใช่ Category เดียวที่คลิกจริง) ต้องเปลี่ยน interaction architecture (เช่น Advanced cross-filtering mode ของ Deneb) ก่อน Phase 2 จะ `PASS`

#### 2.2.2 Amendment จากหลักฐาน Power BI จริง (Phase 2, 24 ก.ย. 2026) — ผล Area-click และคำตัดสินผู้ใช้

**ผลทดสอบ T18 (ข)** (relationship `Filter_Key` → `DualLineVariance_Workshop_Data[Category]`, *:1, Both — ภาพ `T18-00`): คลิกซ้ายกลางสามเหลี่ยมสีของ segment ม.ค.–ก.พ. (ชิด ก.พ.) → Visual อื่น highlight **ม.ค.**; คลิกสามเหลี่ยมของ segment ก.พ.–มี.ค. (ชิด ก.พ.) → **ก.พ.** (ภาพ `T18-03`, `T18-04`) — ใน **crossing segment สองกรณีที่ทดสอบ** การคลิก Area เลือก Category เดียวตาม `Filter_Key` ฝั่งซ้ายของ segment ตรงตาม Field contract หัวข้อ 2.1 และไม่พบการเลือกหลาย Category ในสองกรณีนี้ — เพิ่มเติม: segment กรณี C (พ.ค.–มิ.ย.) คลิกบริเวณพื้นที่กว้างชิด พ.ค. หลังล้าง selection ได้ **พ.ค.** เดียว (ภาพ `T18-06`) รวม 3 กรณีที่ทดสอบ ไม่พบการเลือกหลาย Category — T22 (คลิกขวากลาง Area ช่วง ม.ค.–ก.พ. หลังล้าง selection) ใช้ Include ยืนยันว่า resolve เป็นแถว Fill เดียวที่ `Filter_Key` = ม.ค. (ภาพ `T22-05`) — เหลือเพียง Evidence record fields (version, PBIX) ก่อนสรุป Phase 2 ข้อ 7

**ข้อจำกัดที่พบ**: ตาม Field contract พื้นที่สีที่อยู่ติดเดือน X ทางซ้าย (ครึ่งหลังของ segment ก่อนหน้า) ถูกออกแบบให้เลือกเดือนก่อน X (ยืนยันแล้วใน T18-03) ซึ่งอาจไม่ตรงกับที่ผู้ใช้คาด

**คำตัดสินผู้ใช้ (24 ก.ย. 2026)**: **ยอมรับพฤติกรรมนี้และเขียนในหนังสือ** — ไม่เปลี่ยน architecture (ไม่แบ่งพื้นที่ที่จุดกึ่งกลาง segment และไม่พยายามปิดการคลิกพื้นที่สี) บทที่ 8 ต้อง: (1) สอนให้คลิกที่**จุดข้อมูล**เป็นวิธีหลักในการเลือกเดือน (2) อธิบายตรงไปตรงมาว่าคลิกพื้นที่สีถูกออกแบบให้เลือก "เดือนต้นช่วง" ของช่วงนั้น พร้อมภาพประกอบ (3) ระบุเป็นข้อจำกัดเทียบกับต้นแบบ — **Phase 2 ข้อ 7 — PASS (Codex R16, 24 ก.ย. 2026)**: T18(ก) จุด ต.ค. (T18-07), T18(ข) crossing 2 กรณี + Case C (T18-03/04/06), T22(ก) Include จุด ต.ค. = แถว Original (T22-06), T22(ข) Include Area = แถว Fill Filter_Key ม.ค. (T22-05); ไม่พบการเลือก/กรองหลาย Category ในทุกกรณีที่ทดสอบ; สภาพแวดล้อม Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / deneb demo.pbix — พฤติกรรม "เดือนต้นช่วง" ของ Area เป็นข้อจำกัดที่ผู้ใช้ยอมรับ

#### 2.2.3 Amendment จากหลักฐาน Power BI จริง (Phase 2, 24 ก.ย. 2026) — ค่า `__highlightStatus` จริงของ Deneb 2.0

**หลักฐาน (T19-06)**: ขณะ Column chart ส่ง Highlight ก.ค. มา Deneb ส่ง `Actual__highlightStatus` = `"on"` **ทุกแถว** โดย `Actual__highlight` = ค่าจริงเฉพาะแถวที่ถูก highlight และ `null` ในแถวอื่น (ภาพไม่ได้แสดงคอลัมน์ฝั่ง Reference — สันนิษฐานว่าเหมือนกันแต่ยังไม่มีหลักฐาน) — ไม่มีค่า `"off"` ตามที่เอกสาร deneb.guide อธิบาย spec rev 3 ที่ทำให้จางเฉพาะ `"off"` จึงไม่จางเลย

**Lock ใหม่ (spec rev 4)**: ไม่พึ่ง `__highlightStatus` อย่างเดียว —
- จุด (point layers): **แต่ละ layer ดูเฉพาะ measure ของตัวเอง** (`point_actual_hit_target` ↔ `Actual__*`, `point_reference` ↔ `Reference__*` — แก้ตาม Codex R12 M-25 เพื่อไม่ให้จุดที่ถูก highlight จางเพราะอีก measure) จางเมื่อ `status == 'off'` **หรือ** (`status == 'on'` และ `__highlight !== ค่าจริง`) — รองรับทั้งพฤติกรรมจริงและตามเอกสาร
- เส้น (line layers): เป็น path เดียว opacity มาจาก datum แรก จึงจางทั้งเส้นเมื่อ `status != 'neutral'` (มี highlight อยู่) แทนการอิงแถวแรกซึ่งให้ผลไม่สม่ำเสมอ
- ทุกเงื่อนไขมี `isDefined(...)` กันกรณีผู้อ่านยังไม่เปิด Highlight status (ไม่จาง)
- บทที่ 8 ต้องอธิบายความต่างระหว่างเอกสารกับพฤติกรรมจริงนี้ และแนะนำให้ผู้อ่านตรวจ Data pane เอง
- ขอบเขตการจางยังคงเฉพาะเส้น/จุดตาม Design เดิม (พื้นที่สี, connector, label ไม่จาง) — **ถูกแทนที่ด้วย rev 5 ด้านล่าง**

**rev 5 — คำขอผู้ใช้ (24 ก.ย. 2026) หลังเห็นผลบน Deneb จริง**: ผู้ใช้ไม่ต้องการให้เส้นจางทั้งเส้น จึงเปลี่ยนเป็น
- เส้น Actual/Reference: **ไม่จางเลย** (ลบ opacity condition ออกจาก line layers)
- จุดและป้ายตัวเลข (label) ของเดือนที่ไม่ถูก highlight: จาง **0.5** ตาม measure ของตัวเอง (point/label Actual ↔ `Actual__*`, Reference ↔ `Reference__*`)
- **rev 8 (26 ก.ย. 2026, คำขอผู้ใช้)**: ระดับความจางแยกตามชั้น จุด (point_actual_hit_target, point_reference) 0.5 เท่าเดิม, ป้ายตัวเลข (label_actual, label_reference) 0.3, Connector 0.2 ตรรกะ `test` เดิมไม่เปลี่ยน (ทดสอบ HL-* ปรับเป็น 3 ระดับ 464/464)
- Connector ของเดือนที่ไม่ถูก highlight: จาง 0.5 (rev 5; rev 8 เปลี่ยนเป็น 0.2) เมื่อมี highlight อยู่ (status ≠ neutral ฝั่งใดฝั่งหนึ่ง) และไม่มี measure ใดของแถวนั้นถูก highlight (status = on และ `__highlight === ค่าจริง`)
- พื้นที่สี: ไม่จาง (คงเดิม)
- ผู้ใช้เคยพิจารณาให้เส้นช่วงรอบเดือนที่เลือกเข้ม แต่ต้นแบบพบว่าเส้น monotone ที่วาดจากจุดบางส่วนโค้งไม่ตรงกับเส้นเต็ม (ภาพต้นแบบในแชท ไม่ได้เก็บเป็นไฟล์) จึงเลือกแนวทางนี้แทน

### 2.3 ขอบเขตการใช้งาน (แก้ M-02)

Power Query คำนวณจุดตัดที่ **ตอน Refresh ข้อมูลเท่านั้น** ไม่ตอบสนองต่อ Slicer/Filter แบบ Interactive (คนละกลไกกับ DAX Measure ที่คำนวณตาม Filter context ทุกครั้ง) ดังนั้น

**Design Lock**: Dual-Line Variance Chart รุ่นนี้ (ที่มี crossing-case color-split) ออกแบบมาสำหรับ **หน้ารายงานที่ไม่มี Filter/Slicer ที่ตัด Category ออกจาก Visual นี้แบบ Interactive** (เช่น Slicer เลือกช่วงเดือน) เพราะ

1. ถ้า Slicer ตัด Category ออก แถว Crossing ที่ประกบกับ Category นั้นจะกลายเป็น "ค้าง" (dangling) ไม่มีคู่ Original ให้ประกบ ทำให้ polygon ผิดรูป
2. Power Query ไม่ recompute จุดตัดใหม่ตาม Filter context ของ Report

**ทางเลือกที่ต้องระบุในหนังสือ** (บทที่ 9): ถ้าหน้ารายงานต้องมี Slicer ที่กรอง Category ของ Visual นี้ ให้ใช้ทางเลือกสำรอง "ทาสีทั้งช่วงต่อ Category-pair" (ไม่มี crossing rows, ไม่ต้อง Power Query พิเศษ) ซึ่งทำงานถูกต้องกับ Filter ทุกแบบ แต่สีจะเปลี่ยนที่กึ่งกลาง Category-pair ไม่ใช่จุดตัดจริง

**Test case เพิ่ม**: T29 (ดูหัวข้อ 7) ทดสอบว่าเมื่อ Filter ตัด Category ที่มี Crossing row ประกบ ผลลัพธ์เป็นไปตามที่ระบุไว้ (ยอมรับว่าผิดรูปได้ในกรณีนี้ ไม่ใช่ Bug)

### 2.4 Field contract เพิ่มจากผลพิสูจน์นี้

- `Plot_Position` (ไม่ใช่ `Sort_Order` ตรงๆ) คือ field ที่ใช้เป็นแกน X แบบ `quantitative` ในทุก layer — `Sort_Order` เป็นค่าต้นทางสำหรับ Original rows เท่านั้น
- Category axis label มาจาก lookup/`labelExpr` (ดูข้อจำกัดในหัวข้อ 4) ไม่ใช่ encode `Category` บนแกน X ตรง

### 2.5 ข้อจำกัดที่ต้องระบุตรงไปตรงมาในหนังสือ (ห้ามข้าม)

- เทคนิคนี้ใช้ได้กับ **ชุดข้อมูล Workshop ที่เตรียมไว้ล่วงหน้าผ่าน Power Query** เท่านั้น และ **ใช้ไม่ได้กับหน้ารายงานที่มี Slicer กรอง Category ของ Visual นี้แบบ Interactive** (ดูหัวข้อ 2.3)
- **Template ที่ export ไปใช้กับข้อมูลอื่น ต้องระบุชัดว่า "ไม่ plug-and-play" สำหรับ crossing case** — ผู้ใช้ Template ต้องทำ Power Query step แบบเดียวกันกับข้อมูลใหม่ของตนเองซ้ำทุกครั้ง ไม่ใช่แค่เปลี่ยน field mapping **บทที่ 9 และ 10** (แก้จาก "9 และ 11" ที่ผิด เพราะหนังสือมี 10 บท) ต้องมีคำเตือนนี้ชัดเจน พร้อมตัวอย่าง M code
- คำนวณใน **value space เชิงเส้น (linear scale)** เท่านั้น ถ้า Y-axis เปลี่ยนเป็น log scale หรือ non-linear ตำแหน่งจุดตัดที่ interpolate ไว้จะไม่ตรง — ระบุเป็นข้อจำกัด ไม่รองรับ log scale สำหรับฟีเจอร์นี้

## 3 Business_Type — Design Lock (แก้ M-03)

**พิสูจน์แล้ว** (P1-T02) ว่า test-expression ที่อ่านค่าจาก field แล้วสลับสี ทำงานถูกต้อง

### Lock ใหม่ (แทนที่ Lock เดิมของรอบ 1 ทั้งหมด)

- `Business_Type` เป็น **Column ธรรมดา** บนตาราง `DualLine_PlotData` เดียวกันกับหัวข้อ 2.1 — **ไม่ใช่ DAX Measure อีกต่อไป** เหตุผลที่เปลี่ยนจาก Phase 0: ตอนนั้นกังวลว่า Column จะทำให้ grain เพี้ยนถ้าผูกจากตารางข้อเท็จจริงหลักที่มีค่าไม่ซ้ำได้หลายค่า แต่เมื่อ Lock ให้สร้างตารางเฉพาะสำหรับ Visual นี้ (หัวข้อ 2.1) Power Query เป็นผู้ stamp ค่าเดียวกันซ้ำทุกแถวโดยตรง ไม่มีทางเกิดหลายค่าต่อ Category ได้อีก ปัญหาที่ Phase 0 กังวลจึงไม่มีอยู่จริงในสถาปัตยกรรมนี้ — Column จึงปลอดภัยกว่าและตรงไปตรงมากว่า Measure ที่ต้องพึ่ง `REMOVEFILTERS`
- ค่าต้นทางของ `Business_Type` มาจาก **พารามิเตอร์เดียวที่กำหนดตอนสร้าง Power Query** (literal string หรืออ่านจากตาราง Settings แถวเดียว) แล้ว stamp ลงทุกแถว (`Original`, `Boundary`, และ `Crossing`) ของ `DualLine_PlotData` — ทำครั้งเดียวตอนเตรียม query ไม่ใช่ per-row logic ที่รันซ้ำ
- ค่าที่ยอมรับ: `"Higher is Good"` / `"Lower is Good"` เป๊ะ (case-sensitive)
- **Defensive guard ใหม่**: ทำที่ **Power Query step เดียว** ก่อน stamp — ถ้าค่าต้นทาง Blank/ไม่ตรงกับสองค่านี้ ให้ Power Query แทนด้วย `"Higher is Good"` ก่อน stamp (`Text.Trim` + `List.Contains` เทียบกับ allow-list) วิธีนี้ทำให้ **ไม่มีทางเกิดค่าไม่ตรงกันระหว่างแถวได้เลยโดยโครงสร้าง** (ตัด root cause ที่ M-03 ชี้ ไม่ใช่แค่ป้องกันปลายทาง)
- **QA sanity check** (ไม่ใช่ runtime guard เพราะไม่จำเป็นแล้ว): หลังสร้าง query ตรวจว่าคอลัมน์ `Business_Type` มีค่า **distinct เพียงค่าเดียว** ทั้งตาราง — ถ้าพบมากกว่า 1 ค่าแสดงว่า Power Query step ผิด ต้องแก้ query ไม่ใช่แก้ Vega-Lite
- Vega-Lite `test` expression (เหมือนเดิม ใช้ได้กับ Column เช่นเดียวกับ Measure): `datum.Business_Type == 'Higher is Good' ? ... : ...` รวมกับ `datum.Run_Sign` ตามหัวข้อ 2.1
- **ยังต้องพิสูจน์ใน Phase 2 ด้วย prototype จริงบน Power BI**: ผูก Column นี้แล้วจำนวนแถวใน `dataset` ของ Deneb ต้องเท่ากับจำนวนแถวของ `DualLine_PlotData` พอดี (คาดว่าจะไม่มีปัญหาเพราะเป็น Column บนตารางที่สร้างเองแล้ว แต่ยังต้องยืนยันว่า Deneb ไม่ aggregate/group ซ้ำโดยไม่ตั้งใจ)

## 4 Responsive — Design Lock (แก้ M-04, M-05)

**พิสูจน์แนวคิดแล้ว** (P1-T03) แต่ยังไม่พิสูจน์กับ container resize จริงของ Power BI และมีข้อจำกัดที่ต้องยอมรับตรงไปตรงมา

### 4.1 Category axis label lookup (แก้ M-04 — ยอมรับข้อจำกัด ไม่ claim ว่าพิสูจน์ dynamic แล้ว)

Prototype รอบนี้ใช้ array คงที่ (`['Jan','Feb',...]`) ฝังใน `labelExpr` **ยังไม่พิสูจน์ dynamic lookup จาก `Category` field จริงที่เปลี่ยนตามข้อมูล** เพราะ Vega-Lite's `labelExpr` เป็น expression string ต่อ tick ไม่มีกลไก join กับแถวข้อมูลของ dataset โดยตรงในเวอร์ชันที่ใช้

**Design Lock (ยอมรับข้อจำกัด)**: บทที่ 5 จะสอนให้ผู้อ่านสร้าง `labelExpr` เป็น array ที่ต้องปรับด้วยตัวเองให้ตรงกับ Category ของ Workshop dataset (สร้างจาก Sort_Order → Category mapping ครั้งเดียวตอนเขียน spec) **ระบุเป็นข้อจำกัดของ Template ร่วมกับข้อจำกัดเรื่อง Crossing-case ในหัวข้อ 2.5**: ถ้าผู้อ่านเปลี่ยนจำนวนหรือชื่อ Category ต้องแก้ `labelExpr` array ด้วยตนเอง ไม่ใช่แค่เปลี่ยนข้อมูล — Phase 2 ต้องพิสูจน์ว่ามีทางเลือกที่ dynamic กว่านี้หรือไม่ (เช่น Vega [ไม่ใช่ Vega-Lite] ที่มี `lookup` transform ที่ทรงพลังกว่า) ถ้าไม่มีให้คงข้อจำกัดนี้ไว้

**Amendment Phase 2 (24 ก.ย. 2026, ผู้ใช้เลือกทำแกน dynamic ตามคำแนะนำ Codex R16 M-27) — แทนที่ Design Lock ข้างบน**: spec rev 6 ไม่ใช้ array คงที่แล้ว — อ่านชื่อ Category จาก `dataset` ด้วย params:
- `xAxisSortOrders = pluck(data('dataset'), 'Sort_Order')`, `xAxisCategories = pluck(data('dataset'), 'Category')` (สอง array เรียงตามแถวเดียวกัน; แถว Fill มี Sort_Order เป็น null จึงไม่ถูกเลือก)
- `axis.values = xAxisValues` = `sequence(min, max+1)` ของ Sort_Order (อาศัย `Plot_Position = Sort_Order` ของแถว Original ตาม M code บรรทัด 74)
- `labelExpr` = `xAxisCategories[indexof(xAxisSortOrders, datum.value)]` (ว่างถ้าเดือนนั้นถูกกรองออก)
- `labelOverlap: "greedy"` (Group B) + `labelLimit: 120` ตัดชื่อยาวด้วย "…"
- หลักฐาน headless: ชื่อบนแกนมาจาก Category ครบทั้ง baseline/T09 (ชื่อยาว 38 ตัวอักษร)/T10 (24 categories) ทุก 6 viewport (AXIS-* ใน run-output.txt) — **การไม่ทับซ้อน (Group B) ตัดสินบน Power BI จริงเท่านั้น** เพราะ headless วัดความกว้างอักษรไทยไม่ได้
- ข้อจำกัดเดิม "ต้องแก้ labelExpr เองเมื่อเปลี่ยนข้อมูล" ถูกถอนออก
- **Field contract ของ `Sort_Order` (เพิ่มตาม Codex R17 M-27)**: ควรเป็นเลขจำนวนเต็มเรียงต่อกัน (1, 2, 3, …) — ถ้ามีช่องว่าง ตำแหน่งที่ไม่มีข้อมูลจะเป็น tick ไม่มีชื่อ; ถ้าช่วง min–max ของ Sort_Order เกิน 1000 `xAxisValues` จะเป็น array ว่าง (กันหน่วยความจำ) และแกน X จะไม่มีชื่อเลย; แถว Original ที่ Sort_Order เป็น null จะไม่มีชื่อบนแกน — ครอบคลุมด้วย regression AXIS-edge-* (gaps, hugeGap, nullSome, empty); เดือนที่ถูกกรองออกจะไม่มีชื่อบนแกน
- **~~ข้อจำกัดของ Template: Deneb ไม่ tokenize ชื่อ field ใน `pluck(...)`~~ — ถอนออก (แก้ 24 ก.ย. 2026)**: ข้อความเดิมผิด เขียนจากการดู spec *หลัง import* ไม่ใช่ไฟล์ template — ตรวจไฟล์ template จริงทั้งสองรุ่น (T27-template-export.json, T27-rev6-template-export.json) พบว่า Deneb **tokenize** ชื่อ field ในสตริงของ `pluck(data('dataset'), '__dataset.N__')` ด้วย จึง remap ได้ตามปกติ; ข้อจำกัดของ template ที่ยืนยันแล้วมีเพียงบั๊ก escaping (`\'`) ตอน export และการที่ผู้ใช้ต้องทำ Power Query step เอง; และตอน import Deneb อาจจับคู่ measure ผิดอัตโนมัติ (พบ Reference → "Sum of Actual" ใน T27 รอบที่ 4) บทที่ 9 ต้องสอนให้ตรวจการจับคู่ทุกแถว; template ส่งมอบอยู่ที่ `templates/dual-line-variance.deneb-template.json` (spec rev 7, แก้ escaping แล้ว, ทดสอบ import บน Deneb จริงแล้ว)

### 4.2 กลไก Responsive (Lock เบื้องต้น รอ Phase 2 ยืนยัน)

- Category axis: `"width": "container"` ร่วมกับ `axis.labelOverlap: "greedy"` และ `labelAngle: 0` — ถ้า `width: "container"` ไม่ทำงานตรงตามที่ Deneb ต้องการให้ทดสอบ `autosize: {"type": "fit", "resize": true}` เป็นทางเลือกสำรอง (ทั้งสองทางยังไม่พิสูจน์ใน Power BI จริง)
- **หมายเหตุแก้ Optional improvement รอบ 1**: `labelOverlap: "greedy"` อาจตัด tick สุดท้ายออกได้ ขณะที่ต้นแบบบังคับแสดง Category สุดท้ายเสมอ (`computeThinnedTickValues` มี `push(last)` เสมอ) — ต้องเพิ่ม logic บังคับ tick สุดท้ายใน Phase 2 ถ้าต้องการเทียบเท่าต้นแบบ มิฉะนั้นระบุว่าต่างจากต้นแบบ
- Actual/Reference data label: ย้ายอัลกอริทึม `computeThinningStep`/`computeThinnedTickValues` ของต้นแบบ (D3) มาเป็น Vega expression ที่คำนวณจาก signal ความกว้างของ container จริง (`width` signal) — ต้อง port สูตร `Math.max(1, Math.ceil(estimatedLabelWidth / spacing))` เป็น Vega expression ใน Phase 2

### 4.3 Minimum viewport (แก้ M-05 — ลดสถานะเป็น Provisional)

**Provisional (ยังไม่ Lock จนกว่า Phase 2 พิสูจน์)**: 280×180px เป็นค่าตั้งต้นสำหรับเริ่มทดสอบ **ไม่ใช่ค่าที่ยืนยันแล้ว** เพราะยังไม่ทดสอบร่วมกับจำนวน Category, ความยาวข้อความ, ขนาด font, และ Power BI visual chrome (title bar, border) จริง

Test matrix (หัวข้อ 7) เปลี่ยนจาก "แคบสุด/กว้างสุด" (คำบรรยายกว้างๆ) เป็น**ขนาดตัวเลขที่ทำซ้ำได้** — 4 ขนาดสัดส่วน landscape ใกล้เคียงกัน: `280×180`, `480×270`, `800×450`, `1200×675` (T14–T17) **และเพิ่ม 2 ขนาดที่เปลี่ยน aspect ratio ชัดเจนตามที่ Style guide สัญญาไว้ (แก้ M-21)**: กว้าง-เตี้ย `1200×220` (T34) และ แคบ-สูง `320×700` (T35) — ทดสอบทุกขนาดร่วมกับชุดข้อมูล T09 (Category ยาว) และ T10 (Category มาก) ไม่ใช่แค่ข้อมูล Baseline

## 5 Field Contract ฉบับเต็ม (Lock — แก้ M-14: ระบุ semantics ครบทั้งสาม Row_Type แยกคอลัมน์ ไม่รวมเหมาแบบรอบ 4)

| Field | ประเภท | `Row_Type = Original` (Identity) | `Row_Type = Boundary` (Fill, สำเนา) | `Row_Type = Crossing` (Fill, interpolate) |
| --- | --- | --- | --- | --- |
| `Row_Type` | Text | `"Original"` | `"Boundary"` | `"Crossing"` |
| `Category` | Text | ชื่อ Category เช่น เดือน | **Blank** | **Blank** |
| `Sort_Order` | Whole number | ลำดับเดิม 1,2,3,... ไม่ซ้ำ ต่อเนื่อง | Blank | Blank |
| `Actual` | Decimal | ค่าจริง — Blank (ค่าจริง) → `0` | Blank | Blank |
| `Reference` | Decimal | ค่าเปรียบเทียบ — Blank (ค่าจริง) → `0`; `Reference = 0` → Variance % = Blank | Blank | Blank |
| `Plot_Position` | Decimal | = `Sort_Order` | = `Sort_Order` ของแถว Original ต้นทาง (ไม่ interpolate) | ตำแหน่ง interpolate (เศษส่วน) |
| `Plot_Actual` | Decimal | = `Actual` | = `Actual` ของแถว Original ต้นทาง (คัดลอกตรง) | ค่า interpolate ที่จุดตัด |
| `Plot_Reference` | Decimal | = `Reference` | = `Reference` ของแถว Original ต้นทาง (คัดลอกตรง — แก้ M-13: **ไม่ใช่** `= Plot_Actual`) | = `Plot_Actual` (เท่ากันที่จุดตัดเสมอ) |
| `Segment_ID` | Text | ไม่มีความหมาย (ไม่ใช้ layer นี้) | `"i"` (กรณี C) หรือ `"i-a"`/`"i-b"` (กรณี B) ของ segment ต้นทาง | `"i-a"`/`"i-b"` ของ segment ต้นทาง |
| `Run_Sign` | Whole number | ไม่มีความหมาย (ไม่ใช้ layer นี้) | ตามกรณี B/C ในหัวข้อ 2.0 | ตามกรณี B ในหัวข้อ 2.0 |
| `Business_Type` | Text | ค่าเดียวที่ stamp ทั้งตาราง (หัวข้อ 3) | เดียวกัน | เดียวกัน |
| `Filter_Key` | Text/Date | ค่า Key ของ Category นั้นเอง | ค่า Key ของ `row[i]` ฝั่งซ้ายของ segment — **ไม่ Blank** | ค่า Key ของ `row[i]` ฝั่งซ้ายของ segment — **ไม่ Blank** (แยกจาก `Category`, ใช้เฉพาะเป็น Relationship key ดูหัวข้อ 2.2.1) |

**ตารางนี้เป็นตารางเดียวกับหัวข้อ 2.1 (ไม่ใช่คนละชุด)** — Field contract อ้างอิงหัวข้อ 2.1 โดยตรง ไม่มีคำอธิบาย semantics ที่ขัดกันระหว่างสองหัวข้ออีก

### Grain (แก้ M-11 — สูตรเดียวที่ใช้ตลอดเอกสาร ดูรายละเอียดเต็มในหัวข้อ 2.0)

Grain สำหรับ Identity (Line/Point/Selection/Tooltip) = 1 แถวต่อ 1 Category (`Row_Type = Original` เท่านั้น, จำนวน `N`) — ไม่รองรับ Category ซ้ำ (aggregate ด้วย `SUM` ก่อนถึง Visual ถ้าเกิดขึ้นจริง มี test case T24)

จำนวนแถวทั้งหมดของ Fill dataset (`Row_Type IN ('Boundary','Crossing')`) คำนวณจาก**อัลกอริทึม per-segment** ในหัวข้อ 2.0 โดยตรง (ไม่ใช่สูตรปิดแบบเดียว) — สรุปสั้น: segment ที่ไม่มี fill (`d0=d1=0`) → 0 แถว, segment ปกติ → 2 แถว, segment ที่ crossing → 4 แถว จำนวนแถวรวมทั้งตาราง = `N` (Original สำหรับ Identity) + ผลรวมแถว Fill ของทุก segment

### Blank / Edge-case policy (Lock)

| กรณี | นโยบาย |
| --- | --- |
| Actual Blank (แถว Original) | แปลงเป็น `0` (เลียนแบบต้นแบบ) |
| Reference Blank (แถว Original) | แปลงเป็น `0` (เลียนแบบต้นแบบ) |
| Reference = 0 | Variance % = Blank, tooltip แสดงข้อความแทนค่า % |
| Actual ติดลบ | แสดงผลตามค่าจริง ไม่ clamp เป็น 0 |
| Business_Type ต้นทาง Blank/ไม่ตรง allow-list | Power Query แทนด้วย `"Higher is Good"` ก่อน stamp (หัวข้อ 3) |
| Category ซ้ำ (แถว Original) | ไม่รองรับ — QA ต้องมี test case ยืนยันว่า dataset ตัวอย่างไม่มีเคสนี้ (T24) |
| Filter/Slicer ตัด Category ที่มี Crossing row ประกบ | ยอมรับว่าผิดรูปได้ ระบุเป็นข้อจำกัด (หัวข้อ 2.3, T29) |

## 6 Style Guide (Lock — แก้ M-07)

### 6.1 สีดี/แย่ — แยก Text contrast จาก Non-text distinguishability

**Text contrast (ยืนยันด้วยสูตร WCAG relative luminance, คำนวณจริงแล้ว)** — ใช้เมื่อสีนี้เป็นสีตัวอักษร (data label, legend text) บนพื้นหลังขาว:

| สี | Hex | Contrast vs ขาว | ผ่าน WCAG AA (4.5:1) สำหรับข้อความขนาดเล็ก |
| --- | --- | --- | --- |
| Good text | `#0F766E` (teal-700) | 5.47:1 | ผ่าน |
| Bad text | `#B45309` (amber-700) | 5.02:1 | ผ่าน |
| Actual line/text | `#2563EB` (blue-600) | 5.17:1 | ผ่าน |

**Non-text distinguishability (แก้ M-07 — ต้องไม่พึ่งสีอย่างเดียว)**: teal-700 กับ amber-700 มี contrast ต่อกันเพียง **1.09:1** (คำนวณแล้ว) ซึ่งไม่พอสำหรับแยกพื้นที่ Good/Bad ด้วยสายตาอย่างเดียว โดยเฉพาะภาวะตาบอดสี **ไม่ claim ว่าคู่สีนี้ผ่านการทดสอบ CVD simulation จริง** (แก้คำกล่าวเกินหลักฐานจากรอบ 1) ให้เพิ่ม **Pattern เส้นขอบ** เป็นตัวแยกหลักที่ไม่พึ่งสี:

- พื้นที่ Good: เส้นขอบพื้นที่ (`stroke`) เป็นเส้นทึบ — ใช้ `stroke` บน mark `area` ได้ตรง ๆ
- พื้นที่ Bad: เส้นขอบพื้นที่เป็นเส้นประ — **แก้ไขจากรอบพิสูจน์ Phase 2**: Vega-Lite drop `strokeDash` บน mark `area` เงียบ ๆ (runtime warning "strokeDash dropped as it is incompatible with area" ที่พบตอน render จริงใน Phase 2 ไม่ใช่ตอน static-inspect JSON) ดังนั้นต้องเพิ่ม layer `line` แยกสองชั้น (`bad_area_border_actual`, `bad_area_border_reference`) ที่ทาบทับขอบบน/ขอบล่างของ segment ที่เป็น Bad เท่านั้น (filter เดียวกับ Bad ของ `variance_area` กลับด้วย `!(...)`) แล้วค่อยใช้ `strokeDash` บน mark `line` นั้น (รองรับจริง) — เห็นผลเป็นเส้นประทาบขอบ polygon ของ Bad segment เหมือนเจตนาเดิม
- Connector line: คงสีตาม Good/Bad แต่เพิ่ม **ความหนาต่างกัน** (Good หนากว่า Bad 1px) เป็นตัวช่วยแยกเพิ่มเติม

**สิ่งที่ต้องทำใน Phase 2 ก่อนยืนยันสีสุดท้าย**: ทดสอบคู่สีนี้ผ่าน CVD simulator จริง (เช่น Chrome DevTools Rendering > Emulate vision deficiencies) และปรับถ้าจำเป็น — ห้ามระบุในหนังสือว่า "ผ่านการทดสอบตาบอดสีทุกประเภท" จนกว่าจะมีหลักฐานนี้

### 6.2 สีเส้น

- Actual: `#2563EB` (blue-600) เส้นทึบ
- Reference: `#F59E0B` (amber-500) เส้นประ — ใช้ทั้งสี**และ**ลายเส้นต่างกัน (ไม่พึ่งสีอย่างเดียว)

### 6.3 Typography และ Contrast

- Font: Segoe UI (ค่าเริ่มต้นของ Power BI/Deneb) ขนาดข้อความ Axis/Label ≥ 10px
- ทุกคู่สีข้อความ/พื้นหลังต้องมี contrast ratio ≥ 4.5:1 (WCAG AA) — ตรวจแล้วสำหรับสีในหัวข้อ 6.1 ต้องตรวจซ้ำถ้าเปลี่ยนพื้นหลัง (เช่น label background ไม่ใช่ขาว)

### 6.4 Minimum supported viewport

**Provisional 280×180px** (ดูหัวข้อ 4.3 — ยังไม่ Lock)

## 7 Test Matrix (Lock — แก้ M-08, ปัจจุบันมี 35 รายการ T01–T35 หลังเพิ่ม T31/T32 ในรอบ 4, T33 ในรอบ 7, T34/T35 ในรอบ 8)

| Test ID | สถานการณ์ | กลุ่ม | ทดสอบแบบใด |
| --- | --- | --- | --- |
| T01 | Actual/Reference ปกติ ไม่มีจุดตัด | Baseline | Static |
| T02 | มีจุดตัดระหว่าง Category 1 คู่ | Crossing | Static |
| T03 | มีจุดตัดหลายคู่ต่อเนื่อง (สลับสัญญาณทุกช่วง) | Crossing | Static |
| T04 | Actual = Reference พอดี (diff = 0) ที่ Category จริงเดี่ยวๆ ระหว่างค่าบวก/ลบ (เช่น `+,0,-`) — Expected: segment ทั้งสองข้างเป็นกรณี C (สีตามฝั่งที่ไม่ใช่ศูนย์) ไม่มีพื้นที่สีบวมทับ, เส้น Actual/Reference สัมผัสกันพอดีที่จุดนั้น; **field-level**: แถว `Boundary` ที่จุด diff=0 นี้ต้องมี `Row_Type=Boundary`, `Plot_Actual = Actual` ของ Original ต้นทาง, `Plot_Reference = Reference` ของ Original ต้นทาง, และ `Plot_Actual = Plot_Reference` (เท่ากันเพราะค่าจริงเท่ากันอยู่แล้ว ไม่ใช่ข้อผิดพลาด) | Edge | Static |
| T05 | Actual Blank | Blank | Static |
| T06 | Reference Blank | Blank | Static |
| T07 | Reference = 0 | Divide-by-zero | Static |
| T08 | Actual ติดลบ | Negative | Static |
| T09 | Category ชื่อยาว (> 20 ตัวอักษร) | Long text | Static |
| T10 | จำนวน Category มาก (24+) | Density | Static |
| T11 | Business_Type = `"Higher is Good"` | Business_Type | Static |
| T12 | Business_Type = `"Lower is Good"` | Business_Type | Static |
| T13 | Business_Type ต้นทาง Blank/ไม่ตรง allow-list — Expected (แก้ M-20): (1) ค่าต้นทางถูก normalize เป็น `"Higher is Good"` ก่อน stamp (2) ทุก `Row_Type` (`Original`, `Boundary`, `Crossing`) ได้ค่า `Business_Type` เดียวกันหมดหลัง stamp (3) `DISTINCTCOUNT(Business_Type) = 1` ทั้งตาราง `DualLine_PlotData` (4) ไม่มีค่า Blank หรือค่านอก allow-list หลงเหลือในคอลัมน์นี้เลย | Business_Type | Static |
| T14 | Resize 280×180 | Responsive | Power BI จริง |
| T15 | Resize 480×270 | Responsive | Power BI จริง |
| T16 | Resize 800×450 | Responsive | Power BI จริง |
| T17 | Resize 1200×675 | Responsive | Power BI จริง |
| T34 | Resize 1200×220 (กว้าง-เตี้ย, aspect ratio ต่างจาก T14-T17 — แก้ M-21) | Responsive | Power BI จริง |
| T35 | Resize 320×700 (แคบ-สูง, aspect ratio ต่างจาก T14-T17 — แก้ M-21) | Responsive | Power BI จริง |
| T18 | Cross-filter ทิศทางออก (แก้ M-23): (ก) คลิกจุดข้อมูล (Point layer) แล้ว Visual อื่นที่ผูกกับ Dimension ร่วมถูกกรองถูกต้องตาม Category เดียวที่คลิกจริงผ่าน Relationship แบบ `Both` (หัวข้อ 2.2.1) (ข) คลิกกลางแถบสี Area บริเวณที่ไม่มี Point/Connector คาบเกี่ยว บันทึกผลจริงว่า Visual อื่นเหลือ Category ใดบ้าง (ไม่ใช่แค่ดูว่า Category ที่ resolve ได้เป็น Blank หรือไม่) — ถ้า (ข) ทำให้ Visual อื่นถูกกรองผิด (เหลือหลาย Category ที่ไม่ตรงกับที่คลิก) ต้องเปลี่ยน interaction architecture ก่อน Phase 2 `PASS` — เป็นคำถามเปิดทั้งหมด ไม่ใช่ผลที่ Lock ไว้แล้ว | Interaction | Power BI จริง |
| T19 | Cross-highlight: Visual ต้นทาง (Clustered bar chart) ตั้ง `Highlight` | Interaction | Power BI จริง |
| T20 | Edit interactions ตั้งเป็น `Filter` — ต้องกรอง Visual นี้แบบ Filter ปกติ ไม่เกิด Highlight fields | Interaction | Power BI จริง |
| T21 | Edit interactions ตั้งเป็น `None` — Visual นี้ต้องไม่ตอบสนองต่อ Visual ต้นทางเลย | Interaction | Power BI จริง |
| T22 | Context menu resolve data point (`Show context menu on right-click` + `Attempt to resolve data point-specific actions`) — Right-click ที่ Point layer resolve เป็นแถว Original ได้จริง; Right-click กลางแถบสี Area บันทึกผลจริงว่า resolve เป็นอะไร (คำถามเปิดเดียวกับ T18) | Interaction | Power BI จริง |
| T23 | **(แก้ตาม Phase 2 amendment หัวข้อ 2.1.1)** ผูก Values ตาม configuration ที่ Lock: `Actual`/`Reference` = Sum (measure, เพื่อ Cross-highlight), มี measure ที่ไม่ Blank ทุกแถว `DualLine Row Count = COUNTROWS ( DualLine_PlotData )`, Plot_*/Run_Sign/Sort_Order = Don't summarize — Expected: Deneb `dataset` = จำนวนแถวจริงของ `DualLine_PlotData` (Workshop: 52 = Original 12 + Boundary 22 + Crossing 18) และพื้นที่สี Variance แสดงครบ; ต้องครบ 52 แถวต่อเนื่องเมื่อรับ Cross-highlight (T19) ด้วย; `Business_Type` Column ไม่ทำให้ grain เพี้ยน | Interaction | Power BI จริง |
| T24 | Category ซ้ำในแถว Original (ตรวจว่า QA จับได้ก่อนเข้า Workshop dataset) | Blank/Data quality | Static |
| T25 | Category axis label ไม่ทับซ้อนกันที่ทุกขนาดใน T14–T17, T34, T35 ร่วมกับข้อมูล T09/T10 | Responsive (Group B) | Power BI จริง |
| T26 | Actual/Reference data label thinning ประเมินใหม่ทุกครั้งที่ resize ที่ทุกขนาดใน T14–T17, T34, T35 | Responsive (Group A) | Power BI จริง |
| T27 | Template export/import แล้วนำไปใช้กับข้อมูลใหม่ — ยืนยันว่า field mapping ทำงาน แต่ crossing-case และ labelExpr array **ไม่** ทำงานอัตโนมัติตามข้อจำกัดหัวข้อ 2.5/4.1; **และ (amendment 2.1.1)** ผู้ใช้ Template ต้องสร้าง measure กันแถวหาย (`COUNTROWS` ของตารางตนเอง) ผูกเข้า Values และตรวจว่าจำนวนแถวใน `dataset` หลัง remap เท่ากับตารางต้นทางและพื้นที่สีครบ — Template ไม่นำ measure นี้ไปให้อัตโนมัติ | Template | Power BI จริง |
| T28 | Tooltip เมื่อ `Reference = 0` แสดงข้อความแทนค่า % อย่างเหมาะสม ไม่แสดง `NaN`/`Infinity` | Divide-by-zero | Static |
| T29 | Filter/Slicer ตัด Category **ฝั่งขวา** (`row[i+1]`) ของ segment ที่มี Boundary/Crossing ประกบ ผ่าน Relationship บน `Filter_Key`, ทดสอบทั้ง segment กรณี B (strict crossing) และกรณี C อย่างน้อยหนึ่งตัวอย่างแต่ละแบบ — Expected (แก้ M-17): แถว Fill ของ segment นั้น**ยังไม่ถูกตัด** (เพราะ `Filter_Key` ของทุกแถวยังตรงกับ `row[i]` ฝั่งซ้ายที่เหลืออยู่) เกิดพื้นที่สี "ค้าง" (dangling) เลยขอบ Category ที่ถูกกรองออกไปแล้ว — เอกสาร/หนังสือต้องระบุข้อจำกัดนี้ชัดเจน พร้อมแนะนำ fallback (ทาสีทั้งช่วง) ให้ผู้อ่านเลือกใช้ ถ้าไม่ต้องการผลนี้ ไม่ใช่ปล่อยให้ polygon ผิดรูปโดยไม่มีคำอธิบาย | Crossing (ข้อจำกัด) | Power BI จริง |
| T30 | ยืนยันชื่อ/ตำแหน่ง UI จริงของ Deneb 2.0.0.0 (Project setup pane, Cross-filtering, Cross-highlighting 2 ระดับ, Supporting Fields, Context menu) ด้วยภาพจากเครื่องผู้ใช้ก่อนเขียนบทที่ 8 | UI verification | Power BI จริง |
| T33 | Filter/Slicer ตัด Category **ฝั่งซ้าย** (`row[i]`) ของ segment เดียวกันกับที่ทดสอบใน T29 (คง `row[i+1]` ไว้) ทดสอบทั้ง segment กรณี B และกรณี C — Expected (แก้ M-18): Boundary/Crossing **ทุกแถว**ของ segment นั้นถูกตัดออกทั้งหมด เพราะทุกแถวมี `Filter_Key = key(row[i])` เหมือนกัน ไม่มีแถวใดหลงเหลือ ยืนยันว่า `Filter_Key` ผูกกับฝั่งซ้ายจริงและ stamp สม่ำเสมอทั้ง Boundary และ Crossing | Crossing (ข้อจำกัด) | Power BI จริง |
| T31 | Pattern `+,0,0,-` (zero-run ยาว 2 ระหว่าง run ต่างเครื่องหมาย) — Expected: segment(+,0)=กรณี C สีตามฝั่งบวก, segment(0,0)=กรณี A ไม่มีพื้นที่สี, segment(0,-)=กรณี C สีตามฝั่งลบ รวม 4 fill-rows; **field-level**: ทั้ง 4 แถวเป็น `Row_Type=Boundary` (ไม่มี Crossing เพราะไม่มี strict crossing ในกรณีนี้), แถวที่คัดลอกจาก 2 จุดศูนย์ต้องมี `Plot_Actual=Plot_Reference` ถูกต้องตามกฎ diff=0, แถวที่คัดลอกจากจุดบวก/ลบต้องมี `Plot_Actual≠Plot_Reference` | Crossing (edge case) | Static |
| T32 | Pattern `+,0,0,+` (zero-run ยาว 2 ระหว่าง run เครื่องหมายเดียวกัน) — Expected: ได้ 2 polygon สีเขียวแยกกันมีช่องว่างไม่มีสีคั่นกลาง ไม่เชื่อมเป็นโพลิกอนเดียว (ตรงกับที่ `segmentFill.ts` ไม่เคยรวม segment ข้ามกัน); **field-level**: เช่นเดียวกับ T31 ทั้ง 4 แถวเป็น `Row_Type=Boundary`, จุดศูนย์ทั้งสองมี `Plot_Actual=Plot_Reference` ถูกต้อง | Crossing (edge case) | Static |

T01–T13, T24, T28, T31, T32 ทดสอบแบบ static ได้ใน Phase 2 ด้วย Vega-Lite/ตัวอย่างข้อมูล — ที่เหลือต้องมี Evidence record จาก Power BI จริงตามหัวข้อ 8

## 8 Evidence Record Template (Lock — แก้ M-09)

```text
Test ID:
Power BI Desktop version:
Deneb version:
PBIX file / hash:
Dataset/spec version หรือ hash:
จำนวน Category / test scenario ที่ใช้:
Viewport (กว้าง×สูง px):
Display scaling ของ Windows (%):
Visual ต้นทาง (ชนิด) และ Interaction mode ที่ตั้ง (Highlight/Filter/None):
Supporting Fields ที่เปิด (แยก Actual/Reference: Highlight value / Highlight status / Highlight comparator):
Interactivity settings อื่นที่เปิดใน Deneb:
ขั้นตอนทำซ้ำ:
Expected:
Actual:
หลักฐาน (ภาพ/วิดีโอ):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

Test ที่ไม่มี Evidence record ครบ = สถานะ `NOT TESTED` ห้ามเข้า release ฉบับ Final

## 9 สิ่งที่ยังไม่ปิดหลัง Phase 1 (ส่งต่อ Phase 2)

1. Business_Type Column grain proof บน Power BI จริง (T23)
2. Category axis label responsive proof บน Power BI จริง ที่ 6 ขนาด viewport ครบทั้ง T14–T17, T34, T35 (T25)
3. Data label thinning responsive proof บน Power BI จริง (T26) — ต้อง port อัลกอริทึมจาก D3 เป็น Vega expression ก่อน
4. CVD simulation จริงของคู่สี teal/amber + ยืนยัน pattern เส้นขอบช่วยแยกได้จริงเมื่อจำลองภาวะตาบอดสี
5. ยืนยันชื่อ/ตำแหน่ง UI ของ Deneb 2.0.0.0 ด้วยภาพจริงจากเครื่องผู้ใช้ (T30 — ย้ายมาเป็นเงื่อนไข Phase 2 ตามข้อเสนอแก้ M-10 ในหัวข้อ 1)
6. Filter/Slicer ที่ตัด Category ประกบ Crossing/Boundary row (T29/T33) และ Template limitation (T27) ต้องมีตัวอย่างจริงประกอบก่อนเขียนบทที่ 9/10
7. ทางเลือกที่ dynamic กว่าสำหรับ Category label lookup (Vega เต็มรูปแบบ หรือวิธีอื่น) — ถ้าไม่มีให้คงข้อจำกัดใน 4.1 ไว้ถาวร
8. **T18/T22 และความปลอดภัยของ Area interaction (แก้ M-23)** — พิสูจน์บน Power BI จริงว่าคลิก/right-click กลางแถบสี Area ทำให้เกิด selection/filter ที่ผิดหรือไม่ (ตามการวิเคราะห์ในหัวข้อ 2.2 ว่า `Filter_Key` หลายค่าอาจ propagate ผ่าน Relationship แบบ `Both`) ถ้าพบว่าผิดจริง ต้องเปลี่ยน interaction architecture (เช่น Advanced cross-filtering mode) ก่อน Phase 2 จะ `PASS` ตาม Phase 2 ข้อ 7 ของ `PROJECT_PLAN.md` — เป็นรายการที่มีน้ำหนักสูงสุดในรายการนี้ เพราะกระทบความถูกต้องของ Cross-filter ทั้งฟีเจอร์ ไม่ใช่แค่ Edge case
