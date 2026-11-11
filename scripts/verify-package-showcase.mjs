import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';

const transpile = name => ts.transpileModule(fs.readFileSync(new URL(`../lib/${name}.ts`, import.meta.url), 'utf8'), {
 compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const catalogUrl = moduleUrl(transpile('catalog'));
const { BHKS, TIERS } = await import(catalogUrl);
const { getStartingPackage, packagePreviewHref } = await import(moduleUrl(transpile('package-showcase').replace("from './catalog'", `from '${catalogUrl}'`)));

// Independent expected prices from the existing catalogue, including the non-retrofit minimum.
const expected = [[11699, 15599, 18199], [14299, 20799, 25999], [18199, 28599, 35999]];
for (const [sizeIndex, bhk] of BHKS.entries()) for (const [tierIndex, tier] of TIERS.entries()) {
 const preview = getStartingPackage(bhk, tier.id);
 assert.equal(preview.price, expected[sizeIndex][tierIndex]);
 assert.equal(packagePreviewHref(preview), '/compare');
}
const premium3 = getStartingPackage(3, 'premium');
assert.equal(premium3.type, 'touch-switch');
assert.deepEqual(premium3.items, [
 { name: '4 Touch Modular Switch', qty: 4 },
 { name: 'IR Blaster', qty: 3 },
 { name: 'Smart Plug', qty: 2 },
]);
assert.equal(getStartingPackage(3, 'standard').type, 'retrofit');
console.log('All 9 starting prices, destination links, and the 3 BHK Premium type change verified.');
