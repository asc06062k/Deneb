# Phase 0 review request (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของแผนโครงการ eBook สอนสร้าง "Dual-Line Variance Chart" ด้วย Deneb บน Power BI สำหรับผู้อ่านที่ไม่มีพื้นฐานเขียนโปรแกรม

เนื้อหาแผนทั้งหมดอยู่ด้านล่างนี้ (ไม่ต้องเปิดไฟล์เพิ่ม) เป็นไฟล์ `D:\DATA\Deneb\eBook-DualLineVariance\PROJECT_PLAN.md`

ตรวจประเด็นต่อไปนี้เป็นหลัก

1. ขอบเขต Feature ในหัวข้อ 4 ตรงกับพฤติกรรมจริงของ Custom Visual ต้นแบบที่ `D:\DATA\Custom viz\dualLineVarianceChart` หรือไม่ (ดูจาก capabilities.json/interfaces.ts/visual.ts ถ้าเข้าถึงได้) มีการสัญญาฟีเจอร์ที่ Deneb/Vega-Lite ทำไม่ได้จริงหรือไม่
2. โครงสร้าง 10 บท เรียงลำดับความยากสมเหตุสมผลสำหรับผู้ไม่เคยเขียนโค้ดหรือไม่ มีช่องว่างความรู้ระหว่างบทหรือไม่
3. แนวทาง Cross-filter/Cross-highlight ที่ระบุไว้ (ใช้ selection param ของ Vega-Lite ผ่าน Deneb) สมเหตุสมผลในระดับแนวคิดหรือไม่ และแผนจัดการข้อจำกัดเรื่องไม่มีสิทธิ์รัน Power BI จริงเพียงพอหรือไม่
4. Field contract (Category, Actual, Reference) เพียงพอสำหรับสร้าง Variance area + Connector line ตามที่อธิบายหรือไม่
5. Definition of Done และ Workflow รีวิวรัดกุมพอจะป้องกันการอ้างผลทดสอบเท็จหรือไม่
6. ความเสี่ยงหรือช่องโหว่อื่นที่ควรเพิ่มก่อนเริ่ม Phase 1

ตอบกลับให้ตรงรูปแบบนี้เท่านั้น

1. Verdict: PASS, REVISE, หรือ BLOCKED
2. Mandatory findings (ตาราง: ID, ความรุนแรง, หัวข้อในแผนที่เกี่ยวข้อง, ปัญหา, เหตุผล/หลักฐาน, ข้อเสนอแก้ไข) — ถ้าไม่มีให้เขียนว่า "ไม่มี"
3. Optional improvements แยกจาก Mandatory
4. คำถามที่ต้องรอหลักฐานจาก Phase ถัดไป

ให้ `PASS` เฉพาะเมื่อไม่มี Mandatory finding เหลืออยู่ ห้ามเดาพฤติกรรมของ Deneb หรือ Power BI ถ้าไม่แน่ใจให้ระบุว่าต้องตรวจกับเครื่องจริง อย่าอ้างว่า verdict คือ PASS ถ้ายังมีประเด็นค้าง
