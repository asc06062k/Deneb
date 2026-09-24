# Phase 2 — Evidence Record Template (ต้องทดสอบบน Power BI Desktop + Deneb จริง)

Claude/Codex ไม่มีสิทธิ์เข้าถึง Power BI Desktop หรือ Deneb Editor จริง — รายการนี้ต้องให้**ผู้ใช้เป็นผู้ทดสอบบนเครื่องจริง**แล้วกรอกผลกลับมา ตามรูปแบบที่ Lock ไว้ใน [PHASE1_DESIGN_PLAN.md](../review/PHASE1_DESIGN_PLAN.md) หัวข้อ 8 Test ใดไม่มี Evidence ครบ = สถานะ `NOT TESTED` และห้ามเข้า release ฉบับ Final ตาม `PROJECT_PLAN.md`

**เวอร์ชันที่ต้อง Lock ก่อนเริ่ม**: Power BI Desktop `2.157.1354.0` (64-bit), Deneb `2.0.0.0` — ถ้าเครื่องจริงใช้เวอร์ชันอื่น ให้บันทึกเวอร์ชันจริงและแจ้งกลับก่อนทดสอบต่อ เพราะชื่อ/ตำแหน่ง UI อาจเปลี่ยนไปจากที่เอกสารอ้างอิง

**ไฟล์ที่ต้องใช้**:
- Dataset: `data/DualLineVariance_Workshop_Data.csv`, `data/DualLineVariance_Settings.csv`
- Power Query: `specs/DualLine_PlotData_PowerQuery.pq` (วางใน Power Query Advanced Editor เพื่อสร้างตาราง `DualLine_PlotData`)
- DAX: `dax/workshop-measures.dax`
- Vega-Lite spec: `specs/dual-line-variance-final.vl.json` (วางใน Deneb Editor ผูก `data.name = "dataset"` เข้ากับ `DualLine_PlotData`)

**วิธีผูก Values ของ Deneb (เพิ่ม 24 ก.ย. 2026 หลังเห็นภาพ T30-01 ที่ผูกไว้เพียง 4 field จาก query ชื่อ `Query` จนได้ dataset 12 แถวและกราฟว่าง)** — ต้องผูกจากตาราง `DualLine_PlotData` (เปลี่ยนชื่อ query จาก `Query` ใน Power Query ก่อน):
- ตั้งเป็น **Don't summarize** (คลิกลูกศรที่ field ในช่อง Values): `Plot_Position`, `Plot_Actual`, `Plot_Reference`, `Run_Sign`, `Sort_Order` — ถ้าปล่อยเป็น Sum จะเหลือไม่ถึง 52 แถว (คอลัมน์ข้อความอย่างเดียวแยกแถวได้แค่ 50 แถว ตรวจจาก `qa/scripts/workshop-plotdata.json`)
- คอลัมน์ข้อความ: `Row_Type`, `Category`, `Segment_ID`, `Business_Type`, `Filter_Key`
- **measure ที่ต้องมีเสมอ**: `DualLine Row Count = COUNTROWS ( DualLine_PlotData )` (ดู `dax/workshop-measures.dax`) — ถ้าไม่มี แถว Boundary/Crossing จะหายเหลือ 12 แถว (T23 รอบที่ 1)
- **คง Sum ไว้** (เป็น measure): `Actual`, `Reference` — เพื่อให้ Deneb สร้าง `Actual__highlight`/`Actual__highlightStatus`/`Reference__highlight`/`Reference__highlightStatus` ที่ spec ใช้ (แถว Boundary/Crossing มีค่า null — Power BI จะตัดแถวเหล่านี้ทิ้งถ้าไม่มี `DualLine Row Count`)
- ชื่อใน Values ต้องเป็นชื่อ field ตรงตัว (เช่น `Actual` ไม่ใช่ `Sum of Actual`) — ถ้า Power BI เติม "Sum of" ให้ rename ในช่อง Values
- หลังผูกแล้ว Data pane ของ Deneb ต้องแสดง **1-52 of 52**

แบบฟอร์มด้านล่างมีทุกช่องพร้อม Test ID และ Expected ที่ Lock ไว้แล้ว — กรอกเฉพาะส่วนที่เหลือ (Actual, หลักฐาน, ผู้ทดสอบ, วันที่, ผลสรุป)

---

## T18 — Cross-filter ทิศทางออก (ความสำคัญสูงสุด — ดู M-23)

