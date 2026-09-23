# แผนโครงการ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb บน Power BI

## 0 บริบทและ Workflow

โครงการนี้แยกจาก `D:\DATA\Deneb\eBook` (Bullet Chart) โดยเจตนา คนละ Visual คนละชุดข้อมูล ไม่ใช้ไฟล์ร่วมกัน

Workflow ของโครงการนี้สลับบทบาทจากโครงการ Bullet Chart

- **Claude Code (ผู้เขียน)** วิเคราะห์ ออกแบบ เขียนเนื้อหา สร้าง Dataset, DAX, Vega-Lite Spec, ภาพประกอบ และปกหนังสือ
- **Codex CLI (ผู้รีวิว)** ตรวจทานทุก Phase แบบอิสระ ให้ Verdict `PASS`, `REVISE`, หรือ `BLOCKED` ก่อนเริ่ม Phase ถัดไปเสมอ
- ทุก Phase ที่ผ่านการรีวิวแล้ว commit เข้า git แยก commit ต่อ Phase
- **ข้อบังคับการสื่อสาร**: Claude ต้องตอบกลับ/อธิบายทุกอย่างในแชทเป็น**ภาษาไทย**เสมอ (ยกเว้น Technical Term, ชื่อ Field, โค้ด) — ผู้ใช้ย้ำข้อนี้ซ้ำหลายครั้งแล้ว ห้ามลืมหรือสลับกลับไปตอบเป็นภาษาอังกฤษไม่ว่าขั้นตอนภายใน (debug, tool call) จะใช้ภาษาอังกฤษก็ตาม

Visual อ้างอิงคือ Custom Visual จริงที่ `D:\DATA\Custom viz\dualLineVarianceChart` (D3 + powerbi-visuals-api) เนื้อหาจะสร้าง **สิ่งที่ทำงานคล้ายกันด้วย Deneb/Vega-Lite** ไม่ใช่การพอร์ตโค้ด TypeScript ตรงตัว เพราะ Deneb ไม่รันโค้ด D3 ที่กำหนดเอง

## 1 เป้าหมายโครงการ

จัดทำ eBook ภาษาไทยแบบ Workshop สำหรับผู้ไม่มีพื้นฐานเขียนโปรแกรม พาผู้อ่านสร้าง **Dual-Line Variance Chart** ด้วย Deneb ตั้งแต่พื้นฐานจนได้ Visual ที่ใช้งานจริง มี Tooltip, Cross-filter ออกไปยัง Visual อื่น และรับ Cross-highlight จาก Visual อื่นในหน้ารายงาน

## 2 กลุ่มผู้อ่าน

- ใช้ Power BI Desktop สร้างรายงานพื้นฐานได้ ไม่จำเป็นต้องเคยเขียนโค้ด
- ไม่ต้องมีพื้นฐาน JSON, Vega-Lite, JavaScript หรือ Custom Visual
- ต้องการสร้างกราฟเปรียบเทียบ Actual กับ Target/เทียบปีก่อน ที่ Native Visual ทำได้ไม่ดีพอ (เช่น พื้นที่ Variance ที่เปลี่ยนสีตามดี/แย่)

## 3 ผลลัพธ์การเรียนรู้

เมื่อจบเล่ม ผู้อ่านต้องสามารถ

1. อธิบาย Deneb, Vega-Lite และความสัมพันธ์กับ Vega ได้
2. เชื่อม Field และ Measure จาก Power BI เข้า Deneb ผ่าน `dataset`
3. อ่านและแก้ไข Vega-Lite JSON พื้นฐาน (`mark`, `encoding`, `layer`, `transform`, `scale`, `condition`)
4. สร้างกราฟ 2 เส้น (Actual vs Reference) พร้อมพื้นที่ Variance ที่เปลี่ยนสีตามเงื่อนไข ดี/แย่ โดยกำหนดทิศทาง "ดี" ผ่าน field `Business_Type` (Higher is Good / Lower is Good) แทนการตั้งค่าคงที่แบบต้นแบบ
5. เพิ่ม Connector line, Data label ที่ลดการชนกัน (ไม่รับประกันว่าไม่ชนทุกกรณี) และ Tooltip หลายค่า พร้อมทำให้กลไกจัดตำแหน่งและ thinning ของ Data label ประเมินใหม่ทุกครั้งที่ผู้ใช้ปรับขนาด Visual (Responsive) — Group A
   ทำให้ Category axis label ไม่ทับซ้อนกันภายในช่วงขนาดที่ผ่าน Test matrix ตามกลไกที่พิสูจน์และ Lock ใน Phase 1 — Group B
6. เปิด Cross-filtering (ผ่าน `__selected__` และ Simple mode ของ Deneb) ให้คลิกจุดข้อมูลแล้วกรอง Visual อื่นในหน้าได้ และเปิด Cross-highlighting (ผ่าน `__highlight`/`__highlightStatus`) ให้ Dual-Line Variance Chart แสดงผลเมื่อถูก Highlight จาก Visual อื่น
7. จัดการกรณี Actual/Reference เป็น Blank, ค่าติดลบ, Category ชื่อยาว และจำนวน Category มาก
8. Export/Import Deneb Template เพื่อนำ Spec กลับมาใช้กับข้อมูลอื่น

## 4 ขอบเขต Visual ฉบับสมบูรณ์ (อ้างอิงจาก dualLineVarianceChart)

### Data fields (ที่มาจาก capabilities.json ของ Custom Visual จริง)

| Field | ที่มา | ความหมาย |
| --- | --- | --- |
| Category | dataRole `category` | แกน X เช่น เดือน |
| Actual | dataRole `actual` | Series 1 ค่าจริง |
| Reference | dataRole `reference` | Series 2 ค่าเปรียบเทียบ (Target/Budget/ปีก่อน) |
| Business_Type | **field ใหม่ที่ eBook เพิ่มเอง ไม่มีใน capabilities.json ต้นแบบ** | ค่า `"Higher is Good"` หรือ `"Lower is Good"` ระบุทิศทางที่ถือว่า "ดี" เมื่อเทียบ Actual กับ Reference แทนการตั้งค่าคงที่ผ่าน Format pane ของต้นแบบ |

Custom Visual ต้นแบบรับ 1 Category, 1 Actual, 1 Reference เท่านั้น (ดู `dataViewMappings.conditions` ใน capabilities.json) และกำหนด "ดี/แย่" ผ่าน Format pane object `comparisonLogic.mode` ซึ่งเป็นค่าคงที่ต่อ Visual ไม่ใช่ field ที่ผูกกับข้อมูล eBook ฉบับนี้ **เพิ่ม `Business_Type` เป็นฟีเจอร์ส่วนขยาย** (ดูกลุ่ม B ด้านล่าง) ส่วน Category/Actual/Reference ยังคง grain เดียวกับต้นแบบเพื่อไม่ชวนผู้อ่านออกนอกสิ่งที่พิสูจน์แล้วว่าทำงาน

