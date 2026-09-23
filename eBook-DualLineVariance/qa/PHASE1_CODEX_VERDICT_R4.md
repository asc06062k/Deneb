# 1. Verdict: REVISE

ยังให้ `PASS` ไม่ได้ เนื่องจาก:

- M-01R ปิดเพียงบางส่วน: ถอน `interactive:false` ถูกต้อง แต่ Area layer ยังอ่าน Original rows เพราะไม่มี filter ทำให้ soft-fail ด้วย `Category = Blank` ไม่เป็นจริงเสมอ
- M-10R ปิดครบ
- M-11 ปิดครบในระดับอัลกอริทึม per-segment และ test cases
- M-12 ปิดเพียงบางส่วน: architecture หลักเปลี่ยนเป็น Power Query Column แล้ว แต่ยังมีข้อความตกค้างและ fallback claim ที่ขัดกับ architecture
- พบ Mandatory finding ใหม่ M-13: ค่า `Plot_Reference` ของ Boundary rows ผิด ทำให้พื้นที่ variance ยุบเป็นศูนย์

สรุป: **CLOSED 2, PARTIALLY CLOSED 2, OPEN 0, NEW 1**

# 2. สถานะ finding เดิม

| ID | สถานะ | ผลตรวจ |
|---|---|---|
| M-01R | **PARTIALLY CLOSED** | ถอนคำกล่าวอ้าง `interactive:false` และยอมรับ T18/T22 เป็นคำถามเปิดแล้ว แต่ mitigation ยังไม่ถูกบังคับจริง เพราะ Area layer ไม่มี filter |
| M-10R | **CLOSED** | Cross-reference ใน Phase 1 ข้อ 2 และจุดเกี่ยวข้องชี้ไป `Phase 2 ข้อ 5` ถูกต้องแล้ว |
| M-11 | **CLOSED** | Algorithm A/B/C ตรงกับ `segmentFill.ts`; กรณี zero endpoint, strict crossing และ flat-zero segment deterministic; เพิ่ม T31/T32 ครบ |
| M-12 | **PARTIALLY CLOSED** | จุดหลักเปลี่ยนเป็น Power Query Column แล้ว แต่ยังมี requirement เก่าและ fallback claim ที่ไม่สอดคล้องอยู่ |

# 3. Mandatory findings

## M-01R — Area layer ยังไม่รับประกันว่าใช้เฉพาะแถว Category Blank

**Severity:** High  
**หัวข้อ:** Interaction mitigation / Layer filtering

Design Plan ระบุว่า Area layer:

> ใช้ `dataset` เต็ม ไม่ filter

แต่ dataset เดียวกันมีทั้ง:

- `Row_Type = "Original"` ซึ่ง `Category` ไม่ Blank
- `Row_Type = "Boundary"` และ `"Crossing"` ซึ่ง `Category` Blank

ดังนั้นข้อความถัดมาที่ระบุว่า:

> ทุกแถวในนี้ (`Row_Type IN ('Boundary','Crossing')`) มี `Category = Blank`

ไม่เป็นจริง เพราะ Original rows ก็เข้า Area layer ด้วยเช่นกัน อีกทั้ง Original rows มี `Segment_ID` “ไม่มีความหมาย” ซึ่งอาจถูกรวมเป็น area group เพิ่มอีกกลุ่มหนึ่ง ทำให้เกิดทั้งความเสี่ยงด้าน rendering และการ resolve ไปยัง Category จริงจาก Area mark