```text
Test ID: T18
Power BI Desktop version:
Deneb version:
PBIX file / hash:
Dataset/spec version หรือ hash: dual-line-variance-final.vl.json (Phase 2)
จำนวน Category / test scenario ที่ใช้: 12 (Workshop dataset)
Viewport (กว้าง×สูง px):
Display scaling ของ Windows (%):
Visual ต้นทาง (ชนิด) และ Interaction mode ที่ตั้ง (Highlight/Filter/None): N/A (นี่คือทิศทางออก — Visual นี้เป็นต้นทาง)
Supporting Fields ที่เปิด: N/A
Interactivity settings อื่นที่เปิดใน Deneb: Expose cross-filtering values for dataset rows (Simple mode), Relationship DualLine_PlotData<->Dimension ร่วม ตั้ง Cross-filter direction = Both
ขั้นตอนทำซ้ำ:
  (ก) คลิกที่จุดข้อมูล (Point layer) เดือนใดเดือนหนึ่ง แล้วดู Visual อื่นที่ผูกกับ Dimension เดียวกัน
  (ข) คลิกกลางแถบสี Area ในบริเวณที่ไม่มี Point/Connector คาบเกี่ยว แล้วดู Visual อื่น
Expected:
  (ก) Visual อื่นกรองเหลือเฉพาะเดือนที่คลิกจริง
  (ข) เป็นคำถามเปิด — บันทึกผลจริงว่า Visual อื่นเหลือ Category ใดบ้าง (ดู PHASE1_DESIGN_PLAN.md หัวข้อ 2.2 ว่าอาจกรองผิดหลาย Category พร้อมกัน)
Actual (ก) (24 ก.ย. 2026): Clear selections แล้วคลิกซ้ายที่จุดของ ต.ค. → Clustered column chart "Sum of Actual by Category" highlight แท่ง ต.ค. เพียงแท่งเดียว (Visual ปลายทางใช้ Highlight ตาม default interaction ไม่ใช่ Filter — ผลการเลือกเดือนตรงกัน)
Actual (ข) ครั้งที่ 1 (24 ก.ย. 2026): Clear selections แล้วคลิกซ้ายในพื้นที่สีของ segment พ.ค.–มิ.ย. ชิดฝั่ง มิ.ย. → column chart highlight แท่ง **มิ.ย.** — **สรุปไม่ได้**: ตาม Field contract แถว Boundary ทั้งสองแถวของ segment นี้มี Filter_Key = พ.ค. ถ้าคลิกโดน Area จริงควรได้ พ.ค.; การได้ มิ.ย. บ่งว่าคลิกโดน mark อื่น (จุด/เส้น/connector ของแถว Original มิ.ย.) เพราะ segment นี้เป็นกรณี C ที่ diff = 0 ที่ มิ.ย. พื้นที่สีจึงแคบลงเหลือศูนย์ใกล้ มิ.ย. — ต้องทดสอบซ้ำใน segment ที่พื้นที่สีกว้างฝั่งขวา
Visual ปลายทาง: Clustered column chart ใช้ Category จาก DualLineVariance_Workshop_Data (ผู้ใช้ยืนยัน) — relationship DualLine_PlotData → DualLineVariance_Workshop_Data: DualLine_PlotData[Filter_Key] → DualLineVariance_Workshop_Data[Category], Many to one (*:1), Cross-filter direction = Both, active — ตรงตาม Design Plan หัวข้อ 2.2.1 (หลักฐาน qa/evidence/phase2-powerbi/T18-00-relationship-filterkey.png) ดังนั้นผล (ข) ครั้งที่ 1 ที่ได้ มิ.ย. ไม่ได้มาจาก relationship ผิด — ยิ่งสนับสนุนว่าคลิกโดน mark ของแถว Original มิ.ย.
Actual (ข) ครั้งที่ 2 (24 ก.ย. 2026, ผู้ใช้ทำลูกศรชี้จุดคลิกในภาพ):
  - T18-03: คลิกซ้ายกลางสามเหลี่ยมน้ำตาลของ segment ม.ค.–ก.พ. (ส่วน i-b หลังจุดตัด ชิดฝั่ง ก.พ.) → column chart highlight **ม.ค.** เพียงแท่งเดียว
  - T18-04: คลิกซ้ายกลางสามเหลี่ยมน้ำตาลของ segment ก.พ.–มี.ค. (ส่วน i-a ก่อนจุดตัด ชิดฝั่ง ก.พ.) → highlight **ก.พ.** เพียงแท่งเดียว
  สรุป: ใน crossing segment สองกรณีที่ทดสอบ Area-click resolve เป็น Filter_Key = Category ฝั่งซ้ายของ segment และเลือก Category เดียว ไม่พบการเลือกหลาย Category ในสองกรณีนี้ (ยังไม่ครอบคลุม Case C และ T22) — **และ** พื้นที่สีที่อยู่ติดเดือนใดเดือนหนึ่งทางด้านซ้าย (เช่น สามเหลี่ยมก่อน ก.พ.) จะเลือกเดือนก่อนหน้า (ม.ค.) ซึ่งอาจไม่ตรงกับที่ผู้ใช้คาด — ผู้ใช้ตัดสินแล้ว 24 ก.ย. 2026 ให้ยอมรับและบันทึกเป็นพฤติกรรมในหนังสือ (Design Plan หัวข้อ 2.2.2) ไม่แก้ architecture
หลักฐาน (ข) ครั้งที่ 2: qa/evidence/phase2-powerbi/T18-03-click-area-jan-feb-near-feb.png, T18-04-click-area-feb-mar-near-feb.png
หลักฐาน (ภาพ/วิดีโอ): ภาพ 2 ภาพที่ผู้ใช้ส่งในแชท 24 ก.ย. 2026 (ยังไม่ได้บันทึกเป็นไฟล์ใน qa/evidence — ต้องขอไฟล์ภาพ)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: (ก) PASS (รอไฟล์ภาพ) / (ข) PARTIAL — crossing segment 2 กรณี: Category เดียว = ฝั่งซ้ายของ segment ตาม Design; ผู้ใช้ตัดสิน 24 ก.ย. 2026 ให้ยอมรับพฤติกรรมนี้และเขียนในบทที่ 8 (Design Plan หัวข้อ 2.2.2); ยังต้องทดสอบ Case C (พ.ค.–มิ.ย. บริเวณพื้นที่กว้างชิด พ.ค.) และกรอก Evidence record ให้ครบ (version, PBIX/hash, viewport) — (ก) ยังขาดไฟล์ภาพของการคลิกจุด ต.ค.
```

