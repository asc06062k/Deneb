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

**สภาพแวดล้อมที่ใช้ทดสอบจริง (ยืนยัน 24 ก.ย. 2026 จากหน้าต่าง About ที่ผู้ใช้แคปมา — ภาพในแชท ไม่ได้เก็บไฟล์เพราะมี User ID/Session ID และชื่อบัญชี)**: Power BI Desktop **2.157.1354.0 64-bit (August 2026)** และ Deneb **2.0.0.0** (Publisher: Daniel Marsh-Patrick, Source: AppSource) — **ตรงกับเวอร์ชันที่ Lock ไว้**; ไฟล์ PBIX: `deneb demo.pbix` (ไม่มี hash); ผู้ทดสอบ: ผู้ใช้ (เจ้าของโครงการ) บนเครื่องจริง; viewport ของ Visual ระหว่างทดสอบ interaction ≈ 998×767 px (ขณะแคปหน้า About) ยกเว้น Test ที่ระบุขนาดเอง — ใช้ค่าเหล่านี้กับทุก Test ID ที่บันทึกวันที่ 24 ก.ย. 2026 (เติมลงในผลสรุปแต่ละรายการแล้วตาม Codex R15 M-28)

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
Actual (ข) Case C ครั้งที่ 1 (24 ก.ย. 2026, ภาพ T18-05): ผู้ใช้คลิกซ้ายกลางพื้นที่เขียวของ segment พ.ค.–มิ.ย. ชิด พ.ค. (ลูกศรในภาพ) → Column chart ยังแสดงแท่ง ก.ค. เข้ม (เหมือนสถานะจาก T21 ที่เลือก ก.ค. ใน Column chart ไว้) — **INCONCLUSIVE**: ไม่ได้ Clear selections ก่อน จึงแยกไม่ได้ว่าคลิกบน Area ไม่ถูก resolve (selection เดิมค้าง) หรือเกิดอย่างอื่น; ต้องทดสอบซ้ำหลังล้าง selection (ทุกแท่งสีเข้มเท่ากัน) — ผู้ใช้แจ้งภายหลังว่าได้กด Clear selections (จาก Dual-Line) ก่อนคลิกแล้ว แต่ selection ของ Column chart เอง (ก.ค. จาก T21) น่าจะยังค้าง
Actual (ข) Case C ครั้งที่ 2 (24 ก.ย. 2026, ภาพ T18-06): ล้าง selection ของ Column chart แล้ว (layout ใหม่ Column chart อยู่ซ้าย) คลิกซ้ายกลางพื้นที่เขียวของ segment พ.ค.–มิ.ย. ชิด พ.ค. (ลูกศรในภาพ) → Column chart highlight **พ.ค.** เพียงแท่งเดียว = Filter_Key ฝั่งซ้ายของ segment ตาม Field contract — Case C PASS
หลักฐาน (ภาพ/วิดีโอ): ภาพ 2 ภาพที่ผู้ใช้ส่งในแชท 24 ก.ย. 2026 (ยังไม่ได้บันทึกเป็นไฟล์ใน qa/evidence — ต้องขอไฟล์ภาพ)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
Actual (ก) ไฟล์ภาพ (24 ก.ย. 2026, ภาพ T18-07): หลังล้าง selection คลิกซ้ายจุด ต.ค. → Column chart highlight ต.ค. เพียงแท่งเดียว; tooltip ขณะนั้น ต.ค. / 560 / 530 / +30 / +5.7% (30/530 = 5.66%) ถูกต้อง
ผลสรุป: (ก) PASS / (ข) PASS WITH DOCUMENTED LIMITATION — 3 กรณีที่ทดสอบ (crossing 2 + Case C 1): เลือก Category เดียว = ฝั่งซ้ายของ segment ตาม Design; ผู้ใช้ตัดสิน 24 ก.ย. 2026 ให้ยอมรับพฤติกรรมนี้และเขียนในบทที่ 8 (Design Plan หัวข้อ 2.2.2); สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / PBIX deneb demo.pbix (ดูหัวข้อสภาพแวดล้อมด้านบน), viewport ≈ 998×767 — ข้อสังเกตสำหรับบทที่ 8: Clear selections จากเมนูคลิกขวาของ Dual-Line ไม่ล้าง selection ที่ผู้ใช้ทำใน Visual อื่น — (ก) ยังขาดไฟล์ภาพของการคลิกจุด ต.ค.
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
หน้ารายงาน (24 ก.ย. 2026, ภาพในแชท (ไม่มีไฟล์บนเครื่อง)): Column chart เลือก ก.ค. (Highlight) → Dual-Line บนหน้ารายงาน เส้นจาง จุดเดือนอื่นจาง จุด ก.ค. เข้ม — ตรงกับ preview
ผลสรุป: PASS WITH LIMITATION สำหรับ rev 4 — ชื่อ field PASS; rev 3 FAIL (สาเหตุยืนยันแล้ว T19-06); rev 4 แสดงผลจางถูกต้องบน Deneb จริงทั้ง preview และหน้ารายงาน — สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / PBIX deneb demo.pbix (ดูหัวข้อสภาพแวดล้อมด้านบน)
หลังจากนั้นผู้ใช้ขอเปลี่ยนรูปแบบการจางเป็น **spec rev 5** (เส้นไม่จาง; จุด/connector/label เดือนอื่นจาง 0.5 — Design Plan 2.2.3) ผ่าน headless tests (HL-*) แล้ว
Actual rev 5 บน Deneb จริง (24 ก.ย. 2026, หน้ารายงาน — ภาพที่ผู้ใช้วางในแชท ไม่มีไฟล์บนเครื่อง): เลือกหลายแท่งพร้อมกัน (พ.ค., ก.ค., ส.ค.) ใน Column chart โหมด Highlight → เส้น Actual/Reference และพื้นที่สีไม่จาง; จุด, connector และป้ายตัวเลขของ พ.ค./ก.ค./ส.ค. เข้ม ส่วนเดือนอื่นจาง — ตรงตามคำขอผู้ใช้และ HL-observed; ยังพิสูจน์ด้วยว่ารองรับ multi-select ของ Visual ต้นทาง
ผลสรุป rev 5: PASS WITH LIMITATION — พฤติกรรมถูกต้องบน Deneb จริง; สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / PBIX deneb demo.pbix (ดูหัวข้อสภาพแวดล้อมด้านบน); ยังขาดไฟล์ภาพหลักฐาน (ภาพวางในแชท)
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
ผลสรุป (เบื้องต้น): PASS — กรองตาม Filter_Key ตาม Design (สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / PBIX deneb demo.pbix (ดูหัวข้อสภาพแวดล้อมด้านบน))
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
Actual (24 ก.ย. 2026, spec rev 5, ภาพ T21-01): Clustered column chart (ใหม่) ตั้ง Edit interactions = None แล้วเลือกแท่ง ก.ค. → Dual-Line แสดงครบทุกเดือน จุด/connector/ป้ายตัวเลข/เส้น/พื้นที่สีเข้มปกติทั้งหมด ไม่กรองและไม่จาง
หลักฐาน: qa/evidence/phase2-powerbi/T21-01-none-mode-july.png
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS (สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / PBIX deneb demo.pbix (ดูหัวข้อสภาพแวดล้อมด้านบน))
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
Actual (ข) หลังล้าง selection (24 ก.ย. 2026, ภาพ T22-03): Column chart ทุกแท่งเข้มเท่ากันก่อนทดสอบ, คลิกขวาในสามเหลี่ยมน้ำตาลของ segment ม.ค.–ก.พ. → Context menu ขึ้นพร้อม Include/Exclude (resolve เป็น data point ได้); Column chart ไม่เปลี่ยน (คลิกขวาไม่สร้าง selection — ตามพฤติกรรมปกติของ Power BI) จึงยังไม่ทราบว่า resolve เป็น Category ใด — ต้องเลือก "Show as a table" จากเมนูนี้เพื่อดูแถวที่ resolve
  ต่อ (ภาพ T22-04): "Show as a table" จากเมนูนี้แสดงข้อมูล**ทั้ง Visual** (แถวแรกเป็น เม.ย., ก.ค. ...) ไม่ใช่เฉพาะ data point ที่คลิก จึงใช้ระบุแถวที่ resolve ไม่ได้ — ขั้นต่อไป: ใช้ "Include" แล้วดูว่า Visual เหลือแถวใด/ดู filter ที่เกิดใน Filters pane แล้วลบ filter ออก
  ต่อ (ภาพ T22-05): คลิกขวาจุดเดิมแล้วเลือก "Include" → Filters pane ของ Visual มี "Included (1)": (Blank) (Category) + Higher is Good (Business_Type) + ม.ค. (Filter_Key) + ... — resolve เป็น**แถว Fill 1 แถว** (Category ว่าง, Filter_Key = ม.ค.) ของ segment ม.ค.–ก.พ. ตรงตาม Field contract; Visual เหลือแถวเดียวจึงวาดพื้นที่/เส้นไม่ได้ (คาดไว้) และ Column chart highlight ม.ค.
  (ก) ด้วย Include (24 ก.ย. 2026, ภาพ T22-06): คลิกขวาจุด ต.ค. → Include → Filters pane "Included (1)": ต.ค. (Category) + Higher is Good ... = แถว Original ของ ต.ค.; Visual เหลือ connector/จุด 560–530 ของ ต.ค. และ Column chart highlight ต.ค.
