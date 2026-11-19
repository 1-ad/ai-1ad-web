var modS_CurrentTab = 1;

var modS_TimeoutAR = [];

var modS_WindowIsLoaded = false;
var modS_IsInView = false;
var modS_IsActive = false;
var modS_AutoPlayDone = false;

var modS_NumOfTabs = 3;
var modS_NumOfPoints = 4;

window.addEventListener("load", onmodS_WindowLoaded);
window.addEventListener("scroll", onmodS_WindowScroll);
window.addEventListener("resize", onmodS_WindowResize);

function onmodS_WindowLoaded() {
    //console.log("onmodS_WindowLoaded()");

    // Sets up the module after the window has finshed loading

    window.removeEventListener("loaded", onmodS_WindowLoaded);

    modS_WindowIsLoaded = true;

    for (var tabNum = 1; tabNum <= modS_NumOfTabs; tabNum++) {
        modS_ResetTab(tabNum);
    }

    onmodS_WindowResize();
    modS_SlideInit();
    modS_NavInit();

    gEL("#mod_s_upper_content").style.visibility = "visible";
    gEL("#mod_s_lower_content").style.visibility = "visible";

    onmodS_WindowScroll();

    if (modS_IsInView && !modS_IsActive) {
        modS_modActive();
    }
}

function onmodS_WindowScroll(e) {
    //console.log("onmodS_WindowScroll(e)");

    // Waits until the module is scrolled into view before starting animation

    var isInView = modElInView(gEL("#mod_s_upper_content1"));
    //console.log("isInView:" + isInView);

    if (isInView) {
        window.removeEventListener("scroll", onmodS_WindowScroll);

        modS_IsInView = true;

        if (modS_WindowIsLoaded && !modS_IsActive) {
            modS_modActive();
        }
    }
}

function onmodS_WindowResize(e) {
    //console.log("onmodS_WindowResize(e)");

    // adjust height of containter to fit absolute content

    var tallestHeight = 0;
    var clientHeight;

    for (var a = 1; a <= modS_NumOfTabs; a++) {
        clientHeight = gEL("#mod_s_lower_content" + a).clientHeight;

        if (clientHeight > tallestHeight) {
            tallestHeight = clientHeight;
        }
    }

    gEL("#mod_s_lower_content").style.height = tallestHeight + "px";
}

function modS_modActive() {
    //console.log("modS_modActive()");

    modS_IsActive = true;

    // show the first tab
    modS_ShowTab(1);

    // start autoplay
    modS_StartAutoPlay();
}

function modS_ResetTab(tabNum) {
    //console.log("modS_ResetTab(" + tabNum + ")");

    // Resets elements to starting styles

    for (var a = 1; a <= modS_NumOfTabs; a++) {
        gEL("#mod_s_upper_content" + a).className = "mod_s_upper_content mod_fadeout";
        gEL("#mod_s_lower_content" + a).className = "mod_s_lower_content mod_fadeout";

        gEL("#mod_s_circle" + a).className = "mod_s_bkgrnd mod_fadeout mod_circle_off";
    }

    // hide points
    for (var a = 1; a <= modS_NumOfPoints; a++) {
        gEL("#mod_s_points_tab" + tabNum + "_pt" + a).className = "mod_s_points_row mod_s_points_off mod_fadeout";
    }
}