Vega-Lite ระบุว่า area mark สร้าง shape จากข้อมูลหลายแถว ไม่ใช่หนึ่ง mark ต่อหนึ่งแถว จึงไม่ควรปล่อยแถวคนละบทบาทเข้า path เดียวกันโดยไม่มี filter ([Vega-Lite Area](https://vega.github.io/vega-lite/docs/area.html)).

**Required fix:**

เพิ่ม transform บน Area layer อย่างชัดเจน เช่น:

```json
{
  "filter": "datum.Row_Type == 'Boundary' || datum.Row_Type == 'Crossing'"
}
```

จากนั้นปรับข้อความเป็น “ทุกแถวหลัง transform ของ Area layer มี Category Blank” และคง T18/T22 เป็นคำถามเปิดสำหรับพฤติกรรม Deneb จริง

หมายเหตุ: การใช้ `"tooltip": null` ถูกต้องตาม Vega-Lite และหมายถึงไม่ใช้ tooltip แต่ไม่ได้ปิด click/context-menu event ([Vega-Lite Mark properties](https://vega.github.io/vega-lite/docs/mark.html)).

---

## M-12 — ยังมี Business_Type requirements ที่ขัดกับ Power Query Column architecture

**Severity:** Medium  
**หัวข้อ:** Source-of-truth consistency

จุดหลักใน `PROJECT_PLAN.md` ถูกแก้แล้ว แต่ยังเหลืออย่างน้อยสองจุด:

1. Phase 1 ข้อ 3 ยังระบุ test case:

> `Business_Type Blank หรือไม่ตรงกันระหว่างแถว`

หลังเปลี่ยนเป็น parameter เดียวที่ validate ก่อน stamp ค่าที่ “ไม่ตรงกันระหว่างแถว” ไม่ใช่ input scenario ที่ architecture อนุญาตอีกต่อไป ควรเปลี่ยนเป็น:

- source parameter Blank/invalid
- ตรวจ fallback ก่อน stamp
- ตรวจ `DISTINCTCOUNT(Business_Type) = 1` หลังสร้าง query

2. Features กลุ่ม B ระบุ:

> fallback `"Higher is Good"` เมื่อไม่ผูก field

Power Query guard ป้องกันค่า parameter Blank/invalid ก่อน stamp แต่ไม่สามารถสร้าง fallback ใน Vega-Lite เมื่อผู้ใช้ไม่ได้ผูก `Business_Type` เข้า Deneb Values ได้ หากไม่ bind field จริง `datum.Business_Type` จะไม่มีค่า และ expression แบบสองแขนอาจไหลไปฝั่ง Lower-is-Good แทน

**Required fix:**

- ตัด scenario “ค่าไม่ตรงกันระหว่างแถว” ออกจาก Phase 1 ข้อ 3 หรือเปลี่ยนเป็น QA invariant หลัง stamp
- เปลี่ยนข้อความ “fallback เมื่อไม่ผูก field” เป็น “ต้องผูก `Business_Type` Column; fallback ใช้เมื่อ source parameter Blank/invalid ก่อน Power Query stamp”
- หากต้องการรองรับกรณีไม่ bind fieldจริง ต้องเพิ่ม Vega-Lite runtime fallback อย่างชัดเจนและเพิ่ม test แยก

---

## M-13 — Boundary.Plot_Reference ผิด ทำให้ variance area ยุบเป็นศูนย์

**Severity:** Critical  
**หัวข้อ:** Fill geometry / Field contract

ตาราง schema ใน Design Plan กำหนด:

> Boundary `Plot_Reference = Plot_Actual`

แต่ Boundary row ถูกนิยามว่าเป็น “สำเนาค่า Original” ดังนั้นค่าที่ถูกต้องต้องเป็น:

- `Plot_Actual = Actual` ของ Original ต้นทาง
- `Plot_Reference = Reference` ของ Original ต้นทาง

เฉพาะ Crossing row เท่านั้นที่:

```text
Plot_Actual = Plot_Reference = ค่า Y ที่จุดตัด
```

ถ้า Boundary ทั้งสองปลายมี `Plot_Reference = Plot_Actual` แล้ว Area layer ใช้:

```text
y  = Plot_Actual
y2 = Plot_Reference
```

จะได้ `y = y2` ทุก Boundary row:

- กรณี C สองแถวจะยุบเป็นเส้นทั้งหมด ไม่มีพื้นที่
- กรณี B แต่ละ triangle จะสูญเสียความสูงที่ endpoint และไม่ตรงกับ polygon ใน `segmentFill.ts`

จุดนี้ขัดโดยตรงกับ pseudocode ที่กล่าวว่า “สำเนาค่า row[i]” และทำให้ implementation ตาม Field contract ไม่สามารถแสดง variance area ที่ออกแบบไว้ได้

**Required fix:**

แก้ตาราง schema เป็น:

| Row type | Plot_Actual | Plot_Reference |
|---|---|---|
| Boundary | Actual ของ Original ต้นทาง | Reference ของ Original ต้นทาง |
| Crossing | ค่า interpolate ที่จุดตัด | เท่ากับ Plot_Actual ที่จุดตัด |

และเพิ่ม invariant/test ว่า:

- Boundary ที่ `Actual != Reference` ต้องมี `Plot_Actual != Plot_Reference`
- Crossing ทุกแถวต้องมี `Plot_Actual = Plot_Reference`
- T01/T02/T31/T32 ต้องตรวจทั้งจำนวน rows และ geometry ไม่ใช่เพียงจำนวน polygon

# 4. เงื่อนไขสำหรับรอบถัดไป

Phase 1 จะ `PASS` ได้เมื่อ:

1. Area layer filter เฉพาะ `Boundary`/`Crossing`
2. แก้ `Boundary.Plot_Reference` ให้คัดลอก Reference จริง
3. แก้ข้อความและ test scope ของ M-12 ที่ยังตกค้าง
4. คง T18/T22 เป็น Phase 2 evidence gate โดยไม่กล่าวว่า `tooltip:null` ปิด event
5. Regression-check T01, T02, T04, T31 และ T32 จาก field contract ที่แก้แล้ว

ดังนั้น verdict รอบ 4 คือ **REVISE**.