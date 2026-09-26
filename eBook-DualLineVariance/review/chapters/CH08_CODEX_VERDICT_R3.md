## Verdict: PASS

บทที่ 8 ผ่านการตรวจรอบ 3 ไม่พบ Mandatory finding ใหม่ การเปลี่ยนระดับ Cross-highlight สอดคล้องกันทั้ง spec, Step, template, ชุดทดสอบ และเนื้อหาในบท

## ผลตรวจ

| ประเด็น | ผล |
|---|---|
| ค่า opacity | ตรงกันทุก artifact: จุด `0.5`, ป้าย `0.3`, Connector `0.2`, ค่า default `1` |
| ตรรกะ `test` | ไม่เปลี่ยน; template ต่างเพียงการใช้ placeholder `__dataset.*__` ตามรูปแบบ template |
| Step กับ final spec | layer ตรงกันทั้งหมด |
| Excerpt ในบท | ตรงกับ `encoding.opacity` ใน Step จริง |
| ภาพ 8-12/8-13 | caption และกล่องหมายเหตุเปิดเผยชัดว่าถ่ายก่อนแยกระดับและในภาพทุกชั้นจาง `0.5` |
| Overclaim | ไม่พบ ข้อความแยกชัดระหว่าง “สิ่งที่เห็นในภาพเดิม” กับ “พฤติกรรมของ spec ปัจจุบัน” |
| การถ่ายภาพใหม่ | ไม่จำเป็นสำหรับการให้ PASS รอบนี้ |
| Design plan | rev 8 บันทึกมติ `0.5/0.3/0.2` และระบุว่า `test` ไม่เปลี่ยนครบถ้วน |

`run-ch08-claims-check.mjs` ผ่าน **25/25** รวมการตรวจ excerpt, ค่า opacity, พฤติกรรม highlight, caption และไฟล์ภาพครบถ้วน

ชุด Workshop และ static ไม่สามารถรันซ้ำในสภาพแวดล้อม read-only นี้ได้:

- Workshop ขาดตัวแปร `VEGA_NODE_MODULES`
- Static test พยายามเขียน `qa/scripts/workshop-plotdata.json` จึงถูกปฏิเสธด้วย `EPERM`

อย่างไรก็ตาม การตรวจโครงสร้างและค่าจริงโดยตรงไม่พบความคลาดเคลื่อนจากผลที่รายงานไว้ **464/464 และ 50/50**

## คำตัดสินสุดท้าย

**PASS — บทที่ 8 ผ่าน Phase 3 delta review รอบ 3**  
ไม่มี Mandatory ใหม่ และไม่ต้องถ่ายภาพ 8-12/8-13 ซ้ำเพื่อปิดรอบนี้