### Field contract — Semantics เพิ่มเติม (ต้อง Lock ใน Phase 1)

สามชื่อ field ด้านบนเพียงพอเชิงค่า แต่ยังไม่เพียงพอเชิงความหมาย ต้อง Lock ประเด็นต่อไปนี้ก่อนสร้าง Dataset จริงใน Phase 2

| ประเด็น | พฤติกรรมของต้นแบบ (จาก `visualTransform.ts`) | สิ่งที่ Design Plan ต้องระบุ |
| --- | --- | --- |
| Grain | 1 แถวต่อ 1 Category หลัง Power BI aggregate | ตาราง Workshop ต้องมี Category ไม่ซ้ำ 1 แถวต่อ 1 เดือน |
| Category sort | ใช้ลำดับที่ Power BI ส่งมาตรงๆ ไม่มี sort logic ของตัวเอง | เพิ่มคอลัมน์ `Sort_Order` ในชุดข้อมูล Workshop และสอนวิธี Sort by column ใน Power BI |
| Category axis type | ต้นแบบใช้ string/ordinal (`d3.scalePoint`) ไม่ใช่ temporal scale | **ฉบับ Deneb เลือกออกแบบต่างจากต้นแบบโดยเจตนา**: ทุก layer ที่ plot เส้น/พื้นที่/connector ใช้ `Plot_Position` แบบ `quantitative` (ไม่ใช่ `Category` แบบ `nominal`/`ordinal` ตรงๆ) เพื่อรองรับตำแหน่งเศษส่วนของจุดตัด (crossing) ที่ Deneb 2.0.0.0/Vega-Lite ไม่มีกลไกวางบนแกน ordinal ได้ — Label ของแกน X มาจาก `Sort_Order → Category` mapping ผ่าน `labelExpr` (ดู Design Plan หัวข้อ 2.4) ไม่ใช้ `temporal` เว้นแต่จะยืนยัน requirement เพิ่ม |
| Actual/Reference ไม่ใช่ตัวเลข (Blank/Error) | แปลงเป็น `0` ทันที (`typeof rawActual === "number" ? rawActual : 0`) | ระบุใน Design Plan ว่า eBook จะ "เลียนแบบต้นแบบ" (blank→0) หรือ "เลือกออกแบบใหม่" (blank→เว้นช่องว่างเส้น) และระบุเหตุผล ห้ามเรียกว่าเลียนแบบต้นแบบถ้าไม่ได้ทำแบบเดียวกัน |
| Reference = 0 | `variancePercent = null` (ไม่หารศูนย์) และ tooltip แสดงค่า Variance % เป็นค่าว่าง | Vega-Lite ต้อง guard หารศูนย์แบบเดียวกัน และกำหนดข้อความ tooltip เมื่อ % ไม่มีค่า |
| Category ซ้ำ | ไม่ผ่านการทดสอบในต้นแบบ (ไม่มี logic เฉพาะ) | Design Plan ต้องกำหนดพฤติกรรมเอง (เช่น sum ก่อนเข้า visual) และเพิ่ม test case |
| Business_Type (field ใหม่) | ไม่มีในต้นแบบ — ต้นแบบใช้ Format pane setting คงที่ | ต้องกำหนด: (1) ค่าที่ยอมรับคือ `"Higher is Good"`/`"Lower is Good"` เท่านั้น case-sensitive ตรงตัว (2) **ผูกเป็น Power Query Column** บนตารางเฉพาะที่สร้างสำหรับ Visual นี้ (`DualLine_PlotData`, ดู Design Plan หัวข้อ 2–3) — Power Query stamp ค่าจากพารามิเตอร์เดียว (literal string หรืออ่านจากตาราง Settings แถวเดียว) ซ้ำทุกแถวตอนเตรียมข้อมูล ไม่ใช่ DAX Measure เพราะตารางนี้ Power Query เป็นผู้ควบคุม grain เองทั้งหมดอยู่แล้ว ไม่มีความเสี่ยงกระทบ grain แบบ Column บนตารางข้อเท็จจริงหลัก (3) **Defensive guard ทำที่ Power Query step เดียวก่อน stamp**: ถ้าค่าต้นทาง Blank/ไม่ตรงกับสองค่าที่ยอมรับ ให้แทนด้วย `"Higher is Good"` ก่อน stamp — ตัด root cause ของค่าไม่ตรงกันระหว่างแถวตั้งแต่ต้นทาง ไม่ใช่ guard ที่ runtime (4) fallback `"Higher is Good"` ตรงกับ default ของต้นแบบ แต่เป็น default ที่ eBook เลือกเอง ไม่ใช่ค่าจากต้นแบบ ต้องระบุใน Design Plan (5) Phase 2 ต้อง Lock: field วางในช่อง Values ของ Deneb, ชื่อ column ใน `dataset` ที่ได้, QA sanity check ว่า `DISTINCTCOUNT(Business_Type) = 1`, และพิสูจน์ด้วย prototype จริงว่าจำนวนแถวใน `dataset` ตรงกับจำนวนแถวจริงของ `DualLine_PlotData` (ดู Design Plan หัวข้อ 2 สำหรับสูตรจำนวนแถว) |
| Category axis label ปรับขนาด Visual (Responsive) | ต้นแบบเรียก `computeThinnedTickValues`/`computeThinningStep` ใหม่ทุกครั้งที่ `update()` ถูกเรียกด้วย viewport ใหม่ (ทุกครั้งที่ resize) — นี่คือ Group A (เทียบเท่าต้นแบบ) แต่ต้นแบบ **ไม่รับประกันว่า label จะไม่ทับซ้อนทุกกรณี** เพราะใช้ความกว้างโดยประมาณ (`length × fontSize × 0.62`), บังคับแสดง Category สุดท้ายเสมอ, และไม่ตรวจ bounding-box collision จริง — การ "รับประกันไม่ทับซ้อน" ของ eBook จึงเป็น **Group B** ที่แข็งกว่าต้นแบบ ต้องพิสูจน์แยกด้วย Vega-Lite mechanism ที่เหมาะสม (เช่น axis `labelOverlap`/`labelSeparation`, `autosize.resize`, `width`/`height: "container"`) ใน Phase 1/2 ก่อนสัญญา และจำกัดคำรับประกันไว้เฉพาะช่วงขนาดที่ระบุใน Test matrix เท่านั้น ส่วน Actual/Reference data label ยังคงเป็น Group A "ลดการชน" ตามเดิม ไม่ใช่ "ไม่ทับซ้อน" |

### Features ที่ eBook ต้องพาผู้อ่านสร้างให้ได้

