import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('the preview loads local assets and explains the simulation without scripting', () => {
  const html = source('index.html');
  assert.match(html, /<script src="script\.js"><\/script>/);
  assert.match(html, /rel="stylesheet" href="styles\.css"/);
  assert.match(html, /<noscript>.*deployment simulation/i);
  assert.match(html, /id="simulation-result"[^>]*role="status"/);
  assert.ok(source('styles.css').length);
});

test('the preview runs once at a time, announces steps, and can be run again', async () => {
  const timers = [];
  const attributes = new Map();
  let click;
  const button = {
    disabled: true,
    addEventListener: (event, handler) => { assert.equal(event, 'click'); click = handler; },
    getAttribute: name => attributes.get(name),
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name),
  };
  const result = { textContent: '' };
  const statuses = Array.from({ length: 3 }, () => ({
    textContent: 'Initial',
    classList: { add() {}, remove() {} },
  }));
  vm.runInNewContext(source('script.js'), {
    document: {
      getElementById: id => ({ 'btn-deploy': button, 'simulation-result': result })[id],
      querySelectorAll: () => statuses,
    },
    setTimeout: callback => timers.push(callback),
  });
  assert.equal(button.disabled, false);
  for (let run = 0; run < 2; run++) {
    const completion = click();
    assert.equal(attributes.get('aria-disabled'), 'true');
    assert.match(result.textContent, /running/i);
    await click();
    for (let i = 0; i < 3; i++) {
      assert.equal(timers.length, 1);
      assert.equal(statuses[i].textContent, 'Simulating');
      timers.shift()();
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(statuses[i].textContent, 'Simulation complete');
    }
    await completion;
    assert.match(result.textContent, /All three demo steps finished/);
    assert.equal(attributes.has('aria-disabled'), false);
  }
});
