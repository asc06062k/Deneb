# แผนโครงการ eBook การสร้าง Visual ด้วย Deneb บน Power BI

## 1 เป้าหมายโครงการ

จัดทำ eBook ภาษาไทยแบบ Workshop ที่พาผู้อ่านสร้าง Visual ด้วย Deneb บน Power BI ตั้งแต่พื้นฐานจนถึง Bullet Chart ที่ใช้งานจริง โดยทุกขั้นต้องมีข้อมูลตัวอย่าง โค้ดที่ทดสอบแล้ว ภาพประกอบ และผลลัพธ์ที่ผู้อ่านตรวจสอบตามได้

ต้นฉบับเขียนโดย Codex CLI ตรวจทานโดย Claude แก้ไขและส่งกลับรีวิวซ้ำจนได้รับผล `PASS`

## 2 กลุ่มผู้อ่าน

- ใช้ Power BI Desktop และสร้าง Report พื้นฐานได้
- เข้าใจ Column Measure และ DAX เบื้องต้น
- ไม่จำเป็นต้องมีพื้นฐาน Vega Vega-Lite JavaScript หรือการสร้าง Custom Visual
- ต้องการสร้าง Visual ที่ Native Visual ทำไม่ได้ โดยไม่พัฒนา Power BI Custom Visual เต็มรูปแบบ

## 3 ผลลัพธ์การเรียนรู้

เมื่อจบเล่ม ผู้อ่านต้องสามารถ

1. อธิบายบทบาทของ Deneb Vega-Lite และ Vega ได้
2. เชื่อม Fields และ Measures จาก Power BI เข้ากับ Deneb ได้
3. อ่านและแก้ไข Vega-Lite JSON ขั้นพื้นฐานได้
4. ใช้ mark encoding transform layer scale และ condition ได้
5. สร้าง Progress Bar และ Bullet Chart แบบหลาย Category ได้
6. เพิ่ม Target marker Achievement Conditional Color Label และ Tooltip ได้
7. จัดการกรณี Actual เกิน Target ค่า Blank และ Target เท่ากับศูนย์ได้
8. ทดสอบ Responsive Layout Cross-filter Highlight และ Performance ได้
9. Export และนำ Deneb Template กลับมาใช้ซ้ำได้

## 4 ขอบเขต Bullet Chart ฉบับสมบูรณ์

### Data fields

- Category
- Actual
- Target
- Previous
- Minimum Range
- Satisfactory Range
- Good Range
- Maximum Range
- Tooltip Detail
- Sort Order

### Features

- Horizontal Bullet Chart หลาย Category
- Qualitative ranges อย่างน้อย 3 ระดับ
- Actual bar
- Target marker
- Achievement percentage
- Actual Target และ Variance label
- Conditional color ตาม Achievement
- Tooltip ที่แสดง Category Actual Target Variance และ Achievement
- รองรับ Actual มากกว่า Target
- รองรับค่าติดลบถ้าโครงสร้าง Scale อนุญาต
- รองรับ Category ชื่อยาว
- รองรับ Blank และ Target เท่ากับศูนย์
- Explicit scale domain
- Sorting
- Cross-filter และ Cross-highlight
- Responsive width และ height
- Theme และสีที่แก้ไขได้จากส่วน Parameters ของ Specification
- Template สำหรับนำกลับมาใช้ซ้ำ

## 5 สิ่งส่งมอบ

```text
D:\DATA\Deneb\eBook
├── PROJECT_PLAN.md
├── README.md
├── manuscript
│   ├── chapter-01.md
│   ├── chapter-02.md
│   └── ...
├── data
│   ├── Deneb_Workshop_Data.xlsx
│   └── Deneb_Workshop_Data.csv
├── dax
│   └── workshop-measures.dax
├── specs
│   ├── step-01-first-bar.json
│   ├── step-02-progress-bar.json
│   └── ...
├── templates
│   └── Bullet_Chart_Template.json
├── images
│   ├── chapter-01
│   ├── chapter-02
│   └── ...
├── review
│   ├── REVIEW_RUBRIC.md
│   ├── CLAUDE_REVIEW_PROMPT.md
│   ├── REVIEW_LOG.md
│   └── chapters
├── qa
│   ├── WORKSHOP_TEST_LOG.md
│   └── IMAGE_CHECKLIST.md
└── release
    ├── Deneb_Bullet_Chart_eBook.docx
    └── Deneb_Bullet_Chart_eBook.pdf
```

