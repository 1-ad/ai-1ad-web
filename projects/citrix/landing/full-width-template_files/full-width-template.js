/** Full-Width Template js.
 * Built with Citrix Pylon Framework v1.0.0
 * https://codeshare.ice.citrix.com/pylon
 */


$KP(window).resize(function(){
    doMobileMenuThrottled();
});

$KP(document).ready(function(){
    doMobileMenuThrottled();
});

var doMobileMenuThrottled = _.throttle(checkWidthAndDoMenu,100);

var isFullWidthTmpl = false;
function checkWidthAndDoMenu(){
    // do nothing if not on left nav template
    isFullWidthTmpl = $KP('html').hasClass("ctx-full-width-tmpl");


    // start off-canvas menu
    var width = $KP(window).width();
    var html =  $KP('html');
    if( width <= 960){

        var topMenuCopy = $KP('.nav-content.ctx-menu').clone().attr("id","ctx-top-nav-clone");
        var leftNav = $KP('.left-nav-wrap');
        var topNavNotInjected = leftNav.find('#ctx-top-nav-clone').length == 0 ;

        if( topNavNotInjected ){
            leftNav.prepend(topMenuCopy);
        }
    }
}

$KP(document).ready(function(){
    // toggle menu
    var menuToggle = $KP('a#menu-toggle');
    var body = $KP('body');

    if(!isFullWidthTmpl) {
        menuToggle.click(function(){
            body.addClass("menu").removeClass('menu-close');
        });

        $KP('#left-menu-close').click(function(){
            body.removeClass("menu").addClass('menu-close');
        });

    } else {
        menuToggle.click(function(){
            if(body.hasClass("menu")){
                body.removeClass("menu").addClass('menu-close');
            }else{
                body.addClass("menu").removeClass('menu-close');
            }
        });

        //full-width template: toggle menu on top menu pages - layout full-width
        var menuFw = $KP('.ctx-nav-bar');
        var isMenuOpen = menuFw.hasClass('open');
        if (isMenuOpen) {
            menuFw.removeClass('open');
        } else {
            menuFw.addClass('open');
        }
    }

    //open active accordion when on a child page
    //var path = "/pylon" + window.location.pathname, //use for testing on local when '/pylon' is not appended to URL
    var path = window.location.pathname,
        len = path.split("/").length;

    // is within Documentation section (grandchild page)
    if(len - 1 >= 4){
        var parentPage = path.split("/")[2];
        var currentPage = parentPage + "/" + path.split("/")[3];
        $KP(".ctx-ln-group .ctx-tabs.accordions").find("[data-tab='" + parentPage + "']").addClass("open active").find(".tab-content").show();
        $KP("a.ctx-ln-group[data-subnav-item='"+ currentPage +"']").addClass("active");
    }

    //specify active page in global nav & subnav (child page)
    if(len - 1 <= 3){
        var pageName;
        if(path.indexOf(".") > -1){
            pageName = (path.split("/")[len - 1]).split(".")[0];
        }else{
            pageName = path.split("/")[len - 2];
        }
        $KP(".ctx-nav-bar [data-nav-item='" + pageName + "']").parent().addClass("active");
        $KP("a.ctx-ln-group[data-subnav-item='"+ pageName +"']").addClass("active");
    }
});