ผลสรุป: (ก) PASS — จุด resolve เป็นแถว Original ของเดือนที่คลิก (T22-06) (ข) PASS — คลิกขวากลาง Area หลังล้าง selection resolve เป็นแถว Fill เดียวที่ Filter_Key = ม.ค. (ฝั่งซ้ายของ segment) ตาม Design; สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / PBIX deneb demo.pbix (ดูหัวข้อสภาพแวดล้อมด้านบน) — ข้อสังเกตสำหรับบทที่ 8: "Show as a table" ของ Deneb แสดงข้อมูลทั้ง Visual ไม่ใช่เฉพาะ data point; "Include/Exclude" บน Area จะกรอง Visual ให้เหลือแถว Fill แถวเดียว (กราฟว่าง) ต้องเตือนผู้อ่าน
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
Actual (24 ก.ย. 2026, ภาพ T36B): Column chart = Filter เลือก ก.ค. → Signals: yRawMax 530, yPad 5.4, yDomainMin 494.6, yDomainMax 535.4 — ตรงกับค่าที่คาดไว้ล่วงหน้า [494.6, 535.4] (extent 500–530 ของแถว Filter_Key = ก.ค.)
หลักฐาน: qa/evidence/phase2-powerbi/T36B-filter-july-signals.png — PASS

