## Phase 1 Re-review — รอบ 7

**Verdict: REVISE**

สรุปผล: **CLOSED 4 (M-13, M-14, M-16, M-17), NEW 1 (M-18)**  
ยังให้ `PASS` ไม่ได้ เพราะมี Mandatory finding ใหม่ 1 รายการ

### ผลตรวจ Finding เดิม

| Finding | สถานะ | ผลตรวจ |
| --- | --- | --- |
| M-13 | **CLOSED** | Expected ของ T04 ระบุ `Row_Type`, `Plot_Actual`, `Plot_Reference` และ equality ที่ `diff=0` โดยตรงแล้ว ส่วน T31 ระบุครบทั้ง zero และ non-zero Boundary; T32 อ้าง assertion เดียวกับ T31 อย่างชัดเจน สอดคล้องกับ invariant และ field contract |
| M-14 | **CLOSED** | `Business_Type` ระบุว่า stamp ครบ `Original`, `Boundary`, และ `Crossing` แล้วทั้งในหัวข้อ 3 และ field contract ไม่มีข้อความเดิมที่จำกัดเฉพาะบาง Row_Type เหลืออยู่ |
| M-16 | **CLOSED** | รายการสรุป Static tests ด้านล่างตารางรวม T31/T32 แล้ว และตรงกับค่า `Static` ในตาราง Test Matrix |
| M-17 | **CLOSED** | แยก `Filter_Key` ออกจาก `Category` ครบทั้งหัวข้อ 2.1 และ 5; Fill rows กำหนด key จาก `row[i]` ฝั่งซ้ายและไม่ Blank; Relationship ใช้ `Filter_Key`; T29 แก้ Expected ของกรณีตัดฝั่งขวาให้เกิด dangling ตามกลไกใหม่นี้แล้ว |

### Mandatory finding ใหม่

#### M-18 — พฤติกรรมอีกครึ่งหนึ่งของ `Filter_Key` ยังไม่มี Test assertion

หัวข้อ 2.2.1 ล็อกพฤติกรรมไว้สองกรณี:

1. ถ้า `row[i]` ฝั่งซ้ายถูกกรองออก → Fill rows ของ segment ต้องถูกตัดออก
2. ถ้า `row[i+1]` ฝั่งขวาถูกกรองออก แต่ฝั่งซ้ายยังอยู่ → Fill rows ต้องค้างและเกิด dangling

ปัจจุบัน T29 ตรวจเฉพาะข้อ 2 เท่านั้น แม้สรุปการแก้ M-17 ตอนต้นเอกสารจะกล่าวถึงทั้งสองกรณี จึงยังไม่มี regression test ยืนยันกฎสำคัญว่า `Filter_Key` ผูกกับฝั่งซ้ายจริง และไม่ได้สลับไปใช้ฝั่งขวาหรือกำหนดไม่สม่ำเสมอระหว่าง Boundary/Crossing

**Required fix:** ขยาย T29 ให้ทดสอบสอง subcases หรือเพิ่ม Test ID ใหม่ โดยต้องระบุอย่างน้อย:

- กรอง `row[i]` ฝั่งซ้ายออก แต่คง `row[i+1]` → Boundary/Crossing ทุกแถวของ segment นั้นต้องถูกตัด เพราะทุกแถวมี `Filter_Key = key(row[i])`
- กรอง `row[i+1]` ฝั่งขวาออก แต่คง `row[i]` → Fill rows ของ segment ต้องยังอยู่และเกิด dangling
- ตรวจทั้ง segment กรณี B (strict crossing) และกรณี C อย่างน้อยอย่างละหนึ่งตัวอย่าง เพื่อยืนยันว่า `Filter_Key` ถูก stamp เหมือนกันทุก Fill row

หลังเพิ่ม assertion ฝั่งซ้ายนี้แล้ว และปรับจำนวน Test Matrix/ข้อความ “T01–T32” หากเพิ่ม Test ID ใหม่ รอบถัดไปจึงมีแนวโน้มให้ `PASS` ได้.