function modS_ShowTab(tabNum, dontRelay) {
    console.log("modS_ShowTab(" + tabNum + ", " + dontRelay + ")");

    // Shows new tab content

    modS_ClearAllTimeouts();
    onmodS_WindowResize();

    var delay = 0;
    var modS_OldTabNum;

    if (modS_CurrentTab) {
        // hide old tab content
        gEL("#mod_s_upper_content" + modS_CurrentTab).className = "mod_s_upper_content mod_fadeout mod_trans250";
        gEL("#mod_s_lower_content" + modS_CurrentTab).className = "mod_s_lower_content mod_fadeout mod_trans250";

        // reset nav button
        gEL("#mod_s_nav_" + modS_CurrentTab).className = "mod_s_nav";

        delay += 250;

        modS_OldTabNum = modS_CurrentTab;

        var resetTO = setTimeout(modS_ResetTab, delay, modS_CurrentTab);
        modS_TimeoutAR.push(resetTO);
    }

    modS_CurrentTab = tabNum;

    modS_ResetTab(modS_CurrentTab);

    // select nav button
    gEL("#mod_s_nav_" + modS_CurrentTab).className = "mod_s_nav mod_s_nav_selected";

    // show bkgrnd image
    modS_LorySlider.setSlideSpeed(750);
    modS_LorySlider.slideTo(modS_CurrentTab - 1);

    // show upper copy block
    delay += 0;
    var to1 = setTimeout(function () {
        gEL("#mod_s_upper_content" + modS_CurrentTab).className = "mod_s_upper_content mod_fadein mod_trans500";
    }, delay);
    modS_TimeoutAR.push(to1);

    // show lower copy block
    delay += 500;
    var to2 = setTimeout(function () {
        gEL("#mod_s_lower_content" + modS_CurrentTab).className = "mod_s_lower_content mod_fadein mod_trans500";
    }, delay);
    modS_TimeoutAR.push(to2);

    // show each bullet point
    var to3;
    for (var a = 1; a <= modS_NumOfPoints; a++) {
        delay += 250;
        to2 = setTimeout(modS_ShowBullet, delay, modS_CurrentTab, a);
        modS_TimeoutAR.push(to3);
    }

    // show background circle
    delay += 500;
    var to4 = setTimeout(function () {
        gEL("#mod_s_circle" + modS_CurrentTab).className = "mod_s_bkgrnd mod_fadein mod_circle_on mod_trans500";
    }, delay);
    modS_TimeoutAR.push(to4);

    if (dontRelay != true) {
        modW_ShowTab(tabNum, true);
    }
}

function modS_ShowBullet(tabNum, pointNum) {
    //console.log("modS_ShowBullet("+tabNum+","+pointNum+")");

    // slide and fade bullet point
    gEL("#mod_s_points_tab" + tabNum + "_pt" + pointNum).className = "mod_s_points_row mod_s_points_on mod_fadein mod_trans500out";
}

///////////////////////
// NAV BUTTONS
///////////////////////

function modS_NavInit() {
    //console.log("modS_NavInit()");

    gEL("#mod_s_nav_1").addEventListener("click", onModS_Nav1Click);
    gEL("#mod_s_nav_2").addEventListener("click", onModS_Nav2Click);
    gEL("#mod_s_nav_3").addEventListener("click", onModS_Nav3Click);
}

function onModS_Nav1Click() {
    modS_CancelAutoPlay();
    modS_ShowTab(1);
}

function onModS_Nav2Click() {
    modS_CancelAutoPlay();
    modS_ShowTab(2);
}

function onModS_Nav3Click() {
    modS_CancelAutoPlay();
    modS_ShowTab(3);
}

///////////////////////
// AUTO PLAY
///////////////////////

var modS_AutoPlayTO;
var modS_CurrentAutoPlayNum;

var modS_AutoPlayTime = 5000;

function modS_StartAutoPlay() {
    //console.log("modS_StartAutoPlay()");

    // start autoplay

    if (modS_AutoPlayDone != true) {
        modS_CurrentAutoPlayNum = 1;

        modS_CancelAutoPlay();
        modS_AutoPlayTO = setTimeout(modS_DoAutoPlay, modS_AutoPlayTime);
    }
}

function modS_DoAutoPlay() {
    //console.log("modS_DoAutoPlay()");

    // autoplay to next tab

    modS_CurrentAutoPlayNum++;

    if (modS_CurrentAutoPlayNum > modS_NumOfTabs) {
        modS_CurrentAutoPlayNum = 1;
    } else {
        modS_CancelAutoPlay();
        modS_AutoPlayTO = setTimeout(modS_DoAutoPlay, modS_AutoPlayTime);
    }

    modS_ShowTab(modS_CurrentAutoPlayNum);
}

function modS_CancelAutoPlay(dontRelay) {
    //console.log("modS_CancelAutoPlay(" + dontRelay + ")");

    // cancel autoplay

    modS_AutoPlayDone = true;

    if (dontRelay != true) {
        modW_CancelAutoPlay(true);
    }

    clearTimeout(modS_AutoPlayTO);
}

///////////////////////
// DRAG SLIDER
///////////////////////

var modS_LorySlider;

var modS_TabIsChanged = false;
var modS_ContentIsHidden = false;

var modS_TouchDown = false;
var modS_TouchX;

