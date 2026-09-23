# Deneb Bullet Chart Workshop

เริ่มที่ [eBook](ebook.md) แล้วใช้ไฟล์ใน `data/` และ `specs/` ตามลำดับ บทสุดท้ายใช้สเปกเต็มจาก [source/bulletChart/spec.json](../source/bulletChart/spec.json)

ภาพใน `images/` เป็นภาพอธิบายขั้นตอนที่สร้างจากข้อมูลตัวอย่าง ไม่ใช่ภาพหน้าจอ Power BI Desktop

## ตรวจสอบไฟล์

```powershell
python -m json.tool workshop/specs/01-bars.vl.json > $null
python -m json.tool workshop/specs/02-target.vl.json > $null
python -m json.tool workshop/specs/03-variance.vl.json > $null
python -m json.tool source/bulletChart/spec.json > $null
```
