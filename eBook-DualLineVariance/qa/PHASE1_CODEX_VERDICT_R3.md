# 1. Verdict: REVISE

ยังให้ `PASS` ไม่ได้ เพราะ:

- M-01R ยังไม่ปิด: `interactive:false` ถูกใช้ในตำแหน่งที่ Vega-Lite ไม่รับรอง และ Connector/Data label ยังเปิดรับ event โดยปริยาย
- M-10R ปิดได้เพียงบางส่วน: แก้ไฟล์จริงและเพิ่ม Phase 2 gate แล้ว แต่ cross-reference ยังผิด
- M-11 ยังไม่ปิดครบ: นิยาม `Z` ขัดกับกฎ flat-zero run
- พบ Mandatory finding ใหม่ 1 รายการ: `PROJECT_PLAN.md` ยังล็อก `Business_Type` เป็น Measure หลายแห่ง ขัดกับ Design Plan ที่ล็อกเป็น Column

สรุป: **CLOSED 0, PARTIALLY CLOSED 1, OPEN 2, NEW 1**

# 2. สถานะสาม finding เดิม

| ID | สถานะ | ผลตรวจ |
|---|---|---|
| M-01R | **OPEN** | แนวคิด dedicated Point hit-target ถูกต้อง แต่การปิด event ownership ยังไม่สำเร็จตามที่กล่าวอ้าง |
| M-10R | **PARTIALLY CLOSED** | แก้ `PROJECT_PLAN.md` จริงและเพิ่ม Phase 2 gate แล้ว แต่ยังมี cross-reference “Phase 2 ข้อ 6” ซึ่งต้องเป็นข้อ 5 |
| M-11 | **OPEN** | สูตร `N + 2S + Z` ชัดขึ้น แต่ขอบเขตของ `Z` สำหรับ flat zero run ยังขัดกันเอง |

# 3. Mandatory findings

## M-01R — `interactive:false` ยังไม่ Lock interaction ownership ได้จริง

**Severity:** High  
**หัวข้อ:** Vega-Lite validity / Selection / Context menu

มีสองปัญหาแยกกัน:

1. `interactive` เป็น top-level property ของ **Vega mark definition** จริง แต่ไม่ปรากฏเป็น property ของ **Vega-Lite mark definition** ตามเอกสาร Vega-Lite ปัจจุบัน ดังนั้นการเขียน:

```json
"mark": {
  "type": "area",
  "interactive": false
}
```

