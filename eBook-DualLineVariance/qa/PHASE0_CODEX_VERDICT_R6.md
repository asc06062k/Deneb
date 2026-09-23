## Verdict: REVISE

### M-11 — ยังปิดไม่ครบ

เพิ่มครบทั้ง 4 ตำแหน่งตามที่ร้องขอแล้ว แต่ยังมี Mandatory finding หนึ่งจุดจากข้อความในบทที่ 8:

> “Visual ต้นทาง (เช่น Slicer หรือ Bar chart) … เลือกไอคอน Highlight”

`Slicer` ไม่ใช่ตัวอย่างที่ถูกต้องสำหรับการทดสอบ Cross-highlight เพราะโดยปกติ Slicer ส่งผลแบบ Filter และการตั้งค่า interaction มีเพียง Filter/None ไม่ใช่ Highlight ตามเอกสาร Power BI [Overview of slicers](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-slicers) และ [Change how visuals interact](https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions)

### Mandatory finding M-11A

ต้องแก้ดังนี้:

1. บทที่ 8 เปลี่ยนตัวอย่างต้นทางจาก  
   `เช่น Slicer หรือ Bar chart`  
   เป็น Visual ที่รองรับ Cross-highlight อย่างชัดเจน เช่น `Clustered bar chart` หรือ `Clustered column chart`

2. ระบุแยกให้ชัดว่า Slicer ใช้ตรวจเฉพาะ `Filter/None` ไม่สามารถใช้เป็นต้นทางสำหรับกรณี `Highlight`

3. บทที่ 10 ระบุ Visual ต้นทางที่รองรับครบทั้ง `Highlight/Filter/None` โดยเจาะจง ไม่ใช้เพียงคำว่า “Visual ต้นทางอย่างน้อย 1 ตัว”

4. Evidence record ควรเพิ่ม `ชนิดของ Visual ต้นทาง` เพราะตัวเลือก interaction ที่มีขึ้นกับชนิด Visual ไม่ใช่แค่ค่า `Highlight/Filter/None`

ข้อความแนะนำ:

> ใช้ Clustered bar chart เป็น Visual ต้นทาง จากนั้นเลือก `Format > Edit interactions` และตั้ง interaction ที่ชี้มายัง Dual-Line Variance Chart เป็น `Highlight` หากตั้งเป็น `Filter` หรือ `None` จะไม่เกิด Cross-highlight ทั้งนี้ Slicer รองรับการส่งผลแบบ Filter/None และไม่ควรใช้เป็น Visual ต้นทางในการทดสอบ Highlight

กลไก Deneb ที่เหลือสอดคล้องกับเอกสาร Deneb 2.0 ทั้ง `__selected__`, การเปิด Cross-highlighting สองระดับ และ Supporting Fields ราย Measure [Deneb Cross-filtering](https://deneb.guide/docs/interactivity-selection), [Deneb Dataset](https://deneb.guide/docs/dataset)

นอกเหนือจาก M-11A ไม่พบ Mandatory finding ใหม่ใน Phase 0 ฉบับนี้ เมื่อแก้จุดดังกล่าวแล้ว M-11 จึงจะปิดครบและมีสิทธิ์ได้รับ `PASS` ในรอบถัดไป.