## Verdict: PASS

**CH07-M01 ปิดแล้ว** และไม่พบ Mandatory ใหม่

## ผลตรวจรอบ 2

- [chapter-07.md](/D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-07.md:376) ระบุครบถ้วนว่า:
  - บทนี้ใช้ชื่อเดือนสั้นจากข้อมูล Workshop
  - Category ชื่อยาวยังไม่ได้ทดสอบ
  - ส่งต่อไปทดสอบในบทที่ 9 พร้อมกรณี Category จำนวนมาก
- เพิ่มข้อจำกัดดังกล่าวในสรุปบทแล้วที่ [chapter-07.md](/D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-07.md:424)
- การอ้างว่าแกน X มี `labelLimit` อยู่แล้วถูกต้อง:
  - บทที่ 5 แสดง `labelLimit: {"expr": "max(40, width / 3)"}` ที่ [chapter-05.md](/D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-05.md:135)
  - บทที่ 5 อธิบายหน้าที่ของ `labelLimit` ที่ [chapter-05.md](/D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-05.md:173)
  - Step 2 ของบทที่ 7 มีค่าตรงกันจริงที่ [CH07-S02-data-labels.vl.json](/D:/DATA/Deneb/eBook-DualLineVariance/specs/steps/CH07-S02-data-labels.vl.json:260)
- ข้อความนี้ไม่ overclaim เพราะแยกชัดว่า spec “ตั้ง `labelLimit` ไว้แล้ว” แต่ประสิทธิผลกับ Category ยาว “ยังไม่ได้ทดสอบ”
- Optional ทั้งสองจุดแก้เหมาะสม:
  - caption ภาพ 7-4 แยก `−` กับ `-` ถูกต้อง
  - ข้อความ Tooltip ใช้ถ้อยคำเชิงอนุมาน “ตามโครงสร้าง spec จึงคาดว่า...” พร้อมเปิดเผยขอบเขตการทดสอบ
- รัน `qa/scripts/run-ch07-claims-check.mjs` ซ้ำแล้ว: **34 passed, 0 failed**

## Mandatory findings

ไม่มี

## Optional improvements

ไม่มีเพิ่มเติม

บทที่ 7 พร้อมผ่าน review รอบ 2 โดยไม่ต้องแก้ spec หรือภาพครับ