Test ID: T36-C (รับ Cross-highlight — Edit interactions = Highlight)
Expected: แถวใน dataset ไม่ลดลง domain ไม่เปลี่ยนจาก T36-A (เว้นแต่ host ส่งข้อมูลแบบลดแถว — ถ้าเป็นเช่นนั้นให้บันทึก)
Actual (24 ก.ย. 2026, ภาพ T36C): Highlight ก.ค. → preview แสดงจุด/ป้าย ก.ค. เข้ม เดือนอื่นจาง; Signals: yRawMax 600, yPad 39.6, yDomainMin 340.4, yDomainMax 639.6 = เท่ากับ T36-A
หลักฐาน: qa/evidence/phase2-powerbi/T36C-highlight-july-signals.png — PASS

Test ID: T36-D (คลิก Cross-filter จากกราฟนี้เอง — Simple mode)
Expected: domain ของกราฟนี้ไม่เปลี่ยน (การคลิกกรอง Visual อื่น ไม่ได้กรอง dataset ของตัวเอง)
Actual (24 ก.ย. 2026, ภาพ T36D): หลังคลิกจุดใน Dual-Line เอง → Signals: yDomainMin 340.4, yDomainMax 639.6 = เท่ากับ T36-A
หลักฐาน: qa/evidence/phase2-powerbi/T36D-click-own-point-signals.png — PASS (ภาพไม่แสดง Column chart ขณะนั้น — อาศัยคำอธิบายขั้นตอนของผู้ใช้)

Test ID: T36-E (Filter จนไม่เหลือข้อมูล)
Expected: ไม่มี error, domain = [0, 1]
Actual (24 ก.ย. 2026, ภาพ T36E): Filters pane ของ Visual ตั้ง Filter_Key = is blank → Dual-Line ว่าง ไม่มี error แกน Y แสดง 0.00–1.00 (= [0, 1])
หลักฐาน: qa/evidence/phase2-powerbi/T36E-filter-blank-empty.png — PASS (ตรวจจากแกน ไม่ได้เปิด Signals)