function modS_SlideInit() {
    //console.log("modS_SlideInit()");

    modS_LorySlider = lory(gEL("#mod_s_bkgrnd"), {
        enableMouseEvents: true,
        slideSpeed: 500
    });

    gEL("#mod_s_bkgrnd").addEventListener("touchstart", modS_TouchStart);
    gEL("#mod_s_bkgrnd").addEventListener("mousedown", modS_TouchStart);

    gEL("#mod_s_bkgrnd").addEventListener("touchend", modS_TouchEnd);
    gEL("#mod_s_bkgrnd").addEventListener("mouseup", modS_TouchEnd);

    gEL("#mod_s_bkgrnd").addEventListener("touchmove", modS_TouchMove);
    gEL("#mod_s_bkgrnd").addEventListener("mousemove", modS_TouchMove);

    gEL("#mod_s_bkgrnd").addEventListener("on.lory.touchstart", modS_DotEvent);
    gEL("#mod_s_bkgrnd").addEventListener("on.lory.touchend", modS_DotEvent);
    gEL("#mod_s_bkgrnd").addEventListener("after.lory.slide", modS_DotEvent);
    gEL("#mod_s_bkgrnd").addEventListener("on.lory.resize", modS_DotEvent);
}

function modS_TouchStart(e) {
    //console.log("modS_TouchStart(e)");

    var mouseX = e.clientX;
    if (!mouseX && e.touches) {
        mouseX = e.touches[0].clientX;
    }

    if (!mouseX) {
        mouseX = 0;
    }

    modS_TouchDown = true;
    modS_TouchX = mouseX;

    //console.log("START: " + modS_TouchX);
}

function modS_TouchEnd(e) {
    //console.log("modS_TouchEnd(e)");

    modS_TouchDown = false;
}

function modS_TouchMove(e) {
    //console.log("modS_TouchMove(e)");

    if (modS_TouchDown == true) {
        var mouseX = e.clientX;
        if (!mouseX && e.touches) {
            mouseX = e.touches[0].clientX;
        }
        if (!mouseX) {
            modS_TouchX++;
        }

        var moveAmt = Math.ceil(Math.abs(modS_TouchX - mouseX));
        //console.log("moveAmt: " + moveAmt);

        if (moveAmt > 5) {
            e.preventDefault();
        }

        if (moveAmt > 20) {
            modS_ContentIsHidden = true;
            gEL("#mod_s_upper_content" + modS_CurrentTab).className = "mod_s_upper_content mod_fadeout mod_trans250";
            gEL("#mod_s_lower_content" + modS_CurrentTab).className = "mod_s_lower_content mod_fadeout mod_trans250";
        }
    }
}

function modS_DotEvent(e) {
    if (e.type === "on.lory.touchstart") {
        modS_SlideStart();
    }
    if (e.type === "on.lory.touchend") {
        modS_SlideEnd();
    }
    if (e.type === "after.lory.slide") {
        modS_SlideChanged();
    }
    if (e.type === "after.lory.slide") {
        modS_SlideChanged();
    }
    if (e.type === "on.lory.resize") {
        modS_LorySlider.setSlideSpeed(0);
        modS_LorySlider.slideTo(modS_CurrentTab - 1);
    }
}

function modS_SlideStart() {
    //console.log("modS_SlideStart()");

    modS_CancelAutoPlay();

    modS_TabIsChanged = false;
    modS_ContentIsHidden = false;

    modS_TouchX = 0;

    modS_LorySlider.setSlideSpeed(300);
}

function modS_SlideChanged() {
    //console.log("modS_SlideChanged()");

    var newTab = modS_LorySlider.returnIndex() + 1;
    //console.log("newTab:" + newTab);

    if (newTab != modS_CurrentTab) {
        modS_TabIsChanged = true;
        modS_ShowTab(newTab);
    }
}

function modS_SlideEnd() {
    //console.log("modS_SlideEnd()");

    modS_TouchDown = false;

    if (modS_TabIsChanged != true) {
        gEL("#mod_s_upper_content" + modS_CurrentTab).className = "mod_s_upper_content mod_fadein mod_trans500";
        gEL("#mod_s_lower_content" + modS_CurrentTab).className = "mod_s_lower_content mod_fadein mod_trans500";
    } else {
        modS_TabIsChanged = false;
    }
}

///////////////////////
// HELPERS
///////////////////////

function modS_ClearAllTimeouts() {
    //console.log("modS_ClearAllTimeouts()");

    // kill all delayed animations

    for (var a in modS_TimeoutAR) {
        clearTimeout(modS_TimeoutAR[a]);
    }

    modS_TimeoutAR = [];
}

///////////////////////
// SHARED
///////////////////////

function gEL(id) {
    return document.querySelector(id);
}

function modElInView(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    if (top + left + width + height < 1) {
        return false;
    }

    return (
        top >= window.pageYOffset &&
        left >= window.pageXOffset &&
        (top + height) <= (window.pageYOffset + window.innerHeight) &&
        (left + width) <= (window.pageXOffset + window.innerWidth)
    );
}
