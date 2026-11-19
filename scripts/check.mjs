import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique.');
const targets = [...html.matchAll(/\b(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)].map((match) => match[1]).filter((target) => !/^(?:[a-z]+:|\/\/)/i.test(target));
for (const target of new Set(targets)) await access(path.join(root, target));
for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing anchor: ${match[1]}`);
const originals = [
  'capital-workflow', 'capital-forecast', 'capital-results',
  'solarchain-cities', 'solarchain-architecture', 'solarchain-physics', 'solarchain-console', 'solarchain-market',
  'eval-workflow', 'eval-frontier', 'eval-ablation', 'eval-governance', 'eval-audit', 'eval-stability',
  'virel-original', 'virel-retained', 'virel-workflow', 'virel-energy', 'cost-placement',
];
for (const name of originals) {
  const src = `assets/${name}.png`;
  assert(html.includes(`<img src="${src}"`), `Missing inline original figure: ${src}`);
  assert(html.includes(`data-image="${src}"`), `Missing full-resolution view: ${src}`);
}
const scripts = (await readdir(root)).filter((file) => file.endsWith('.js'));
for (const script of scripts) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, script)], { encoding: 'utf8' });
  assert.equal(result.status, 0, `${script}: ${result.stderr}`);
}
const context = { window: {} };
vm.runInNewContext(await readFile(path.join(root, 'assets/eval-evidence.js'), 'utf8'), context);
const records = context.window.SolarEvalEvidence.records;
assert.equal(records.length, 1620, 'The original 1,620 evaluation records must remain intact.');
assert.equal(records.filter((record) => record.setting === 'main').length, 540);
assert.equal(records.filter((record) => record.setting === 'noPhysics').length, 540);
for (const setting of ['llm', 'llmNoPhysics']) assert.equal(records.filter((record) => record.setting === setting).length, 270);
for (const record of records) for (const key of ['reward', 'violation', 'liquidity']) assert(Number.isFinite(record[key]), `${key} must be finite.`);
vm.runInNewContext(await readFile(path.join(root, 'assets/capital-evidence.js'), 'utf8'), context);
const sensitivities = context.window.CapitalSensitivity;
const capitalCsv = (await readFile(path.join(root, 'evidence/capital-price-sensitivity.csv'), 'utf8')).trim().split(/\r?\n/).slice(1).map(line => line.split(','));
assert.equal(sensitivities.length, 81, 'Keep all 3-region × 9-technology × 3-fuel sensitivity estimates.');
assert.equal(capitalCsv.length, 81);
assert.equal(new Set(sensitivities.map(row => [row.region, row.technology, row.fuel].join('/'))).size, 81);
for (const row of sensitivities) {
  const source = capitalCsv.find(item => item[0] === row.region && item[1] === row.technology && item[2] === row.fuel + ' Price');
  assert(source, `Missing source row for ${row.region}/${row.technology}/${row.fuel}`);
  assert.equal(row.deltaBp, Number(source[5]), 'Plotted change must equal the reported result.');
  assert.equal(row.elasticity, Number(source[3]));
  assert.equal(row.meanWacc, Number(source[4]));
  assert.equal(row.months, 120);
  const converted = Math.expm1(row.elasticity * Math.log(1.1)) * row.meanWacc * 10000;
  assert(Math.abs(row.deltaBp - converted) < 1e-9, 'Check the original-unit elasticity to basis-point conversion.');
}
console.log(`Verified ${ids.length} unique anchors, ${new Set(targets).size} local resources, ${scripts.length} script syntaxes, ${originals.length} inline originals, 1,620 original evaluation records, and 81 source-matched capital sensitivity estimates.`);