ไม่เก็บไฟล์ชั่วคราว ภาพทดลอง หรือผลรีวิวที่ยกเลิกแล้วไว้ใน `release`

## 6 โครงสร้างหนังสือ

### บทที่ 1 รู้จัก Deneb

- Deneb คืออะไร
- Vega-Lite ต่างจาก Vega อย่างไร
- Deneb ต่างจาก Native Visual และ Custom Visual อย่างไร
- กรณีที่ควรและไม่ควรใช้ Deneb
- ภาพรวม Bullet Chart ที่จะสร้าง

ผลลัพธ์ ผู้อ่านเข้าใจเส้นทางของทั้งเล่มและเห็น Visual ปลายทาง

### บทที่ 2 เตรียม Power BI และ Deneb

- ติดตั้ง Deneb จาก Microsoft Marketplace
- เพิ่ม Deneb ลงใน Report
- เปิด Deneb Editor
- เลือก Vega-Lite
- รู้จัก Editor Preview Data Pane และ Debug Area

ผลลัพธ์ Deneb แสดงข้อมูลตัวอย่างจาก Power BI ได้

### บทที่ 3 เตรียมข้อมูล Workshop

- อธิบาย Data Model
- Import Excel
- ตรวจ Data Type
- สร้าง Measures
- ตรวจ Filter Context
- ตรวจข้อมูลผิดปกติ

ผลลัพธ์ Dataset และ Measures พร้อมใช้ทุก Workshop

### บทที่ 4 พื้นฐาน JSON และ Vega-Lite

- Schema
- Data และชื่อ `dataset`
- Mark
- Encoding
- Field Type
- Axis Scale และ Sort
- วิธีอ่าน Error

ผลลัพธ์ สร้าง Bar Chart แรกได้

### บทที่ 5 สร้าง Progress Bar

- Background bar
- Actual bar
- Normalize Actual เทียบ Target
- Layer
- Rounded corner
- Category และ Value label

ผลลัพธ์ Progress Bar แบบ Minimal KPI

### บทที่ 6 เพิ่ม Achievement และสถานะ

- Calculate transform
- Achievement เท่ากับ Actual หาร Target
- Status thresholds
- Conditional color
- Percentage formatting
- ป้องกันหารด้วยศูนย์

ค่าเริ่มต้นสำหรับ Workshop

- ต่ำกว่า 70 เปอร์เซ็นต์ Bad
- ตั้งแต่ 70 แต่น้อยกว่า 90 เปอร์เซ็นต์ Warning
- ตั้งแต่ 90 เปอร์เซ็นต์ขึ้นไป Good

ผลลัพธ์ Progress Bar เปลี่ยนสีตามผลงาน

### บทที่ 7 เปลี่ยน Progress Bar เป็น Bullet Chart

- แนวคิด Qualitative ranges
- วาง Range ซ้อนกัน
- Actual bar
- Target marker ด้วย rule mark
- จัดลำดับ Layer
- กำหนด Explicit scale domain

ผลลัพธ์ Bullet Chart รุ่นพื้นฐาน

### บทที่ 8 Label Tooltip และ Formatting

- Actual Target Variance และ Achievement label
- Tooltip แบบหลายค่า
- Format number และ display unit
- จัดตำแหน่ง Label ไม่ให้ชนกัน
- Category ชื่อยาว
- สีและ Typography

ผลลัพธ์ Bullet Chart ที่อ่านค่าได้ครบโดยไม่รก

### บทที่ 9 Power BI Interaction

- Cross-filter
- Cross-highlight
- Selection behavior
- Context menu และ Drill-through ที่ Deneb รองรับ
- ตรวจ interaction กับ Visual อื่น

ผลลัพธ์ Bullet Chart ทำงานร่วมกับ Report page ได้

### บทที่ 10 Edge Cases และ Production Hardening