Power BI Desktop version:
Deneb version:
ผู้ทดสอบ:
วันที่:
ผลสรุป: T36-A PASS WITH LIMITATION (ถ่ายตอน 12 แถว — T36-C ยืนยันซ้ำค่าเดียวกันกับ 52 แถวแล้ว), T36-B PASS, T36-C PASS, T36-D PASS, T36-E PASS — สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / deneb demo.pbix
```

---

## T14–T17, T34, T35 — Responsive ต่อขนาด viewport (Category axis label = Group B, Actual/Reference data label thinning = Group A)

หมายเหตุ: T25 คือผลรวม (ต้องผ่านทุกขนาดด้านล่างจึงตัดสิน T25 = PASS) และ T26 คือผลรวมของ Group A ในทำนองเดียวกัน — กรอกทีละขนาดก่อน แล้วค่อยสรุป T25/T26 ที่ท้ายหัวข้อนี้ ร่วมกับข้อมูล: Baseline (12 เดือน) + T09 (ชื่อยาว) + T10 (24 categories)

```text
Test ID: T14 (280×180 px — แคบสุด)
จำนวน Category / test scenario ที่ใช้: 12 (Baseline Workshop), spec rev 5, ปรับขนาดผ่าน Format > General > Size and position ของ Visual เดียวกัน
Group B — Category axis label ทับซ้อนหรือไม่: แสดง 3 label: ม.ค., พ.ค., ก.ย. (ข้ามทีละ 4) — ไม่ทับซ้อน
Group A — Actual/Reference data label ชนกันหรือไม่: แสดงป้ายเดือน ม.ค., เม.ย., ก.ค., ต.ค. + ธ.ค. (thinning step 3 + เดือนสุดท้าย) ไม่พบป้ายชนป้าย; จุด/เส้นแน่นมากจนพื้นที่สีแทบมองไม่เห็นที่ขนาดนี้
หลักฐาน (screenshot): qa/evidence/phase2-powerbi/T14-280x180.png (ช่อง Height/Width ในภาพยืนยันขนาด)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS (Baseline 12 เดือนเท่านั้น)
```

```text
Test ID: T15 (480×270 px)
จำนวน Category / test scenario ที่ใช้: 12 (Baseline Workshop), spec rev 5, ปรับขนาดผ่าน Format > General > Size and position ของ Visual เดียวกัน
Group B — Category axis label ทับซ้อนหรือไม่: แสดง 6 label: ม.ค., มี.ค., พ.ค., ก.ค., ก.ย., พ.ย. — ไม่ทับซ้อน
Group A — Actual/Reference data label ชนกันหรือไม่: แสดงป้ายทุก 2 เดือน + ธ.ค. ไม่พบป้ายชนป้าย
หลักฐาน (screenshot): qa/evidence/phase2-powerbi/T15-480x270.png (ช่อง Height/Width ในภาพยืนยันขนาด)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS (Baseline 12 เดือนเท่านั้น)
```

```text
Test ID: T16 (800×450 px)
จำนวน Category / test scenario ที่ใช้: 12 (Baseline Workshop), spec rev 5, ปรับขนาดผ่าน Format > General > Size and position ของ Visual เดียวกัน
Group B — Category axis label ทับซ้อนหรือไม่: แสดงครบ 12 label — ไม่ทับซ้อน
Group A — Actual/Reference data label ชนกันหรือไม่: แสดงป้ายครบ 24 ป้าย ไม่พบป้ายชนป้าย
หลักฐาน (screenshot): qa/evidence/phase2-powerbi/T16-800x450.png (ช่อง Height/Width ในภาพยืนยันขนาด)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS (Baseline 12 เดือนเท่านั้น)
```

```text
Test ID: T17 (1200×675 px — กว้างสุด)
จำนวน Category / test scenario ที่ใช้: 12 (Baseline Workshop), spec rev 5, ปรับขนาดผ่าน Format > General > Size and position ของ Visual เดียวกัน
Group B — Category axis label ทับซ้อนหรือไม่: แสดงครบ 12 label — ไม่ทับซ้อน
Group A — Actual/Reference data label ชนกันหรือไม่: แสดงป้ายครบ 24 ป้าย ไม่พบป้ายชนป้าย
หลักฐาน (screenshot): qa/evidence/phase2-powerbi/T17-1200x675.png (ช่อง Height/Width ในภาพยืนยันขนาด)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS (Baseline 12 เดือนเท่านั้น)
```

```text
Test ID: T34 (1200×220 px — กว้าง-เตี้ย)
จำนวน Category / test scenario ที่ใช้: 12 (Baseline Workshop), spec rev 5, ปรับขนาดผ่าน Format > General > Size and position ของ Visual เดียวกัน
Group B — Category axis label ทับซ้อนหรือไม่: แสดงครบ 12 label — ไม่ทับซ้อน (แกน Y เหลือ 3 tick: 400/500/600)
Group A — Actual/Reference data label ชนกันหรือไม่: แสดงป้ายครบ 24 ป้าย ไม่พบป้ายชนป้าย แม้ความสูงน้อย (ป้ายชิดเส้นมากขึ้น)
หลักฐาน (screenshot): qa/evidence/phase2-powerbi/T34-1200x220.png (ช่อง Height/Width ในภาพยืนยันขนาด)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS (Baseline 12 เดือนเท่านั้น)
```

```text
Test ID: T35 (320×700 px — แคบ-สูง)
จำนวน Category / test scenario ที่ใช้: 12 (Baseline Workshop), spec rev 5, ปรับขนาดผ่าน Format > General > Size and position ของ Visual เดียวกัน
Group B — Category axis label ทับซ้อนหรือไม่: แสดง 6 label: ม.ค., มี.ค., พ.ค., ก.ค., ก.ย., พ.ย. — ไม่ทับซ้อน
Group A — Actual/Reference data label ชนกันหรือไม่: แสดงป้ายทุก 2 เดือน + ธ.ค.; ไม่พบป้ายชนป้าย แต่บางป้ายทับเส้น/จุด (เช่น 510 ที่ ก.ค., 520 ทับเส้นประ) — อยู่ในเกณฑ์ "ลดการชน"
หลักฐาน (screenshot): qa/evidence/phase2-powerbi/T35-320x700.png (ช่อง Height/Width ในภาพยืนยันขนาด)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS (Baseline 12 เดือนเท่านั้น)
```

```text
Test ID: T09 × 6 viewport (ชื่อ Category ยาว, data/test/DualLineVariance_T09_LongCategory.csv) — รอบที่ 1 ด้วย spec rev 6 (24 ก.ย. 2026)
Group B: 480×270, 800×450, 1200×675, 1200×220 — ชื่อถูกตัดด้วย "…" และสลับแสดง ไม่ทับซ้อน ✅; **280×180 และ 320×700 — ชื่อบนแกน 2 ชื่อทับกัน (ม.ค. ... กับ ก.ย. ...) ❌**
สาเหตุ (จำลองได้ด้วย qa/scripts/run-axis-overlap-sim.mjs ที่วัดอักษรด้วย canvas): เมื่อ autosize "fit" ย่อพื้นที่กราฟ ตำแหน่ง label ขยับเข้าหากันหลังจาก greedy overlap ตัดสินไปแล้ว ประกอบกับ labelFlush ทำให้ label แรกชิดซ้ายและยื่นไปทางขวา
การแก้ (spec rev 7): labelFlush false + labelLimit = max(40, width/3) + labelSeparation 4 — จำลองแล้วไม่ทับ 18/18 (baseline/T09/T10 × 6 viewport, qa/evidence/phase2-workshop-steps/axis-overlap-sim-output.txt) — **ต้องทดสอบซ้ำบน Power BI ด้วย rev 7**
หลักฐาน: qa/evidence/phase2-powerbi/T09-rev6-<ขนาด>.png (6 ไฟล์)
ผลสรุป: FAIL (rev 6) → รอทดสอบ rev 7
รอบที่ 2 ด้วย spec rev 7 (24 ก.ย. 2026): 280×180 — แสดง 3 ชื่อ (ม.ค./พ.ค./ก.ย. ตัดด้วย "…") ไม่ทับซ้อน ✅ (ภาพ T09-rev7-280x180.png); 320×700 — แสดง 3 ชื่อ ไม่ทับซ้อน ✅ (ภาพ T09-rev7-320x700.png); 480×270 — 3 ชื่อ (ม.ค./พ.ค./ก.ย. ตัด "…") ✅; 800×450 — 4 ชื่อเต็ม (ม.ค./เม.ย./ก.ค./ต.ค.) ✅; 1200×675 — 6 ชื่อเต็ม ✅; 1200×220 — 6 ชื่อเต็ม ✅ (ภาพ T09-rev7-<ขนาด>.png — 4 ขนาดหลังเป็นภาพเต็มจอที่ Claude จับด้วย PowerShell CopyFromScreen ตามที่ผู้ใช้สั่ง "ถ่าย" หลังผู้ใช้ตั้งขนาดเอง ช่อง Height/Width ใน Format pane ในภาพยืนยันขนาด)
ผลสรุป T09 rev 7: **PASS ครบ 6 viewport** (Group B ไม่ทับซ้อน) — Group A: ป้ายตัวเลขไม่พบชนกันเอง