ใน Vega-Lite spec ยังไม่มีหลักฐานว่าจะ compile ผ่านและสร้าง Vega mark ที่ `interactive:false` ให้ตามต้องการ เอกสาร Vega ระบุความหมายของ property นี้ แต่เอกสาร Vega-Lite ไม่ได้ระบุว่าใช้ใน mark object ได้ ([Vega Marks](https://vega.github.io/vega/docs/marks/), [Vega-Lite Mark](https://vega.github.io/vega-lite/docs/mark.html)).

ข้อความว่า “property จริงของ Vega mark definition” จึงไม่เพียงพอ เพราะ spec ที่โครงการกำลังสร้างเป็น Vega-Lite ไม่ใช่ Vega โดยตรง

2. Design Plan ปิด `interactive:false` เฉพาะ Area และ Line แต่หัวข้อ 2.2 รวม:

> Connector (rule), Point (hit-target), Data label … เปิด interactive ไว้

ดังนั้น Connector rule และ Data-label text ยังเป็น event sources โดยปริยาย ขัดกับข้อความถัดมาว่า Point เป็น “จุดเดียวที่รับ click/hover/context-menu ทั้ง spec”

**Required fix:**

- เลือกกลไกที่ valid สำหรับชนิด spec ที่ใช้จริง:
  - หากใช้ Vega-Lite ต้องพิสูจน์จาก compiled Vega ว่า `interactive:false` ถูกส่งต่อจริง หรือใช้กลไก Vega-Lite/Deneb ที่รองรับ
  - หากต้องใช้ Vega property โดยตรง ให้เปลี่ยนส่วนนั้นเป็น Vega spec และแก้ขอบเขตหนังสือให้ตรง
- ปิด interaction ของ Connector และ Data-label marks ด้วย ไม่ใช่เฉพาะ Area/Line
- ก่อนกล่าวว่า Point เป็น event source เดียว ต้องมี static proof อย่างน้อยว่า spec validate/compile และ compiled Vega มี `interactive:false` บน marks ที่ต้องการ
- คง T18/T22 สำหรับพิสูจน์พฤติกรรมจริงใน Deneb Phase 2

## M-10R — แก้ source of truth แล้ว แต่ cross-reference ยังผิด

**Severity:** Medium  
**หัวข้อ:** Phase gate / Cross-reference

ส่วนสำคัญปิดแล้ว:

- Phase 1 ข้อ 2 ตัด requirement ที่ต้องเห็น Editor จริงออกแล้ว
- Phase 2 เพิ่ม UI verification เป็นข้อ 5 และระบุว่าเป็น gate ก่อน `PASS` จริง
- Features กลุ่ม A ชี้ไป Phase 2 ข้อ 5 ถูกต้อง

แต่ [PROJECT_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:178) ใน Phase 1 ข้อ 2 ยังเขียนว่า:

> เป็นเงื่อนไขบังคับของ Phase 2 ตามข้อ 6 ด้านล่าง

ข้อ UI verification จริงคือ **Phase 2 ข้อ 5** ส่วนข้อ 6 คือส่งผลงานให้ Codex รีวิว

**Required fix:** แก้ “Phase 2 ข้อ 6” เป็น “Phase 2 ข้อ 5” แล้วค้นทั้งไฟล์อีกครั้งว่ามีเลขอ้างอิงเก่าค้างหรือไม่

## M-11 — นิยาม `Z` ยังไม่ครอบคลุม flat zero run อย่างสอดคล้อง

**Severity:** High  
**หัวข้อ:** Grain / Run construction

นิยามต้นหัวข้อกำหนด `Z` เป็นแถว Original ที่ `diff=0` และมี run เครื่องหมายต่างกัน “ทั้งสองฝั่ง” พร้อมไม่นับกรณีที่มี zero run ต่อกัน แต่กฎข้อ 3 กลับกำหนดว่า:

> จุดเริ่ม/จบของ flat run ที่ติดกับ run เครื่องหมายจริงยังต้องมี Boundary duplicate ตามกฎข้อ 2

ตัวอย่าง `+, 0, 0, -`:

- จุดศูนย์แรกไม่ได้มีเครื่องหมาย `+/-` อยู่ประชิดทั้งสองฝั่ง
- จุดศูนย์สุดท้ายก็ไม่ได้มีเครื่องหมาย `+/-` อยู่ประชิดทั้งสองฝั่ง
- ตามนิยาม `Z` ตอนต้นจึงอาจได้ `Z=0`
- แต่ตามกฎข้อ 3 ต้องสร้าง Boundary ที่หัวและท้าย flat run

จึงยังคำนวณ `N + 2S + Z` ไม่ได้แบบ deterministic สำหรับ flat run

นอกจากนี้ตาราง schema ในหัวข้อ 2.1 มี cell ไม่ครบสำหรับ `Run_Sign` และ `Business_Type` ทำให้ค่าของ `Boundary` ไม่ได้ถูกระบุแยกอย่างชัดเจน

**Required fix:**

- นิยาม `Z` จาก algorithm เดียว เช่น “จำนวน Boundary duplicates ที่ algorithm สร้าง” แล้วแจกแจง:
  - isolated zero ระหว่าง opposite-sign runs
  - zero run ระหว่าง opposite-sign runs
  - zero run ระหว่าง same-sign runs
  - leading/trailing zero run
  - all-zero series
- ระบุจำนวน Boundary ที่แน่นอนสำหรับแต่ละกรณี
- เพิ่มอย่างน้อยหนึ่ง test สำหรับ `+,0,0,-` และหนึ่ง testสำหรับ `+,0,0,+`
- แก้ตาราง schema ให้ทุกแถวมีครบทั้ง Original/Crossing/Boundary/ประเภท

## M-12 — `PROJECT_PLAN.md` ยังขัดกับ Business_Type Design Lock

**Severity:** High  
**หัวข้อ:** Source-of-truth regression

Design Plan ล็อก `Business_Type` เป็น Power Query Column แต่ `PROJECT_PLAN.md` ยังล็อกเป็น DAX Measure หลายตำแหน่ง ได้แก่:

- Field contract ระบุ “ผูกเป็น Measure ไม่ใช่ Column”
- Features กลุ่ม B ระบุ Measure
- บทที่ 4 สอนสร้าง DAX Measure
- Phase 1 ข้อ 4 ยังกำหนดให้พิสูจน์ Measure grain
- Phase 2 และ Definition of Done ยังมีกรณี “ค่าไม่ตรงกันระหว่างแถว” ซึ่งสถาปัตยกรรม stamp ค่าเดียวตั้งใจตัดออกแล้ว

ดูตัวอย่างที่ [PROJECT_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:64), [PROJECT_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:86), [PROJECT_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:134) และ [PROJECT_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:180)

สิ่งนี้ทำให้ M-03 ที่เคยปิดแล้วเกิด regression ใน source of truth

**Required fix:**

- เปลี่ยนทุก requirement ใน `PROJECT_PLAN.md` ให้ตรงกับ Power Query Column architecture
- เปลี่ยน test จาก “ค่าขัดกันระหว่างแถว” เป็น:
  - source parameter invalid/blank แล้ว fallback ถูกต้อง
  - `DISTINCTCOUNT(Business_Type)=1`
  - Deneb dataset มี `N+2S+Z` rows ไม่ aggregate/group ผิด
- ตัด DAX Measure ของ `Business_Type` ออกจากบทที่ 4 และ deliverables ที่เกี่ยวข้อง
- ตรวจคำว่า `Measure`, `ไม่ตรงกันระหว่างแถว`, `REMOVEFILTERS` และ `ค่าของแถวแรก` ทั้งไฟล์อีกครั้ง

# 4. เงื่อนไขสำหรับรอบถัดไป

Phase 1 จะ `PASS` ได้เมื่อ:

1. ใช้กลไกปิด interaction ที่ valid กับ Vega-Lite/Deneb และทำให้ Point เป็น interactive mark เดียวจริง
2. แก้ Phase 2 cross-reference จากข้อ 6 เป็นข้อ 5
3. นิยามและทดสอบ `Z` สำหรับ isolated zero และ flat zero run แบบไม่ขัดกัน
4. ทำให้ `PROJECT_PLAN.md` ใช้ Business_Type Column architecture ตรงกับ Design Plan ทุกแห่ง

ดังนั้น verdict รอบ 3 คือ **REVISE**.