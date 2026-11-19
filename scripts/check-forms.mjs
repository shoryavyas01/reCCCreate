// No real messages are sent. All delivery providers below are mocked.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
function loader(overrides = {}, globals = {}) {
  const cache = new Map();
  return function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const exports = {}; cache.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const require = (id) => {
      if (Object.hasOwn(overrides, id)) return overrides[id];
      const target = id.startsWith('@/') ? path.resolve('src', id.slice(2)) : path.resolve(path.dirname(file), id);
      if (!id.startsWith('@/') && !id.startsWith('.')) throw new Error('Unexpected dependency: ' + id);
      return load(target + '.ts');
    };
    vm.runInNewContext(code, { exports, require, Response, Request, URL, AbortSignal, TextDecoder, TextEncoder, Error, TypeError, DOMException, setTimeout, console, process: { env: {} }, fetch: () => { throw new Error('External requests are prohibited in these tests'); }, ...globals });
    return exports;
  };
}
const calls = [];
let saved = true;
const sheet = { sheetConfigured: true, saveToSheet: async (form, data) => { calls.push({ form, data }); return { saved }; } };
const load = loader({ '@/lib/sheet': sheet, '@/lib/data': { getProducts: async () => ({ data: products }) } });
const { catalogueProducts: products } = load('src/lib/catalogue.ts');
const contact = load('src/lib/contact.ts');
const order = load('src/lib/order.ts');
const phool = load('src/lib/phoolMitra.ts');
const contactInput = { name: 'Release check', email: 'check@example.com', phone: '', role: 'Buyer', topic: 'Buying', product: 'kesar-kyari', message: 'Please share product availability.', consent: 'on' };
const orderInput = { name: 'Release check', phone: '9876543210', product: products[0].id, quantity: '2', delivery_area_or_class: 'Jaipur', consent: 'on' };
const phoolInput = { name: 'Release check', phone: '9876543210', area: 'Jaipur', temples: 'Nearby temple', frequency: 'Weekly', consent: 'on' };
for (const [validate, input] of [[contact.validateContact, contactInput], [(body) => order.validateOrder(body, products), orderInput], [phool.validateSignup, phoolInput]]) {
  assert.ok(validate(input).data);
  assert.ok(validate({ ...input, consent: false }).error);
}
assert.equal(contact.validateContact(contactInput).data.consent, 'on', 'Client validation must preserve consent for API submission');
for (const product of contact.contactProducts) assert.ok(contact.validateContact({ ...contactInput, product: product.id }).data);
for (const change of [{ email: 'invalid' }, { product: '' }, { product: 'unknown' }, { message: 'short' }, { botcheck: 'spam' }]) assert.ok(contact.validateContact({ ...contactInput, ...change }).error);
assert.equal(contact.validateContact({ ...contactInput, topic: 'Partnering' }).data.product, '');
const validatedOrder = order.validateOrder({ ...orderInput, price: '1', total: '1' }, products).data;
assert.equal(validatedOrder.total, '40', 'Order total must use server catalogue prices');
for (const quantity of ['0', '-1', '1.5', '101', 'NaN']) assert.ok(order.validateOrder({ ...orderInput, quantity }, products).error);
assert.ok(order.validateOrder({ ...orderInput, phone: '----------' }, products).error);
assert.ok(order.validateOrder(orderInput, products.map((p) => ({ ...p, in_stock: false }))).error);
assert.ok(phool.validateSignup({ ...phoolInput, phone: '123' }).error);
const request = (body, options = {}) => new Request('https://example.com/api/form', { method: 'POST', headers: { 'Content-Type': 'application/json', origin: 'https://example.com', ...options.headers }, body: options.raw ?? JSON.stringify(body) });
for (const [file, input, form] of [['contact', contactInput, 'contact'], ['order', orderInput, 'order'], ['phool-mitra', phoolInput, 'phool-mitra']]) {
  const route = load(`src/app/api/${file}/route.ts`);
  const before = calls.length;
  for (const bad of [null, [], {}, { ...input, consent: false }, { ...input, botcheck: true }]) assert.equal((await route.POST(request(bad))).status, 400);
  assert.equal((await route.POST(request(input, { headers: { origin: 'https://elsewhere.example' } }))).status, 403);
  assert.equal((await route.POST(request(input, { headers: { 'Content-Type': 'text/plain' } }))).status, 415);
  assert.equal((await route.POST(request(input, { raw: '{broken' }))).status, 400);
  assert.equal((await route.POST(request(input, { raw: JSON.stringify({ ...input, extra: 'x'.repeat(30001) }) }))).status, 413);
  assert.equal(calls.length, before, 'Invalid submissions must never reach the Sheet');
  sheet.sheetConfigured = false;
  assert.equal((await route.POST(request(input))).status, 503);
  sheet.sheetConfigured = true;
  assert.equal((await route.POST(request(input))).status, 200);
  assert.equal(calls.at(-1).form, form);
  saved = false;
  assert.equal((await route.POST(request(input))).status, 502);
  saved = true;
}
const contactRoute = load('src/app/api/contact/route.ts');
assert.equal((await contactRoute.POST(request(contact.validateContact(contactInput).data))).status, 200);
assert.match(calls.at(-1).data.topic, /Kesar Kyari.*₹20/);
const draft = new URL(contact.contactDraft(contact.validateContact({ ...contactInput, message: 'Flowers & colours?\nThank you.' }).data));
assert.equal(draft.protocol, 'mailto:');
assert.match(draft.searchParams.get('body'), /Kesar Kyari.*₹20/);
assert.match(draft.searchParams.get('body'), /Flowers & colours\?\nThank you\./);
// Real delivery helper: validate script version and never repeat an uncertain POST.
let posts = 0;
const sheetLoad = loader({}, { process: { env: { PHOOL_MITRA_SCRIPT_URL: 'https://example.com/script', PHOOL_MITRA_SECRET: 'test-only' } }, fetch: async (_url, init) => {
  if (init.method === 'GET') return Response.json({ ok: true, version: 3 });
  posts++; throw new TypeError('Response lost after submission');
}, console: { error: () => {} } });
assert.equal((await sheetLoad('src/lib/sheet.ts').saveToSheet('order', { name: 'Test' })).saved, false);
assert.equal(posts, 1, 'A dropped response must not cause duplicate automatic submissions');
console.log('Form checks passed: all three APIs, consent round trip, product choices, trusted prices, validation, request limits, cross-origin rejection, unavailable/failure states, email fallback and duplicate prevention. No real messages sent.');
