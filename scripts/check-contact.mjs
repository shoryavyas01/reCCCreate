// Exercise contact validation and delivery without writing to the team's Google Sheet.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require: (id) => dependencies[id], Response, Request, URL, AbortSignal });
  return exports;
}
const contact = load('src/lib/contact.ts');
const valid = { name: 'Website check', email: 'check@example.com', phone: '', role: 'Buyer', topic: 'Buying', message: 'Please share product availability.' };
let calls = 0;
let provider = 'success';
const sheet = { sheetConfigured: false, saveToSheet: async (form, body) => {
  calls++;
  assert.equal(form, 'contact');
  assert.equal(body.email, valid.email);
  assert.equal(body.role, valid.role);
  assert.equal(body.message, valid.message);
  if (provider === 'timeout') throw new Error('Connection failed');
  return { saved: provider === 'success' };
} };
const route = load('src/app/api/contact/route.ts', { '@/lib/contact': contact, '@/lib/sheet': sheet });
const request = (body, origin = 'https://example.com') => new Request('https://example.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify(body) });
assert.equal((await route.POST(request(valid))).status, 503);
assert.equal(calls, 0);
sheet.sheetConfigured = true;
for (const invalid of [null, [], { ...valid, email: 'invalid' }, { ...valid, message: 'short' }, { ...valid, role: 'Unknown' }, { ...valid, botcheck: 'spam' }]) {
  assert.equal((await route.POST(request(invalid))).status, 400);
}
assert.equal((await route.POST(request(valid, 'https://elsewhere.example'))).status, 403);
assert.equal(calls, 0);
assert.equal((await route.POST(request(valid))).status, 200);
// Support an older open contact form across a deployment.
assert.equal((await route.POST(request({ ...valid, role: undefined, topic: undefined, i_am_a: 'Buyer', about: 'Buying' }))).status, 200);
provider = 'refused';
assert.equal((await route.POST(request(valid))).status, 502);
provider = 'timeout';
assert.equal((await route.POST(request(valid))).status, 502);
const draft = new URL(contact.contactDraft({ ...valid, message: 'Rangoli & flowers? A new line.\nThank you.' }));
assert.equal(draft.protocol, 'mailto:');
assert.equal(draft.pathname, contact.contactEmail);
assert.match(draft.searchParams.get('body'), /Rangoli & flowers\? A new line\.\nThank you\./);
console.log('Contact checks passed: validation, honeypot, origin, missing setup, Sheet success, legacy fields, rejection, connection failure and encoded email draft. No external requests sent.');