Test ID: T10 × 6 viewport (24 categories, data/test/DualLineVariance_T10_24Categories.csv) — spec rev 7 (24 ก.ย. 2026)
การเปลี่ยน Source: Claude แก้ path ใน partition M ของ DualLineVariance_Workshop_Data จาก T09 เป็น T10 ผ่าน Power BI modeling MCP ตามคำขอผู้ใช้ แล้ว refresh DualLineVariance_Workshop_Data + DualLine_PlotData; DAX ยืนยัน 24 แถว (ม.ค. 68–ธ.ค. 69) และ DualLine_PlotData 108 แถว (ตรงกับ headless)
Group B (ชื่อบนแกน X): 1200×220 — 24 ชื่อ ✅; 1200×675 — 24 ชื่อ ✅; 800×450 — 12 ชื่อ (ทุก 2 เดือน) ✅; 480×270 — 6 ชื่อ (ทุก 4 เดือน) ✅; 280×180 — 3 ชื่อ ✅; 320×700 — 6 ชื่อ ✅ — ไม่ทับซ้อนทุกขนาด
Group A (ป้ายตัวเลข): จำนวนป้ายลดลงตามความกว้าง (ครบที่ 1200 px, เหลือบางเดือนที่ 800/480/280) — ยืนยันว่า thinning ประเมินตามขนาดจริง; ที่ 280×180 ป้ายแน่นและชิดกันบางจุด (เกณฑ์ "ลดการชน")
หลักฐาน: qa/evidence/phase2-powerbi/T10-rev7-<ขนาด>.png (6 ไฟล์ — ภาพเต็มจอที่ Claude จับด้วย PowerShell หลังผู้ใช้ตั้งขนาดและสั่ง "ถ่าย"; ช่อง Height/Width ใน Format pane ยืนยันขนาด)
ข้อจำกัด: ไม่ได้บันทึกการลาก resize ต่อเนื่อง (ใช้การกรอกขนาดทีละค่า)
ผลสรุป T10 rev 7: **PASS ครบ 6 viewport**

Test ID: T25 (สรุป Group B — Category axis label ไม่ทับซ้อน ทุกขนาด)
Expected: T14–T17, T34, T35 ทั้งหมด Group B ต้อง PASS (ใช้ labelOverlap:"greedy" + width:"container")
ผลสรุป: PASS — Baseline 12 เดือน (spec rev 5, 6 ขนาด), T09 ชื่อยาว (spec rev 7, 6 ขนาด), T10 24 categories (spec rev 7, 6 ขนาด) ไม่ทับซ้อนทุกกรณี — ข้อสังเกต: baseline ทดสอบก่อนเปลี่ยนเป็นแกน dynamic (rev 6/7); rev 7 ใช้ labelExpr lookup แทน array คงที่ ผลต่อ baseline ประเมินด้วย axis-overlap-sim เท่านั้น

