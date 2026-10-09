const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = html.match(/<script id="webAnalytics">([\s\S]*?)<\/script>/)[1];
const testToken = '0123456789abcdef0123456789abcdef';

function run({token = testToken, protocol = 'https:', hostname = 'jazzcertify.cilabworks.com',
              dnt, windowDnt, gpc, existing = false, appendFails = false} = {}) {
  const appended = [];
  const notice = {hidden: true};
  const document = {
    querySelector: () => existing ? {} : null,
    createElement(tag) {
      assert.equal(tag, 'script');
      return {attributes: {}, setAttribute(name, value) { this.attributes[name] = value; }};
    },
    body: {appendChild(script) {
      if (appendFails) throw new Error('insertion unavailable');
      appended.push(script);
    }},
    getElementById: () => notice,
  };
  const context = {document, location: {protocol, hostname},
    navigator: {doNotTrack: dnt, globalPrivacyControl: gpc}, window: {doNotTrack: windowDnt}};
  // The loader must not read saved game data, cookies or send its own requests.
  for (const key of ['localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest']) {
    Object.defineProperty(context, key, {get() { throw new Error(`unexpected ${key} access`); }});
  }
  Object.defineProperty(document, 'cookie', {get() { throw new Error('unexpected cookie access'); }});
  vm.runInNewContext(source.replace(/const CF_WEB_ANALYTICS_TOKEN = "[^"]*";/,
    `const CF_WEB_ANALYTICS_TOKEN = ${JSON.stringify(token)};`), context);
  return {appended, notice};
}

test('all inline JavaScript parses', () => {
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
});

test('an unconfigured token keeps analytics offline', () => {
  assert.equal(run({token: ''}).appended.length, 0);
});

test('no analytics outside the configured HTTPS production host', () => {
  for (const options of [{protocol: 'file:', hostname: ''}, {protocol: 'http:', hostname: 'localhost'},
    {hostname: '127.0.0.1'}, {hostname: 'ranats.github.io'},
    {hostname: 'jazzcertify.cilabworks.com.example.org'}, {protocol: 'http:'}]) {
    const result = run(options);
    assert.equal(result.appended.length, 0);
    assert.equal(result.notice.hidden, true);
  }
});

test('invalid site identifiers, DNT and GPC produce no script requests', () => {
  for (const options of [{token: 'not-a-site-token'}, {dnt: '1'}, {windowDnt: '1'}, {gpc: true}]) {
    assert.equal(run(options).appended.length, 0);
  }
});

test('production loads one asynchronous official module with SPA measurement disabled', () => {
  const {appended, notice} = run();
  assert.equal(appended.length, 1);
  const script = appended[0];
  assert.equal(script.type, 'module');
  assert.equal(script.async, true);
  assert.equal(script.src, 'https://static.cloudflareinsights.com/beacon.min.js');
  assert.equal(script.referrerPolicy, 'origin');
  assert.deepEqual(JSON.parse(script.attributes['data-cf-beacon']), {token: testToken, spa: false});
  assert.equal(notice.hidden, false);
});

test('an existing beacon is not installed twice', () => {
  assert.equal(run({existing: true}).appended.length, 0);
});

test('analytics insertion failure does not escape into the game', () => {
  assert.doesNotThrow(() => run({appendFails: true}));
  assert.equal(run({appendFails: true}).notice.hidden, true);
});