**ถ้า (ข) กรองผิด**: ต้องเปลี่ยน interaction architecture (เช่น Advanced cross-filtering mode ของ Deneb) ก่อน Phase 2 จะ `PASS` ตาม `PROJECT_PLAN.md` Phase 2 ข้อ 7 — แจ้งผลกลับก่อนดำเนินการต่อ ไม่ต้องแก้เอง

---

## T19 — Cross-highlight (Visual ต้นทาง = Clustered bar chart)

```text
Test ID: T19
Power BI Desktop version:
Deneb version:
Visual ต้นทาง (ชนิด) และ Interaction mode ที่ตั้ง: Clustered bar chart, Edit interactions = Highlight
Supporting Fields ที่เปิด: Highlight value + Highlight status สำหรับ Actual และ Reference (Supporting Fields: dataset)
Interactivity settings อื่นที่เปิดใน Deneb: Expose cross-highlight values for measures
ขั้นตอนทำซ้ำ: คลิก/เลือกแถบใน Clustered bar chart แล้วดู Dual-Line Variance Chart
Expected: จุดข้อมูลที่ไม่ถูกเลือกแสดงผลจางลง/ต่างจากจุดที่ถูก highlight (ตาม __highlight/__highlightStatus)
Actual ส่วนที่ 1 — ชื่อ field (24 ก.ย. 2026): เปิด Highlight value + Highlight status ของ Actual และ Reference แล้ว Data pane มีคอลัมน์ Actual__highlight, **Actual__highlightStatus**, Reference__highlight, **Reference__highlightStatus** — ชื่อตรงกับที่ spec ใช้ใน opacity condition ทุกตัว (ยืนยัน M-05/M-09 ที่ระดับชื่อ field); ขณะยังไม่มี highlight จาก Visual อื่น แถวที่เห็นในภาพ (Actual = null) มีค่า status = "on" — spec ทำให้จางเฉพาะเมื่อ = "off" จึงแสดงปกติ (opacity 1) ไม่ว่าค่าตอนไม่มี highlight จะเป็น "on" หรือ "neutral"; dataset ยังคง 52 แถว (1-50 of 52)
Actual ส่วนที่ 2 — ความพยายามครั้งที่ 1 (24 ก.ย. 2026, วิดีโอ 42 วินาที ScreenSketch 20260924-0654-08 — ไฟล์วิดีโอ 19.9 MB ไม่ได้คัดลอกเข้า repo; ใช้ภาพ timeline 1 fps แทน): อยู่ในโหมด Edit interactions แล้วคลิกแท่ง ต.ค. และ มิ.ย. ของ Column chart → Power BI เปิดหน้า "Category/Actual" แบบตาราง (ต.ค. 560, มิ.ย. 480) แทนการเลือกแท่ง ไม่เกิด highlight บน Dual-Line chart; เมื่อเปิด Deneb editor ภายหลัง Data pane แสดง Actual__highlightStatus/Reference__highlightStatus = "neutral" และ 1-50 of 52 แถว — **ยังไม่ได้ทดสอบพฤติกรรม highlight จริง** (การเห็นค่า "on" ใน T19-01 น่าจะเกิดขณะมี selection ค้างอยู่ — ยังไม่ยืนยัน)
หลักฐานเพิ่ม: qa/evidence/phase2-powerbi/T19-02-status-neutral-52rows.png, T19-03-attempt1-video-timeline.png
  ปัญหาที่พบ (ใช้ประกอบบทที่ 8 "ปัญหาที่อาจพบ"): Column chart ตัวเดิมเปิดหน้า "Show data point as a table" ทุกครั้งที่คลิกซ้ายที่แท่ง (ภาพ T19-00) — แก้ได้โดยลบแล้วสร้าง Clustered column chart ใหม่ (สาเหตุของ Visual ตัวเดิมยังไม่ทราบ)
Actual ส่วนที่ 2 — ความพยายามครั้งที่ 2 (24 ก.ย. 2026): Column chart ใหม่ คลิกแท่ง ก.ค. → แท่ง ก.ค. ถูกเลือก (แท่งอื่นจาง) แต่ Dual-Line chart **ไม่จางลงเลย** (ภาพ T19-04) — ยังไม่ทราบว่า Edit interactions ของ Column chart ใหม่ → Dual-Line ตั้งเป็น Highlight แล้วหรือไม่ และ Deneb ได้รับค่า __highlightStatus = off หรือไม่ (ถ้าเป็น Filter กราฟควรเหลือเฉพาะ ก.ค. — ไม่เป็นเช่นนั้น) → FAIL/INCONCLUSIVE รอตรวจ interaction mode + Data pane
Actual ส่วนที่ 2 — ความพยายามครั้งที่ 3 (24 ก.ย. 2026, ภาพ T19-05): อยู่ในโหมด Edit interactions (ไอคอน Filter/Highlight/None ใต้ Dual-Line) ผู้ใช้ระบุว่าตั้ง Highlight — เลือกแท่ง ก.ค. แล้ว Dual-Line **ไม่จางเลย** และแสดงครบทุกเดือน (ภาพไม่ชัดพอจะยืนยันว่าไอคอนใดถูกเลือก) — ยังไม่ทราบค่า __highlightStatus ขณะนั้น
Actual ส่วนที่ 2 — ข้อมูลที่ Deneb ได้รับขณะ highlight (24 ก.ย. 2026, ภาพ T19-06, Column chart ใหม่ = Highlight, เลือก ก.ค., 1-52 of 52): แถว Original ก.ค. (Sort_Order 7) Actual__highlight = 510 (= Actual); แถว Original อื่น (380, 520) Actual__highlight = null; **Actual__highlightStatus = "on" ทุกแถว** รวมแถวที่ไม่ถูก highlight และแถว Boundary/Crossing (ภาพไม่ได้แสดงคอลัมน์ Reference__highlight/Reference__highlightStatus — พฤติกรรมฝั่ง Reference ยังไม่มีหลักฐาน) — **ต่างจากเอกสาร deneb.guide** ที่ระบุว่า "off" = มี highlight แต่ measure ไม่ถูก highlight; spec rev 3 ทำให้จางเฉพาะ "off" จึงไม่จางเลย → FAIL ของ spec rev 3 (สาเหตุยืนยันแล้ว)
  การแก้ (spec rev 4, ปรับตาม Codex R12 M-25): แต่ละ point layer จางตาม measure ของตัวเองเท่านั้น — จุด Actual ดู Actual__*, จุด Reference ดู Reference__* — เมื่อ status = "off" หรือ (status = "on" และ __highlight !== ค่าจริง); เส้นจางทั้งเส้นเมื่อ status ≠ "neutral"; ไม่จางถ้าไม่มี field — ทดสอบ headless 8 สถานการณ์ (absent/neutral/observed/documented/actualOnly/referenceOnly/actualFieldsOnly/zeroValue) + regression 2 ข้อ (เงื่อนไข rev 3 และเงื่อนไข OR สอง measure ต้องถูกจับได้) ผ่านทั้งหมด (HL-* ใน qa/evidence/phase2-workshop-steps/run-output.txt, ภาพตัวอย่าง HL-observed-july-preview.png) — **ยังต้องทดสอบซ้ำบน Deneb จริงด้วย spec rev 4**
  row preservation ระหว่าง highlight: 1-52 of 52 ✅ (ปิดส่วน (ข) ของ T23)
หลักฐาน (ภาพ/วิดีโอ): qa/evidence/phase2-powerbi/T19-01-highlightstatus-fields.png
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
Actual ส่วนที่ 2 — spec rev 4 บน Deneb จริง (24 ก.ย. 2026, ภาพ T19-07 + ภาพขยาย T19-08): ขณะ highlight ก.ค. จาก Column chart, preview ใน Deneb editor แสดงเส้น Actual/Reference จางทั้งเส้น, จุด Actual/Reference ของเดือนอื่นจาง, จุด ก.ค. ทั้ง 510 (Actual) และ 520 (Reference) แสดงเข้ม — ตรงกับ HL-observed; dataset 1-52 of 52; พื้นที่สี/connector/label ไม่จางตาม Design — ข้อจำกัด: เห็นผลใน preview ของ Deneb editor ขณะมี highlight (ไม่ใช่ภาพหน้ารายงาน), ภาพไม่แสดงคอลัมน์ Reference__highlight* แต่จุด Reference ของ ก.ค. เข้มและเดือนอื่นจางสอดคล้องกับ rev 4, ยืนยันไม่ได้จากภาพว่าเป็น spec rev 4 ล่าสุด (หลัง M-25) — ผู้ใช้ได้รับแจ้งให้ copy ใหม่ก่อนทดสอบ
ผลสรุป: PASS WITH LIMITATION — ชื่อ field PASS; rev 3 FAIL (สาเหตุยืนยันแล้ว T19-06); rev 4 แสดงผลจางถูกต้องบน Deneb จริง (T19-07/08) — ยังขาด Evidence record fields (version, PBIX) และภาพหน้ารายงาน
```