Test ID: T26 (สรุป Group A — Actual/Reference data label ลดการชน ทุกขนาด, ไม่รับประกัน 100%)
Expected: label re-evaluate ทุกครั้งที่ resize (container width signal), ลดการชนแต่ไม่ต้องไม่ชนเลย
ผลสรุป: PASS WITH LIMITATION — จำนวนป้ายเปลี่ยนตามขนาดจริงบน Power BI ทั้ง baseline และ T10 (ครบที่ 1200 px, ลดลงที่ขนาดเล็ก) จึงยืนยันว่า thinning ประเมินใหม่ตามขนาด Visual; เกณฑ์ "ลดการชน" — มีป้ายชิด/ทับเส้นบ้างที่ 280×180 และ 320×700; ข้อจำกัด: ทดสอบด้วยการกรอกขนาดทีละค่า ไม่ได้บันทึกการลาก resize ต่อเนื่อง
```

---

## T27 — Template limitation (Export/Import แล้วนำไปใช้ข้อมูลใหม่)

```text
Test ID: T27
ขั้นตอนทำซ้ำ: Export Deneb Template จาก Workshop dataset แล้ว Import เข้า report ใหม่พร้อมข้อมูลอื่น
Expected: Field mapping ทำงาน แต่ crossing-case (ต้อง Power Query ใหม่) และ labelExpr array (ต้องแก้ manual) ไม่ทำงานอัตโนมัติ — ตามข้อจำกัดที่ระบุใน PHASE1_DESIGN_PLAN.md หัวข้อ 2.5/4.1
Actual รอบที่ 1 (24 ก.ย. 2026, สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / deneb demo.pbix): Export template จาก Visual เดิม (spec rev 5) แล้ว Import เข้า Deneb visual ใหม่ในหน้าใหม่ของ PBIX เดิม
  - หน้า "Create or import new specification" จับคู่ field ครบตามชื่อ (ภาพ T27-01) — template เก็บ Supporting fields (Highlight value/status ของ Actual/Reference) และระบุ measure "DualLine Row Count" เป็น field ที่ต้องจับคู่ด้วย
  - หลังกด Create: กราฟว่าง, Logs = "[Error] Unexpected token ILLEGAL" (ภาพ T27-02)
  - **สาเหตุ (ยืนยันแล้ว)**: ไฟล์ template ที่ Deneb 2.0.0.0 export (T27-template-export.json) แปลง `datum.X` เป็น `datum['__dataset.N__']` แต่ occurrence ที่ 2 เป็นต้นไปในสตริงเดียวกันถูก escape เป็น `datum['__dataset.N__']` (backslash หลุดเข้าไปใน expression) รวม 66 จุด — Vega expression parser จึง error; spec หลัง import (T27-imported-spec.json) มีปัญหาเดียวกัน — **เป็นบั๊กของ Deneb export ไม่ใช่ของ spec**
  - **ทางแก้ที่พิสูจน์แบบ headless**: แทนที่ `\'` ด้วย `'` ในไฟล์ template (ไฟล์ T27-template-fixed.json) แล้วจำลองการ import (แทน `__dataset.N__` ด้วยชื่อ field ตาม usermeta) → compile/render ได้ (จุด 12 จุด) และเท่ากับ final spec เมื่อ normalize `datum['x']` → `datum.x` — **ยังไม่ได้ทดสอบ import ไฟล์ที่แก้แล้วบน Deneb จริง**
  - ข้อสังเกต: Visual ใหม่ใช้ measure ชื่อ "Sum of Actual"/"Sum of Reference" (ไม่ได้ rename) Deneb จึงแปลงชื่อ highlight fields เป็น `Sum of Actual__highlightStatus` ให้อัตโนมัติ — สอดคล้องกัน
หลักฐาน: qa/evidence/phase2-powerbi/T27-01-import-field-mapping.png, T27-02-import-error-illegal-token.png, T27-template-export.json, T27-imported-spec.json, T27-template-fixed.json
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง) + วิเคราะห์ไฟล์แบบ headless
วันที่: 24 ก.ย. 2026
Actual รอบที่ 2 (24 ก.ย. 2026, ภาพ T27-03): Import T27-template-fixed.json บน Deneb จริง → กราฟ render ครบ (เส้น, พื้นที่สี, connector, ป้าย, แกน), dataset 1-50 of 52, ไม่มี error
Actual รอบที่ 3 — template ส่งมอบ (24 ก.ย. 2026): ผู้ใช้ export template ใหม่ (T27-rev6-template-export.json — เป็น spec rev 6 เพราะ export ก่อนวาง rev 7) พบบั๊ก escaping 66 จุดเหมือนเดิม; สร้าง `templates/dual-line-variance.deneb-template.json` = แก้ escaping + patch rev6→rev7 (xAxisValues cap, labelLimit/labelFlush/labelSeparation, description) + ชื่อ/คำอธิบายใน usermeta — จำลอง import แล้ว **เท่ากับ final spec rev 7** (หลัง normalize `datum['x']`) และ render ได้; template เก็บ Supporting fields (Highlight value/status) และ measure DualLine Row Count ไว้ 
Actual รอบที่ 4 — import template ส่งมอบบน Deneb จริง (24 ก.ย. 2026, สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / deneb demo.pbix, ข้อมูล Workshop 12 เดือน): Deneb visual ใหม่ → Existing template → `templates/dual-line-variance.deneb-template.json`
  - หน้าจับคู่ field (ภาพ T27-04, T27-05): column ทุกตัวจับคู่ตรงชื่อ แต่ **Deneb จับคู่ measure "Reference" ไปที่ "Sum of Actual" อัตโนมัติ** (ผิด) — ผู้ใช้แก้เป็น "Sum of Reference" ก่อนกด Create (ภาพ T27-06)
  - หลัง Create (ภาพ T27-07): กราฟ render ครบ ไม่มี error, description = spec rev 7, ค่าถูกต้อง (เช่น ม.ค. 420/400, ก.พ. 380/410 — Reference ไม่ซ้ำกับ Actual)
  - บทเรียนสำหรับบทที่ 9: ต้องตรวจการจับคู่ field ทุกแถวก่อนกด Create โดยเฉพาะ measure ที่ชื่อคล้ายกัน