แบ่งสองกลุ่มชัดเจน เพราะหลักฐานจาก source ต้นแบบสนับสนุนเฉพาะบางฟีเจอร์ ส่วนที่เหลือเป็นสิ่งที่ Deneb ทำได้แต่ต้นแบบไม่มี

**กลุ่ม A — เทียบเท่าพฤติกรรมที่พิสูจน์ได้จาก source ต้นแบบ**

- เส้น Actual และเส้น Reference บนแกน Category เดียวกัน
- พื้นที่ Variance ระหว่างสองเส้น เปลี่ยนสีตาม Comparison Logic (Higher-is-better / Lower-is-better) **รวมกรณีเส้นตัดกันระหว่าง Category** — ต้นแบบ (`segmentFill.ts`) หาจุดตัดด้วยการ interpolate เชิงเส้นแล้วแบ่ง polygon เป็นสองรูปสามเหลี่ยมคนละสีที่จุดตัดพอดี ไม่ใช่แค่ทาสีทั้งช่วงสีเดียว เป็นโจทย์ที่ต้องพิสูจน์ความเป็นไปได้ใน Vega-Lite ใน Phase 1/2 ก่อน ถ้าทำไม่ได้เทียบเท่าให้ลดคำสัญญาและระบุข้อจำกัดแทน
- Connector line แนวตั้งเชื่อม Actual กับ Reference ต่อ Category สีตามดี/แย่
- Data label ของ Actual และ Reference ที่ **ลดการชนกัน** (ไม่ใช่ "ไม่ทับซ้อน") ด้วยการสลับตำแหน่งบน/ล่างตามค่าที่สูงกว่า และ thinning เมื่อ Category แน่น (ต้นแบบไม่ได้ตรวจ collision จริง จึงไม่รับประกันว่าไม่ชนทุกกรณี — ต้องมี test matrix รองรับ) — **Responsive**: การ thinning/จัดตำแหน่งนี้ต้องคำนวณใหม่ทุกครั้งที่ผู้อ่านปรับขนาด Visual จริง (ลาก resize, ย่อ/ขยาย pane, เปลี่ยน layout) เหมือนที่ต้นแบบเรียกคำนวณใหม่ทุกครั้งที่ `update()` ได้รับ viewport ใหม่ ไม่ใช่คำนวณครั้งเดียวตอนโหลด (เทียบเท่าต้นแบบ = re-evaluate ทุก resize; "ไม่ทับซ้อน" ของ Category axis label เป็นคำสัญญาที่แข็งกว่าต้นแบบ ดู Group B)
- Tooltip แสดง Category, Actual, Reference, Variance (ค่า และ %); Variance % เป็นค่าว่างเมื่อ Reference เท่ากับศูนย์
- Cross-filtering ทิศทางออก: คลิกจุดข้อมูลบน Dual-Line Variance Chart แล้วกรอง Visual อื่นในหน้า ใช้กลไก Deneb 2.0 จริง คือเปิด **Cross-filtering ในหน้า Project setup pane ของ Visual editor** (ชื่อ/ตำแหน่ง UI มาจากเอกสารทางการใน Phase 1 — ต้องยืนยันซ้ำด้วยภาพจริงจาก Deneb 2.0.0.0 ตาม Phase 2 ข้อ 5 ก่อนเขียนขั้นตอนละเอียดในบทที่ 8) เลือกโหมด Simple แล้ว mark ที่คลิกต้องมาจากแถว dataset ที่ยังไม่ผ่าน transform เพื่อให้ Deneb resolve กลับเป็นแถวต้นทางได้ และ encode opacity จากฟิลด์ `__selected__` (ค่า `on`/`off`/`neutral`)
- รองรับ Blank ที่ Actual หรือ Reference (ตามนโยบายที่ Lock ใน Field contract), ค่าติดลบ, Category ชื่อยาว, จำนวน Category มาก — ใช้แนวทาง **fit-and-thin เหมือนต้นแบบ** (บีบทุก Category ลงใน viewport แล้วลด tick/label ที่แสดง) **ไม่ใช่ scroll** เพราะต้นแบบไม่มี scroll implementation
- Template: Export/Import Deneb Template ที่เก็บ field mapping และ Interactivity settings ตามกลไก Template จริงของ Deneb

**กลุ่ม B — ส่วนขยายเฉพาะฉบับ Deneb (ต้นแบบไม่มีหลักฐานว่ารองรับ ต้องระบุว่าเป็นส่วนเพิ่มเติม ไม่ใช่การเลียนแบบ)**

- Cross-highlighting ทิศทางเข้า: Custom Visual ต้นแบบใช้เฉพาะ `selectionManager.select()`/`syncSelectionOpacity()` เพื่อจัดการ selection ของตัวเอง ไม่ได้อ่าน `dataView.categorical.values[].highlights` และ capabilities.json ที่ตรวจไม่ประกาศรองรับ highlight ดังนั้นต้นแบบ **ไม่รองรับการรับ Cross-highlight จาก Visual อื่น** eBook จะสอนสิ่งนี้เป็น "ความสามารถเพิ่มเติมที่ Deneb ทำได้ดีกว่าต้นแบบ" โดยเปิด **สองระดับตามลำดับ** (Deneb 2.0): (1) เปิด Cross-highlighting ของ Visual ในหน้า Project setup pane ก่อน (2) ไปที่ "Supporting Fields: dataset" แล้วเปิด Supporting field `Highlight value` **และ** `Highlight status` ให้ทั้ง Actual และ Reference เป็นรายฟิลด์ (ค่าเริ่มต้นเปิดเฉพาะ `Highlight value` เท่านั้น `Highlight status`/`Highlight comparator` ต้องเปิดเพิ่มเองถ้า Spec จะอ้างถึง `[Actual]__highlightStatus`/`[Reference]__highlightStatus`) แล้วจึง encode สี/opacity จาก `[Actual]__highlight`, `[Actual]__highlightStatus`, `[Reference]__highlight`, `[Reference]__highlightStatus` (สถานะ `on`/`off`/`neutral`) แยกจาก cross-filter โดยเด็ดขาด (ค่าฐานยังอยู่ครบ ไม่ใช่แค่ opacity ของ mark เดิม)

