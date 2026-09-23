## Phase 0 Re-review — รอบ 7

**Verdict: PASS**

### M-11 / M-11A: CLOSED

ตรวจพบการแก้ครบทั้ง 3 ส่วนแล้ว:

1. **บทที่ 8**
   - เปลี่ยน Visual ต้นทางเป็น `Clustered bar chart` หรือ `Clustered column chart`
   - ระบุขั้นตอน `Format > Edit interactions > Highlight`
   - เตือนชัดเจนว่า `Filter` หรือ `None` จะไม่ทำให้เกิด Cross-highlight
   - ระบุชัดว่า **ห้ามใช้ Slicer ทดสอบ Highlight** เพราะ Slicer มีเฉพาะ `Filter`/`None`

2. **บทที่ 10**
   - ใช้ `Clustered bar chart` เป็น Visual ต้นทาง
   - กำหนดให้ทดสอบครบ `Highlight` / `Filter` / `None`
   - ทำให้ผู้อ่านเปรียบเทียบผลของแต่ละ Interaction mode ได้โดยตรง

3. **Evidence record**
   - เพิ่มชนิดของ Visual ต้นทาง
   - เพิ่ม Interaction mode ที่ตั้งผ่าน `Edit interactions`
   - ยกตัวอย่าง `Clustered bar chart` และค่าที่รองรับ `Highlight` / `Filter` / `None`

การแก้ไขสอดคล้องกับเอกสาร Power BI: Visual interaction สามารถกำหนดเป็น Filter, Highlight หรือ None ได้ ขณะที่ Slicer ใช้ควบคุม Visual อื่นด้วย Filter หรือ None ส่วน Column chart รองรับพฤติกรรม Cross-highlight ตามที่แผนเลือกใช้เป็นต้นทาง ([Microsoft Learn: visual interactions](https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions?tabs=powerbi-desktop), [Microsoft Learn: slicers](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-slicers), [Microsoft Learn: column charts](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-column-charts)).

### Mandatory findings ที่เหลือ

**ไม่มี**

ตรวจซ้ำครบทั้ง:

- ความสอดคล้องระหว่างเป้าหมาย ขอบเขต บทที่ 8 บทที่ 10 และ Phase 1
- Cross-filtering ด้วย `__selected__`
- Cross-highlighting สองระดับและ Supporting Fields ราย Measure
- การแยก Highlight ออกจาก Filter/None
- Context menu
- Evidence record และสถานะ `NOT TESTED`
- Release gate สำหรับ Draft/Final
- Field contract, crossing case, edge cases และ Definition of Done

กลไก Deneb ที่ระบุยังตรงกับเอกสาร Deneb 2.0 ได้แก่ Simple cross-filtering, `__selected__`, การเปิด Cross-highlight ระดับ Visual และการเลือก `Highlight value`/`Highlight status` ราย Measure ([Deneb: Cross-Filtering](https://deneb.guide/docs/interactivity-selection), [Deneb: Dataset and Supporting Fields](https://deneb.guide/docs/dataset)).

**Phase 0 ผ่าน สามารถเริ่ม Phase 1 Research และ Design Lock ได้**