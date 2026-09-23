# Deneb Bullet Chart eBook — สถานะโครงการ

ตรวจสภาพแวดล้อม Phase 0 เมื่อ 20 กันยายน 2026 (Asia/Bangkok) ตาม [PROJECT_PLAN.md](PROJECT_PLAN.md)

## สถานะ Quality Gate

**Phase 0: ผ่าน Quality Gate** หลังผู้ใช้แจ้งเวอร์ชัน Power BI Desktop และ Deneb ที่ตรวจจากโปรแกรมจริงเมื่อ 20 กันยายน 2026 ไม่มีการเริ่ม Research, Dataset, Specification หรือต้นฉบับ eBook ในโฟลเดอร์นี้

## ไฟล์และโครงสร้าง

- ก่อนเริ่ม Phase 0 โฟลเดอร์ `eBook` มีเพียง `PROJECT_PLAN.md`
- สร้างโฟลเดอร์ตามแผนแล้ว: `manuscript`, `data`, `dax`, `specs`, `templates`, `images/chapter-01` ถึง `chapter-12`, `review/chapters`, `qa`, และ `release`
- ใช้ `.gitkeep` รักษาโฟลเดอร์ว่างไว้ใน Git ไฟล์เหล่านี้ไม่ใช่ผลงานหรือผลทดสอบ
- นอก `eBook` มี `source`, `workshop`, และ `pbiviz` อยู่เดิม ไม่ได้นำไฟล์จากพื้นที่เหล่านั้นมาเป็นหลักฐานว่า Workshop ของ eBook ผ่านการทดสอบ

## สถานะเครื่องมือที่ตรวจได้จริง

| เครื่องมือ | ผลตรวจ | เวอร์ชันที่ยืนยันได้ |
| --- | --- | --- |
| Power BI Desktop | ผู้ใช้ตรวจจากโปรแกรมจริงและแจ้งเวอร์ชัน; การตรวจจาก CLI ไม่พบในตำแหน่งติดตั้งทั่วไป, PATH, รายการ Appx, รายการ Uninstall, Start Menu หรือ process ที่กำลังทำงาน | `2.157.1354.0` 64-bit (Aug 2026) |
| Deneb ใน Power BI | ผู้ใช้ตรวจจากโปรแกรมจริงและแจ้งเวอร์ชัน; การตรวจจาก CLI ไม่พบไฟล์ `.pbiviz` ในโปรเจกต์หรือ CustomVisuals path ที่ตรวจ | `2.0.0.0` |
| Claude Code CLI | พบ `C:\Users\MSI\.local\bin\claude.exe`; คำสั่ง `claude --version` ทำงาน | `2.1.278 (Claude Code)` |

ผล “ไม่พบ” จาก CLI หมายถึงไม่พบจากจุดตรวจข้างต้น ไม่ได้หักล้างข้อมูลเวอร์ชันที่ผู้ใช้ตรวจจากโปรแกรมจริง และยังไม่ได้ทดสอบการส่ง Review Pack ให้ Claude จริง

## ผลตรวจ Phase 0 และขั้นถัดไป

1. บันทึกเวอร์ชัน Power BI Desktop และ Deneb ที่ผู้ใช้ตรวจจากโปรแกรมจริงแล้ว
2. ยืนยันช่องทาง Claude Code CLI และเวอร์ชันแล้ว; การส่ง Review Pack จริงเป็นงานใน Phase ถัดไป
3. Phase 1 เริ่มได้ตามลำดับใน `PROJECT_PLAN.md` เมื่อได้รับคำสั่งให้ดำเนินงานต่อ

ไม่มีการบันทึกภาพ UI จากการคาดเดา

## Phase 1

จัดทำ [Design Plan](review/PHASE1_DESIGN_PLAN.md) และ [Review log](review/REVIEW_LOG.md) แล้ว และได้รับผลรีวิวจาก Claude เป็น `PASS` รอบสุดท้ายหลังแก้ findings ครบ **Phase 1 ผ่าน Quality Gate และ Design Lock แล้ว**; ขั้นถัดไปคือ Phase 2

## Phase 2

สร้าง Dataset Excel/CSV, DAX measures และ [Dataset test log](qa/PHASE2_DATASET_TEST_LOG.md) แล้ว ครอบคลุม fixture T01–T12. Normalized Bullet Chart static render ผ่าน และผล interaction/responsive อยู่ใน [PHASE2_INTERACTION_TEST_LOG.md](qa/PHASE2_INTERACTION_TEST_LOG.md): T14/T15/T16 ผ่าน, T17 รอทดสอบใหม่ด้วยนิยาม Width×Height ให้ตรงกับ Design Lock. ยังไม่ผ่าน Quality Gate ของ Phase 2 จนกว่า T17, T18, T19 และ performance จะผ่าน