- Business_Type แบบผูกกับข้อมูล: ต้นแบบกำหนด Higher-is-better/Lower-is-better ผ่าน Format pane object `comparisonLogic.mode` เท่านั้น (ดู capabilities.json) เป็นค่าคงที่ต่อ Visual ที่ผู้สร้างรายงานต้องตั้งเองทุกครั้ง eBook จะสอนการเพิ่ม field `Business_Type` จาก Semantic model เข้าไปในช่อง Values ของ Deneb (ไม่ใช่การแก้ `capabilities.json` หรือประกาศ data role ใหม่แบบ Custom Visual — Deneb ไม่มีกลไกนั้น) เพื่อให้ปรากฏเป็นคอลัมน์ใน `dataset` แล้วให้ Vega-Lite `transform` อ่านค่านี้มากำหนด sign ของ good/bad ทั้งพื้นที่ Variance และ Connector line แทนที่ Format pane setting ตามนโยบายที่ Lock ในหัวข้อ Field contract (ผูกเป็น **Power Query Column** บนตาราง `DualLine_PlotData` ที่ Power Query stamp ค่าเดียวซ้ำทุกแถวเพื่อรักษา grain — **ต้อง bind Column นี้เข้า Deneb Values จริงเสมอ ไม่มีสถานะ "ไม่ผูก field"**; fallback `"Higher is Good"` ใช้เมื่อ **ค่าต้นทางที่ป้อนให้ Power Query เป็น Blank/ไม่ตรง allow-list ก่อน stamp** เท่านั้น ไม่ใช่กรณีไม่ bind field) ระบุชัดว่าเป็นความสามารถเพิ่มเติมที่ต้นแบบไม่มี ไม่ใช่การเลียนแบบ
- Category axis label ไม่ทับซ้อนกันภายในช่วงขนาดที่ Test matrix กำหนด: ต้นแบบไม่รับประกันสิ่งนี้ (ดูรายละเอียดในตาราง Field contract แถว Responsive) eBook จะพิสูจน์และล็อกวิธีทำใน Vega-Lite (เช่น axis `labelOverlap`, `labelSeparation`, `autosize.resize`, `width`/`height: "container"`) เป็นคุณภาพเพิ่มเติมเหนือต้นแบบ จำกัดคำรับประกันไว้เฉพาะช่วงขนาดที่ทดสอบจริงเท่านั้น ไม่ใช่ทุกขนาดที่เป็นไปได้

หมายเหตุ: Custom Visual ต้นแบบมี Animation แบบ Web Animations API (`element.animate`) ซึ่งอยู่นอกขอบเขตของ Deneb (ไม่มี API ระดับนั้น) ส่วน Context menu นั้น **Deneb รองรับ Power BI Context menu ของจริงในตัว** ผ่าน section "Context menu" ใน Project setup pane ซึ่งมีสองการตั้งค่า: `Show context menu on right-click` และ `Attempt to resolve data point-specific actions` (เปิดโดย Default ทั้งสอง) ไม่ต้องเขียนโค้ดเรียก `showContextMenu` เอง — eBook จะสอนการเปิดใช้งานนี้ ไม่ใช่ระบุว่าทำไม่ได้ ชื่อ/ตำแหน่งการตั้งค่าทั้งหมดในหัวข้อนี้ต้องยืนยันซ้ำกับหน้าจอ Deneb เวอร์ชันที่ Lock จริงก่อนเขียนบทที่ 8

## 5 สิ่งส่งมอบ

```text
D:\DATA\Deneb\eBook-DualLineVariance
├── PROJECT_PLAN.md
├── README.md
├── manuscript
│   ├── chapter-01.md ... chapter-10.md
├── data
│   ├── DualLineVariance_Workshop_Data.xlsx
│   └── DualLineVariance_Workshop_Data.csv
├── dax
│   └── workshop-measures.dax
├── specs
│   ├── step-01-....json ... step-NN-final.json
├── templates
│   └── DualLineVariance_Template.json
├── images
│   ├── chapter-01 ... chapter-10
├── cover
│   └── cover.svg / cover.png
├── review
│   ├── PHASE1_DESIGN_PLAN.md
│   ├── REVIEW_LOG.md
│   └── chapters
├── qa
│   └── (ผลทดสอบแต่ละ Phase)
└── release
    └── (ไฟล์ฉบับผ่าน QA เท่านั้น)
```

## 6 โครงสร้างหนังสือ (กระชับ 10 บท)

### บทที่ 1 รู้จัก Deneb
Deneb คืออะไร, ความสัมพันธ์กับ Vega/Vega-Lite, ประวัติย่อ, Deneb ต่างจาก Native Visual/Custom Visual อย่างไร, ภาพรวม Visual ปลายทางของเล่มนี้

### บทที่ 2 เตรียม Power BI และ Deneb
ติดตั้ง Deneb จาก Marketplace, เพิ่มลง Report, เปิด Editor, ส่วนประกอบของ Editor (Spec pane, Data pane, Debug pane, Signal viewer)

### บทที่ 3 โครงสร้างภาษา Vega-Lite ที่ต้องรู้
`$schema`, `data`/`dataset`, `mark`, `encoding`, `field`/`type`, `scale`, `axis`, `layer`, `transform` (`calculate`, `filter`), `condition`, `params`(selection) — อธิบายทีละคอมโพเนนต์แบบเห็นภาพ พร้อมตัวอย่างสั้นที่รันได้จริง

### บทที่ 4 ชุดข้อมูล Workshop
โครงสร้างตาราง `DualLine_PlotData` ที่สร้างผ่าน Power Query, ที่มาของ field แต่ละคอลัมน์ (สะท้อน capabilities.json ต้นแบบ และ `Business_Type` ที่เป็นส่วนขยายของ eBook — สอนสร้างเป็น **Power Query Column ที่ stamp ค่าเดียวซ้ำทุกแถว** ไม่ใช่ DAX Measure เพราะตารางนี้ควบคุม grain เองอยู่แล้ว), Test scenarios ที่ข้อมูลต้องครอบคลุม (รวมกรณี Business_Type ต้นทาง Blank/ไม่ตรง allow-list ก่อน stamp), DAX measures พื้นฐานสำหรับตารางข้อเท็จจริงหลักของรายงาน (แยกจาก `DualLine_PlotData`)

### บทที่ 5 กราฟสองเส้นแรก (Actual vs Reference)
Layer สองเส้น, สี/lineStyle ต่อ series, จุดข้อมูล (point mark), Sort ตาม Category

### บทที่ 6 พื้นที่ Variance และ Connector Line
Transform คำนวณ variance/good-bad **โดยอ่านทิศทางจาก field `Business_Type`** (Column ค่าเดียวซ้ำทุกแถว, Higher is Good / Lower is Good) แทนค่าคงที่, Layer พื้นที่แบบ conditional color, Connector line (rule mark) เชื่อม Actual-Reference ต่อจุด, พฤติกรรม fallback ที่ Power Query เมื่อค่าต้นทาง Blank/ไม่ตรง allow-list ตาม Field contract

### บทที่ 7 Data Label และ Tooltip
จัดตำแหน่ง Actual/Reference data label เพื่อ**ลดการชนกัน** (above/below + thinning ตาม test matrix ไม่รับประกันทุกกรณี — Group A), Tooltip หลายค่าพร้อม format ตัวเลข, การจัดการ Category ยาว

