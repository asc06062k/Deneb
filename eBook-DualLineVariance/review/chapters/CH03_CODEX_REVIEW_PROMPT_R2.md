# Phase 3 — บทที่ 3 review request รอบ 2 (สำหรับ Codex CLI)

รอบ 1 ให้ `REVISE` (`review/chapters/CH03_CODEX_VERDICT.md`, CH03-M01 ถึง M04) ผู้เขียนแก้ [`manuscript/chapter-03.md`](../../manuscript/chapter-03.md) ตรวจซ้ำเฉพาะที่แก้ รูปแบบตอบเหมือนเดิม ภาษาไทย

## สิ่งที่แก้

- M01: เพิ่มย่อหน้า `$schema` ในหัวข้อ 3.1 (อ้าง deneb.guide Visual Editor/Templates ตามที่ Codex เสนอ; ผู้เขียนยังไม่ได้ทดสอบเองว่าใส่แล้วเกิดอะไรบนเครื่องจริง — ระบุในบทแล้ว) และไม่ให้ "ไม่มี $schema" เป็นคุณสมบัติความถูกต้องทั่วไป
- M02: แยก `__row__` / `__selected__` / `<measure>__highlight` เป็นสามเงื่อนไขตามเอกสาร Deneb (Dataset, Cross-Filtering) และระบุว่าภาพ 2-12/2-13 เป็นสถานะโปรเจกต์ตัวอย่าง
- M03: ตัดข้อความว่า `sort: {field, op}` กลับมาในบท 5 แก้เป็น "แนวคิดกลับมา แต่ spec สุดท้ายใช้ Plot_Position + labelExpr" ตารางท้ายบทแยก `transform.filter` (บท 5–8) กับ `transform.calculate` (บท 7–8) และ `condition` เป็นบท 6–8 — ตรวจกับ `specs/steps/` แล้ว: filter เริ่ม CH05-S01, calculate เริ่ม CH07-S01, condition เริ่ม CH06-S01
- M04: caption ภาพ 3-2 ถึง 3-9 ทุกภาพระบุ "ไม่ใช่ภาพหน้าจอ Power BI"
- Optional ที่รับ: ขยายประโยค condition, ประโยค `{expr}`, แยก cross-filter/cross-highlight, หมายเหตุป้ายเดือนหมุนอัตโนมัติ

ตัวอย่างและภาพเหมือนเดิม (สคริปต์ 65 ผ่าน) ตรวจว่าเลขภาพ 3-x / 2-x ยังอ้างถูก และไม่มี overclaim ใหม่ในข้อความที่เพิ่ม