- Actual มากกว่า Target
- Target เท่ากับศูนย์
- Blank และ Missing category
- ค่าติดลบ
- Scale และ domain
- Category จำนวนมาก
- Responsive layout
- Performance
- Accessibility และ contrast

ผลลัพธ์ Visual ผ่าน Test Matrix

### บทที่ 11 Template และการนำกลับมาใช้ซ้ำ

- แยกส่วนที่ผู้ใช้แก้ไขได้
- ตั้งค่า Parameters
- Export Template
- Import Template
- เปลี่ยน Field mapping
- Versioning ของ Specification

ผลลัพธ์ Bullet Chart Template พร้อมนำไปใช้กับ Project อื่น

### บทที่ 12 Final Workshop

- เริ่มจากหน้า Report เปล่า
- Import ข้อมูล
- สร้าง Measures
- สร้าง Bullet Chart ฉบับสมบูรณ์
- ทดสอบทุกกรณี
- เปรียบเทียบผลลัพธ์กับ Reference

ผลลัพธ์ ผู้อ่านทำซ้ำได้โดยไม่คัดลอกไฟล์สำเร็จรูป

## 7 ชุดข้อมูล Workshop

สร้างไฟล์ `data/Deneb_Workshop_Data.xlsx` โดยมีตารางต่อไปนี้

### ตาราง KPI Data

| Column | Type | Purpose |
| --- | --- | --- |
| KPI_ID | Text | Unique key |
| Category | Text | ชื่อ KPI |
| Actual | Decimal | ผลงานจริง |
| Target | Decimal | เป้าหมาย |
| Previous | Decimal | ผลงานงวดก่อน |
| Range_Min | Decimal | จุดเริ่มต้น Scale |
| Range_Low | Decimal | สิ้นสุดช่วงต่ำ |
| Range_Mid | Decimal | สิ้นสุดช่วงกลาง |
| Range_High | Decimal | สิ้นสุดช่วงดี |
| Sort_Order | Whole number | ลำดับแสดงผล |
| Unit | Text | หน่วย |
| Tooltip_Detail | Text | รายละเอียดเพิ่มเติม |

### Test scenarios ที่ต้องมี

1. Actual ต่ำกว่า 70 เปอร์เซ็นต์ของ Target
2. Actual อยู่ระหว่าง 70 ถึงต่ำกว่า 90 เปอร์เซ็นต์
3. Actual ตั้งแต่ 90 ถึง 100 เปอร์เซ็นต์
4. Actual เท่ากับ Target
5. Actual มากกว่า Target
6. Target เท่ากับศูนย์
7. Actual เป็น Blank
8. Target เป็น Blank
9. Category ชื่อยาว
10. ค่า Actual และ Target ขนาดใหญ่
11. ค่า Actual ติดลบ
12. หลาย Category สำหรับทดสอบ scrolling และ performance

### Measures ขั้นต่ำ

```DAX
Actual Value =
SUM ( KPI_Data[Actual] )

Target Value =
SUM ( KPI_Data[Target] )

Achievement % =
DIVIDE ( [Actual Value], [Target Value] )

Variance =
[Actual Value] - [Target Value]

Variance % =
DIVIDE ( [Variance], [Target Value] )
```

Codex ต้องตรวจชื่อ Table Column และ Measure ในไฟล์ข้อมูล โค้ด Deneb ภาพ และต้นฉบับให้ตรงกันทั้งหมด

## 8 มาตรฐาน Workshop ต่อหนึ่ง Step

ทุก Step ต้องมีหัวข้อตามลำดับนี้

1. เป้าหมาย
2. สิ่งที่ควรเห็นก่อนเริ่ม
3. Fields และ Measures ที่ใช้
4. ขั้นตอนใน Power BI
5. JSON ที่เพิ่มหรือแก้เฉพาะ Step
6. คำอธิบายโค้ด
7. ภาพระหว่างทำ
8. ผลลัพธ์ที่ควรได้
9. วิธีตรวจสอบผล
10. ปัญหาที่อาจพบและวิธีแก้
11. แบบฝึกหัดสั้น
12. จุดตรวจผ่านก่อนทำ Step ถัดไป

ห้ามนำ Specification ฉบับเต็มมาวางซ้ำทุก Step ให้แสดงเฉพาะส่วนที่เปลี่ยน และให้ลิงก์ไปยังไฟล์ JSON เต็มของ Step นั้น