---

## T20 — Edit interactions = Filter

```text
Test ID: T20
Visual ต้นทาง: Clustered bar chart, Edit interactions = Filter
ขั้นตอนทำซ้ำ: เลือกแถบใน Visual ต้นทาง
Expected: Dual-Line Variance Chart ถูกกรองแบบ Filter ปกติ ไม่ใช่ Highlight fields
Actual (24 ก.ย. 2026, ภาพ T20-01): Clustered column chart (ใหม่) ตั้ง Filter แล้วเลือกแท่ง ก.ค. → Dual-Line เหลือจุด/label ของ ก.ค. เดียว (ไม่มีเส้นเพราะเหลือแถว Original แถวเดียว) + พื้นที่สีของ segment ก.ค.–ส.ค. ครบทั้งสามเหลี่ยมน้ำตาลและเขียวจนถึงตำแหน่ง ส.ค. (Filter_Key = ก.ค.) แต่ไม่มีจุด ส.ค.; พื้นที่ของ segment มิ.ย.–ก.ค. หายไป (Filter_Key = มิ.ย.); แกน X แสดง ก.ค.–ส.ค.; แกน Y คำนวณใหม่ ~496–534 สอดคล้องกับสูตร ±18% ของ extent 500–530 (คาด [494.6, 535.4] — ยังไม่เห็นค่า signal)
  ข้อสังเกตด้าน UX: พื้นที่สีที่ยื่นไปถึงตำแหน่งเดือนที่ถูกกรองออก (ส.ค.) โดยไม่มีจุด ส.ค. เป็นผลตาม Design (T29) ที่ผู้อ่านอาจงง — ต้องอธิบายในบทที่ 9
หลักฐาน: qa/evidence/phase2-powerbi/T20-01-filter-mode-july.png
ผลสรุป (เบื้องต้น): PASS — กรองตาม Filter_Key ตาม Design (ยังขาด Evidence record fields: version, PBIX)
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T21 — Edit interactions = None

```text
Test ID: T21
Visual ต้นทาง: Clustered bar chart, Edit interactions = None
ขั้นตอนทำซ้ำ: เลือกแถบใน Visual ต้นทาง
Expected: Dual-Line Variance Chart ไม่ตอบสนองเลย
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T22 — Context menu (รวมกรณี Area ที่เป็นคำถามเปิดจาก M-23)