### บทที่ 8 Cross-filtering และ Cross-highlighting
เปิด `Expose cross-filtering values for dataset rows` (Simple mode) จาก Project setup pane และอ่านค่า `__selected__` (on/off/neutral) เพื่อกรอง Visual อื่น, เปิด `Expose cross-highlight values for measures` ของ Visual แล้วเปิด Supporting field `Highlight value` และ `Highlight status` ต่อ measure (Actual, Reference) แยกกันใน "Supporting Fields: dataset" ก่อนอ่าน `__highlight`/`__highlightStatus` เพื่อรับ Highlight จาก Visual อื่น (สอนแยกจาก cross-filter ชัดเจนว่าเป็นคนละกลไกแต่คนละส่วนการตั้งค่าภายใน Project setup pane เดียวกัน), **ตั้งค่าฝั่ง Power BI โดยใช้ `Clustered bar chart` หรือ `Clustered column chart` เป็น Visual ต้นทาง (Visual ประเภทนี้รองรับ Highlight จริง) ผ่าน `Format > Edit interactions` แล้วเลือกไอคอน `Highlight` ให้ชี้มาที่ Dual-Line Variance Chart อย่างชัดเจน** — ถ้า Visual ต้นทางถูกตั้งเป็น `Filter` หรือ `None` จะไม่เกิด cross-highlight ไม่ว่า Spec จะถูกต้องแค่ไหน **ห้ามใช้ Slicer เป็น Visual ต้นทางสำหรับทดสอบ Highlight เพราะ Slicer ส่งผลได้เฉพาะ `Filter`/`None` เท่านั้น ไม่มีตัวเลือก `Highlight`**, เปิด Context menu ผ่าน `Show context menu on right-click` และ `Attempt to resolve data point-specific actions` (section Context menu ของ Project setup pane, เปิดโดย Default ทั้งสอง), ตรวจกับ Visual จริงในหน้ารายงานและบันทึกหลักฐาน

### บทที่ 9 Edge Case, Responsive และ Template
Blank/Reference เป็นศูนย์ (ตามนโยบายที่ Lock ใน Field contract), ค่าติดลบ, Category ชื่อยาว, Category จำนวนมากด้วยแนวทาง fit-and-thin, `Business_Type` ต้นทาง Blank/ไม่ตรง allow-list ก่อน Power Query stamp (รวมตรวจว่า grain ของ `dataset` ไม่เพี้ยน), **ทดสอบ Responsive: ลาก resize Visual แคบ/กว้าง/สูง-ต่ำหลายขนาดแล้วตรวจแยกสองเกณฑ์ — Category axis label ต้องไม่ทับซ้อนกันเลยในทุกขนาดที่ทดสอบ (Group B) และ Actual/Reference data label ลดการชนกัน (Group A ไม่รับประกัน 100%)**, แยก Template สำหรับนำไปใช้ซ้ำ

### บทที่ 10 Final Workshop
เริ่มจาก Report เปล่า → Import ข้อมูล → สร้าง Measure → สร้าง Dual-Line Variance Chart ฉบับสมบูรณ์ → เพิ่ม `Clustered bar chart` เป็น Visual ต้นทาง (รองรับ `Highlight/Filter/None` ครบ) แล้วทดสอบ `Edit interactions` ทั้งสามสถานะเพื่อยืนยันว่า Dual-Line Variance Chart ตอบสนองต่างกันตามที่ตั้งค่าจริง → เทียบผลกับ Reference spec

### มาตรฐานต่อหนึ่ง Step (บังคับทุก Step ในทุกบท)

ทุก Step ต้องมีหัวข้อตามลำดับนี้: 1) เป้าหมาย 2) สิ่งที่ควรเห็นก่อนเริ่ม 3) Fields/Measures ที่ใช้ 4) ขั้นตอนใน Power BI 5) JSON ที่เพิ่มหรือแก้เฉพาะ Step 6) คำอธิบายโค้ด 7) ภาพระหว่างทำ 8) ผลลัพธ์ที่ควรได้ 9) วิธีตรวจสอบผล 10) ปัญหาที่อาจพบและวิธีแก้ 11) แบบฝึกหัดสั้น 12) จุดตรวจผ่านก่อนทำ Step ถัดไป ห้ามวาง Specification ฉบับเต็มซ้ำทุก Step ให้แสดงเฉพาะส่วนที่เปลี่ยนและลิงก์ไปยังไฟล์ JSON เต็มของ Step นั้น

### กฎภาพประกอบ (บังคับ)

- ภาพหน้าจอ Power BI/Deneb ต้องจับจาก Workshop ที่รันจริงบนเครื่องผู้ใช้เท่านั้น ห้ามวาดจากการคาดเดา UI
- ถ้ายังไม่มีภาพจริง ให้ใช้ภาพแผนผัง/มม็อคที่ระบุ Caption ชัดเจนว่า "ภาพแผนผังแนวคิด ไม่ใช่ภาพหน้าจอจริง" และต้องแทนที่ด้วยภาพจริงก่อนเข้า Phase 4
- UI, โค้ด, ชื่อ Field และค่าบนภาพต้องตรงกับต้นฉบับของบทนั้น
- Caption ทุกภาพต้องบอกว่าภาพแสดงอะไรอย่างเจาะจง ห้ามใช้ Caption กว้างๆ เช่น "ภาพตัวอย่าง"
- Naming convention: `CHxx-Syy-<สิ่งที่แสดง>.png` เช่น `CH08-S02-selection-setting.png`

มาตรฐานทั้งสองข้อนี้ใช้แทนที่การอ้างอิงไปยังโครงการ Bullet Chart โดยสมบูรณ์ — โครงการนี้ไม่ขึ้นกับไฟล์ของ `D:\DATA\Deneb\eBook`

## 7 ขั้นตอนทำงาน (Claude เขียน, Codex รีวิว)

### Phase 0 ตรวจสภาพแวดล้อมและอนุมัติแผน
1. ตรวจโครงสร้างโฟลเดอร์และไฟล์ต้นแบบ (`dualLineVarianceChart` source, capabilities, settings)
2. เขียน `PROJECT_PLAN.md` ฉบับนี้
3. ส่ง Plan ให้ Codex รีวิวความเป็นไปได้ทางเทคนิคและความครบถ้วนของขอบเขต
4. แก้จนได้ `PASS` ก่อนเริ่ม Phase 1

