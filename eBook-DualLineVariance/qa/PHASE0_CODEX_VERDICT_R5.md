## Verdict: REVISE

### M-10 — CLOSED

แก้ครบทั้ง 3 ประเด็นแล้ว:

1. ระบุถูกต้องว่า `Highlight value`, `Highlight status` และ `Highlight comparator` เป็น Supporting fields ที่ต้องเปิดแยกกัน และค่าเริ่มต้นของ measure เปิดเฉพาะ `Highlight value`
2. แก้เป็นคนละ section ภายใน `Project setup pane` เดียวกันแล้ว
3. ใช้ชื่อ Deneb 2.0 ถูกต้องครบทุกจุด:
   - `Show context menu on right-click`
   - `Attempt to resolve data point-specific actions`

เอกสาร Deneb 2.0 ยืนยันว่าทั้งสองรายการอยู่ใน section `Context menu` และเปิดโดยค่าเริ่มต้นทั้งคู่ [Deneb — Context Menu](https://deneb.guide/docs/interactivity-context-menu) ส่วนชื่อ cross-filter และ cross-highlight ในแผนก็ตรงกับเอกสารปัจจุบันแล้ว [Deneb — Cross-Filtering](https://deneb.guide/docs/interactivity-selection), [Deneb — Cross-Highlighting](https://deneb.guide/docs/interactivity-highlight)

### Mandatory finding ใหม่

**M-11 — ต้องระบุการตั้งค่า Power BI visual interaction เป็น `Highlight` อย่างชัดเจน**

แผนกล่าวถึงการเปิด `Expose cross-highlight values for measures` และ Supporting fields ครบแล้ว แต่ยังไม่ได้กำหนดขั้นตอนบังคับให้ตั้ง interaction จาก Visual ต้นทางมายัง Deneb เป็น `Highlight` ผ่าน Power BI `Edit interactions`

Deneb ไม่สามารถกำหนด interaction mode ใน visual header แทนผู้สร้างรายงานได้ และเอกสารระบุให้ยืนยันว่า Visual อื่นถูกตั้งเป็น `Highlight your visual` มิฉะนั้น Power BI อาจส่งผลแบบ Filter หรือพฤติกรรมอาจขึ้นกับค่าเริ่มต้นของรายงาน [Deneb — Cross-Highlighting](https://deneb.guide/docs/interactivity-highlight)

ต้องเพิ่มอย่างน้อยใน:

- บทที่ 8: ขั้นตอน `Edit interactions` และเลือก `Highlight` ที่ Deneb
- Phase 1 ข้อ 2: lock ขั้นตอนนี้เป็นส่วนหนึ่งของกลไก cross-highlight
- Evidence record/Test matrix: บันทึก interaction mode ของ Visual ต้นทาง
- บทที่ 10: ทดสอบทั้งสถานะ `Highlight`, `Filter` และ `None` หรืออย่างน้อยยืนยันว่าใช้ `Highlight`

### สรุป

- M-10: **ปิดครบ**
- Mandatory ค้าง: **M-11 จำนวน 1 รายการ**
- Verdict: **REVISE**
- ยังให้ `PASS` ไม่ได้จนกว่าจะเพิ่มเงื่อนไข Power BI `Edit interactions → Highlight` อย่างชัดเจนในแผน