```text
Test ID: T22
Interactivity settings: Show context menu on right-click + Attempt to resolve data point-specific actions
ขั้นตอนทำซ้ำ:
  (ก) Right-click ที่ Point layer (จุดข้อมูล)
  (ข) Right-click กลางแถบสี Area (ไม่มี Point คาบเกี่ยว)
Expected:
  (ก) Context menu resolve เป็นแถว Original/Category จริง
  (ข) คำถามเปิด — บันทึกว่า resolve เป็นอะไรจริง (ไม่ควร resolve ผิด Category)
Actual (เบื้องต้น 24 ก.ย. 2026 — ตีความจากภาพ ยังไม่ได้ยืนยันจุดคลิกกับผู้ใช้):
  - Context menu ของ Power BI ขึ้นจริงทั้งสองภาพ รายการ: Copy, Show as a table, Include, Exclude, Group (ปิด), Clear selections, Summarize (ปิด), Format, New visual calculation, Set up a verified answer (ปิด) — มี Include/Exclude แปลว่า resolve เป็น data point ได้
  - ภาพ T22-01: เมนูเปิดที่ตำแหน่งใกล้จุด Reference ของ พ.ค. (470); Clustered column chart "Sum of Actual by Category" ด้านขวา highlight แท่ง พ.ค. เพียงแท่งเดียว
  - ภาพ T22-02: เมนูเปิดที่ตำแหน่งในพื้นที่สีเขียวของ segment พ.ค.–มิ.ย. (ชิดฝั่ง พ.ค.); column chart highlight แท่ง พ.ค. เพียงแท่งเดียว — สอดคล้องกับ Filter_Key ของแถว Boundary = Category ฝั่งซ้ายของ segment
  - ยังไม่ทราบ: (1) highlight บน column chart มาจากการคลิกขวาครั้งนี้หรือจากการคลิกซ้ายก่อนหน้า (2) column chart ใช้ Category จากตารางใด และมี relationship Filter_Key ตามที่ Lock หรือไม่ (3) กรณีคลิกพื้นที่สีชิดฝั่งขวาของ segment (ใกล้ มิ.ย.) จะ resolve เป็น พ.ค. หรือไม่ — ซึ่งจะเป็นความเสี่ยง "resolve ผิด Category" ตาม M-23
หลักฐาน: qa/evidence/phase2-powerbi/T22-01-rightclick-near-may-reference-point.png, T22-02-rightclick-area-may-june-segment.png
ผลสรุปเบื้องต้น: PARTIAL — Context menu ทำงาน; ความถูกต้องของ Category ที่ resolve จาก Area ยังสรุปไม่ได้
ผู้ทดสอบ:
วันที่:
ผลสรุป: PARTIAL (ดูผลสรุปเบื้องต้นด้านบน)
```

---

## T23 — Business_Type Column ไม่กระทบ grain