### Phase 1 Research และ Design Lock
1. พิสูจน์ความเป็นไปได้ของ Variance area ที่แบ่งสีตรงจุดตัด (crossing case) ด้วย Vega-Lite ล้วนๆ — ถ้าทำไม่ได้แบบ pixel-accurate ให้เลือกทางใดทางหนึ่งและบันทึกเหตุผล: (ก) precompute จุดตัดเป็นแถวเพิ่มใน dataset ตอนเตรียมข้อมูล Workshop (ยอมรับได้เพราะเป็นชุดข้อมูลตัวอย่างคงที่) หรือ (ข) ลดคำสัญญาเป็นทาสีทั้งช่วงต่อ Category-pair พร้อมระบุข้อจำกัดเทียบต้นแบบ
2. ยืนยันกลไก Deneb 2.0 ที่ใช้จริง**จากเอกสารทางการเท่านั้น** (ชื่อ/ตำแหน่ง UI ในเอกสารรุ่นเก่าอาจต่างจากรุ่นที่ Lock — Phase 1 ใช้เอกสารเป็นหลักฐานชั้นต้น ส่วนการยืนยันด้วยภาพจริงจากเครื่องผู้ใช้เป็นเงื่อนไขบังคับของ **Phase 2 ข้อ 5** ไม่ใช่ Phase 1 เพราะ Claude/Codex ไม่มีสิทธิ์เข้าถึง Power BI Desktop/Deneb Editor จริงในเครื่องผู้ใช้): `__selected__` (on/off/neutral) กับการเปิด `Expose cross-filtering values for dataset rows` โหมด Simple ใน Project setup pane สำหรับ cross-filter; และสำหรับ cross-highlight ต้องเปิด **สองระดับ** คือ (1) เปิด `Expose cross-highlight values for measures` ของ Visual (2) เปิด Supporting field ต่อ measure แยกกันใน "Supporting Fields: dataset" เฉพาะฟิลด์ที่ Spec จะใช้จริง — ถ้าใช้แค่ `[measure]__highlight` และ `__highlightStatus` เปิดเพียง `Highlight value` และ `Highlight status` (ค่าเริ่มต้นเปิดเฉพาะ `Highlight value`) ถ้าจะใช้ `__highlightComparator` ด้วยต้องเปิด `Highlight comparator` แยกอีกฟิลด์ — คนละกลไกกับ cross-filter แต่ทั้งสองอยู่ใน Project setup pane เดียวกัน (คนละ section) ห้ามอธิบายรวมกันหรือสลับชื่อ UI รุ่นเก่ากับรุ่นที่ Lock ไว้ **และต้อง Lock ขั้นตอนฝั่ง Power BI คู่กันเสมอ**: ให้ผู้อ่านตั้งค่า Visual ต้นทางผ่าน `Format > Edit interactions` แล้วเลือก `Highlight` ให้ชี้มาที่ Dual-Line Variance Chart เพราะ Deneb ไม่สามารถกำหนด interaction mode แทนผู้สร้างรายงานได้ ถ้า Visual ต้นทางเป็น `Filter` หรือ `None` cross-highlight จะไม่เกิดไม่ว่า Spec จะถูกแค่ไหน
3. กำหนด Field contract ฉบับเต็มตามตารางในหัวข้อ 4 (grain, sort, axis type, blank policy, reference=0 policy, duplicate policy, **Business_Type policy**), Style guide (รวมระบุ minimum supported viewport), Test matrix รวมกรณี Blank/ติดลบ/Category ยาว/จำนวนมาก/เส้นตัดกัน/**Business_Type ต้นทาง Blank/ไม่ตรง allow-list ก่อน Power Query stamp และ `DISTINCTCOUNT(Business_Type)=1` หลังสร้าง query**/**ปรับขนาด Visual หลายขนาด (แคบสุด, กว้างสุด, เตี้ย, สูง ตามที่กำหนดในหัวข้อ Style guide)** — แยก Test ID ของ Category axis label overlap ออกจาก Actual/Reference data label collision อย่างชัดเจน (คนละเกณฑ์ผ่าน)
4. **Lock แนวทางที่จะพิสูจน์ใน Phase 2 (ไม่ใช่พิสูจน์ที่นี่ เพราะ Claude/Codex ไม่มีสิทธิ์เข้าถึง Power BI Desktop/Deneb Editor จริงในเครื่องผู้ใช้ — สอดคล้องกับ Phase 1 ข้อ 2)**: (ก) การผูก `Business_Type` เป็น Power Query Column บนตาราง `DualLine_PlotData` ควรทำให้จำนวนแถวใน `dataset` ของ Deneb ตรงกับจำนวนแถวจริงของตาราง (ข) กลไก Vega-Lite ที่เลือก (เช่น `labelOverlap`, `labelSeparation`, `autosize.resize`, `width`/`height: "container"`) ควรทำให้ Category axis label ไม่ทับซ้อนเมื่อ resize (ค) กลไกจัดตำแหน่งและ thinning ของ Actual/Reference data label ควรถูกประเมินใหม่เมื่อ resize โดยใช้เกณฑ์ "ลดการชน" ไม่ใช่รับประกัน collision-free — ทั้งสามข้อเป็นสมมติฐานที่ต้องพิสูจน์ด้วย prototype จริงบน Power BI ใน **Phase 2 ข้อ 6** (T23/T25/T26) ถ้าพิสูจน์ไม่ได้ให้ลดคำสัญญาและบันทึกข้อจำกัด
5. กำหนด Evidence record ที่ต้องกรอกทุกครั้งที่อ้างผลทดสอบ Interaction บน Power BI จริง อย่างน้อยต้องมี: Power BI Desktop version, Deneb version, ไฟล์ PBIX หรือ hash อ้างอิง, Test ID, การตั้งค่า Interactivity ที่เปิด, **ชนิดของ Visual ต้นทาง (เช่น Clustered bar chart) และ Interaction mode ที่ตั้งผ่าน `Edit interactions` (`Highlight`/`Filter`/`None`)**, ขั้นตอนทำซ้ำ, Expected/Actual, หลักฐานภาพหรือวิดีโอ, ผู้ทดสอบ, วันที่ — Interaction ใดไม่มี Evidence record ต้องมีสถานะ `NOT TESTED` และห้ามเข้า release
6. บันทึกเวอร์ชัน Power BI Desktop และ Deneb ที่จะใช้ถ่ายภาพและทดสอบทั้งเล่ม (ล็อกก่อนเริ่ม เพราะ Layout ของ Interactivity settings เปลี่ยนตามรุ่น) และกำหนดเกณฑ์ accessibility ขั้นต่ำ (คู่สี good/bad ต้องแยกได้แม้ไม่ใช้สี, contrast, ชุดสีที่ผู้มีภาวะตาบอดสีอ่านได้)
7. เขียน Design Plan → ส่ง Codex รีวิว → แก้จน `PASS`