ผลสรุปรอบที่ 4: **PASS** — template ส่งมอบ (spec rev 7) import และ render ได้บน Deneb จริง หลังแก้การจับคู่ Reference
ผลสรุป: PASS WITH LIMITATION — template ที่ Deneb 2.0.0.0 export ตรงๆ ใช้ไม่ได้ (บั๊ก escaping) แต่หลังแทนที่ `\'` → `'` import ได้ถูกต้องบน Deneb จริง; ทดสอบเฉพาะการ import กับข้อมูลชุดเดิม — ข้อจำกัดตอนนำไปใช้กับข้อมูลใหม่: ต้องทำ Power Query step เอง (Design Plan 2.5) — ส่วน labelExpr ชื่อเดือนตายตัวถูกแทนด้วยแกน dynamic ใน spec rev 6 แล้ว (template นี้ export จาก rev 5 ต้อง export ใหม่จาก rev 6); ยังไม่ได้ทดสอบกับข้อมูลใหม่; บทที่ 9 ต้องแจก template ที่แก้แล้ว + สอนวิธีแก้ไฟล์ export เอง
```

---

## T29 / T33 — Filter ตัด Category ฝั่งขวา/ฝั่งซ้ายของ segment ที่มี Boundary/Crossing (ครอบคลุมทั้ง Case B และ Case C)

**ผลรอบที่ 1 (24 ก.ย. 2026, Slicer "Category" แบบ Select all แล้วเอาออกทีละเดือน — ภาพ T29-01, T33-01, T29C-01, T33C-01)**: ทุกภาพ จุด/ป้าย/เส้นของเดือนที่เอาออกหายไป แต่**แถวพื้นที่สี (Fill) ไม่ถูกตัดเลย** — T29 (เอา ก.พ. ออก): พื้นที่ ม.ค.–ก.พ. อยู่ ✅ แต่พื้นที่ ก.พ.–มี.ค. (Filter_Key = ก.พ.) ก็ยังอยู่ ✗; T33 (เอา ม.ค. ออก): พื้นที่ ม.ค.–ก.พ. ยังอยู่ ✗; T29-C (เอา มิ.ย. ออก): พื้นที่ พ.ค.–มิ.ย. อยู่ ✅ แต่ มิ.ย.–ก.ค. ก็ยังอยู่ ✗; T33-C (เอา พ.ค. ออก): พื้นที่ พ.ค.–มิ.ย. ยังอยู่ ✗ — ต่างจาก T20 (กรองผ่าน Column chart) ที่แถว Fill ถูกตัดตาม Filter_Key ถูกต้อง
สมมติฐาน (ยังไม่ยืนยัน): Slicer ใช้ DualLine_PlotData[Category] (แถว Fill มี Category ว่าง จึงผ่านเงื่อนไข "ไม่ใช่เดือน X" เสมอ) แทน DualLineVariance_Workshop_Data[Category] — ผู้ใช้เปลี่ยน Slicer เป็น DualLineVariance_Workshop_Data[Category] ในรอบที่ 2 ซึ่งให้ผลตาม Design ทั้งหมด → **ยืนยันสมมติฐาน: รอบที่ 1 Slicer ใช้ DualLine_PlotData[Category]** (แถว Fill มี Category ว่าง จึงไม่ถูกตัด) — ผลสรุปรอบที่ 1: ไม่ใช่ความผิดของ spec แต่เป็นข้อผิดพลาดการตั้งค่าที่ผู้อ่านอาจทำซ้ำ → บทที่ 8/9 ต้องเตือน "Slicer/Filter ต้องใช้ Category จากตารางหลัก ไม่ใช่จาก DualLine_PlotData"

**ผลรอบที่ 2 (24 ก.ย. 2026, Slicer = DualLineVariance_Workshop_Data[Category], เอาออกทีละเดือน)** — สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / deneb demo.pbix:
- T29 (เอา ก.พ. ออก, ภาพ T29-02): พื้นที่ ม.ค.–ก.พ. (Filter_Key ม.ค.) ยังอยู่ ยื่นไปถึงตำแหน่ง ก.พ. โดยไม่มีจุด ก.พ.; พื้นที่ ก.พ.–มี.ค. หายไป; เส้นลากจาก ม.ค. ไป มี.ค. — **PASS**
- T33 (เอา ม.ค. ออก, ภาพ T33-02): พื้นที่ ม.ค.–ก.พ. หายทั้งหมด แกน X เริ่มที่ ก.พ. — **PASS**
- T29-C (เอา มิ.ย. ออก, ภาพ T29C-02): พื้นที่ พ.ค.–มิ.ย. ยังอยู่ ยื่นไปถึงตำแหน่ง มิ.ย.; พื้นที่ มิ.ย.–ก.ค. หายไป — **PASS**
- T33-C (เอา พ.ค. ออก, ภาพ T33C-02): พื้นที่ พ.ค.–มิ.ย. หายไป; พื้นที่ เม.ย.–พ.ค. (Filter_Key เม.ย.) ยังอยู่ยื่นไปถึงตำแหน่ง พ.ค. — **PASS**
- ข้อสังเกตด้าน UX สำหรับบทที่ 9: เมื่อกรองเดือนออก พื้นที่สีของช่วงก่อนหน้ายังยื่นไปถึงเดือนที่ถูกกรอง ขณะที่เส้นลากข้ามไปเดือนถัดไป จึงเห็นพื้นที่สี "ห้อย" นอกเส้น (ตาม Design — Design Plan หัวข้อ 2.2 ระบุทางเลือกสำรองสำหรับรายงานที่มี Slicer ไว้แล้ว)

```text
Test ID: T29 (ตัดฝั่งขวา — Case B, strict crossing)
ขั้นตอนทำซ้ำ: ใช้ Slicer กรอง Category ออก 1 ตัวที่เป็นฝั่งขวาของ segment ที่มีจุดตัด (เช่น กรอง "ก.พ." ออก ซึ่งเป็นฝั่งขวาของ segment 0-a/0-b, Row_Type=Crossing)
Expected: แถว Fill ของ segment นั้นยังไม่ถูกตัด (dangling) เพราะ Filter_Key ยังตรงกับฝั่งซ้าย (ม.ค.)
Actual: Slicer = DualLineVariance_Workshop_Data[Category] เอา ก.พ. ออก → พื้นที่ ม.ค.–ก.พ. (Filter_Key ม.ค.) ยังอยู่ยื่นไปถึงตำแหน่ง ก.พ.; พื้นที่ ก.พ.–มี.ค. หายไป (ก่อนหน้ามีหลักฐานทางอ้อมจาก T20-01)
หลักฐาน: qa/evidence/phase2-powerbi/T29-02-workshop-slicer-exclude-feb.png (รอบ 1 ที่ Slicer ใช้ DualLine_PlotData[Category] ไม่นับ — ดูหัวข้อด้านบน)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS — สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / deneb demo.pbix, spec rev 5

