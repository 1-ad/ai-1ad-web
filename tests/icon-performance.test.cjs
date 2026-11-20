const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const inline = file => read(file).match(/<script>([\s\S]*?)<\/script>/)[1];

function imageData(width, height, seed = 0) {
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < data.length; i++) data[i] = (i * 37 + seed * 71 + (i % 13) * 29) % 256;
    return {width, height, data};
}
function canvas(width, height, seed) {
    const surface = {width, height, reads: 0, allocations: 0, pixels: imageData(width, height, seed)};
    surface.getContext = () => ({
        getImageData() { surface.reads++; return {...surface.pixels, data: surface.pixels.data.slice()}; },
        createImageData(w, h) { surface.allocations++; return {width: w, height: h, data: new Uint8ClampedArray(w * h * 4)}; },
        putImageData(pixels) { surface.result = pixels.data.slice(); }
    });
    return surface;
}
function filterFixture(file, sourceSize = [320, 320], mapSize = sourceSize, targetSize = sourceSize) {
    const ctx = vm.createContext({});
    vm.runInContext(read(file), ctx);
    const source = canvas(...sourceSize, 1), map = canvas(...mapSize, 2), target = canvas(...targetSize, 3);
    const filter = new ctx.filters.DisplacementMap(source, map, target, new ctx.filters.Point(), 10, 10, 1, 2);
    return {filter, source, map, target};
}

test('aquarium pixels match the original filter, including shifted edges and changing settings', () => {
    for (const dimensions of [[[320, 320], [320, 320], [320, 320]], [[17, 11], [9, 7], [13, 11]]]) {
        const old = filterFixture('tests/fixtures/displacement-original.js', ...dimensions);
        const current = filterFixture('js/displacement.js', ...dimensions);
        current.filter.cacheMap = true;
        for (const [x, y] of [[0, 0], [1, 0], [319, 0], [321, 0], [1428, 0], [-3, -2], [1.75, -0.5]]) {
            for (const instance of [old, current]) {
                instance.source.pixels = imageData(...dimensions[0], x + y);
                Object.assign(instance.filter.point, {x, y});
                instance.filter.draw();
            }
            assert.deepEqual(current.target.result, old.target.result, `offset ${x},${y}`);
        }
        for (const instance of [old, current]) {
            Object.assign(instance.filter, {scaleX: -4.5, scaleY: 17.2, channelX: 0, channelY: 3});
            instance.filter.draw();
        }
        assert.deepEqual(current.target.result, old.target.result);
        for (const instance of [old, current]) instance.map.pixels = imageData(...dimensions[1], 8);
        current.filter.invalidateMap();
        old.filter.draw(); current.filter.draw();
        assert.deepEqual(current.target.result, old.target.result);
    }
});
test('aquarium reuses scratch buffers and reads the static map once', () => {
    const {filter, source, map, target} = filterFixture('js/displacement.js');
    filter.cacheMap = true;
    for (let frame = 0; frame < 12; frame++) { filter.point.x = frame; filter.draw(); }
    assert.equal(source.reads, 12);
    assert.equal(map.reads, 1);
    assert.equal(target.allocations, 1);
    filter.cacheMap = false;
    filter.draw(); filter.draw();
    assert.equal(map.reads, 3, 'mutable maps remain supported');
});