```text
Test ID: T23
ขั้นตอนทำซ้ำ: เปิด Data pane ของ Deneb ตรวจจำนวนแถวใน dataset เทียบกับจำนวนแถวจริงของ DualLine_PlotData (52 แถวสำหรับ Workshop dataset — ดู qa/scripts/workshop-plotdata.json)
Expected: จำนวนแถวตรงกันพอดี ไม่ถูก Deneb aggregate/group ซ้ำ — configuration ที่ Lock (Design Plan 2.1.1): Actual/Reference = Sum, มี DualLine Row Count, Plot_*/Run_Sign/Sort_Order = Don't summarize; ต้องได้ 52 แถว = Original 12 + Boundary 22 + Crossing 18 และพื้นที่สีครบ; ต้องยังครบ 52 แถวขณะรับ Cross-highlight (ตรวจร่วมกับ T19)
Actual: [รอบที่ 1 — 24 ก.ย. 2026] ผูกครบ 12 field จากตาราง DualLine_PlotData (ตั้งชื่อถูกแล้ว) แต่ Data pane แสดง **1-12 of 12** — มีเฉพาะแถว Original (Run_Sign/Segment_ID = null) แถว Boundary/Crossing 40 แถวหายทั้งหมด กราฟจึงไม่มีพื้นที่สี Variance
  สมมติฐาน (ยังไม่ยืนยัน): Actual/Reference ผูกเป็น Sum (implicit measure) เพื่อให้มี __highlight field — แถว Boundary/Crossing มี Actual/Reference = Blank ตาม Field contract (PHASE1_DESIGN_PLAN.md หัวข้อ 5) เมื่อ measure ทุกตัวของแถวเป็น Blank Power BI จะตัดแถวนั้นออกจาก query ก่อนส่งให้ Visual — Design Plan ไม่ได้คาดการณ์เรื่องนี้
  ทดสอบวินิจฉัย: (1) เอา Actual/Reference ออกจาก Values ชั่วคราว → ถ้าได้ 52 แถว สมมติฐานถูก (2) ใส่กลับ + เพิ่ม measure ที่ไม่ Blank ทุกแถว เช่น DualLine Row Count = COUNTROWS ( DualLine_PlotData ) → คาดว่าได้ 52 แถวพร้อม __highlight fields
หลักฐาน (screenshot ของ Data pane): qa/evidence/phase2-powerbi/T23-01-dataset-12-rows.png
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: FAIL (รอบที่ 1)
Actual รอบที่ 2 (24 ก.ย. 2026): ผลทดสอบวินิจฉัยยืนยันสมมติฐาน — (1) เอา Actual/Reference ออก → 1-50 of 52 และพื้นที่สีแสดง (2) ใส่กลับ + measure DualLine Row Count → 1-50 of 52 (รวม 52 แถว) พื้นที่สี Good/Bad แสดงครบบน Deneb จริง, Category = null และ Filter_Key มีค่าในแถว Boundary/Crossing ตาม Field contract
หลักฐาน รอบที่ 2: qa/evidence/phase2-powerbi/T23-02-diagnostic-no-measures-52-rows.png, T23-03-row-count-measure-52-rows.png
ผลสรุป รอบที่ 2: PARTIAL — (ก) base configuration PASS: 52 แถวรวม (เห็นยอดรวม 1-50 of 52 และตัวอย่างแถว Boundary/Crossing แต่ภาพไม่ได้แสดงการนับแยก Original 12 / Boundary 22 / Crossing 18 โดยตรง) และพื้นที่สีครบ โดยมี DualLine Row Count ใน Values (Lock ใน PHASE1_DESIGN_PLAN.md หัวข้อ 2.1.1) (ข) row preservation ระหว่างรับ Cross-highlight: PASS — 1-52 of 52 ขณะ highlight ก.ค. (ภาพ T19-06)
```

---

## T36 — แกน Y อัตโนมัติ ±18% แบบต้นแบบ (เพิ่ม 24 ก.ย. 2026 ตามคำตัดสินผู้ใช้ + Codex R6)

spec คำนวณ domain จาก `data('dataset')` ทุกแถว ดู `params` ใน `specs/dual-line-variance-final.vl.json` — ทุกกรณีดูค่าต่ำสุด/สูงสุดของแกน Y ที่แสดง (หรือ signal `yDomainMin`/`yDomainMax` ใน Signal viewer ของ Deneb)

```text
Test ID: T36-A (ข้อมูลเต็ม ไม่มี filter)
Expected: Signal yDomainMin = 340.4, yDomainMax = 639.6 (ข้อมูล 380–600); แกน Y ไม่เริ่มที่ 0; ยืนยันด้วยว่า Deneb ใช้ชื่อ data source "dataset" จริง (ถ้าไม่ใช่ แกนจะเป็น [0, 1] หรือ error)
Actual: [24 ก.ย. 2026] Signals: yRawMax = 600, yPad = 39.6, yDomainMin = 340.4, yDomainMax = 639.6 ตรงกับที่คาด; Data set dropdown = "dataset"; กราฟแสดงแกน X/Y ครบ (ยืนยันการแก้ "axis": null บน Deneb จริง), เส้น monotone, จุด, connector, label — **ข้อจำกัด**: ทดสอบกับ dataset ที่มีเพียง 12 แถว (T23 FAIL รอบที่ 1) แต่ค่า extent เท่ากันเพราะแถว Boundary/Crossing อยู่ในช่วงเดียวกับแถว Original เสมอ — ควรดูซ้ำหลังแก้ T23
หลักฐาน (screenshot กราฟ + Signal viewer): qa/evidence/phase2-powerbi/T36A-01-signals-ydomain.png, T23-01-dataset-12-rows.png
ผลสรุป T36-A: PASS WITH LIMITATION / RETEST REQUIRED — ค่าและชื่อ dataset ถูกต้อง แต่ภาพเป็น configuration 12 แถว ต้องมีภาพใหม่ที่เห็น 52 แถว + `DualLine Row Count` ใน Values + Signals

Test ID: T36-B (รับ Filter จาก Visual อื่น — Edit interactions = Filter หรือ Slicer)
ขั้นตอนทำซ้ำ: กรองให้เหลือบางเดือน
Expected: แถวใน dataset ลดลง และ domain คำนวณใหม่จากเดือนที่เหลือ (±18% ของช่วงใหม่)
Actual:
หลักฐาน:

Test ID: T36-C (รับ Cross-highlight — Edit interactions = Highlight)
Expected: แถวใน dataset ไม่ลดลง domain ไม่เปลี่ยนจาก T36-A (เว้นแต่ host ส่งข้อมูลแบบลดแถว — ถ้าเป็นเช่นนั้นให้บันทึก)
Actual:
หลักฐาน:

Test ID: T36-D (คลิก Cross-filter จากกราฟนี้เอง — Simple mode)
Expected: domain ของกราฟนี้ไม่เปลี่ยน (การคลิกกรอง Visual อื่น ไม่ได้กรอง dataset ของตัวเอง)
Actual:
หลักฐาน:

Test ID: T36-E (Filter จนไม่เหลือข้อมูล)
Expected: ไม่มี error, domain = [0, 1]
Actual:
หลักฐาน:

Power BI Desktop version:
Deneb version:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED (แยกราย T36-A ถึง E)
```

