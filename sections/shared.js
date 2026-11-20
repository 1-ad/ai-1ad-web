// Icon runtime. Legacy demos continue using js/shared.js.
function getIconImage(source) {
    return gEL('img[data-icon-asset="' + source + '"]');
}
function initializeIcon(setup) {
    // Eager image elements load with the iframe. Decode every sprite and CSS
    // layer before building particles and drawing the complete initial frame.
    var assets = document.querySelectorAll("img[data-icon-asset]");
    return Promise.all(Array.prototype.map.call(assets, function (asset) {
        if (!asset.complete || !asset.naturalWidth) {
            return Promise.reject(new Error("Icon image did not load: " + asset.getAttribute("src")));
        }
        return typeof asset.decode === "function" ? asset.decode() : Promise.resolve();
    })).then(function () {
        setup();
        adIsReady = true;
        // Preparation and the first draw also happen offscreen. Only the
        // animation loop and timed light sequence depend on viewport visibility.
        gEL("#banner").className = "adsize fadein";
        adStart();
    }).catch(function (error) {
        console.error("Unable to initialize icon:", error);
    });
}
var windowIsVisible=false;var adIsInView=window.parent===window;var adIsReady=false;var adMouseOver=false;var adTimerRunning=false;var adIsStarted=false;var adCanAnimate=false;var adTimerTO;var adResetTO;window.addEventListener("load",function(){gEL("#banner").addEventListener("mousedown",onAdMouseDown);gEL("#banner").addEventListener("mouseover",onAdMouseOver);gEL("#banner").addEventListener("mouseout",onAdMouseOut);checkWindowVisibility()});function windowScroll(){adMouseOver=false;clearRequestTimeout(adResetTO);adResetTO=requestTimeout(adTimerReset,100);adStatusUpdated()}function adInViewUpdate(a){if(adIsInView!=a){adIsInView=a;if(adIsInView==true){adTimerReset()}adStatusUpdated()}}function onAdMouseDown(a){adMouseOver=true;adStatusUpdated()}function onAdMouseOver(a){adMouseOver=true;adStatusUpdated()}function onAdMouseOut(a){adMouseOver=false;clearRequestTimeout(adResetTO);adResetTO=requestTimeout(adTimerReset,100)}function adStatusUpdated() {
    // Once started, an icon keeps animating until it leaves the viewport or
    // the page becomes hidden, even after the legacy 60-second timer expires.
    if (windowIsVisible && adIsInView && (adIsStarted || adTimerRunning || adMouseOver)) {
        if (!adIsStarted) adStart();
        else if (!adCanAnimate) adResume();
    } else if (adCanAnimate) {
        adPause();
    } else if (!windowIsVisible || !adIsInView) {
        // Also pause startup/light timers before the first animation frame.
        pauseAllTimeouts();
    } else if (!adIsStarted) {
        resumeAllTimeouts();
    }
}
function adStart(){if(adIsReady&&adIsStarted==false){adIsStarted=true;window.dispatchEvent(new Event("adStart"));adTimerReset();adStatusUpdated()}}function adResume(){if(adCanAnimate==false){adCanAnimate=true;window.dispatchEvent(new Event("adResume"));resumeAllTimeouts();adTimerReset();adStatusUpdated()}}function adPause(){if(adCanAnimate==true){adCanAnimate=false;window.dispatchEvent(new Event("adPause"));clearRequestTimeout(adTimerTO);pauseAllTimeouts();adStatusUpdated()}}function adTimerReset(a){adTimerRunning=true;if(a!=undefined){adMaxTime=a}clearRequestTimeout(adTimerTO);adTimerTO=requestTimeout(adTimeUp,adMaxTime);adStatusUpdated()}function adTimeUp(){adTimerRunning=false;adStatusUpdated()}var timeoutAR=[];function requestTimeout(callback, delay) {
    var timer = {
        id: Math.random(), callbackFN: callback, delayMS: delay,
        remainMS: delay, startMS: 0, timerTO: null, done: false
    };
    timer.pause = function () {
        if (timer.done || timer.timerTO === null) return;
        window.clearTimeout(timer.timerTO);
        timer.timerTO = null;
        timer.remainMS = Math.max(0, timer.remainMS - (performance.now() - timer.startMS));
    };
    timer.resume = function () {
        if (timer.done || timer.timerTO !== null) return;
        timer.startMS = performance.now();
        timer.timerTO = window.setTimeout(function () {
            timer.clear();
            callback.call(window);
        }, timer.remainMS);
    };
    timer.clear = function () {
        window.clearTimeout(timer.timerTO);
        timer.timerTO = null;
        timer.done = true;
        var index = timeoutAR.indexOf(timer);
        if (index !== -1) timeoutAR.splice(index, 1);
    };
    timeoutAR.push(timer);
    if (!document.hidden && adIsInView) timer.resume();
    return timer;
}
function clearAllRequestTimeouts(){var b=timeoutAR.length;while(b--){timeoutAR[b].clear()}timeoutAR=[]}function clearRequestTimeout(a){if(a){a.clear()}}function pauseAllTimeouts(){var b=timeoutAR.length;while(b--){timeoutAR[b].pause()}}function resumeAllTimeouts(){var b=timeoutAR.length;while(b--){timeoutAR[b].resume()}}function gIndex(e,c,d){for(var b in e){if(e[b][c]===d){return b}}return -1}var vis=(function(){var c,a,b={hidden:"visibilitychange",webkitHidden:"webkitvisibilitychange",mozHidden:"mozvisibilitychange",msHidden:"msvisibilitychange"};for(c in b){if(c in document){a=b[c];break}}return function(d){if(d){document.addEventListener(a,d)}return !document[c]}})();vis(function(){if(vis()){windowIsVisible=true;adStatusUpdated()}else{windowIsVisible=false;adStatusUpdated()}});function checkWindowVisibility(){if(document.visibilityState=="hidden"){windowIsVisible=false;adStatusUpdated()}else{windowIsVisible=true;adStatusUpdated()}}function renderEngine(options) {
    var renderer = options;
    // Keep the original rounded interval (42 ms at 24 fps) and frame-based motion.
    renderer.frameDelay = Math.round(1000 / renderer.frameRate);
    renderer.frameRequest = null;
    renderer.renderStarted = false;
    renderer.isRendering = false;
    renderer.lastFrameTime = 0;
    renderer.pause = function () {
        if (renderer.frameRequest !== null) {
            window.cancelAnimationFrame(renderer.frameRequest);
            renderer.frameRequest = null;
        }
    };
    renderer.resume = function () {
        renderer.pause();
        if (!renderer.renderStarted || !adCanAnimate) return;
        renderer.lastFrameTime = performance.now();
        renderer.frameRequest = window.requestAnimationFrame(renderer.onFrame);
    };
    renderer.onFrame = function (timestamp) {
        renderer.frameRequest = null;
        if (!renderer.renderStarted || !adCanAnimate) return;
        var elapsed = timestamp - renderer.lastFrameTime;
        if (elapsed >= renderer.frameDelay) {
            // Preserve cadence without replaying missed frames after a long stall.
            renderer.lastFrameTime = timestamp - (elapsed % renderer.frameDelay);
            renderer.doRender();
        }
        if (renderer.renderStarted && adCanAnimate) {
            renderer.frameRequest = window.requestAnimationFrame(renderer.onFrame);
        }
    };
    renderer.doRender = function () {
        if (renderer.isRendering) return;
        renderer.isRendering = true;
        if (renderer.showRenderTime) console.time("render");
        try {
            for (var i = 0; i < renderer.renderAR.length; i++) renderer.renderAR[i]();
        } finally {
            if (renderer.showRenderTime) console.timeEnd("render");
            renderer.isRendering = false;
        }
    };
    renderer.start = function () {
        renderer.pause();
        renderer.renderStarted = true;
        renderer.doRender();
        renderer.resume();
    };
    renderer.stop = function () {
        renderer.renderStarted = false;
        renderer.pause();
    };
    renderer.onAdPause = renderer.pause;
    renderer.onAdResume = renderer.resume;
    window.addEventListener("adPause", renderer.onAdPause);
    window.addEventListener("adResume", renderer.onAdResume);
    return renderer;
}
function gEL(a){return document.querySelector(a)}function randRange(b,a){return Math.floor(Math.random()*(a-b+1))+b}function ab(){return Math.random()<0.5?-1:1}function getClippedRegion(f,b,g,d,a){var e=document.createElement("canvas");var c=e.getContext("2d");e.width=d;e.height=a;c.drawImage(f,b,g,d,a,0,0,d,a);return e}function easeLinear(e,a,g,f){return g*e/f+a}function easeInOutQuad(e,a,g,f){if((e/=f/2)<1){return g/2*e*e+a}return -g/2*((--e)*(e-2)-1)+a}function easeInQuad(e,a,g,f){return g*(e/=f)*e+a}function easeOutQuad(e,a,g,f){return -g*(e/=f)*(e-2)+a}function easeInQuint(e,a,g,f){return g*(e/=f)*e*e*e*e+a}function rect(a,d,b,c){return{x:a,y:d,width:b,height:c}}function rectOverlap(b,a){if(b.x<a.x+a.width&&b.x+b.width>a.x&&b.y<a.y+a.height&&b.height+b.y>a.y){return true}else{return false}};
