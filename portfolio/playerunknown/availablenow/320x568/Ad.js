class Ad{constructor(paramsOB){this.timeoutAR=[];}
requestTimeout(callbackFN,delayMS){const timerOB={};timerOB.id=Math.random();timerOB.callbackFN=callbackFN;timerOB.delayMS=delayMS;timerOB.startMS=void 0;timerOB.remainMS=delayMS;timerOB.timerTO=void 0;timerOB.pause=function(){clearTimeout(timerOB.timerTO);timerOB.remainMS-=new Date-timerOB.startMS;if(timerOB.remainMS<-1){timerOB.clear();}};timerOB.resume=()=>{timerOB.startMS=new Date;clearTimeout(timerOB.timerTO);timerOB.timerTO=setTimeout(timerOB.callbackFN,timerOB.remainMS);};timerOB.clear=()=>{clearTimeout(timerOB.timerTO);const index=this.gIndex(this.timeoutAR,"id",timerOB.id);if(index>-1){this.timeoutAR.splice(index,1);}}
timerOB.resume();this.timeoutAR.push(timerOB);return timerOB;}
clearAllRequestTimeouts(){const a=this.timeoutAR.length;while(a--){this.timeoutAR[a].clear();}
this.timeoutAR=[];}
clearRequestTimeout(timerOB){if(timerOB){timerOB.clear();}}
pauseAllTimeouts(){let a=this.timeoutAR.length;while(a--){this.timeoutAR[a].pause();}}
resumeAllTimeouts(){let a=this.timeoutAR.length;while(a--){this.timeoutAR[a].resume();}}
gIndex(array,name,value){for(const a in array){if(array[a][name]===value)return a;}
return-1;}
renderEngine(newRenderOB){console.log("renderEngine("+newRenderOB+")");const rOB=newRenderOB;rOB.frameDelay=Math.round((1/rOB.frameRate)*1000);rOB.renderAR=[];rOB.clearAR=[];rOB.renderInt;rOB.renderStarted;rOB.init=function(){rOB.window.addEventListener("adPause",rOB.onAdPause);rOB.window.addEventListener("adResume",rOB.onAdResume);}
rOB.addRenderFunc=function(func,scope){rOB.renderAR.push([func,scope]);}
rOB.addClearContext=function(context){rOB.clearAR.push(context);}
rOB.onAdPause=function(e){rOB.pause();}
rOB.onAdResume=function(e){rOB.resume();}
rOB.start=function(){rOB.renderStarted=true;rOB.doRender();clearInterval(rOB.renderInt);rOB.renderInt=setInterval(rOB.doRender,rOB.frameDelay);}
rOB.stop=function(){rOB.renderStarted=false;clearInterval(rOB.renderInt);}
rOB.pause=function(){if(rOB.renderStarted==true){clearInterval(rOB.renderInt);}}
rOB.resume=function(){if(rOB.renderStarted==true){clearInterval(rOB.renderInt);rOB.renderInt=setInterval(rOB.doRender,rOB.frameDelay);}}
rOB.doRender=function(){if(rOB.isRendering!=true){rOB.isRendering=true;for(let a in rOB.clearAR){rOB.clearAR[a].clearRect(0,0,rOB.canvasWidth,rOB.canvasHeight);}
for(let a in rOB.renderAR){rOB.renderAR[a][0](rOB.renderAR[a][1]);}
rOB.isRendering=false;}}
rOB.init();return rOB;}
randRange(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
ab(){return Math.random()<0.5?-1:1;}
easeInQuad(t,b,c,d){return c*(t/=d)*t+b;}
easeInOutQuad(t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b;}
easeOutQuad(t,b,c,d){return-c*(t/=d)*(t-2)+b;}
rect(x,y,w,h){return{"x":x,"y":y,"width":w,"height":h}}
rectOverlap(r1,r2){if(r1.x<r2.x+r2.width&&r1.x+r1.width>r2.x&&r1.y<r2.y+r2.height&&r1.height+r1.y>r2.y){return true;}else{return false;}}}
class AdAniEmbers extends Ad{constructor(effectOB){super(effectOB);this.canvasContext=effectOB.canvas.getContext("2d");this.canvasWidth=effectOB.canvasWidth;this.canvasHeight=effectOB.canvasHeight;this.canvasRect=this.rect(0,0,this.canvasWidth,this.canvasHeight+30);this.renderAR=[];this.canRender=false;effectOB.renderMan.addRenderFunc(this.onUpdate,this);effectOB.renderMan.addRenderFunc(this.onRedraw,this);effectOB.renderMan.addClearContext(this.canvasContext);this.startX=effectOB.startX;this.startY=effectOB.startY;this.totalParticles=effectOB.totalParticles;this.globalAlpha=effectOB.globalAlpha;this.globalScale=effectOB.globalScale;this.particleImg=new Image();this.particleImg.onload=this.particleLoaded();this.particleImg.src=effectOB.imgSrcPath+effectOB.srcImg;}
resume(){console.log("EVENT: Embers Render");this.canRender=true;}
pause(){console.log("EVENT: Embers Pause");this.canRender=false;}
particleLoaded(){for(var a=1;a<=this.totalParticles;a++){this.buildParticle(a);}
this.resume();}
buildParticle(particleNum){let imgOB={};imgOB.img=this.particleImg;let imgScale=this.randRange(60,100)/100;imgOB.width=this.randRange(8,12)*imgScale*this.globalScale;imgOB.height=this.randRange(8,12)*imgScale*this.globalScale;imgOB.alpha=(this.randRange(20,70)/100)*this.globalAlpha;imgOB.swayAmount=this.randRange(20,200)/100;imgOB.gravity=this.randRange(4,15)/5;imgOB=this.resetParticle(imgOB);let randNum=this.randRange(24,24*6);for(var a=1;a<=randNum;a++){imgOB.radians+=(imgOB.swayAmount/180)*Math.PI*2;imgOB.y-=(Math.cos(imgOB.radians)+imgOB.gravity);imgOB.speedX+=imgOB.wind;imgOB.x+=imgOB.speedX;}
this.renderAR.push(imgOB);}
resetParticle(imgOB){imgOB.x=this.startX+this.randRange(-50,50);imgOB.y=this.startY;imgOB.radians=Math.PI;imgOB.wind=this.randRange(1,4)/400*this.ab();imgOB.speedX=this.randRange(8,14)/100;return imgOB;}
onUpdate(parent){if(parent.canRender==true){let imgOB,imgRect;for(var a in parent.renderAR){imgOB=parent.renderAR[a];imgOB.radians+=(imgOB.swayAmount/180)*Math.PI*2;imgOB.y-=(Math.cos(imgOB.radians)+imgOB.gravity)*.7;imgOB.speedX+=imgOB.wind;imgOB.x+=imgOB.speedX*.7;imgRect=parent.rect(imgOB.x,imgOB.y,imgOB.width,imgOB.height);if(!parent.rectOverlap(parent.canvasRect,imgRect)){parent.resetParticle(imgOB);}}}}
onRedraw(parent){if(parent.canRender==true){let imgOB;for(var a in parent.renderAR){imgOB=parent.renderAR[a];parent.canvasContext.save();parent.canvasContext.globalAlpha=imgOB.alpha;parent.canvasContext.translate(imgOB.x,imgOB.y);parent.canvasContext.drawImage(imgOB.img,-(imgOB.width*.5),-(imgOB.height*.5),imgOB.height,imgOB.height);parent.canvasContext.restore();}}}}
class AdAniFire extends Ad{constructor(effectOB){super(effectOB);this.canvasContext=effectOB.canvas.getContext("2d");this.canvasWidth=effectOB.canvasWidth;this.canvasHeight=effectOB.canvasHeight;this.TO_RADIANS=Math.PI/180;this.renderAR=[];this.canRender=false;effectOB.renderMan.addRenderFunc(this.onUpdate,this);effectOB.renderMan.addRenderFunc(this.onRedraw,this);effectOB.renderMan.addClearContext(this.canvasContext);this.startX=effectOB.startX;this.startY=effectOB.startY;this.totalParticles=effectOB.totalParticles;this.endCount=effectOB.endCount;this.distance=effectOB.distance;this.globalAlpha=effectOB.globalAlpha;this.particleImg=new Image();this.particleImg.onload=this.particleLoaded();this.particleImg.src=effectOB.imgSrcPath+effectOB.srcImg;}
resume(){console.log("EVENT: Fire Render");this.canRender=true;}
pause(){console.log("EVENT: Fire Pause");this.canRender=false;}
particleLoaded(){for(var a=1;a<=this.totalParticles;a++){this.buildParticle(a);}
this.resume();}
buildParticle(particleNum){let imgOB={};imgOB.img=this.particleImg;imgOB.width=200;imgOB.height=200;imgOB.endCount=this.endCount;imgOB.startScale=this.randRange(30,50)/100;imgOB.endScale=this.randRange(190,220)/100;imgOB.changeScale=imgOB.endScale-imgOB.startScale;imgOB.startY=this.startY+((imgOB.height*imgOB.startScale)/2);imgOB.endY=this.startY-this.distance;imgOB.changeY=imgOB.endY-imgOB.startY;imgOB.rotation=this.randRange(0,360);imgOB.speedRotation=(this.randRange(2,5)/8)*this.ab();imgOB=this.resetParticle(imgOB);imgOB.count=Math.round(this.endCount*(particleNum/this.totalParticles));this.renderAR.push(imgOB);}
resetParticle(imgOB){imgOB.width=200;imgOB.height=200;imgOB.x=this.startX;imgOB.y=imgOB.startY;imgOB.scale=imgOB.startScale;imgOB.alpha=1;imgOB.count=0;imgOB.delayCount=0;return imgOB;}
onUpdate(parent){if(parent.canRender==true){let imgOB,playRatio,newAlpha;for(var a in parent.renderAR){imgOB=parent.renderAR[a];if(imgOB.delay>imgOB.delayCount){imgOB.delayCount++;}else{imgOB.count++;imgOB.scale=parent.easeInQuad(imgOB.count,imgOB.startScale,imgOB.changeScale,imgOB.endCount);imgOB.y=parent.easeInQuad(imgOB.count,imgOB.startY,imgOB.changeY,imgOB.endCount);playRatio=Math.round((imgOB.count/parent.endCount)*100);if(playRatio>80){imgOB.alpha=1-((playRatio-80)/20);}
imgOB.rotation+=imgOB.speedRotation;if(imgOB.count>=parent.endCount){imgOB=parent.resetParticle(imgOB);}}}}}
onRedraw(parent){if(parent.canRender==true){let imgOB,imgW,imgH;for(var a in parent.renderAR){imgOB=parent.renderAR[a];imgW=imgOB.width*imgOB.scale;imgH=imgOB.height*imgOB.scale;parent.canvasContext.save();parent.canvasContext.globalAlpha=imgOB.alpha*parent.globalAlpha;parent.canvasContext.translate(imgOB.x,imgOB.y);parent.canvasContext.rotate(imgOB.rotation*parent.TO_RADIANS);parent.canvasContext.drawImage(imgOB.img,-(imgW*.5),-(imgH*.5),imgW,imgH);parent.canvasContext.restore();}}}}
class AdAniSmoke extends Ad{constructor(effectOB){super(effectOB);this.canvasContext=effectOB.canvas.getContext("2d");this.canvasWidth=effectOB.canvasWidth;this.canvasHeight=effectOB.canvasHeight;this.TO_RADIANS=Math.PI/180;this.renderAR=[];this.canRender=false;effectOB.renderMan.addRenderFunc(this.onUpdate,this);effectOB.renderMan.addRenderFunc(this.onRedraw,this);effectOB.renderMan.addClearContext(this.canvasContext);this.startX=effectOB.startX;this.startY=effectOB.startY;this.totalParticles=effectOB.totalParticles;this.endCount=effectOB.endCount;this.distance=effectOB.distance;this.globalAlpha=effectOB.globalAlpha;this.particleImg=new Image();this.particleImg.onload=this.particleLoaded();this.particleImg.src=effectOB.imgSrcPath+effectOB.srcImg;}
resume(){console.log("EVENT: Smoke Render");this.canRender=true;}
pause(){console.log("EVENT: Smoke Pause");this.canRender=false;}
particleLoaded(){for(var a=1;a<=this.totalParticles;a++){this.buildParticle(a);}
this.resume();}
buildParticle(particleNum){let imgOB={};imgOB.img=this.particleImg;imgOB.width=200;imgOB.height=200;imgOB.endCount=this.endCount;imgOB.startScale=this.randRange(100,200)/100;imgOB.endScale=this.randRange(300,500)/100;imgOB.changeScale=imgOB.endScale-imgOB.startScale;imgOB.startY=this.startY+((imgOB.height*imgOB.startScale)/2);imgOB.endY=this.startY-this.distance;imgOB.changeY=imgOB.endY-imgOB.startY;imgOB.rotation=this.randRange(0,360);imgOB.speedRotation=(this.randRange(2,5)/5)*this.ab();imgOB=this.resetParticle(imgOB);imgOB.count=Math.round(this.endCount*(particleNum/this.totalParticles));this.renderAR.push(imgOB);}
resetParticle(imgOB){imgOB.width=200;imgOB.height=200;imgOB.x=this.startX+this.randRange(-80,80);imgOB.y=imgOB.startY;imgOB.scale=imgOB.startScale;imgOB.alpha=1;imgOB.count=0;imgOB.delayCount=0;return imgOB;}
onUpdate(parent){if(parent.canRender==true){let imgOB,playRatio,newAlpha;for(var a in parent.renderAR){imgOB=parent.renderAR[a];if(imgOB.delay>imgOB.delayCount){imgOB.delayCount++;}else{imgOB.count++;imgOB.scale=parent.easeInQuad(imgOB.count,imgOB.startScale,imgOB.changeScale,imgOB.endCount);imgOB.y=parent.easeInQuad(imgOB.count,imgOB.startY,imgOB.changeY,imgOB.endCount);playRatio=Math.round((imgOB.count/parent.endCount)*100);if(playRatio>80){imgOB.alpha=1-((playRatio-80)/20);}
imgOB.rotation+=imgOB.speedRotation;if(imgOB.count>=parent.endCount){imgOB=parent.resetParticle(imgOB);}}}}}
onRedraw(parent){if(parent.canRender==true){let imgOB,imgW,imgH;for(var a in parent.renderAR){imgOB=parent.renderAR[a];imgW=imgOB.width*imgOB.scale;imgH=imgOB.height*imgOB.scale;parent.canvasContext.save();parent.canvasContext.globalAlpha=imgOB.alpha*parent.globalAlpha;parent.canvasContext.translate(imgOB.x,imgOB.y);parent.canvasContext.rotate(imgOB.rotation*parent.TO_RADIANS);parent.canvasContext.drawImage(imgOB.img,-(imgW*.5),-(imgH*.5),imgW,imgH);parent.canvasContext.restore();}}}}
class AdCtrl extends Ad{constructor(paramsOB){super();this.paramsOB=paramsOB;this.adIsVisible=true;this.adCanAnimate=true;this.adisStarted=false;this.adIsPlaying=false;this.adMouseOver=false;this.windowIsVisible=true;this.adTimerTO;this.adResetTO;this.adMaxTime=paramsOB.adMaxTime;paramsOB.wrapper.addEventListener("mousedown",()=>{this.adResume();});paramsOB.wrapper.addEventListener("mouseup",()=>{});paramsOB.wrapper.addEventListener("mouseover",()=>{this.adMouseOver=true;this.adResume();});paramsOB.wrapper.addEventListener("mouseout",()=>{this.adMouseOver=false;this.clearRequestTimeout(this.adResetTO);this.adResetTO=this.requestTimeout(()=>{this.adTimerReset();},100);});paramsOB.window.document.addEventListener("visibilitychange",()=>{this.checkWindowVisibility();});}
startAd(){this.requestTimeout(()=>{this.adStart();},0);this.checkWindowVisibility();}
adStart(){if(this.adisStarted!=true){this.adisStarted=true;console.log("EVENT: adStart");this.paramsOB.window.dispatchEvent(new Event("adStart"));}
this.adResume();}
adResume(){if(this.adisStarted!=true){this.adStart();}else if(this.adIsPlaying!=true){this.adIsPlaying=true;console.log("EVENT: adResume");this.paramsOB.window.dispatchEvent(new Event("adResume"));this.resumeAllTimeouts();this.adTimerReset();}}
adPause(){if(this.adIsVisible==false||this.windowIsVisible==false||(this.adMouseOver!=true&&this.adIsPlaying==true)){this.adIsPlaying=false;console.log("EVENT: adPause");this.paramsOB.window.dispatchEvent(new Event("adPause"));this.clearRequestTimeout(this.adTimerTO);this.pauseAllTimeouts();}}
adTimerReset(){this.clearRequestTimeout(this.adTimerTO);this.adTimerTO=this.requestTimeout(()=>{this.adPause();},this.adMaxTime);this.adResume();}
checkWindowVisibility(){if(document.visibilityState=="hidden"){this.windowHidden();}else{this.windowVisible();}}
windowVisible(){if(this.windowIsVisible!=true){this.windowIsVisible=true;this.visibleUpdate();}}
windowHidden(){if(this.windowIsVisible==true){this.windowIsVisible=false;this.visibleUpdate();}}
visibleUpdate(){if(this.windowIsVisible==true&&this.adIsVisible==true){console.log("EVENT: adVisible");this.paramsOB.window.dispatchEvent(new Event("adVisible"));this.adResume();}else if(this.windowIsVisible!=true||this.adIsVisible!=true){console.log("EVENT: adHidden");this.paramsOB.window.dispatchEvent(new Event("adHidden"));this.adPause();}}}