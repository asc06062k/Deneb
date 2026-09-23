# Phase 1 Design Plan — Deneb Bullet Chart eBook

สถานะ: เสนอให้รีวิว | 20 กันยายน 2026 | เครื่องอ้างอิง: Power BI Desktop 2.157.1354.0 64-bit (Aug 2026), Deneb 2.0.0.0

เอกสารนี้ล็อกแนวทางการออกแบบก่อนสร้างข้อมูลหรือ Specification ใน Phase 2 ยังไม่มีการอ้างว่ากราฟทำงานจริง

## 1. หลักฐานจากเอกสารทางการ

| ประเด็น | ข้อเท็จจริงที่ใช้ | แหล่ง |
| --- | --- | --- |
| Dataset | ฟิลด์ใน Values ของ Deneb ถูกผูกกับ named dataset ชื่อ `dataset` | [Deneb Dataset](https://deneb.guide/docs/dataset) |
| Editor | Editor แสดงข้อมูล, preview และ debug; preview ใช้ขนาด visual บน report canvas | [Deneb Visual Editor](https://deneb.guide/docs/visual-editor) |
| Interaction | Deneb ต้องเปิด cross-filter และ cross-highlight ตามกลไกที่แยกกัน; cross-filter ใช้ `__selected__`, highlight ใช้ companion field ของ measure | [Selection](https://deneb.guide/docs/interactivity-selection), [Highlight](https://deneb.guide/docs/interactivity-highlight) |
| Templates | ไฟล์นำกลับมาใช้ซ้ำต้องเป็น Deneb template ที่มี metadata และ field placeholders ไม่ใช่ Vega-Lite JSON ล้วน | [Deneb Templates](https://deneb.guide/docs/templates) |
| Layout | Deneb มีพฤติกรรม fit/overflow ที่ต้องทดสอบในขนาด container จริง | [Scrolling and Overflow](https://deneb.guide/docs/scrolling-overflow) |
| Vega-Lite | Layer ใช้สเกลร่วมเป็นค่าเริ่มต้น; transform ทำตามลำดับ; scale/domain, parameters และ invalid values ต้องกำหนดอย่างตั้งใจ | [Layer](https://vega.github.io/vega-lite/docs/layer.html), [Transform](https://vega.github.io/vega-lite/docs/transform.html), [Scale](https://vega.github.io/vega-lite/docs/scale.html), [Parameters](https://vega.github.io/vega-lite/docs/parameter.html), [Invalid Data](https://vega.github.io/vega-lite/docs/invalid-data.html) |
| Power BI | Edit interactions ระบุ Filter, Highlight หรือ None ต่อคู่ visual | [Microsoft Learn](https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions) |

หลักฐานเอกสารเป็นกรอบการออกแบบ ส่วนรายละเอียด UI และผล interaction จะยืนยันบนเวอร์ชันที่ใช้งานจริงใน Phase 2–3

## 2. Style guide

- ภาษาไทยเป็นหลัก ใช้ศัพท์อังกฤษเมื่อเป็นชื่อเมนู, field, property หรือคำที่ค้นใน Editor ได้ตรงตัว; อธิบายศัพท์ครั้งแรก
- หนึ่ง step เพิ่มแนวคิดหลักหนึ่งเรื่อง ลำดับ: เป้าหมาย → สิ่งที่เห็นก่อนเริ่ม → fields/measures → ขั้นตอน → JSON ส่วนที่เปลี่ยน → อธิบาย → ภาพ → ผลลัพธ์ → วิธีตรวจ → ปัญหา → แบบฝึกหัด → จุดตรวจผ่าน
- ชื่อ table/column/measure ใช้ตัวสะกดใน Field contract ทุกจุด; โค้ดใช้ JSON ที่ parse ได้ ไม่มี comment ในไฟล์ `.json`
- ค่าตัวอย่างทุกค่าในข้อความและภาพต้องย้อนตรวจได้จาก dataset รุ่นเดียวกัน; ภาพจับจาก Power BI/Deneb ที่รันจริง ไม่สร้างภาพจำลอง UI
- ใช้ locale `en-US` สำหรับตัวเลขใน Workshop: ค่าปริมาณ `,.1f` (มีตัวคั่นหลักพันและทศนิยม 1 ตำแหน่งทั้งที่ 1,999 และ 2,000), percentage `,.1%`; แสดงหน่วยจาก `Unit` แยกจากตัวเลข ไม่เปลี่ยนค่า raw
- กราฟใช้ฉากหลังขาว, ตัวอักษรสีเข้ม, ช่วงเชิงคุณภาพสีเทาอ่อนสามระดับ, Actual ใช้สีสถานะพร้อมข้อความสถานะ, Target เป็นเส้นเข้ม; สีเป็นตัวช่วย ไม่ใช้เป็นสัญญาณเดียว
- Caption บอกสิ่งที่ต้องตรวจ เช่น ค่า Category, Target และตำแหน่ง marker; ทุกภาพต้องอ่านได้ใน PDF ขนาดหน้าจริง
- อ้างอิงเอกสารทางการใกล้ข้อความที่เกี่ยวข้อง; แยก “พฤติกรรมที่ทดสอบแล้ว” จาก “แนวทางออกแบบ”

## 3. Final Bullet Chart reference ที่จะพิสูจน์ใน Phase 2

หนึ่งแถวต่อ `KPI_ID` เรียง `Sort_Order`: ชื่อ Category ด้านซ้าย, แถบ qualitative range 3 ช่วงซ้อนตามแกน x ร่วม, Actual bar ที่บางกว่า, Target marker แนวตั้ง, ค่าของ Actual/Target/Variance/Achievement อ่านได้ผ่าน label หรือ tooltip โดยไม่ชนกัน แสดงสถานะ Bad/Warning/Good ด้วยสีและข้อความ

นิยามสีสถานะจากค่า raw ก่อนปัดเศษ: Achievement < 0.70 = Bad; 0.70 ถึง < 0.90 = Warning; >= 0.90 = Good. Percentage label แสดง 1 ตำแหน่งตามปกติ; Vega expression ใน Deneb ต้องแสดง `<70.0%` เมื่อ raw < 70% แต่ปัดเป็น 70.0% และ `<90.0%` เมื่อ raw < 90% แต่ปัดเป็น 90.0%. ตรวจทั้ง label และ tooltip ด้วย fixture Actual/Target = 69999/100000 และ 89999/100000 (expected `<70.0%` และ `<90.0%`); ขอบตรงใช้ 70/100 และ 90/100 (expected `70.0%` และ `90.0%`). เมื่อ Target เป็นศูนย์, Blank หรือค่าติดลบ ไม่คำนวณ Achievement และใช้สถานะ `Target N/A`; Workshop ไม่ตีความ KPI ที่เป้าหมายติดลบ. Actual Blank ไม่วาด actual bar และแสดงสถานะ `Actual Missing`; หาก Actual และ Target ผิดปกติพร้อมกัน ให้แสดง `Actual Missing; Target N/A` ตามลำดับ. Actual ติดลบเมื่อ Target บวกจัดเป็น Bad และวาด bar ไปทางซ้ายจากศูนย์. Actual > Target หรือเกิน `Range_High` ต้องเห็นส่วนที่เกินและ marker; ค่าติดลบที่ต่ำกว่า `Range_Min` ต้องเห็นส่วนที่ต่ำกว่าช่วง. ช่วงสีหยุดที่ `Range_High`/เริ่มที่ `Range_Min` แต่ domain ขยายให้ครอบ Actual

กำหนด domain แบบ explicit จากข้อมูลแถวที่อยู่ใน filter context รวมศูนย์, Actual, Target, Range_Min และ Range_High พร้อม padding ที่กำหนดชัด; ไม่ตัด Actual ที่เกิน Target และไม่สมมติว่า domain เริ่ม 0 เสมอ. วิธีคำนวณ domain ที่เข้ากับ layer จะเลือกหลัง prototype ทดสอบจริง

ความกว้างปรับตาม container ส่วนความสูงต่อแถวและ overflow ต้องทดสอบใน Power BI จริง; ขนาด container 320×240, 640×480 และ 960×600 px เป็นชุดที่ต้องรองรับตาม T17 พร้อม scroll เมื่อแถวล้น. สี, font, row height และ threshold ที่แก้ได้จะอยู่ใน `params` ของ Vega-Lite หากการทดสอบยืนยันว่าใช้ได้ใน Deneb 2.0

การเลือก mark ต้องส่ง cross-filter ไป visual อื่นและแสดงสถานะ selection ภายในกราฟ; cross-highlight จาก visual อื่นต้องแสดง highlighted Actual ทับ original Actual โดยไม่ทำให้ค่าฐานหายไป และต้องทดสอบ companion field จริงใน Data Pane ก่อนล็อกชื่อที่ใช้ใน JSON. Tooltip มี Category, Actual, Target, Variance, Achievement และ `Tooltip_Detail` โดย Blank/ศูนย์แสดง `N/A` อย่างชัดเจน

## 4. Field contract

Power BI table เดียวชื่อ `KPI_Data`; grain = หนึ่งแถวต่อ `KPI_ID`; `KPI_ID` ไม่ซ้ำ, `Category` อาจชื่อซ้ำได้จึงไม่ใช้เป็น key, `Sort_Order` ไม่ซ้ำในชุด Workshop. ค่าตัวเลขเป็น decimal ยกเว้น `Sort_Order` เป็น whole number. CSV และ Excel ต้องมี schema และค่าเท่ากัน

| Column | Type | บทบาท/กฎ |
| --- | --- | --- |
| `KPI_ID` | Text | key ไม่ว่าง ไม่ซ้ำ; ใส่ใน Values เพื่อรักษา row identity |
| `Category` | Text | ชื่อแสดงผล; มีกรณีชื่อยาว |
| `Actual` | Decimal | ค่าจริง; อาจ Blank, ลบ หรือเกิน Target |
| `Target` | Decimal | เป้าหมาย; อาจ Blank หรือ 0 |
| `Previous` | Decimal | งวดก่อน; อาจ Blank; ใช้ประกอบบทเรียน |
| `Range_Min` | Decimal | จุดเริ่มช่วงเชิงคุณภาพ; อาจติดลบ |
| `Range_Low` | Decimal | ปลายช่วงต่ำ |
| `Range_Mid` | Decimal | ปลายช่วงกลาง |
| `Range_High` | Decimal | ปลายช่วงดี; ต้อง >= `Range_Mid` |
| `Sort_Order` | Whole number | ลำดับแสดงผล |
| `Unit` | Text | หน่วยที่แสดง |
| `Tooltip_Detail` | Text | คำอธิบายเพิ่มเติมใน tooltip |
| `Data_QA_Status` | Text (Power Query derived) | `OK`, `Invalid Range`, `Target Outside Range`, `Target Not Applicable`; สร้างหลัง import โดยไม่เพิ่มใน CSV/Excel ต้นทาง |

สำหรับแถวปกติ `Range_Min <= Range_Low <= Range_Mid <= Range_High`; `Target` ที่เป็นบวกต้องอยู่ใน `[Range_Min, Range_High]`. Target 0/Blank เป็นกรณีทดสอบที่ยกเว้นกฎนี้; Target ติดลบถือว่าไม่รองรับและแสดง `N/A`. Actual อาจสูงกว่า `Range_High` หรือต่ำกว่า `Range_Min` ได้โดย domain ขยาย แต่ช่วงสีไม่ขยายตาม. ไม่รวมหลาย KPI ด้วย SUM เพื่อสร้างหนึ่ง bullet; measure ต่อไปนี้ใช้ใน filter context ที่มี `KPI_ID` เดียว และถ้ารวมหลายแถวต้องระบุความหมายใหม่ก่อนใช้งาน

```DAX
Actual Value = IF ( COUNT ( KPI_Data[Actual] ) = 0, BLANK (), SUM ( KPI_Data[Actual] ) )
Target Value = IF ( COUNT ( KPI_Data[Target] ) = 0, BLANK (), SUM ( KPI_Data[Target] ) )
Achievement % = IF ( ISBLANK ( [Actual Value] ) || ISBLANK ( [Target Value] ) || [Target Value] <= 0, BLANK (), DIVIDE ( [Actual Value], [Target Value] ) )
Variance = IF ( ISBLANK ( [Actual Value] ) || ISBLANK ( [Target Value] ), BLANK (), [Actual Value] - [Target Value] )
Variance % = IF ( ISBLANK ( [Variance] ) || ISBLANK ( [Target Value] ) || [Target Value] <= 0, BLANK (), DIVIDE ( [Variance], [Target Value] ) )
```

สูตรนี้รักษา Blank ที่ต้นทางและป้องกันการบังคับ Blank เป็น 0 ใน `Variance`; `DIVIDE` คืน Blank เมื่อหารด้วย 0 ตาม [Microsoft Learn](https://learn.microsoft.com/en-us/dax/divide-function-dax). สำหรับ Target ติดลบ `Variance` ยังเป็นผลต่างเชิงตัวเลข แต่ Achievement และ Variance % เป็น N/A; tooltip ต้องบอกว่า Target แบบนี้ไม่รองรับการตีความสถานะ. การแสดง `N/A` เป็นหน้าที่ของ visual ไม่แปลง measure เป็นข้อความ. ใน Deneb Values ใช้ `KPI_ID`, `Category`, `Sort_Order`, `Unit`, `Tooltip_Detail`, `Data_QA_Status`, range columns และ measures ตาม step; ชื่อ field ที่ปรากฏใน Data Pane ต้องตรวจจริงใน Phase 2 ก่อนล็อก JSON. ต้องตรวจผล DAX และข้อมูลที่ Deneb ได้จาก Power BI ด้วยกรณีทดสอบเฉพาะ

ลำดับสร้าง `Data_QA_Status`: ถ้า range ค่าใด Blank หรือไม่เรียง ให้ `Invalid Range` ก่อน; ถัดมาถ้า Target Blank/0/ติดลบ ให้ `Target Not Applicable`; ถัดมาถ้า Target บวกอยู่นอก `[Range_Min, Range_High]` ให้ `Target Outside Range`; มิฉะนั้น `OK`. ทุกแถว T01–T12 รวม Target 0/Blank ต้องมี range valid; range Blank/ผิดลำดับใช้เป็นแถวทดสอบ T13 เท่านั้น. เมื่อสถานะไม่ใช่ `OK` ซ่อน qualitative range layer และแสดงข้อความสถานะบนแถว; Actual/Target ที่มีค่าจริงยังแสดงตามกฎอื่น

## 5. Test matrix และเกณฑ์ผ่าน

| ID | กรณี | สิ่งที่ต้องเห็น/ตรวจ |
| --- | --- | --- |
| T01 | Actual < 70% Target รวม 69.999% | Bad, สีและข้อความตรง threshold, ค่า Achievement ตรง; 69.999% แสดง `<70.0%` |
| T02 | 70% <= Actual < 90% รวม 89.999% | Warning, ตรวจขอบ 70% และก่อน 90%; 89.999% แสดง `<90.0%` |
| T03 | 90% <= Actual < 100% | Good, ตรวจขอบ 90% |
| T04 | Actual = Target | 100%, bar จบที่ marker, Variance = 0 |
| T05 | Actual > Target | bar ไม่ถูกตัด, marker ยังเห็น, Variance บวก |
| T06 | Target = 0 | Achievement/Variance % เป็น N/A, ไม่มี Infinity/NaN |
| T07 | Actual Blank | ไม่มี bar ปลอมเป็นศูนย์, label/tooltip N/A |
| T08 | Target Blank | ไม่มี marker ปลอมเป็นศูนย์, Achievement N/A |
| T09 | Category ชื่อยาว 80 อักขระ | tooltip แสดงครบ 80 อักขระ, ชื่อบนแกนไม่ทับ bar/label |
| T10 | Actual = 1,234,567,890.5, Unit = `THB` | label/tooltip แสดง `1,234,567,890.5 THB`; แกนและ label ไม่ทับกัน, tooltip ยังอ่านครบ |
| T11 | Actual ติดลบ, Target บวก | bar อยู่ซ้ายศูนย์, domain ครอบคลุม, สถานะ Bad; Target ติดลบต้องแสดง N/A |
| T12 | 12, 50, 100 Category | sort ตรง `Sort_Order`; scroll ถึงแถวสุดท้ายได้และ bar/marker/status ของแถวนั้นอ่านได้; median เวลา render 3 ครั้งต่อขนาด <= 3 วินาทีหลัง warm-up หนึ่งครั้ง |
| T13 | Range Blank/ไม่เรียงหรือ Target บวกนอกช่วง | Power Query เพิ่ม `Data_QA_Status` = `Invalid Range` หรือ `Target Outside Range`; Deneb ซ่อนเฉพาะ range layer และแสดงคำเตือนบนแถว |
| T14 | Filter จาก slicer/visual | ค่าและจำนวนแถวเปลี่ยนตาม filter context |
| T15 | คลิกแถว Deneb | visual อื่นถูก cross-filter ด้วย `KPI_ID`, selection ภายใน Deneb ชัด |
| T16 | Highlight จาก visual อื่น | เฉพาะ `Actual Value` ใช้ highlight companion field; Target/Range คงค่าเดิม, clear selection คืนค่าปกติ |
| T17 | Resize/ขนาดเล็ก | ชุด 12 แถวที่ 320×240, 640×480 และ 960×600 px และชุด 100 แถวที่ 640×480 px **ต้องผ่านทุกกรณี**: ทุกแถวเข้าถึงได้ด้วย scroll, แถวแรกและสุดท้ายมี bar/marker/status ครบ, ไม่มี label ทับกัน, tooltip อ่านครบ; กรณีใดไม่ผ่านถือว่า T17 ไม่ผ่านและต้องแก้ก่อน release |
| T18 | Template export/import | placeholder รวม `KPI_ID`; field mapping, params, interaction และผลแสดงตรงต้นฉบับ |
| T19 | Accessibility | สถานะมีข้อความทุกแถว, contrast ของข้อความกับพื้นหลัง >= 4.5:1; บันทึกผล keyboard focus จริงและข้อจำกัดที่พบ |

Phase 2 ต้องสร้างข้อมูลที่ทำให้ T01–T12 เกิดจริง และบันทึก expected/actual พร้อมหลักฐานภาพหรือข้อมูล Data Pane. สร้างชุดหลัก 12 แถวที่มี `KPI_ID`/`Sort_Order` ไม่ซ้ำ และชุดขยาย 50/100 แถวโดยสำเนาแถวปกติพร้อมรหัสและลำดับใหม่ ไม่ใช้แถว edge case ซ้ำจนบิดผล. T13–T19 ใช้ test report กับ visual อื่นและการเปลี่ยนขนาด. Performance วัดหลัง warm-up หนึ่งครั้งและรอบจับเวลา 3 ครั้งต่อจำนวนแถว โดยจับจากการใช้ filter หรือ resize จน mark สุดท้ายใน viewport แสดงครบ (บันทึกวิดีโอหน้าจอพร้อมเวลาและตรวจ frame), รายงาน median และค่าสูงสุดพร้อมสเปกเครื่อง; **median <= 3 วินาทีที่ทุกขนาดข้อมูลเป็นเกณฑ์ผ่านของ T12** หากไม่ผ่าน ต้องปรับ prototype และทดสอบซ้ำ ไม่เลื่อนเกณฑ์ย้อนหลัง

## 6. Design Lock และสิ่งที่ต้องพิสูจน์ใน Phase 2

| Locked ใน Phase 1 | Deferred เพื่อทดสอบใน Phase 2 |
| --- | --- |
| ชื่อ table/columns/measures และ grain ต่อ `KPI_ID`; กฎ Blank/Target/threshold; รูปแบบ reference, test matrix และขนาด container 320×240, 640×480, 960×600 px | ชื่อ companion field ตาม Data Pane จริง, วิธีคำนวณ explicit domain ใน layer, syntax ของ params ที่ Deneb 2.0 ยอมรับ, พฤติกรรม scroll/keyboard และเวลา render จริง |

หากผลทดสอบทำให้ต้องเปลี่ยนข้อที่ Locked ให้แก้ Design Plan และส่ง Claude รีวิวซ้ำก่อนเดินต่อ

## 7. เงื่อนไขก่อนปลด Design Lock

- Claude ตรวจ Technical accuracy, ความสอดคล้องกับแผน, ลำดับการสอน, field contract, edge cases, interactions และความชัดเจนของ test matrix
- ทุก finding มีคำตัดสิน Accepted/Rejected/Need Evidence และเหตุผล; แก้แล้วส่ง re-review จนได้ `PASS` จริง
- แม้ได้ `PASS` จาก Design Plan ก็ยังไม่ถือว่า JSON หรือ visual ทำงาน; Phase 2 ต้องพิสูจน์ด้วย prototype บน Power BI/Deneb จริง