## 9 แผนภาพประกอบ

### ภาพขั้นต่ำต่อ Step

- ภาพก่อนเริ่ม
- ภาพตำแหน่งเมนูหรือ Field mapping
- ภาพ Deneb Editor พร้อมเน้นโค้ดที่แก้
- ภาพผลลัพธ์หลังจบ Step

### กฎของภาพ

- ต้องจับจาก Workshop ที่รันจริง
- UI โค้ด ชื่อ Field และค่าบนภาพต้องตรงกับต้นฉบับ
- Crop เฉพาะพื้นที่สำคัญแต่ต้องเหลือบริบทเพียงพอ
- ใช้กรอบหรือลูกศรเท่าที่จำเป็น
- ห้ามบัง Error message หรือค่าที่ผู้อ่านต้องตรวจสอบ
- ใช้ Resolution และ Scale เดียวกันตลอดเล่ม
- ไม่ใช้ภาพที่เบลอหรือภาพจากเวอร์ชันเก่า

### Naming convention

```text
CH05-S01-before.png
CH05-S02-field-mapping.png
CH05-S03-editor-change.png
CH05-S04-result.png
```

Caption ทุกภาพต้องบอกว่าภาพแสดงอะไร ไม่ใช้ Caption แบบกว้าง เช่น ภาพตัวอย่าง

## 10 ขั้นตอนทำงานของ Codex CLI

### Phase 0 ตรวจสภาพแวดล้อม

1. ตรวจไฟล์ทั้งหมดใน Project folder
2. สร้างโครงสร้าง Folder ที่ขาด
3. ตรวจว่ามี Power BI Desktop Deneb และช่องทางเรียก Claude หรือไม่
4. บันทึก Version ที่ใช้จริงใน README
5. ห้ามเดา Version หรือหน้าตา UI

### Phase 1 Research และ Design Lock

1. ตรวจเอกสารปัจจุบันของ Deneb Vega-Lite และ Microsoft
2. กำหนด Style guide ของหนังสือ
3. กำหนด Final Bullet Chart reference
4. กำหนด Field contract
5. กำหนด Test matrix
6. ส่ง Design Plan ให้ Claude รีวิว
7. แก้จน `PASS`

### Phase 2 Dataset และ Technical Prototype

1. สร้าง Excel และ CSV
2. สร้าง DAX measures
3. สร้าง Bullet Chart prototype ฉบับเต็มก่อน
4. ทดสอบทุก edge case
5. แยก Prototype ย้อนกลับเป็น Workshop steps
6. ส่ง Dataset Spec และ Final Specification ให้ Claude รีวิว
7. แก้จน `PASS`

เหตุผล ต้องพิสูจน์ก่อนว่า Visual ปลายทางทำงานจริง แล้วจึงแตกเป็นบทเรียน เพื่อไม่ให้หนังสือพาผู้อ่านไปสู่โค้ดที่ตันกลางทาง

### Phase 3 เขียนทีละบท

สำหรับแต่ละบท

1. สร้าง Chapter outline
2. สร้างหรือทดสอบ Workshop
3. บันทึก JSON ของทุก Step
4. จับภาพจากผลจริง
5. เขียนต้นฉบับ
6. ทำ Self-review
7. ส่ง Chapter Review Pack ให้ Claude
8. แก้ไขตามประเด็นที่ยืนยันได้
9. ส่งกลับรีวิว
10. Merge เข้า Master manuscript เมื่อได้ `PASS`

ห้ามเขียนหลายบทพร้อมกันก่อนบทต้นทางผ่าน เพราะชื่อ Fields วิธีอธิบาย และ Style อาจเปลี่ยนแล้วทำให้ต้องแก้ย้อนหลังจำนวนมาก

### Phase 4 รวมเล่ม

1. รวมบทที่ผ่านแล้ว
2. ตรวจสารบัญ Heading Caption และ Cross-reference
3. ตรวจโค้ดกับไฟล์ JSON
4. ตรวจภาพกับเนื้อหา
5. สร้าง DOCX
6. Render ทุกหน้าเป็นภาพเพื่อตรวจ Layout
7. แก้ Page break ภาพแตก ตารางล้น และโค้ดถูกตัด
8. สร้าง PDF
9. ส่ง Full-book Review Pack ให้ Claude
10. แก้และส่งซ้ำจน `PASS`

