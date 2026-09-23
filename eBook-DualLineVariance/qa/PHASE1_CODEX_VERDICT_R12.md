## Verdict: REVISE

M-23R ยังปิดไม่ครบ จึงยังให้ `PASS` ไม่ได้ แต่ไม่พบ Mandatory finding ใหม่เพิ่มเติม

### Mandatory finding ที่ยังค้าง

**M-23R — ข้อความอ้าง `interactive:false` และ Point เป็น layer เดียวที่รับ event ยังตกค้างในหัวข้อ 0.1**

ใน [PHASE1_DESIGN_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:63) ยังระบุว่า:

> ตั้ง `"interactive": false` บน Area และ Line marks ทั้งคู่ เหลือ Point layer เป็น layer เดียวที่รับ click/tooltip/context-menu ทั้ง spec

ข้อความนี้ยังเป็นข้อกล่าวอ้างที่ถูกถอนแล้ว เพราะ:

- `interactive` ไม่ใช่ Vega-Lite MarkDef property ที่อาศัยได้
- เอกสารปัจจุบันยอมรับแล้วว่า Area, Connector และ layer อื่นยังอาจรับ/resolve event
- ขัดตรงกับหัวข้อ 2.2 ซึ่งระบุชัดว่า Point ไม่ใช่ layer เดียวที่รับ event

**Required fix:** แก้ cell ของ M-01R ในหัวข้อ 0.1 ให้เป็นบันทึกประวัติที่ระบุว่าข้อสรุปรอบ 2 ถูกถอนในรอบ 3 และถูกแทนที่ด้วย Phase 2 T18/T22 gate ห้ามปล่อยข้อความเดิมไว้โดยไม่มีการกำกับว่าเป็นแนวทางที่ยกเลิกแล้ว

ตัวอย่างข้อความที่ใช้ได้:

> แนวทางรอบ 2 ที่ใช้ `"interactive": false` และอ้างว่า Point เป็น layer เดียวที่รับ event ถูกถอนในรอบ 3 เพราะ property นี้ไม่รองรับใน Vega-Lite MarkDef; หลัง M-23 ให้ถือว่า Area interaction เป็นคำถามเปิดที่ต้องพิสูจน์ด้วย T18/T22 และ Phase 2 ข้อ 7

### จุดที่ตรวจแล้วว่าปิดครบ

- หัวข้อ 2.2 ถอนแนวคิด `Category=Blank` เป็น safe soft-fail ชัดเจน
- หัวข้อ 2.2.1 item 1 ระบุแล้วว่า `Category` ไม่ใช่กลไกป้องกัน Area interaction
- ตัด “ลด opacity” ออกจาก mitigation และอธิบายถูกต้องว่าไม่กระทบ hit-testing
- T18 ขยาย Expected ให้ตรวจว่า Visual อื่นเหลือ Category ใดจริง
- T22 ครอบคลุม right-click กลาง Area
- `PROJECT_PLAN.md` Phase 2 ข้อ 7 เป็น mandatory gate พร้อม Evidence record, architecture change และ regression test
- Codex review ถูก renumber เป็น Phase 2 ข้อ 8
- Design Plan หัวข้อ 9 ข้อ 8 ส่งต่อ T18/T22 Area safety ครบ

### Optional cleanup

หัวข้อ 2.2.1 มีลำดับรายการ `1, 2, 3, 4, 2, 3, 5` ควรจัดใหม่ให้ต่อเนื่อง เพื่อลดความกำกวมของ cross-reference แต่ยังไม่ถือเป็น Mandatory finding

**สรุป:** ไม่มี Mandatory finding ใหม่ แต่ M-23R ยังเหลือข้อความตกค้างหนึ่งจุดที่หัวข้อ 0.1 จึงเป็น `REVISE` รอบนี้.