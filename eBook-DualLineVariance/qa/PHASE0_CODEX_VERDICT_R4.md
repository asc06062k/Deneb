## Verdict: `REVISE`

M-10 แก้ถูกทิศทางเกือบครบ แต่ยังปิดไม่ได้ เนื่องจากเหลือข้อความคลาดเคลื่อนเกี่ยวกับชื่อ UI และการเปิด Supporting field อยู่ 3 จุด

### Mandatory finding — M-10 ยังเปิดอยู่

1. **Phase 1 ข้อ 2 ระบุการเปิด field ไม่ครบกับผลลัพธ์ที่อ้าง**

ข้อความปัจจุบันระบุว่าเปิด `Highlight value` และ `Highlight status` แล้วจึงจะได้:

> `[measure]__highlight`/`__highlightStatus`/`__highlightComparator`

แต่ `Highlight comparator` เป็น Supporting field อีกตัวที่ต้องเปิดแยกต่อ measure เช่นเดียวกัน หากจะใช้ `__highlightComparator` การเปิดเพียง Value + Status ไม่ได้ทำให้ Comparator พร้อมใช้งาน

ให้แก้เป็นอย่างใดอย่างหนึ่ง:

- ตัด `/__highlightComparator` ออกจากประโยค เพราะ Spec ที่วางแผนไว้ใช้เพียง Value และ Status; หรือ
- เพิ่มว่าต้องเปิด `Highlight comparator` ต่อ Actual และ Reference ด้วย หาก Spec จะอ้าง field นี้

เอกสารยืนยันว่า Supporting field เปิดแยกทีละ field และค่าเริ่มต้นของ measure เปิดเฉพาะ `Highlight value` เท่านั้น ([Dataset — Supporting Fields](https://deneb.guide/docs/dataset), [Cross-Highlighting — Special Fields](https://deneb.guide/docs/interactivity-highlight))

2. **บทที่ 8 ยังบอกว่าเป็น “คนละหน้าตั้งค่า”**

ข้อความ:

> “เป็นคนละกลไกและคนละหน้าตั้งค่า”

ไม่ตรงกับ Deneb 2.0 เพราะ Cross-filtering, Cross-highlighting และ Supporting Fields อยู่ใน **Project setup pane เดียวกัน** แต่เป็นคนละ section/รายการตั้งค่า ควรแก้เป็น:

> “เป็นคนละกลไกและคนละส่วนการตั้งค่าภายใน Project setup pane”

3. **ชื่อ UI ของ Context menu ยังไม่ใช่ชื่อ Deneb 2.0 ที่แน่นอน**

หลายตำแหน่งยังใช้:

> “Data point resolution ของ Interactivity”

ใน Deneb 2.0 ชื่อปัจจุบันอยู่ใน section **Context menu** ของ Project setup pane และมีสอง property:

- `Show context menu on right-click`
- `Attempt to resolve data point-specific actions`

ทั้งสองเปิดโดยค่าเริ่มต้น จึงควรแทนข้อความในหมายเหตุ บทที่ 8 และหัวข้อ 9 ด้วยชื่อสองรายการนี้ ไม่ควรใช้ชื่อกว้าง ๆ ว่า “Data point resolution of Interactivity” ([Deneb 2.0 Context Menu](https://deneb.guide/docs/interactivity-context-menu))

เพื่อให้สอดคล้องกับเงื่อนไข “ใช้ชื่อ UI ของ Deneb 2.0” อย่างเคร่งครัด ควรใช้ชื่อ property จริงในจุดหลักด้วย:

- Cross-filter: `Expose cross-filtering values for dataset rows`
- Cross-highlight: `Expose cross-highlight values for measures`

### สถานะ Findings

- M-05: `CLOSED`
- M-09: `CLOSED`
- M-10: `OPEN` — เหลือ 3 จุดข้างต้น
- Mandatory finding อื่นนอกขอบเขต M-10: **ไม่พบ**

เมื่อแก้สามจุดนี้แล้ว M-10 จึงจะปิดได้และ Phase 0 มีแนวโน้มพร้อมรับ `PASS` โดยไม่ต้องเปลี่ยนโครงสร้างแผนส่วนอื่นครับ