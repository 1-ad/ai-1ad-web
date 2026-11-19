var modW_CurrentTab;

var modW_TimeoutAR = [];

var modW_WindowIsLoaded = false;
var modW_IsInView = false;
var modW_IsActive = false;
var modW_AutoPlayDone = false;

var modW_NumOfTabs = 3;
var modW_NumOfPoints = 4;

window.addEventListener("load", onModW_WindowLoaded);
window.addEventListener("scroll", onModW_WindowScroll);

function onModW_WindowLoaded() {
    //console.log("onModW_WindowLoaded()");

    // Sets up the module after the window has finshed loading

    window.removeEventListener("loaded", onModW_WindowLoaded);

    modW_WindowIsLoaded = true;

    for (var tabNum = 1; tabNum <= modW_NumOfTabs; tabNum++) {
        modW_ResetTab(tabNum);
    }

    modW_NavInit();

    gEL("#mod_w_bkgrnd_tab1").className = "mod_w_bkgrnd";
    gEL("#mod_w_content").style.visibility = "visible";

    if (modW_IsInView && !modW_IsActive) {
        modW_modActive();
    }
}

function onModW_WindowScroll() {
    //console.log("onModW_WindowScroll()");

    // Waits until the module is scrolled into view before starting animation

    var isInView = modElInView(gEL("#mod_w_points_tab1_pt1"));
    //console.log("isInView:" + isInView);

    if (isInView) {
        window.removeEventListener("scroll", onModW_WindowScroll);

        modW_IsInView = true;

        if (modW_WindowIsLoaded && !modW_IsActive) {
            modW_modActive();
        }
    }
}

function modW_modActive() {
    //console.log("modW_modActive()");

    modW_IsActive = true;

    // show the first tab
    modW_ShowTab(1);

    // start autoplay
    modW_StartAutoPlay();
}

function modW_ResetTab(tabNum) {
    //console.log("modW_ResetTab(" + tabNum + ")");

    // Resets elements to starting styles

    gEL("#mod_w_msg_tab" + tabNum).className = "mod_w_msg mod_msg_off mod_fadeout";
    gEL("#mod_w_points_tab" + tabNum).className = "mod_w_points mod_w_center mod_fadeout";

    gEL("#mod_w_bkgrnd_tab" + tabNum).className = "mod_w_bkgrnd mod_fadeout";
    gEL("#mod_w_circle_tab" + tabNum).className = "mod_w_bkgrnd mod_fadeout mod_circle_off";

    for (var a = 1; a <= modW_NumOfPoints; a++) {
        gEL("#mod_w_points_tab" + tabNum + "_pt" + a).className = "mod_w_points_row mod_w_points_off mod_fadeout";
    }
}

function modW_ShowTab(tabNum, dontRelay) {
    console.log("modW_ShowTab(" + tabNum + ", " + dontRelay + ")");

    modW_ClearAllTimeouts();

    var delay = 0;
    var modW_oldTabNum;

    if (modW_CurrentTab) {
        // hide old tab content
        gEL("#mod_w_msg_tab" + modW_CurrentTab).className = "mod_w_msg mod_w_center mod_fadeout mod_trans250";
        gEL("#mod_w_points_tab" + modW_CurrentTab).className = "mod_w_points mod_w_center mod_fadeout mod_trans250";

        // reset nav button
        gEL("#mod_w_btns_arrow" + modW_CurrentTab).style.visibility = "hidden";
        gEL("#mod_w_btns_tab" + modW_CurrentTab).className = "mod_w_btns_btn";

        delay += 250;

        modW_oldTabNum = modW_CurrentTab;

        var resetTO = setTimeout(modW_ResetTab, 250, modW_CurrentTab);
        modW_TimeoutAR.push(resetTO);
    }

    modW_CurrentTab = tabNum;

    modW_ResetTab(modW_CurrentTab);

    // select nav button
    gEL("#mod_w_btns_arrow" + modW_CurrentTab).style.visibility = "visible";
    gEL("#mod_w_btns_tab" + modW_CurrentTab).className = "mod_w_btns_btn mod_w_btns_btn_selected";

    // show bkgrnd image
    if (modW_oldTabNum) {
        // fade out old background
        gEL("#mod_w_bkgrnd_tab" + modW_oldTabNum).className = "mod_w_bkgrnd mod_fadeout mod_trans500";
        gEL("#mod_w_circle_tab" + modW_oldTabNum).className = "mod_w_bkgrnd mod_fadeout mod_trans500";

        // fade in new background
        gEL("#mod_w_bkgrnd_tab" + modW_CurrentTab).className = "mod_w_bkgrnd mod_fadein mod_trans500";
    } else {

        // first time the background doesn't fade in
        gEL("#mod_w_bkgrnd_tab" + modW_CurrentTab).className = "mod_w_bkgrnd mod_fadein";
    }

    // show main copy block
    delay += 0;
    var to1 = setTimeout(function () {
        gEL("#mod_w_msg_tab" + modW_CurrentTab).className = "mod_w_msg mod_w_center mod_fadein mod_trans500out";
        gEL("#mod_w_points_tab" + modW_CurrentTab).className = "mod_w_points mod_w_center";
    }, delay);
    modW_TimeoutAR.push(to1);

    // show each bullet point
    var to2;
    for (var a = 1; a <= modW_NumOfPoints; a++) {
        delay += 250;
        to2 = setTimeout(modW_ShowBullet, delay, modW_CurrentTab, a);
        modW_TimeoutAR.push(to2);
    }

    // show background circle
    delay += 500;
    var to3 = setTimeout(function () {
        gEL("#mod_w_circle_tab" + modW_CurrentTab).className = "mod_w_bkgrnd mod_fadein mod_circle_on mod_trans500";
    }, delay);
    modW_TimeoutAR.push(to3);

    if (dontRelay != true) {
        modS_ShowTab(tabNum, true);
    }
}

