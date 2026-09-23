## Verdict: REVISE

### สถานะ Findings เดิม

| ID | สถานะ | ผลตรวจ |
|---|---|---|
| M-05 | **CLOSED** | แก้ครบทั้งหัวข้อ 3 ข้อ 5 และบทที่ 7 เป็น “ลดการชนกัน” พร้อมระบุชัดว่าไม่รับประกันทุกกรณีแล้ว |
| M-09 | **CLOSED** | ไม่มีการอ้างอิงหรือพึ่งพา `D:\DATA\Deneb\eBook\PROJECT_PLAN.md` แล้ว มาตรฐาน 12 หัวข้อและกฎภาพประกอบถูกเขียนไว้ในแผนโดยตรงครบถ้วน การกล่าวถึงโครงการ Bullet Chart เพื่อเปรียบเทียบ workflow ไม่ถือเป็น dependency |

### Mandatory finding ใหม่

**M-10 — การตั้งค่า Cross-highlight ยังไม่ครบสำหรับ Deneb 2.0**

แผนหลายตำแหน่งระบุว่าเมื่อเปิด “Expose Cross-Highlight Values for Measures” แล้วจะอ่าน `[Measure]__highlightStatus` ได้ แต่ใน Deneb 2.0 supporting field `__highlightStatus` ถูกปิดโดยค่าเริ่มต้นและต้องเปิดแยกต่อ field ใน Project setup pane

ตำแหน่งที่ต้องแก้:

- หัวข้อ 4 กลุ่ม B
- บทที่ 8
- Phase 1 ข้อ 2
- Definition of Done ที่กล่าวถึงกลไก Cross-highlight

ให้ระบุขั้นตอนสองระดับ:

1. เปิด cross-highlighting สำหรับ visual
2. เปิด supporting field `Highlight Status` ให้ Actual และ Reference หาก specification ใช้ `[Actual]__highlightStatus` และ `[Reference]__highlightStatus`

นอกจากนี้ ชื่อและตำแหน่ง UI ในแผนยังผสมระหว่าง UI รุ่นเก่า (`Vega > Power BI Interactivity`) กับ Deneb 2.0 (`Project setup pane`) จึงต้องผูกคำแนะนำกับ Deneb version ที่ล็อกใน Phase 1 หรือใช้ชื่อของรุ่นที่เลือกอย่างสม่ำเสมอ

เอกสาร Deneb ปัจจุบันยืนยันว่า highlight value เปิดตาม cross-highlighting แต่ `__highlightStatus` เป็น supporting field ที่ปิดโดยค่าเริ่มต้น: [Deneb Dataset](https://deneb.guide/docs/dataset), [Deneb Field Parameters](https://deneb.guide/docs/field-parameters), [PBIR Implementation Guide](https://deneb.guide/docs/pbir-guide)

### สรุป

- M-05: ปิดครบ
- M-09: ปิดครบ
- Optional improvement เรื่องคำซ้ำ: แก้แล้ว
- Mandatory คงเหลือ: **M-10 จำนวน 1 รายการ**

จึงยังให้ `PASS` ไม่ได้ในรอบนี้ เนื่องจากยังมี Mandatory finding ค้างอยู่ 1 รายการ.