---

## T14–T17, T34, T35 — Responsive ต่อขนาด viewport (Category axis label = Group B, Actual/Reference data label thinning = Group A)

หมายเหตุ: T25 คือผลรวม (ต้องผ่านทุกขนาดด้านล่างจึงตัดสิน T25 = PASS) และ T26 คือผลรวมของ Group A ในทำนองเดียวกัน — กรอกทีละขนาดก่อน แล้วค่อยสรุป T25/T26 ที่ท้ายหัวข้อนี้ ร่วมกับข้อมูล: Baseline (12 เดือน) + T09 (ชื่อยาว) + T10 (24 categories)

```text
Test ID: T14 (280×180 px — แคบสุด)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่ (Expected: ไม่ทับซ้อนเลย):
Group A — Actual/Reference data label ชนกันหรือไม่ (Expected: ลดการชน ไม่รับประกัน 100%):
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T15 (480×270 px)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T16 (800×450 px)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T17 (1200×675 px — กว้างสุด)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T34 (1200×220 px — กว้าง-เตี้ย)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T35 (320×700 px — แคบ-สูง)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T25 (สรุป Group B — Category axis label ไม่ทับซ้อน ทุกขนาด)
Expected: T14–T17, T34, T35 ทั้งหมด Group B ต้อง PASS (ใช้ labelOverlap:"greedy" + width:"container")
ผลสรุป: PASS / FAIL / NOT TESTED (PASS ได้เฉพาะเมื่อ T14–T17, T34, T35 ทั้งหมด Group B = PASS)

Test ID: T26 (สรุป Group A — Actual/Reference data label ลดการชน ทุกขนาด, ไม่รับประกัน 100%)
Expected: label re-evaluate ทุกครั้งที่ resize (container width signal), ลดการชนแต่ไม่ต้องไม่ชนเลย
ผลสรุป: PASS / FAIL / NOT TESTED (พิจารณาจากผลรวม T14–T17, T34, T35 Group A — เกณฑ์ "ลดการชน" ไม่ใช่ collision-free)
```

---

## T27 — Template limitation (Export/Import แล้วนำไปใช้ข้อมูลใหม่)

```text
Test ID: T27
ขั้นตอนทำซ้ำ: Export Deneb Template จาก Workshop dataset แล้ว Import เข้า report ใหม่พร้อมข้อมูลอื่น
Expected: Field mapping ทำงาน แต่ crossing-case (ต้อง Power Query ใหม่) และ labelExpr array (ต้องแก้ manual) ไม่ทำงานอัตโนมัติ — ตามข้อจำกัดที่ระบุใน PHASE1_DESIGN_PLAN.md หัวข้อ 2.5/4.1
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T29 / T33 — Filter ตัด Category ฝั่งขวา/ฝั่งซ้ายของ segment ที่มี Boundary/Crossing (ครอบคลุมทั้ง Case B และ Case C)

```text
Test ID: T29 (ตัดฝั่งขวา — Case B, strict crossing)
ขั้นตอนทำซ้ำ: ใช้ Slicer กรอง Category ออก 1 ตัวที่เป็นฝั่งขวาของ segment ที่มีจุดตัด (เช่น กรอง "ก.พ." ออก ซึ่งเป็นฝั่งขวาของ segment 0-a/0-b, Row_Type=Crossing)
Expected: แถว Fill ของ segment นั้นยังไม่ถูกตัด (dangling) เพราะ Filter_Key ยังตรงกับฝั่งซ้าย (ม.ค.)
Actual: หลักฐานทางอ้อมจาก T20-01 (กรองเหลือ ก.ค. ผ่าน Column chart ไม่ใช่ Slicer): segment ก.ค.–ส.ค. (strict crossing) ที่ฝั่งขวา ส.ค. ถูกกรองออก ยังแสดงพื้นที่ครบ — สอดคล้องกับ Expected; ยังต้องทดสอบตามขั้นตอน Slicer
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED

Test ID: T33 (ตัดฝั่งซ้าย — Case B, strict crossing)
ขั้นตอนทำซ้ำ: กรอง Category ฝั่งซ้ายของ segment เดียวกันออก (เช่น กรอง "ม.ค." ออก)
Expected: แถว Fill ของ segment นั้นถูกตัดออกทั้งหมด เพราะ Filter_Key ของทุกแถว = key(ม.ค.)
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T29-C (ตัดฝั่งขวา — Case C, ไม่มีจุดตัด/same-sign segment)
ขั้นตอนทำซ้ำ: ใช้ Slicer กรอง Category ออก 1 ตัวที่เป็นฝั่งขวาของ segment แบบ Case C (เช่น segment "4" ระหว่าง พ.ค.→มิ.ย. — กรอง "มิ.ย." ออก)
Expected: แถว Fill ของ segment "4" ยังไม่ถูกตัด เพราะ Filter_Key ของทั้งสองแถว Boundary = key(พ.ค.)
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED

Test ID: T33-C (ตัดฝั่งซ้าย — Case C, ไม่มีจุดตัด/same-sign segment)
ขั้นตอนทำซ้ำ: กรอง Category ฝั่งซ้ายของ segment "4" ออก (กรอง "พ.ค." ออก)
Expected: แถว Fill ของ segment "4" ถูกตัดออกทั้งหมด เพราะ Filter_Key ของทั้งสองแถว = key(พ.ค.)
Actual: หลักฐานทางอ้อมจาก T20-01: segment มิ.ย.–ก.ค. (Case C) ที่ฝั่งซ้าย มิ.ย. ถูกกรองออก พื้นที่หายทั้งหมด — สอดคล้องกับพฤติกรรม T33-C (คนละ segment กับที่ระบุ); ยังต้องทดสอบตามขั้นตอน Slicer
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T30 — ยืนยันชื่อ/ตำแหน่ง UI จริงของ Deneb 2.0.0.0

```text
Test ID: T30
ขั้นตอนทำซ้ำ: เปิด Deneb Editor แล้วเทียบชื่อ/ตำแหน่งกับที่ Design Plan อ้างอิง:
  - Project setup pane
  - Expose cross-filtering values for dataset rows (+ โหมด Simple/Advanced)
  - Expose cross-highlight values for measures
  - Supporting Fields: dataset (Highlight value / Highlight status / Highlight comparator)
  - section Context menu (Show context menu on right-click / Attempt to resolve data point-specific actions)
Expected: ชื่อ/ตำแหน่งตรงกับที่อ้างจากเอกสาร deneb.guide
Actual (ระบุความต่างถ้ามี): [กรอกบางส่วนจากภาพที่ 1 — 24 ก.ย. 2026]
  - Editor มีแท็บ Specification / Config / Project setup — ตรง ("Project setup" คือแท็บ ไม่ใช่ pane แยก)
  - Cross-filtering: "Expose cross-filtering values for dataset rows" (เปิดอยู่) — ตรง
  - "Cross-filtering management": Simple ("Let Deneb attempt to resolve cross-filtering for me") / Advanced ("available for Vega only") — ตรง; มีการตั้งค่าเพิ่ม "Data point limit" = 50 (default) ที่เอกสารของเราไม่ได้อ้างถึง
  - Cross-highlighting: "Expose cross-highlight values for measures" (เปิดอยู่) — ตรง
  - "Supporting fields: dataset" — เป็น section ใน Project setup (ภาพที่ 2) แสดงรายการ field ที่ผูกไว้ (Category, Business_Type = ไอคอนตาราง; Actual, Reference = ไอคอน measure พร้อมจุดสี) แต่ละตัวขยายได้ — ภาพที่ 3–4: **measure** (Actual, Reference) มี "Highlight value" (ติ๊กไว้โดย default), "Highlight status", "Highlight comparator" (ไม่ติ๊กโดย default) — ตรงกับเอกสารและกับข้อความใน Plan ว่า "ค่าเริ่มต้นเปิดเฉพาะ Highlight value"; ทั้ง column และ measure มีตัวเลือกเพิ่มที่เอกสารเราไม่ได้อ้าง: "Format string", "Formatted value", "Treat as field parameter"
  - Context menu (ภาพที่ 2): "Show context menu on right-click" (เปิด) และ "Attempt to resolve data point-specific actions" (เปิด) — ตรงทั้งสองชื่อ
  - section อื่นที่พบแต่เอกสารเราไม่ได้อ้าง: "General", "Continuous view" (ภาพ T19-02), "Semantic model integration", "Tooltips"
  - Data pane มี dropdown "Data set" = `dataset` — ยืนยันชื่อ data source ที่ spec ใช้ (`data: {name: "dataset"}` และ `data('dataset')` ใน params ของแกน Y)
  - Footer แสดง "Vega-Lite 6.4.3" — ตรงกับเวอร์ชันที่ใช้ทดสอบ headless
  - Data pane แสดงคอลัมน์ __row__, __selected__ (neutral), Actual__highlight... — ชื่อ highlight field ใช้ชื่อที่แสดงของ field ("Actual") สอดคล้องกับ spec (T19 ต้องยืนยัน Actual__highlightStatus ต่อ)
หลักฐาน (screenshot แต่ละหน้าตั้งค่า): qa/evidence/phase2-powerbi/T30-01-project-setup-crossfilter-highlight.png, T30-02-supporting-fields-context-menu.png, T30-03-supporting-fields-expanded-columns.png, T30-04-supporting-fields-expanded-measures.png
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS — ทุกชื่อ UI ที่ Design Plan อ้างอิงตรงกับ Deneb จริง (ข้อสังเกต: "Project setup" เป็นแท็บของ Editor; "Supporting fields: dataset" เป็น section ใน Project setup แยกราย field; มี "Data point limit", "Semantic model integration", "Tooltips", "Format string", "Formatted value", "Treat as field parameter" เพิ่มเติม — ใช้ประกอบการเขียนบทที่ 2 และ 8) — Power BI Desktop/Deneb version ยังไม่ได้บันทึกจากเครื่องจริง (ภาพแสดงเฉพาะ Vega-Lite 6.4.3)
```

---

หลังกรอกครบทุก Test ID ข้างต้น ส่งไฟล์นี้กลับมาเพื่อนำผลไปสรุปใน `qa/PHASE2_DATASET_TEST_LOG.md` และตัดสิน Phase 2 gate ตาม `PROJECT_PLAN.md` Phase 2 ข้อ 5–7
