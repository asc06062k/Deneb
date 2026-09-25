# Phase 3 — บทที่ 2 review request รอบ 2 (สำหรับ Codex CLI)

รอบ 1 ให้ `REVISE` (`review/chapters/CH02_CODEX_VERDICT.md`, M-01 ถึง M-07) ผู้เขียนแก้ต้นฉบับ [`manuscript/chapter-02.md`](../../manuscript/chapter-02.md) และรับหลักฐานจากผู้ใช้บน Power BI Desktop 2.157.1354.0 + Deneb 2.0.0.0 จริงแล้ว ขอให้ตรวจซ้ำ รูปแบบตอบเหมือนรอบ 1 (Verdict, Mandatory findings ตาราง, Optional, คำถามที่ค้าง) ภาษาไทย ตรวจเฉพาะที่เปลี่ยน + ตรวจว่าการเลื่อนเลขภาพไม่ทำให้อ้างผิด

## หลักฐานใหม่จากผู้ใช้ (25 ก.ย. 2026)

1. หลังคลิกไอคอนถุงบนการ์ด Deneb ใน AppSource **ไม่มี dialog ยืนยันเพิ่ม** (คำตอบผู้ใช้ ไม่มีภาพ)
2. ช่อง Values: ค่าเริ่มต้นแสดง `Sum of Actual` (Summarization = Sum) ผู้ใช้ **เปลี่ยนชื่อด้วย Rename for this visual** เป็น `Actual` ไม่ได้ตั้ง Don't summarize ภาพ `CH02-S03-values-context-menu.png` (ภาพ 2-8) เห็นเมนูคลิกขวา: Remove field / Rename for this visual / Move / Don't summarize / Sum (ติ๊ก) / ... และภาพ Data flyout ที่ Field = "Sum of Actual", Summarization = "Sum" (ไม่ได้ใส่ในบท)
3. ปุ่ม Convert my spec to Vega: กดแล้วมีคำเตือนของ Deneb "This will replace your Vega-Lite specification with the compiled Vega output. THIS CANNOT BE UNDONE." (ภาพ 2-15 `CH02-S05-convert-to-vega-warning.png`) ผู้ใช้รายงานด้วยวาจาว่าหลังยืนยัน กด Ctrl+Z หรือไอคอน Undo ของ Power BI แล้ว spec กลับมาได้ (ไม่มีภาพ) — ผู้เขียนเลือกเขียนทั้งคำเตือนของ Deneb และผลทดสอบของผู้ใช้แบบไม่ยืนยันเกินไป และให้ผู้อ่านไม่กดในบทนี้

## สิ่งที่แก้ตามรอบ 1

M-01 ขั้นตอนติดตั้ง, M-02 ขั้นตอน Rename (แทน Don't summarize), M-03 JSON เป็น "ตัวอย่างย่อที่เรียบเรียง", M-04 ตัดคำว่า "ถาวร" ใช้คำเตือนจริง, M-05 แบบฝึกหัด Simple bar chart ให้ทำใน Visual สำเนา, M-06 หัวข้อ Fields ของ Step 5, M-07 วิธีตรวจผลใน Step 4; รับ optional: แบบฝึกหัด Step 1 เปลี่ยนเป็นตรวจผู้เผยแพร่/Certified; ไม่รับ: แยกความต่าง Source กับ Data (ผู้เขียนยังไม่ตรวจกับเอกสาร ถ้า Codex ยืนยันจากเอกสารได้ ให้ระบุลิงก์)

ภาพตอนนี้ 2-1 ถึง 2-20 (เพิ่ม 2-8 และ 2-15) เลขเลื่อน ขอให้ตรวจการอ้างอิง "ภาพ 2-x" ทุกจุด และตรวจภาพใหม่ 2-8, 2-15 ว่าไม่มีชื่อบัญชี
