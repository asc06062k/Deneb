// Builds templates/dual-line-variance.deneb-template.json (Deneb template format) from
// specs/dual-line-variance-final.vl.json (rev 8, 4-field architecture) and self-checks that
// substituting the placeholders back reproduces the final spec exactly.
// Run: node qa/scripts/build-template.mjs
// The template keeps the usermeta/deneb/interactivity block of the previously delivered template
// (real Deneb 2.0.0.0 export, escaping bugs already fixed) and only changes name, description,
// datasets and the spec body.

import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const finalPath = join(root, "specs", "dual-line-variance-final.vl.json");
const tplPath = join(root, "templates", "dual-line-variance.deneb-template.json");
const finalSpec = JSON.parse(readFileSync(finalPath, "utf8"));
const old = JSON.parse(readFileSync(tplPath, "utf8"));

// placeholder keys in the order Deneb lists the dataset fields
const FIELDS = [
  { key: "__dataset.0__", name: "Category", kind: "column", type: "text" },
  { key: "__dataset.1__", name: "Actual", kind: "measure", type: "numeric", highlight: true },
  { key: "__dataset.2__", name: "Reference", kind: "measure", type: "numeric", highlight: true },
  { key: "__dataset.3__", name: "Business_Type", kind: "measure", type: "text" },
];
const K = Object.fromEntries(FIELDS.map((f) => [f.name, f.key]));

// Field references inside the spec body, in the forms the spec actually uses:
//   datum.X, datum.X__highlight, datum.X__highlightStatus  -> datum['<key>'] / datum['<key>__highlight...']
//   "field": "X"   "as": "X"   'X' (pluck)                 -> "<key>" / '<key>'
function toTemplate(text) {
  let t = text;
  for (const { name } of FIELDS) {
    const k = K[name];
    t = t.replace(new RegExp(`datum\\.${name}__highlightStatus\\b`, "g"), `datum['${k}__highlightStatus']`);
    t = t.replace(new RegExp(`datum\\.${name}__highlight\\b`, "g"), `datum['${k}__highlight']`);
    t = t.replace(new RegExp(`datum\\.${name}(?![A-Za-z0-9_])`, "g"), `datum['${k}']`);
    t = t.replace(new RegExp(`"field": "${name}"`, "g"), `"field": "${k}"`);
    t = t.replace(new RegExp(`"as": "${name}"`, "g"), `"as": "${k}"`);
    t = t.replace(new RegExp(`'${name}'\\)`, "g"), `'${k}')`);
  }
  return t;
}
function fromTemplate(text) {
  let t = text;
  for (const { name } of FIELDS) {
    const k = K[name].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    t = t.replace(new RegExp(`datum\\['${k}__highlightStatus'\\]`, "g"), `datum.${name}__highlightStatus`);
    t = t.replace(new RegExp(`datum\\['${k}__highlight'\\]`, "g"), `datum.${name}__highlight`);
    t = t.replace(new RegExp(`datum\\['${k}'\\]`, "g"), `datum.${name}`);
    t = t.replace(new RegExp(`"${k}"`, "g"), `"${name}"`);
    t = t.replace(new RegExp(`'${k}'`, "g"), `'${name}'`);
  }
  return t;
}

const finalText = JSON.stringify(finalSpec, null, 2);
const bodyText = toTemplate(finalText);
const body = JSON.parse(bodyText);

// round trip
const back = fromTemplate(bodyText);
if (back !== finalText) {
  throw new Error("template round trip differs from the final spec");
}
// no plain field references may remain
const leftovers = [...bodyText.matchAll(/datum\.(Actual|Reference|Category|Business_Type)(?![A-Za-z0-9_])/g)];
if (leftovers.length) throw new Error("unreplaced field references: " + leftovers.length);

const datasets = FIELDS.map((f) => {
  const d = { key: f.key, name: f.name, description: "", kind: f.kind, type: f.type };
  if (f.highlight) d.supportFieldConfiguration = { highlight: true, highlightStatus: true, highlightComparator: false, format: false, formatted: false };
  return d;
});

const info = {
  ...old.usermeta.information,
  generated: new Date().toISOString(),
  name: "Dual-Line Variance Chart (eBook, spec rev 8, 4 fields)",
  description:
    "Four fields only: Category (column, Sort by column so rows arrive in month order), Actual and Reference (measures, Sum, with Highlight value + Highlight status enabled) and Business_Type (measure returning 'Higher is Good' or 'Lower is Good'). The variance area is computed inside the spec. Enable Cross-filtering (Simple) and Cross-highlighting in Project setup.",
};

const template = {
  usermeta: { ...old.usermeta, information: info, datasets: { dataset: datasets } },
  ...body,
};
writeFileSync(tplPath, JSON.stringify(template, null, 2) + "\n", "utf8");
console.log(`wrote ${tplPath} (${FIELDS.length} dataset fields; round trip OK)`);
