var siteURL="/";var chipWidth=322;var iframeAR;var iconAR;var isDynamic=false;window.onload=function(){initContactForm();updateWidth();iframeAR=[];iframeAR.push("loops_icon_iframe");iframeAR.push("effects_icon_iframe");iframeAR.push("clients_icon_iframe");iframeAR.push("contact_icon_iframe");iconAR=[];iconAR.push("contact_icon_iframe");if(isDynamic){loadEChipsData("loops");loadEChipsData("effects");loadCChipsData("projects_banners");loadCChips2Data("projects_preroll");loadCChips2Data("projects_mobile")}if(!isDynamic){initEChips()}gEL("#wrapper").style.visibility="visible";initIconVisibility()};var effectIFrameAR=["eChip0_iframe","eChip1_iframe","eChip2_iframe","eChip3_iframe"];var effectDataAR=["loops/snowflakes","loops/rainfall","loops/silversparkles","loops/colorizeimage","effects/shatterparticle","effects/pixelexplode","effects/beerbubbles","effects/steaminghot"];function initEChips(){var c="ROLLOVER TO ANIMATE";if(supportsTouch){c="TAP TO ANIMATE"}var d,e;for(var b in effectIFrameAR){d=effectIFrameAR[b].split("")[5];e="#eChip"+d;gEL("#eChip"+d+"_instruct").innerHTML=c;gEL(e).addEventListener("mousedown",onEChipOver);gEL(e).addEventListener("mouseover",onEChipOver)}}function onEChipOver(d){var a=d.target.id.split("")[5];var c="#eChip"+a;var b=effectDataAR[a];gEL(c+"_instruct").className="text eChip_instruct eChip_instruct_off trans250in";gEL(c).removeEventListener("mousedown",onEChipOver);gEL(c).removeEventListener("mouseover",onEChipOver);if(typeof gtag==="function"){gtag("event","creative_demo_play",{send_to:"G-24L76YR0Q4",creative_path:b})}}window.onresize=function(){updateWidth();iframeInView(true)};function updateWidth(){var e=20;var c=15;var viewportWidth=document.documentElement.clientWidth;var d=viewportWidth-c-e;var b=Math.max(1,Math.floor(d/chipWidth));if(b>4){b=4}var a=Math.min((b*chipWidth)+e,viewportWidth);gEL("#content_area").style.width=a+"px";if(b==1){gEL("#content_list_ul").className="columns1"}else{gEL("#content_list_ul").className="columns2"}resizeContactForm(b)}window.addEventListener("scroll",onWindowScroll);window.addEventListener("touchmove",onWindowScroll);window.addEventListener("mousemove",onMouseMove);function onMouseMove(event) {
    if (!pointerIconState || !pointerIconState.inView) return;
    var frame = pointerIconState.element;
    try {
        if (typeof frame.contentWindow.onMouseUpdate !== "function") return;
        frame.contentWindow.onMouseUpdate({
            windowWidth: window.innerWidth, windowHeight: window.innerHeight,
            mouseX: event.clientX, mouseY: event.clientY,
            mouseRatioX: event.clientX / window.innerWidth - 0.5,
            isInView: true, iframeRect: pointerIconState.rect
        });
    } catch (error) {}
}
function onWindowScroll(f){try{var d;for(var b in effectIFrameAR){d=gEL("#"+effectIFrameAR[b]);if(d&&typeof d.contentWindow.windowScroll==="function"){d.contentWindow.windowScroll()}}}catch(c){}iframeInView()}var iconFrameStates = [];
var iconVisibilityObserver;
var pointerIconState;
var iconVisibilityRequest = null;
function updateIconVisibility(state, inView, rect) {
    state.inView = inView;
    state.rect = rect;
    try {
        var callback = state.element.contentWindow.adInViewUpdate;
        if (typeof callback === "function") callback(inView);
    } catch (error) {}
}
function refreshIconVisibility(state) {
    updateIconVisibility(state, elInView(state.element), state.element.getBoundingClientRect());
}
function initIconVisibility() {
    if (typeof window.IntersectionObserver === "function") {
        iconVisibilityObserver = new window.IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                for (var i = 0; i < iconFrameStates.length; i++) {
                    var state = iconFrameStates[i];
                    if (state.element === entry.target) {
                        // The tower and hat containers crop their iframes, so their
                        // intersection ratios cannot reach 1. Keep the original
                        // viewport geometry test instead of using that ratio.
                        refreshIconVisibility(state);
                        break;
                    }
                }
            });
        }, {threshold: [0, 1]});
    }
    for (var i = 0; i < iframeAR.length; i++) {
        var element = gEL("#" + iframeAR[i]);
        if (!element) continue;
        var state = {element: element, inView: false, rect: null};
        iconFrameStates.push(state);
        if (element.id === "contact_icon_iframe") pointerIconState = state;
        (function (frameState) {
            frameState.element.addEventListener("load", function () { refreshIconVisibility(frameState); });
        }(state));
        if (iconVisibilityObserver) iconVisibilityObserver.observe(element);
    }
    iframeInView(true);
}
function iframeInView(force) {
    if (!force) {
        // Scrolling across a cropped edge need not cross an observer threshold.
        // Coalesce scroll events while retaining the existing visibility rule.
        if (iconVisibilityRequest === null) {
            iconVisibilityRequest = window.requestAnimationFrame(function () {
                iconVisibilityRequest = null;
                iframeInView(true);
            });
        }
        return;
    }
    if (iconVisibilityRequest !== null) {
        window.cancelAnimationFrame(iconVisibilityRequest);
        iconVisibilityRequest = null;
    }
    for (var i = 0; i < iconFrameStates.length; i++) refreshIconVisibility(iconFrameStates[i]);
}
function elInView(c){var e=c.offsetTop;var d=c.offsetLeft;var b=c.offsetWidth;var a=c.offsetHeight;while(c.offsetParent){c=c.offsetParent;e+=c.offsetTop;d+=c.offsetLeft}return(e>=window.pageYOffset&&d>=window.pageXOffset&&(e+a)<=(window.pageYOffset+window.innerHeight)&&(d+b)<=(window.pageXOffset+window.innerWidth))}function gEL(a){return document.querySelector(a)}var supportsTouch="ontouchstart" in window||navigator.msMaxTouchPoints;