function runtime(hidden = false) {
    let now = 0, id = 0;
    const timers = new Map(), rafs = new Map(), events = new Map(), documentEvents = new Map(), nodes = new Map();
    const get = selector => {
        if (!nodes.has(selector)) nodes.set(selector, {style: {}, className: '', addEventListener() {}});
        return nodes.get(selector);
    };
    const window = {
        addEventListener(name, callback) { if (!events.has(name)) events.set(name, []); events.get(name).push(callback); },
        dispatchEvent(event) { for (const callback of events.get(event.type) || []) callback(event); if (window['on' + event.type]) window['on' + event.type](event); },
        setTimeout(callback, delay) { const handle = ++id; timers.set(handle, {callback, at: now + Math.max(0, delay || 0)}); return handle; },
        clearTimeout(handle) { timers.delete(handle); },
        requestAnimationFrame(callback) { const handle = ++id; rafs.set(handle, callback); return handle; },
        cancelAnimationFrame(handle) { rafs.delete(handle); }
    };
    const document = {hidden, visibilityState: hidden ? 'hidden' : 'visible', querySelector: get,
        addEventListener(name, callback) { documentEvents.set(name, callback); }};
    const ctx = vm.createContext({window, document, performance: {now: () => now}, console, Event: class {constructor(type) { this.type = type; }}});
    vm.runInContext(read('icons/shared.js'), ctx);
    const advance = milliseconds => {
        const end = now + milliseconds;
        while (true) {
            let first;
            for (const [handle, timer] of timers) if (timer.at <= end && (!first || timer.at < first.timer.at)) first = {handle, timer};
            if (!first) break;
            now = first.timer.at; timers.delete(first.handle); first.timer.callback();
        }
        now = end;
    };
    return {ctx, window, document, timers, rafs, nodes, get, advance,
        frameAt(time) { now = time; const pending = [...rafs.values()]; rafs.clear(); for (const callback of pending) callback(now); },
        visibility(value) { document.hidden = value; document.visibilityState = value ? 'hidden' : 'visible'; documentEvents.get('visibilitychange')(); }
    };
}

test('24 fps renderer preserves its 42 ms cadence at different display refresh rates', () => {
    for (const hz of [60, 120, 144]) {
        const t = runtime(); t.ctx.adCanAnimate = true;
        let frames = 0;
        const renderer = t.ctx.renderEngine({frameRate: 24, renderAR: [() => frames++]});
        renderer.start();
        for (let frame = 1; frame <= hz * 10; frame++) t.frameAt(frame * 1000 / hz);
        assert.equal(renderer.frameDelay, 42);
        assert.equal(frames, 239); // Initial draw plus floor(10000 / 42).
        assert.equal(t.rafs.size, 1);
        renderer.pause(); assert.equal(t.rafs.size, 0);
        t.frameAt(20000); assert.equal(frames, 239);
        renderer.resume(); renderer.resume(); assert.equal(t.rafs.size, 1);
        t.frameAt(20041); assert.equal(frames, 239);
        t.frameAt(20042); assert.equal(frames, 240);
        renderer.stop(); assert.equal(t.rafs.size, 0);
        renderer.resume(); assert.equal(t.rafs.size, 0);
    }
});
test('long frame stalls do not fast-forward animation or create multiple loops', () => {
    const t = runtime(); t.ctx.adCanAnimate = true;
    let frames = 0;
    const renderer = t.ctx.renderEngine({frameRate: 24, renderAR: [() => frames++]});
    renderer.start(); t.frameAt(5000);
    assert.equal(frames, 2); assert.equal(t.rafs.size, 1);
    t.ctx.adCanAnimate = false; t.window.dispatchEvent(new t.ctx.Event('adPause'));
    assert.equal(t.rafs.size, 0);
});
test('timers preserve remaining delays across repeated pauses and remove completed callbacks', () => {
    const t = runtime(); let calls = 0;
    t.ctx.requestTimeout(() => calls++, 1000);
    t.advance(350); t.ctx.pauseAllTimeouts(); t.advance(5000); t.ctx.pauseAllTimeouts();
    assert.equal(calls, 0); assert.equal(t.timers.size, 0);
    t.ctx.resumeAllTimeouts(); t.ctx.resumeAllTimeouts(); t.advance(649); assert.equal(calls, 0);
    t.advance(1); assert.equal(calls, 1); assert.equal(t.ctx.timeoutAR.length, 0);
    t.ctx.resumeAllTimeouts(); t.advance(1000); assert.equal(calls, 1);
    const cancelled = t.ctx.requestTimeout(() => calls++, 0); cancelled.clear(); t.advance(0); assert.equal(calls, 1);
});
test('office lights retain their original sequence without retaining completed timers', () => {
    const t = runtime(), changes = [];
    for (const selector of ['#light1', '#light2']) {
        let current;
        Object.defineProperty(t.get(selector), 'className', {get: () => current, set(value) { current = value; changes.push([selector, value]); }});
    }
    vm.runInContext(inline('icons/officetower/index.html'), t.ctx);
    t.ctx.doLights(); t.advance(750);
    assert.deepEqual(changes, [['#light1', 'light fadein trans250'], ['#light1', 'light fadeout trans250'], ['#light2', 'light fadein trans250'], ['#light2', 'light fadeout trans250']]);
    t.advance(59250);
    assert.equal(t.ctx.timeoutAR.length, 2);
    assert.equal(t.timers.size, 2);
});
test('hidden startup, viewport pausing, hover and the 60-second stop still work', () => {
    const t = runtime(true);
    let frames = 0;
    t.ctx.initEffects = () => t.ctx.renderEngine({frameRate: 24, renderAR: [() => frames++]}).start();
    vm.runInContext(inline('icons/officetower/index.html'), t.ctx);
    t.window.dispatchEvent(new t.ctx.Event('load'));
    t.advance(1000); assert.equal(frames, 1); assert.equal(t.timers.size, 0); assert.equal(t.rafs.size, 0);
    t.visibility(false); t.advance(250); assert.equal(t.ctx.adCanAnimate, true); assert.equal(t.rafs.size, 1);
    t.ctx.adInViewUpdate(false); assert.equal(t.rafs.size, 0); assert.equal(t.timers.size, 0);
    t.advance(1000); t.ctx.adInViewUpdate(true); assert.equal(t.rafs.size, 1);
    t.advance(60000); assert.equal(t.ctx.adCanAnimate, false); assert.equal(t.rafs.size, 0);
    t.ctx.onAdMouseOver(); assert.equal(t.ctx.adCanAnimate, true);
    t.visibility(true); assert.equal(t.ctx.adCanAnimate, false); assert.equal(t.rafs.size, 0); assert.equal(t.timers.size, 0);
});

