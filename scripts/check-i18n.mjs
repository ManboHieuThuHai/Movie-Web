import fs from "node:fs";

const english = JSON.parse(fs.readFileSync(new URL("../src/locales/en.json", import.meta.url)));
const vietnamese = JSON.parse(fs.readFileSync(new URL("../src/locales/vi.json", import.meta.url)));
const englishKeys = Object.keys(english).sort();
const vietnameseKeys = Object.keys(vietnamese).sort();

if (JSON.stringify(englishKeys) !== JSON.stringify(vietnameseKeys)) {
  const missing = englishKeys.filter((key) => !vietnameseKeys.includes(key));
  const extra = vietnameseKeys.filter((key) => !englishKeys.includes(key));
  throw new Error(`Locale key parity failed. Missing: ${missing.join(", ")}. Extra: ${extra.join(", ")}.`);
}

console.log(`Locale parity passed: ${englishKeys.length} keys.`);
