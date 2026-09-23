## Verdict: REVISE

ยังให้ `PASS` ไม่ได้ เนื่องจาก M-12 ยังปิดไม่ครบ และพบ Mandatory finding เพิ่มอีก 1 จุด

### M-12 — OPEN

หัวข้อ 3 ข้อ 5 ยังไม่ได้ “แยกอีกประโยค” ตามที่ระบุไว้ ปัจจุบัน Data label และ Category axis label ยังเชื่อมอยู่ในประโยคเดียวด้วยคำว่า “และ” ทำให้ขอบเขตคำรับประกัน Group A/Group B ยังไม่แยกเด็ดขาด

ควรแก้เป็นลักษณะนี้:

> 5. เพิ่ม Connector line, Data label ที่ลดการชนกัน (ไม่รับประกันว่าไม่ชนทุกกรณี) และ Tooltip หลายค่า พร้อมทำให้กลไกจัดตำแหน่งและ thinning ของ Data label ประเมินใหม่ทุกครั้งที่ผู้ใช้ปรับขนาด Visual (Responsive) — Group A  
> ทำให้ Category axis label ไม่ทับซ้อนกันภายในช่วงขนาดที่ผ่าน Test matrix ตามกลไกที่พิสูจน์และ Lock ใน Phase 1 — Group B

จะใช้สองประโยคภายในข้อ 5 เดียวกันได้ ไม่จำเป็นต้องเพิ่มเลขข้อใหม่

### M-14 — CLOSED

หัวข้อ 9 แก้เป็น “Phase 1 ข้อ 5” แล้ว และตรงกับตำแหน่ง Evidence record ปัจจุบัน ไม่มี cross-reference เก่าที่พบในข้อความส่วนนี้

### Mandatory finding ใหม่

**M-15 — Phase 1 ยังไม่มี prototype gate สำหรับ Responsive Data label**

Phase 1 ข้อ 4 บังคับพิสูจน์บน Power BI จริงเฉพาะ:

- grain ของ `Business_Type`
- Category axis label ไม่ทับซ้อนเมื่อ resize

แต่ยังไม่ได้บังคับพิสูจน์ว่า Actual/Reference data-label positioning และ thinning ถูกประเมินใหม่ทุกครั้งที่ resize จริง ทั้งที่เป็น Learning outcome และ Group A requirement

ให้เพิ่ม Phase 1 ข้อ 4 (ค) เช่น:

> (ค) พิสูจน์ด้วย prototype จริงใน Power BI ว่ากลไกจัดตำแหน่งและ thinning ของ Actual/Reference data label ถูกประเมินใหม่เมื่อ resize Visual ในทุกขนาดที่กำหนดใน Test matrix โดยใช้เกณฑ์ “ลดการชน” ไม่ใช่รับประกัน collision-free

การมี Test matrix ในข้อ 3 อย่างเดียวยังไม่เท่ากับการพิสูจน์และ Lock กลไกใน prototype

ส่วนถ้อยคำ Deneb 2.0 เรื่อง `__selected__`, Supporting fields และ Context menu ที่ตรวจ regression ไม่พบ Mandatory mismatch ใหม่ โดยสอดคล้องกับเอกสารทางการปัจจุบันของ [Cross-filtering](https://deneb.guide/docs/interactivity-selection) และ [Deneb 2.0 changelog](https://deneb.guide/docs/changelog) ครับ