### Phase 2 Dataset และ Vega-Lite Prototype
1. สร้าง Excel/CSV dataset และ DAX measures ตาม Field contract ที่ Lock ไว้ (รวมคอลัมน์ `Sort_Order`)
2. สร้าง Vega-Lite spec ฉบับสมบูรณ์ (ฟีเจอร์กลุ่ม A และ B ในหัวข้อ 4) แบบ static ก่อน รวมทดสอบ crossing case ตามแนวทางที่ Lock ใน Phase 1 และทดสอบ `Business_Type` ทั้งสองค่า และกรณีค่าต้นทาง Blank/ไม่ตรง allow-list ก่อน Power Query stamp
3. บันทึกผลตรวจแบบ static (JSON valid, schema ถูกต้อง, ตรรกะ good/bad และจุดตัดถูกต้องตามข้อมูลทดสอบ, thinning/label logic ตอบสนองต่อค่าความกว้าง/สูงที่จำลองหลายขนาดใน spec) ไว้ใน `qa/` — **การทดสอบ Cross-filtering/Cross-highlighting/Context menu จริงต้องทำใน Power BI Desktop จริงโดยผู้ใช้ ตาม Evidence record ที่ Lock ไว้** เพราะ Claude/Codex ไม่มีสิทธิ์รันแอปนี้ ห้ามอ้างว่าทดสอบผ่านจริงถ้าไม่มี Evidence record ครบ
4. แตก Prototype กลับเป็น Workshop steps ทีละบท
5. **บังคับก่อน Phase 2 จะ `PASS`**: ผู้ใช้เปิด Deneb 2.0.0.0 จริงและยืนยันด้วยภาพหน้าจอว่าชื่อ/ตำแหน่ง UI ต่อไปนี้ตรงกับที่ Design Plan อ้างอิงจากเอกสาร — Project setup pane, `Expose cross-filtering values for dataset rows`, `Expose cross-highlight values for measures`, Supporting Fields: dataset (`Highlight value`/`Highlight status`/`Highlight comparator`), section Context menu (`Show context menu on right-click`/`Attempt to resolve data point-specific actions`) — ถ้าชื่อ/ตำแหน่งต่างจากเอกสาร ให้แก้ Design Plan และบทที่ 8 ตามภาพจริง ไม่ใช่ตามเอกสาร
6. **บังคับก่อน Phase 2 จะ `PASS`**: พิสูจน์ด้วย prototype จริงบน Power BI (ไม่ใช่ Vega Editor แบบ standalone) ตามแนวทางที่ Lock ใน Phase 1 ข้อ 4 — (ก) `Business_Type` Column ไม่ทำให้จำนวนแถวใน Deneb `dataset` เพี้ยนจากจำนวนแถวจริงของ `DualLine_PlotData` (T23) (ข) Category axis label ไม่ทับซ้อนจริงเมื่อ resize ที่**ทุกขนาด viewport ที่ Lock ไว้ทั้ง 6 ขนาด (T14–T17, T34, T35)** (T25) (ค) Actual/Reference data label thinning ประเมินใหม่จริงเมื่อ resize ที่ทุกขนาดเดียวกัน (T26) — ข้อใดพิสูจน์ไม่ได้ ให้ลดคำสัญญาในบทที่เกี่ยวข้องและบันทึกข้อจำกัดไว้ก่อนเขียนบทนั้น
7. **บังคับก่อน Phase 2 จะ `PASS`**: ทำ T18 และ T22 บน Power BI จริงพร้อม Evidence record ครบ โดยเฉพาะกรณีคลิก/right-click กลางแถบสี Area (ไม่ใช่แค่ที่ Point layer) — ตรวจว่า Visual อื่นที่ผูกกับ Dimension ร่วมเหลือ Category ใดบ้างหลังคลิก **ถ้าพบว่า Area-click/right-click ทำให้เกิด selection, filter, หรือ data-point resolution ที่ผิด (เช่น กรองไปหลาย Category ที่ไม่ตรงกับที่คลิกจริง ตามที่วิเคราะห์ไว้ใน Design Plan หัวข้อ 2.2) ต้องเปลี่ยน interaction architecture (เช่น Advanced cross-filtering mode ของ Deneb) และ regression-test ใหม่ก่อน — ห้ามให้ Phase 2 `PASS` จนกว่าพฤติกรรม Area interaction จะถูกแก้หรือพิสูจน์ว่าปลอดภัยจริง**
8. ส่ง Dataset spec และ Final specification ให้ Codex รีวิว → แก้จน `PASS`

### Phase 3 เขียนทีละบท (บทที่ 1–10)
ต่อบท: เขียนต้นฉบับ → สร้าง/อัปเดต JSON ของ Step → สร้างภาพประกอบ (SVG แผนผัง/mock เพราะไม่มีสิทธิ์ capture หน้าจอ Power BI จริง — ระบุไว้ชัดว่าเป็นภาพประกอบแนวคิด ไม่ใช่ภาพหน้าจอจริง จนกว่าผู้ใช้จะยืนยันด้วยภาพจากเครื่องจริง) → Self-review → ส่ง Codex รีวิว → แก้ตาม Finding ที่ยืนยันได้ → Merge เข้า manuscript เมื่อ `PASS`

ห้ามเขียนหลายบทพร้อมกันก่อนบทต้นทางผ่าน (เหตุผลเดียวกับโครงการ Bullet Chart — ชื่อ field และ Style อาจเปลี่ยน)

### Phase 4 รวมเล่มและออกแบบปก
1. รวมบทที่ผ่านแล้ว ตรวจสารบัญ/Cross-reference/โค้ดตรงกับ JSON
2. ออกแบบปกมินิมอลตามที่ผู้ใช้ขอ (สร้างเป็น SVG/PNG ด้วยแนวทาง design skill ไม่ใช้ AI image-gen ที่เดา licensing)
3. Render เป็น HTML/PDF ตรวจ Layout
4. ส่ง Full-book review pack ให้ Codex → แก้จน `PASS`

### Phase 5 Release
1. Final QA ตาม Definition of Done (หัวข้อ 10) รวมตรวจ Release gate
2. ย้ายเฉพาะไฟล์ผ่าน QA เข้า `release`
3. Commit และสรุปสถานะใน README

## 8 Workflow รีวิวกับ Codex

- สถานะ: `PASS`, `REVISE`, หรือ `BLOCKED` — Codex เป็นผู้ให้ Verdict ทุก Phase ในโครงการนี้ (สลับบทบาทจากโครงการ Bullet Chart ที่ Claude เป็นผู้รีวิว)
- ทุก Finding จาก Codex ต้องถูกตัดสินเป็น `Accepted`, `Rejected` หรือ `Need Evidence` พร้อมเหตุผลที่ตรวจสอบได้ (เช่น อ้างอิงเอกสาร Deneb ฉบับปัจจุบันหรือผลทดสอบจริง) ก่อนแก้ไข
- Finding ที่ `Rejected` ต้องบันทึกหลักฐานที่หักล้างได้ ไม่ใช่ความเห็นส่วนตัว
- หลังแก้ไขต้อง Regression test ส่วนที่เกี่ยวข้องก่อนส่งกลับรีวิว
- ถ้าไม่ผ่านภายใน 3 รอบ ให้สร้าง Conflict Summary ระบุข้อขัดแย้ง หลักฐานทั้งสองฝั่ง และคำตัดสินที่ต้องการ ห้ามวนแก้ไม่จำกัดรอบ
- `PASS` ให้เฉพาะเมื่อไม่มี Mandatory finding ค้างอยู่เท่านั้น