### Phase 5 Release

1. รัน Final QA
2. ตรวจ Link และไฟล์ประกอบ
3. ตรวจว่า Workshop ทำตามจากศูนย์ได้
4. ใส่ Version และ Release date
5. ย้ายเฉพาะไฟล์ผ่าน QA เข้า `release`

## 11 Workflow รีวิวกับ Claude

### Review Pack ต่อหนึ่งบท

ประกอบด้วย

- Chapter manuscript
- JSON ทุก Step ของบท
- ภาพประกอบ
- Field contract
- Test results
- รายการสิ่งที่เปลี่ยนจากรอบก่อน
- ประเด็นที่ต้องการให้ตรวจเป็นพิเศษ

### สถานะรีวิว

- `PASS` ผ่านทุก Mandatory criterion
- `PASS WITH MINOR EDITS` ยังไม่ถือว่าผ่าน Codex ต้องแก้และส่งใหม่
- `REVISE` มีข้อผิดพลาดหรือคำอธิบายไม่เพียงพอ
- `BLOCKED` ข้อมูลหรือหลักฐานไม่พอสำหรับตัดสิน

### Review cycle

```text
Codex Draft
  -> Codex Self Test
  -> Claude Review
  -> Codex Triage Findings
  -> Codex Revision
  -> Regression Test
  -> Claude Re-review
  -> PASS
```

### กฎการรับข้อเสนอแนะ

- Codex ห้ามแก้ตาม Claude โดยอัตโนมัติหากข้อเสนอแนะขัดกับผลทดสอบหรือเอกสารหลัก
- ทุก Finding ต้องมี `Accepted`, `Rejected` หรือ `Need Evidence`
- Finding ที่ Reject ต้องบันทึกเหตุผลและหลักฐาน
- หลังแก้ต้อง Regression test Step ที่เกี่ยวข้อง
- ถ้าไม่ผ่าน 3 รอบ ให้สร้าง Conflict Summary ระบุข้อขัดแย้ง หลักฐาน และคำตัดสินที่ต้องการ ห้ามวนแก้โดยไม่มีขอบเขต

## 12 Claude Review Rubric

Claude ต้องให้คะแนนและ Finding แยกตามหัวข้อต่อไปนี้

1. Technical accuracy
2. Workshop reproducibility
3. ความต่อเนื่องของการเรียนรู้
4. ความตรงกันของ Data DAX JSON ภาพ และข้อความ
5. Code quality และ Vega-Lite conventions
6. Power BI interaction
7. Edge-case handling
8. ภาษาไทยและความชัดเจน
9. Layout และคุณภาพภาพ
10. ความครบถ้วนของแบบฝึกหัดและ QA

Mandatory criteria ทุกข้อต้องผ่าน จึงให้สถานะ `PASS`

## 13 Definition of Done ต่อหนึ่งบท

บทหนึ่งจะเสร็จเมื่อ

- Workshop ทำตามได้ตั้งแต่ต้นจนจบ
- JSON parse และ render ได้
- ผลลัพธ์ตรงกับ Reference
- Test cases ที่เกี่ยวข้องผ่าน
- Fields Measures และค่าบนภาพตรงกับต้นฉบับ
- รูปทุกภาพอ่านได้และมี Caption
- ไม่มีคำสั่งที่อิง UI แบบคลุมเครือ
- แหล่งอ้างอิงสำคัญถูกบันทึก
- Claude ให้ `PASS`
- Review log ถูกอัปเดต

## 14 Definition of Done ทั้งโครงการ

- ทุกบทผ่าน Claude Review
- Final Bullet Chart ผ่าน Test matrix ทั้งหมด
- ผู้อ่านทดลองทำ Final Workshop จากหน้าเปล่าได้
- DOCX และ PDF ไม่มีภาพแตก ข้อความล้น หรือโค้ดถูกตัด
- สารบัญและ Cross-reference ถูกต้อง
- ไฟล์ Excel CSV DAX JSON และ Template เปิดใช้งานได้
- ไม่มี Secret Credential หรือข้อมูลจริงขององค์กรอยู่ในไฟล์
- Release folder มีเฉพาะไฟล์ฉบับผ่าน QA

