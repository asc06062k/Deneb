# Phase 2 Dataset Test Log

วันที่ 21 กันยายน 2026 | แหล่งไฟล์: `eBook/data/Deneb_Workshop_Data.xlsx` และ `.csv`

## ตรวจที่ทำแล้ว

- สร้างข้อมูล 12 แถวใน table `KPI_Data` พร้อม schema 12 columns ตาม Field contract
- ตรวจ `KPI_ID` ไม่ซ้ำและ `Sort_Order` เรียง 1–12
- ตรวจช่วงทุกแถวในชุดหลักให้ `Range_Min <= Range_Low <= Range_Mid <= Range_High`
- ครอบคลุม T01–T12: ต่ำกว่า 70%, ขอบ 70%, 89.999%, ขอบ 90%, เท่ากับ Target, เกิน Target, Target 0, Actual Blank, Target Blank, ค่าขนาดใหญ่/Category ยาว, Actual ติดลบ และ Target ติดลบ
- ค่าที่ไม่มีข้อมูลถูกเก็บเป็น Blank ใน Excel/CSV ไม่แทนด้วยศูนย์
- สร้าง `QA_Expected` ใน workbook เพื่อบันทึก expected status ของแต่ละ fixture โดยไม่เพิ่ม `Data_QA_Status` ลงใน source file; ฟิลด์ดังกล่าวจะสร้างใน Power Query ตาม Design Plan
- สร้าง DAX measures ใน `eBook/dax/workshop-measures.dax` พร้อม guard สำหรับ Blank และ Target <= 0

## หลักฐานไฟล์

- `Deneb_Workshop_Data.xlsx` มี sheets `KPI_Data` และ `QA_Expected`; ตรวจช่วง A1:L13 และ A1:D13 แล้ว ไม่มี formula errors
- `Deneb_Workshop_Data.csv` มี 12 data rows และ header ตรงกับ Excel
- `Deneb_Workshop_Data_preview.png` เป็น preview จาก workbook ที่สร้างจริง

## ยังไม่ผ่านใน Phase 2

สร้าง [Bullet Chart Prototype Draft](../specs/Bullet_Chart_Prototype_Draft.json) และ [Normalized Prototype](../specs/Bullet_Chart_Prototype_Normalized.json); ตรวจ JSON parse ได้ทั้งคู่และมี `dataset` กับ 6 layers. ภาพ runtime ล่าสุดยืนยัน patched normalized render ผ่านสำหรับ static fixtures และแก้ target marker orientation/filter แล้ว. รายละเอียด provider mismatch และการแก้อยู่ใน [PHASE2_RUNTIME_ERROR_LOG.md](PHASE2_RUNTIME_ERROR_LOG.md). ยังต้องยืนยัน Data Pane field names, cross-filter/highlight, resize, scroll และ performance. ห้ามใช้ไฟล์ source เดิมใน `workshop/` เป็นหลักฐานแทน prototype ตาม Quality Gate
