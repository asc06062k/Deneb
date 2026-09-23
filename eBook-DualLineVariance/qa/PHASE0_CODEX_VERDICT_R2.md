## Verdict: REVISE

การแก้ไขปิดประเด็นเดิมได้เกือบทั้งหมด แต่ยังเหลือ Mandatory finding 2 ข้อ จึงยังให้ `PASS` ไม่ได้

## Mandatory findings

| ID | สถานะ | Finding | การแก้ที่ต้องทำ |
|---|---|---|---|
| M-05 | ยังปิดไม่ครบ | ขอบเขต Feature แก้เป็น “ลดการชนกัน” แล้ว แต่หัวข้อ 3 ข้อ 5 ยังเขียนว่า “Data label ที่ไม่ชนกัน” และบทที่ 7 ยังใช้ “จัดตำแหน่ง label ไม่ให้ชนกัน” ซึ่งยังเป็นคำรับประกันแบบเด็ดขาดและขัดกับ test-based promise | แก้ทั้งสองตำแหน่งเป็น “ลดการชนกัน” และระบุว่าประเมินตาม test matrix โดยไม่รับประกันทุกกรณี |
| M-09 | ยังปิดไม่ครบ | แม้หัวข้อ 8–10 จะ self-contained มากขึ้น แต่หัวข้อ 6 ยังนำเข้ากฎจาก `D:\DATA\Deneb\eBook\PROJECT_PLAN.md` หัวข้อ 8–9 โดยตรง เช่น “โครงสร้าง 12 หัวข้อย่อยต่อ Step” และ naming convention ทำให้แผนฉบับนี้ยังไม่ self-contained และไม่สามารถตรวจ requirement ทั้งหมดจากเอกสารเดียวได้ | คัดลอกกฎที่จำเป็นมาเขียนไว้ในแผนนี้โดยตรง หรือสร้างเอกสารมาตรฐานกลางที่ถูก version/commit ไว้ชัดเจน ห้ามอาศัยไฟล์ของโครงการ Bullet Chart เป็น normative dependency |

M-01, M-02, M-03, M-04, M-06, M-07, M-08 และ M-10 ถือว่าปิดแล้วจากข้อความในฉบับนี้

## Optional improvements

- หัวข้อ 1 ใช้คำว่า “Cross-filter, Cross-highlight และ Cross-filter ไปยัง Visual อื่น” ซึ่งซ้ำและอาจทำให้เข้าใจทิศทางผิด แนะนำเปลี่ยนเป็น “Cross-filter ออกจาก Visual และรับ Cross-highlight จาก Visual อื่น”
- ในกลุ่ม A ควรกำหนดว่า หาก Phase 1 เลือก fallback แบบทาสีทั้งช่วง ฟีเจอร์ crossing case จะถูกย้ายออกจากสถานะ “เทียบเท่าต้นแบบ” อย่างเป็นทางการ ไม่ใช่เพียงลดคำสัญญาในข้อความ
- Phase 3 ระบุว่าใช้ mock ขณะที่หัวข้อ 6 ซึ่งอ้างกฎภายนอกบอกว่าภาพต้องจับจาก Workshop จริง ควรรวมกฎภาพเป็นข้อความเดียวเพื่อป้องกันความขัดแย้ง
- Release gate อาจระบุชื่อไฟล์หรือ index ของ Test ID ที่ต้องผ่าน เพื่อให้ตรวจคำว่า “ครบทุก Test ID” ได้แบบ deterministic

## คำถามที่ต้องรอหลักฐาน

คำถามเหล่านี้ไม่ขวางการอนุมัติ Phase 0 แต่ต้องได้คำตอบใน Phase 1/ก่อน Final release:

1. Vega-Lite สามารถแบ่งสี variance polygon ตรงจุดตัดได้ตามที่ต้องการหรือไม่ และจะเลือก native transform, precompute หรือ fallback ใด
2. Field contract จะเลือกนโยบาย Blank แบบ `blank → 0` ตามต้นแบบ หรือเว้นช่องว่างเส้น
3. Category ซ้ำจะ aggregate ด้วยวิธีใด และที่ชั้น Power Query, DAX หรือก่อนนำเข้าข้อมูล
4. Evidence จาก Power BI/Deneb จริงยืนยัน Cross-filtering, Cross-highlighting และ Context menu ครบตาม Test ID หรือยัง
5. Template ที่ export แล้วเก็บ field mapping และ interactivity settings ตามที่แผนกล่าวไว้จริงในเวอร์ชัน Deneb ที่ล็อกหรือไม่

เมื่อแก้ M-05 สองตำแหน่งและทำให้มาตรฐานต่อบทใน M-09 ไม่ขึ้นกับโครงการ Bullet Chart แล้ว แผนนี้จึงมีสิทธิ์ได้รับ `PASS` ในรอบถัดไป โดยคำถามหลักฐานข้างต้นสามารถคงเป็น Phase 1 gates ได้ตามที่วางแผนไว้.