## 9 ข้อจำกัดที่ต้องระบุตรงไปตรงมาในหนังสือ

- Claude/Codex ไม่มีสิทธิ์เข้าถึง Power BI Desktop หรือ Deneb Editor จริงในเครื่องผู้ใช้ ภาพหน้าจอต้องมาจากผู้ใช้ยืนยันบนเครื่องจริง หรือระบุชัดว่าเป็นภาพแผนผัง/แนวคิด (mock) ไม่ใช่ภาพหน้าจอจริง
- ผลทดสอบ Cross-filtering, Cross-highlighting และ Context menu ต้องมี Evidence record ครบตามที่ Lock ไว้ใน Phase 1 ข้อ 5 มิฉะนั้นต้องมีสถานะ `NOT TESTED` ในเนื้อหา ห้ามอนุมานจาก Spec ว่าใช้งานได้จริง
- Deneb ไม่รองรับ Custom animation แบบ Web Animations API ที่ต้นแบบใช้ — จะไม่สัญญาฟีเจอร์นี้; Context menu ของ Power BI ใช้ได้จริงผ่าน `Show context menu on right-click` และ `Attempt to resolve data point-specific actions` (section Context menu ของ Project setup pane) ไม่ใช่ข้อจำกัด (ชื่อ/ตำแหน่งตั้งค่าต้องยืนยันกับเวอร์ชันที่ Lock จริงก่อนเขียน ไม่ใช้ชื่อ UI จากเอกสารรุ่นเก่าปนกับรุ่นที่ใช้จริง)
- Variance area ที่แบ่งสีตรงจุดตัด (crossing case) ขึ้นกับผลพิสูจน์ใน Phase 1 ข้อ 1 — ถ้าทำได้เฉพาะแบบ precompute หรือแบบง่าย (ทาสีทั้งช่วง) ต้องระบุข้อจำกัดเทียบต้นแบบตรงจุดที่สอน ไม่ใช้คำว่า "เทียบเท่า" เกินจริง
- Field contract ผูกกับ dataset ตัวอย่างของเล่มนี้เท่านั้น ไม่ใช่คำแนะนำสถาปัตยกรรม Data model ระดับองค์กร
- **เส้น Actual/Reference ใช้ `interpolate: "monotone"` (โค้งมน) แต่พื้นที่สี Good/Bad (Area), เส้นขอบเส้นประของ Bad segment, และ Connector line ยังคงเป็นเส้นตรง** — เป็นการตัดสินใจของผู้ใช้ (ดู `qa/PHASE2_STATIC_TEST_LOG.md` หัวข้อ M-11) ที่ยอมรับความไม่ sync กันระหว่างเส้นโค้งกับพื้นที่สีเส้นตรงชั่วคราว โดยไม่รอให้ Codex ให้ `PASS` Phase 2 ส่วน static ก่อน (Codex ยัง flag เป็น Mandatory finding M-11 อยู่) ต้องระบุข้อจำกัดนี้ตรงไปตรงมาในบทที่เกี่ยวข้อง (จุดตัดที่เห็นจากเส้นโค้งอาจไม่ตรงกับขอบพื้นที่สีเป๊ะระหว่างจุดข้อมูล) จนกว่าจะมีการทบทวนใหม่ก่อน Phase 4/5

## 10 Definition of Done

### ต่อหนึ่งบท
- Workshop ทำตามได้ตั้งแต่ต้นจนจบด้วย Field contract ที่ Lock ไว้
- JSON ของทุก Step parse ได้ไม่มี error ทาง syntax/schema
- Fields, Measures และค่าบนภาพตรงกับต้นฉบับและ Field contract
- ภาพทุกภาพมี Caption ระบุว่าเป็นภาพจริงจากเครื่องผู้ใช้หรือภาพแผนผัง
- ข้อความ Cross-filtering/Cross-highlighting อ้างอิงกลไกที่ถูกต้องและครบสองระดับของการเปิดใช้งาน (`__selected__` กับ `__highlight`/`__highlightStatus` ที่ต้องเปิด Supporting field แยกต่างหากจากการเปิด Cross-highlighting ของ Visual) ตามที่ Lock ใน Phase 1 ใช้ชื่อ UI ตรงกับเวอร์ชันที่ Lock จริง ไม่ผสมรุ่นเก่ากับรุ่นใหม่
- ทุก Claim เรื่อง Interaction ที่ทดสอบบน Power BI จริงมี Evidence record แนบ หรือระบุ `NOT TESTED`
- **Codex ให้ `PASS`** และ Review log ถูกอัปเดต

### ทั้งโครงการ
- ทุกบทผ่าน Codex Review
- Final Dual-Line Variance Chart spec ผ่าน Test matrix ทั้งหมดที่ Lock ไว้ใน Phase 1 (รวม crossing case, blank, ติดลบ, reference=0, category ยาว/จำนวนมาก, `Business_Type` ต้นทาง Blank/ไม่ตรง allow-list ก่อน stamp) โดยแยกเกณฑ์ Responsive เป็นสองส่วน: **Category axis label ต้องไม่ทับซ้อนกัน** ในทุกขนาดที่ Test matrix กำหนด (Group B) และ **Actual/Reference data label ลดการชนกัน** ตาม test matrix โดยไม่รับประกัน collision-free ทุกกรณี (Group A)
- DOCX/PDF ไม่มีภาพแตก ข้อความล้น หรือโค้ดถูกตัด
- ไฟล์ Excel, CSV, DAX, JSON และ Template เปิดใช้งานได้จริง
- ไม่มี Secret, Credential หรือข้อมูลจริงขององค์กรอยู่ในไฟล์

### Release gate (บังคับ ห้ามข้าม)
- ฉบับที่จะ Release เป็น "ใช้งานได้จริง" (ไม่ติดป้าย unverified) ต้องมี Evidence record ที่ `PASS` ครบทุก Test ID ของ Cross-filtering, Cross-highlighting และ Context menu บน Power BI/Deneb จริง
- ถ้า Evidence ยังไม่ครบ ให้ Release ได้เฉพาะฉบับ **Draft** ที่ติดป้าย "Interaction unverified — ยังไม่ผ่านทดสอบบน Power BI จริง" ไว้ชัดเจนทุกจุดที่กล่าวถึง Interaction ทั้งในเนื้อหาและหน้าปกใน/สารบัญ
- ห้ามนำฉบับ Draft ที่ติดป้าย unverified เข้าเป็นฉบับ Final ใน `release` จนกว่าจะได้ Evidence ครบและ Codex ให้ `PASS` รอบสุดท้าย