## 15 ลำดับดำเนินงานที่แนะนำ

1. อนุมัติ Project Plan
2. สร้าง Folder structure และ README
3. สร้าง Dataset และ Test matrix
4. สร้าง Final Bullet Chart prototype
5. Claude รีวิว Technical design
6. แตก Prototype เป็น Workshop steps
7. เขียนบท 1 ถึง 4
8. เขียนบท 5 ถึง 8
9. เขียนบท 9 ถึง 12
10. รวมเล่มและทำ Layout QA
11. Claude รีวิวทั้งเล่ม
12. แก้จน PASS และ Release

## 16 คำสั่งเริ่มงานสำหรับ Codex CLI

```text
อ่านไฟล์ D:\DATA\Deneb\eBook\PROJECT_PLAN.md ทั้งหมดก่อนเริ่มงาน

เริ่มจาก Phase 0 เท่านั้น ตรวจสภาพแวดล้อมและไฟล์ที่มีอยู่ สร้างโครงสร้างโฟลเดอร์ตามแผน และจัดทำ README.md ที่ระบุสถานะจริงของเครื่องมือ Power BI Deneb และ Claude ห้ามเริ่มเขียน eBook หรือสร้าง Specification จนกว่า Phase 0 จะตรวจเสร็จ

ทำงานทีละ Phase และหยุดสรุปผลเมื่อถึง Quality Gate รักษาชื่อ Table Column Measure และไฟล์ให้ตรงตาม Field contract ทุกจุด ใช้เอกสารทางการเป็นหลัก ทดสอบโค้ดก่อนนำไปเขียนในหนังสือ และห้ามระบุว่า Review ผ่านหากยังไม่ได้รับผล PASS จาก Claude จริง
```

## 17 ความเสี่ยงและมาตรการควบคุม

| Risk | Impact | Control |
| --- | --- | --- |
| UI ของ Power BI หรือ Deneb ต่างจากภาพ | ผู้อ่านทำตามไม่ได้ | บันทึก Version และจับภาพใหม่จากเครื่องจริง |
| โค้ดตัวอย่างไม่ได้รันจริง | Workshop ตัน | Prototype และ regression test ก่อนเขียน |
| ชื่อ Fields ไม่ตรงกัน | JSON แสดง Blank | ใช้ Field contract เดียวและ automated text check |
| Claude แนะนำโค้ดที่ดูถูกแต่รันไม่ได้ | เกิด regression | Codex ต้องทดสอบทุก Finding ก่อนรับ |
| ภาพมากแต่ไม่ช่วยอธิบาย | หนังสือยาวและรก | ทุกภาพต้องผูกกับการกระทำหรือผลตรวจ |
| Review วนไม่จบ | Project ล่าช้า | 3 รอบแล้วสร้าง Conflict Summary |
| สร้าง PBIX อัตโนมัติไม่ได้ | ขาดไฟล์ตัวอย่าง | ให้ขั้นตอนสร้าง PBIX จาก Excel อย่างละเอียดและตรวจด้วยเครื่องจริง |
| เนื้อหาเปลี่ยนตาม Version | หนังสือล้าสมัย | ระบุ Version และแยก compatibility notes |

## 18 หลักการสำคัญ

- สร้างและทดสอบ Visual ปลายทางก่อนแตกเป็นบทเรียน
- เพิ่มความยากทีละแนวคิด ไม่เพิ่มหลาย Feature ใน Step เดียว
- โค้ด ภาพ ข้อมูล และคำอธิบายต้องมาจาก Workshop รุ่นเดียวกัน
- แยกข้อเท็จจริงจากคำแนะนำด้าน Design
- ใช้ Claude เป็น Reviewer ไม่ใช่แหล่งยืนยันว่าโค้ดทำงาน
- ผลทดสอบจริงและเอกสารทางการมีน้ำหนักเหนือความเห็นของ Reviewer
- Release เฉพาะสิ่งที่ผ่าน Quality Gate