function modW_ShowBullet(tabNum, pointNum) {
    //console.log("modW_ShowBullet("+tabNum+","+pointNum+")");

    // slide and fade bullet point
    gEL("#mod_w_points_tab" + tabNum + "_pt" + pointNum).className = "mod_w_points_row mod_w_points_on mod_fadein mod_trans500out";
}

///////////////////////
// NAV BUTTONS
///////////////////////

function modW_NavInit() {
    //console.log("modW_NavInit()");

    gEL("#mod_w_btns_tab1").addEventListener("click", onModW_Nav1Click);
    gEL("#mod_w_btns_tab2").addEventListener("click", onModW_Nav2Click);
    gEL("#mod_w_btns_tab3").addEventListener("click", onModW_Nav3Click);
}

function onModW_Nav1Click(e) {
    modW_CancelAutoPlay();
    modW_ShowTab(1);
}

function onModW_Nav2Click(e) {
    modW_CancelAutoPlay();
    modW_ShowTab(2);
}

function onModW_Nav3Click(e) {
    modW_CancelAutoPlay();
    modW_ShowTab(3);
}

///////////////////////
// AUTO PLAY
///////////////////////

var modW_AutoPlayTO;
var modW_CurrentAutoPlayNum;

var modW_AutoPlayTime = 5000;

function modW_StartAutoPlay() {
    //console.log("modW_StartAutoPlay()");

    // start autoplay

    if (modW_AutoPlayDone != true) {
        modW_CurrentAutoPlayNum = 1;

        modW_CancelAutoPlay();
        modW_AutoPlayTO = setTimeout(modW_DoAutoPlay, modW_AutoPlayTime);
    }
}

function modW_DoAutoPlay() {
    //console.log("modW_DoAutoPlay()");

    // autoplay to next tab

    modW_CurrentAutoPlayNum++;

    if (modW_CurrentAutoPlayNum > modW_NumOfTabs) {
        modW_CurrentAutoPlayNum = 1;
    } else {
        modW_CancelAutoPlay();
        modW_AutoPlayTO = setTimeout(modW_DoAutoPlay, modW_AutoPlayTime);
    }

    modW_ShowTab(modW_CurrentAutoPlayNum);
}

function modW_CancelAutoPlay(dontRelay) {
    //console.log("modW_CancelAutoPlay(" + dontRelay + ")");

    // cancel autoplay

    modW_AutoPlayDone = true;

    if (dontRelay != true) {
        modS_CancelAutoPlay(true);
    }

    clearTimeout(modW_AutoPlayTO);
}

///////////////////////
// HELPERS
///////////////////////

function modW_ClearAllTimeouts() {
    //console.log("modW_ClearAllTimeouts()");

    // kill all delayed animations

    for (var a in modW_TimeoutAR) {
        clearTimeout(modW_TimeoutAR[a]);
    }

    modW_TimeoutAR = [];
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