test('rocket easing and rendered rotation match the original, with one cached DOM reference', () => {
    function rocket(source) {
        let lookups = 0, writes = 0;
        const style = new Proxy({}, {set(object, key, value) { writes++; object[key] = value; return true; }});
        const element = {style};
        const ctx = vm.createContext({window: {}, adCanAnimate: true, gEL() { lookups++; return element; }});
        vm.runInContext(source, ctx);
        ctx.shipElement = element;
        return {ctx, style, counts: () => ({lookups, writes})};
    }
    const old = rocket(read('tests/fixtures/rocket-original.js'));
    const current = rocket(inline('icons/rocketship/index.html'));
    for (const target of [0, 0.5, -0.5, 0.1, 0]) {
        for (let i = 0; i < 120; i++) {
            for (const instance of [old, current]) { instance.ctx.onMouseUpdate({mouseRatioX: target}); instance.ctx.onUpdateShip(); }
            assert.equal(current.ctx.shipRad, old.ctx.shipRad);
            assert.equal(current.style.transform, old.style.transform);
        }
    }
    assert.equal(current.counts().lookups, 0);
    assert(current.counts().writes < old.counts().writes / 5);
});

function homepage(withObserver = true) {
    const nodes = new Map(), notifications = [], mouse = [];
    const pendingFrames = new Map(); let nextFrame = 0;
    let observer, reads = 0;
    const get = selector => {
        if (!nodes.has(selector)) nodes.set(selector, {
            id: selector.slice(1), style: {}, offsetTop: 2000, offsetLeft: 0, offsetWidth: 160, offsetHeight: 200, offsetParent: null,
            contentWindow: {adInViewUpdate(value) { notifications.push([selector, value]); }, onMouseUpdate(value) { mouse.push(value); }},
            listeners: {}, addEventListener(name, callback) { this.listeners[name] = callback; },
            getBoundingClientRect() { reads++; return {top: this.offsetTop, left: 0, width: 160, height: 200}; }
        });
        return nodes.get(selector);
    };
    const window = {addEventListener() {}, pageXOffset: 0, pageYOffset: 0, innerWidth: 1280, innerHeight: 720,
        requestAnimationFrame(callback) { const id = ++nextFrame; pendingFrames.set(id, callback); return id; },
        cancelAnimationFrame(id) { pendingFrames.delete(id); }};
    if (withObserver) window.IntersectionObserver = class {constructor(callback) { this.callback = callback; observer = this; } observe() {}};
    const ctx = vm.createContext({window, document: {querySelector: get}, navigator: {}});
    vm.runInContext(read('site/site.js'), ctx);
    ctx.initContactForm = () => {}; ctx.updateWidth = () => {}; ctx.initEChips = () => {};
    window.onload();
    return {ctx, window, get, notifications, mouse, observer, reads: () => reads, pendingFrames,
        flushFrame() { const callbacks = [...pendingFrames.values()]; pendingFrames.clear(); callbacks.forEach(callback => callback()); }};
}
test('icon visibility covers initial load, lazy frame load, resize and full visibility', () => {
    const t = homepage(); assert.equal(t.notifications.length, 4); assert(t.notifications.every(([, visible]) => !visible));
    const frame = t.get('#contact_icon_iframe');
    t.observer.callback([{target: frame, isIntersecting: true, intersectionRatio: 0.5, boundingClientRect: {}}]);
    t.ctx.onMouseMove({clientX: 640, clientY: 300}); assert.equal(t.mouse.length, 0);
    frame.offsetTop = 100;
    t.observer.callback([{target: frame, isIntersecting: true, intersectionRatio: 1, boundingClientRect: {}}]);
    const reads = t.reads();
    for (let i = 0; i < 120; i++) t.ctx.onMouseMove({clientX: 960, clientY: 300});
    assert.equal(t.reads(), reads); assert.equal(t.mouse.length, 120); assert.equal(t.mouse[0].mouseRatioX, 0.25);
    frame.offsetTop = 2000; frame.listeners.load(); assert.equal(t.notifications.at(-1)[1], false);
    frame.offsetTop = 100; t.window.onresize(); assert.equal(t.notifications.at(-1)[1], true);
});
test('scroll-based visibility remains available without IntersectionObserver', () => {
    const t = homepage(false), frame = t.get('#contact_icon_iframe');
    frame.offsetTop = 100; t.ctx.onWindowScroll(); t.flushFrame(); assert.equal(t.notifications.at(-1)[1], true);
    frame.offsetTop = 650; t.ctx.onWindowScroll(); t.flushFrame(); assert.equal(t.notifications.at(-1)[1], false);
});
test('cropped icon containers do not prevent animation and scroll checks are coalesced', () => {
    const t = homepage(), tower = t.get('#clients_icon_iframe');
    tower.offsetTop = 100; tower.offsetWidth = 250; tower.offsetHeight = 250;
    t.observer.callback([{target: tower, isIntersecting: true, intersectionRatio: 0.576, boundingClientRect: {}}]);
    assert.deepEqual(t.notifications.at(-1), ['#clients_icon_iframe', true]);
    const reads = t.reads();
    tower.offsetTop = 500;
    for (let i = 0; i < 120; i++) t.ctx.onWindowScroll();
    assert.equal(t.pendingFrames.size, 1); assert.equal(t.reads(), reads);
    t.flushFrame(); assert.equal(t.reads(), reads + 4);
    assert.equal(t.notifications.filter(([id]) => id === '#clients_icon_iframe').at(-1)[1], false);
});