Test ID: T33 (ตัดฝั่งซ้าย — Case B, strict crossing)
ขั้นตอนทำซ้ำ: กรอง Category ฝั่งซ้ายของ segment เดียวกันออก (เช่น กรอง "ม.ค." ออก)
Expected: แถว Fill ของ segment นั้นถูกตัดออกทั้งหมด เพราะ Filter_Key ของทุกแถว = key(ม.ค.)
Actual: Slicer = DualLineVariance_Workshop_Data[Category] เอา ม.ค. ออก → พื้นที่ ม.ค.–ก.พ. หายทั้งหมด แกน X เริ่มที่ ก.พ.
หลักฐาน: qa/evidence/phase2-powerbi/T33-02-workshop-slicer-exclude-jan.png (รอบ 1 ที่ Slicer ใช้ DualLine_PlotData[Category] ไม่นับ — ดูหัวข้อด้านบน)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS — สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / deneb demo.pbix, spec rev 5
```

```text
Test ID: T29-C (ตัดฝั่งขวา — Case C, ไม่มีจุดตัด/same-sign segment)
ขั้นตอนทำซ้ำ: ใช้ Slicer กรอง Category ออก 1 ตัวที่เป็นฝั่งขวาของ segment แบบ Case C (เช่น segment "4" ระหว่าง พ.ค.→มิ.ย. — กรอง "มิ.ย." ออก)
Expected: แถว Fill ของ segment "4" ยังไม่ถูกตัด เพราะ Filter_Key ของทั้งสองแถว Boundary = key(พ.ค.)
Actual: Slicer = DualLineVariance_Workshop_Data[Category] เอา มิ.ย. ออก → พื้นที่ พ.ค.–มิ.ย. (segment "4") ยังอยู่ยื่นไปถึงตำแหน่ง มิ.ย.; พื้นที่ มิ.ย.–ก.ค. หายไป
หลักฐาน: qa/evidence/phase2-powerbi/T29C-02-workshop-slicer-exclude-jun.png (รอบ 1 ที่ Slicer ใช้ DualLine_PlotData[Category] ไม่นับ — ดูหัวข้อด้านบน)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS — สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / deneb demo.pbix, spec rev 5

Test ID: T33-C (ตัดฝั่งซ้าย — Case C, ไม่มีจุดตัด/same-sign segment)
ขั้นตอนทำซ้ำ: กรอง Category ฝั่งซ้ายของ segment "4" ออก (กรอง "พ.ค." ออก)
Expected: แถว Fill ของ segment "4" ถูกตัดออกทั้งหมด เพราะ Filter_Key ของทั้งสองแถว = key(พ.ค.)
Actual: Slicer = DualLineVariance_Workshop_Data[Category] เอา พ.ค. ออก → พื้นที่ พ.ค.–มิ.ย. (segment "4") หายทั้งหมด; พื้นที่ เม.ย.–พ.ค. ยังอยู่ (ก่อนหน้ามีหลักฐานทางอ้อมจาก T20-01)
หลักฐาน: qa/evidence/phase2-powerbi/T33C-02-workshop-slicer-exclude-may.png (รอบ 1 ที่ Slicer ใช้ DualLine_PlotData[Category] ไม่นับ — ดูหัวข้อด้านบน)
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS — สภาพแวดล้อม: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / deneb demo.pbix, spec rev 5
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
ผลสรุป: PASS — ทุกชื่อ UI ที่ Design Plan อ้างอิงตรงกับ Deneb จริง (ข้อสังเกต: "Project setup" เป็นแท็บของ Editor; "Supporting fields: dataset" เป็น section ใน Project setup แยกราย field; มี "Data point limit", "Semantic model integration", "Tooltips", "Format string", "Formatted value", "Treat as field parameter" เพิ่มเติม — ใช้ประกอบการเขียนบทที่ 2 และ 8) — เวอร์ชันยืนยันภายหลังจากหน้าต่าง About: Power BI Desktop 2.157.1354.0 / Deneb 2.0.0.0 / PBIX deneb demo.pbix (ดูหัวข้อสภาพแวดล้อมด้านบน)
```

---

หลังกรอกครบทุก Test ID ข้างต้น ส่งไฟล์นี้กลับมาเพื่อนำผลไปสรุปใน `qa/PHASE2_DATASET_TEST_LOG.md` และตัดสิน Phase 2 gate ตาม `PROJECT_PLAN.md` Phase 2 ข้อ 5–7
