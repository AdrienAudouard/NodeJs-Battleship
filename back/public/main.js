!function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e){t.exports={PLAYER_BOAT:"player_boat",KILLED_BOAT:"killed_boat",TARGET_HIT:"TARGET_HIT",TARGET_NO_HIT:"TARGET_NO_HIT"}},function(t,e){t.exports=new class{constructor(){this.assets={}}load(t,e){const n=t.length;let i=0;return t.forEach(t=>{const o=new Image;o.onload=()=>{this.assets[t.id]=o,i+=1,i===n&&e(this.assets)},o.src=t.url}),e}get(t){return this.assets[t]}unload(t){delete this.assets[t]}}},function(t,e,n){const i=n(3),o=n(4),r=n(1),s=n(6),a=n(9),h=n(12),c=n(0);let u,d,l,_,m,w;window.onload=()=>{r.load([{id:c.TARGET_NO_HIT,url:"/assets/black-circe.png"},{id:c.TARGET_HIT,url:"/assets/red-cross.png"},{id:c.PLAYER_BOAT,url:"/assets/square-ship.png"},{id:c.KILLED_BOAT,url:"/assets/red-square-ship.png"}],()=>{m=new a,w=new h,u=new i,m.onError=t=>{alert(t)},w.onCreate=(t,e)=>{m.createGame(t,e)},w.onJoin=(t,e)=>{m.joinGame(t,e)},m.onGamecreated=t=>{w.showGameCode(t)},m.onGameStart=t=>{w.hideAllForm(),f(),_.setPlayerBoats(t)}})};const f=()=>{p(),g(),_=new s(d,l,m),_.onEndGame=()=>{u.clear(),w.showForm()}},p=()=>{const t=.7*window.innerHeight,e=.7*window.innerHeight,n=window.innerWidth/2-t/2,i=window.innerHeight/2-e/2;d=new o(u.ctx,t,e,n,i)},g=()=>{const t=.25*window.innerHeight,e=.25*window.innerHeight,n=.75*window.innerWidth,i=window.innerHeight/2-e/2;l=new o(u.ctx,t,e,n,i)}},function(t,e){t.exports=class{constructor(){this._canvas=document.getElementById("paper"),this.ctx=this._canvas.getContext("2d"),window.onresize=()=>{},this._initCanvasSize()}clear(){this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)}_initCanvasSize(){this._canvas.width=window.innerWidth,this._canvas.height=window.innerHeight}}},function(t,e,n){const i=n(5),o=n(1),r=n(0);t.exports=class{constructor(t,e,n,i,o){this._ctx=t,this._width=e,this._heigth=n,this._x=i,this._y=o,this.markers=[],this.boats=[],this.draw(),this.onClick=(t,e)=>{},window.addEventListener("click",t=>{this._onClick(t)})}addMarker(t){this.markers.push(t)}_onClick(t){const e=t.clientX-(window.innerWidth/2-this._width/2),n=t.clientY-(window.innerHeight/2-this._heigth/2);if(e<0||n<0||e>this._width||n>this._heigth)return;const i=Math.trunc(e/this._width*10),o=Math.trunc(n/this._heigth*10);this.onClick(i,o)}draw(){this._ctx.save(),this._ctx.translate(this._x,this._y),this._ctx.clearRect(0,0,this._width,this._heigth),this._drawBackground(),this._drawLines(),this._drawBoats(),this._drawMarkers(),this._ctx.restore()}_drawBoats(){this.boats.forEach(t=>{const e=o.get(r.PLAYER_BOAT),n=this._width/10;t.points.forEach(t=>{this._ctx.drawImage(e,t.x*n,t.y*n,n,n)})})}_drawMarkers(){this.markers.forEach(t=>{const e=this._width/10*.7,n=t.x*(this._width/10)+this._width/10*.3/2,i=t.y*(this._heigth/10)+this._width/10*.3/2;this._ctx.drawImage(o.get(t.type),n,i,e,e)})}_drawBackground(){this._ctx.beginPath(),this._ctx.fillStyle=i.GAME_VIEW_BACKGROUND,this._ctx.rect(0,0,this._width,this._heigth),this._ctx.fill()}_drawLines(){this._ctx.strokeStyle=i.GAME_VIEW_LINE;for(let t=1;t<10;t++){const e=t*(this._width/10),n=t*(this._heigth/10);this._ctx.beginPath(),this._ctx.moveTo(e,0),this._ctx.lineTo(e,this._heigth),this._ctx.stroke(),this._ctx.beginPath(),this._ctx.moveTo(0,n),this._ctx.lineTo(this._width,n),this._ctx.stroke()}}}},function(t,e){t.exports={GAME_VIEW_BACKGROUND:"#11513f",GAME_VIEW_LINE:"white"}},function(t,e,n){const i=n(7),o=n(0),r=n(8);t.exports=class{constructor(t,e,n){this.gameView=t,this.playerGameView=e,this.socketController=n,this.infoView=new r(this.playerGameView._ctx,this.gameView._y),this._isPlayerTurn=!1,this.onEndGame=()=>{},this.gameView.onClick=(t,e)=>{this._isPlayerTurn&&this.socketController.addNewMarker(t,e)},this.socketController.onNewMarker=(t,e,n,i)=>{this.onNewMarker(t,e,n,i)},this.socketController.onBoardHited=(t,e,n,i)=>{this.onBoardHited(t,e,n,i)},this.socketController.onWin=()=>{alert("You win !"),this._endGame()},this.socketController.onLoose=()=>{alert("You loose !"),this._endGame()},this.socketController.onStartTurn=()=>{this._isPlayerTurn=!0,this.infoView.drawInfo("It's your turn")},this.socketController.onEndTurn=()=>{this._isPlayerTurn=!1,this.infoView.drawInfo("it's the enemy's turn")}}_endGame(){this.onEndGame()}setPlayerBoats(t){this.boats=t,this.playerGameView.boats=t,this.playerGameView.draw()}onBoardHited(t,e,n,r){const s=n?r?o.KILLED_BOAT:o.TARGET_HIT:o.TARGET_NO_HIT;this.playerGameView.addMarker(new i(t,e,s)),this.playerGameView.draw()}onNewMarker(t,e,n,r){const s=n?r?o.KILLED_BOAT:o.TARGET_HIT:o.TARGET_NO_HIT;this.gameView.addMarker(new i(t,e,s)),this.gameView.draw()}}},function(t,e){t.exports=class{constructor(t,e,n){this.x=t,this.y=e,this.type=n}}},function(t,e){t.exports=class{constructor(t,e){this._ctx=t,this._h=e}drawInfo(t){this._ctx.save(),this._ctx.clearRect(0,0,window.innerWidth,this._h),this._ctx.textAlign="center",this._ctx.fillStyle="white",this._ctx.font="30px Arial",this._ctx.fillText(t,window.innerWidth/2,this._h/2),this._ctx.restore()}}},function(t,e,n){(function(e){const i=n(11);t.exports=class{constructor(){i.hostname(),e.env.PORT;this._socket=io(),this.onNewMarker=(t,e,n)=>{},this.onGamecreated=t=>{},this.onError=t=>{},this.onGameStart=t=>{},this.onEndTurn=()=>{},this.onStartTurn=()=>{},this.onBoardHited=(t,e,n)=>{},this.onWin=()=>{},this.onLoose=()=>{},this._socket.on("player_turn",()=>{this.onStartTurn()}),this._socket.on("win",()=>{this.onWin()}),this._socket.on("loose",()=>{this.onLoose()}),this._socket.on("player_end_turn",()=>{this.onEndTurn()}),this._socket.on("new_marker",({x:t,y:e,touched:n,killed:i})=>{this.onNewMarker(t,e,n,i)}),this._socket.on("board_hited",({x:t,y:e,touched:n,killed:i})=>{this.onBoardHited(t,e,n,i)}),this._socket.on("game_code",t=>{this.onGamecreated(t)}),this._socket.on("join_error",()=>{this.onError("The game do not exists")}),this._socket.on("game_start",t=>{this.onGameStart(t)})}joinGame(t,e){this._socket.emit("join_game",{pseudo:t,id:e})}createGame(t,e){this._socket.emit("create_game",{pseudo:t,type:e})}addNewMarker(t,e){this._socket.emit("new_marker",{x:t,y:e})}}}).call(this,n(10))},function(t,e){var n,i,o=t.exports={};function r(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function a(t){if(n===setTimeout)return setTimeout(t,0);if((n===r||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:r}catch(t){n=r}try{i="function"==typeof clearTimeout?clearTimeout:s}catch(t){i=s}}();var h,c=[],u=!1,d=-1;function l(){u&&h&&(u=!1,h.length?c=h.concat(c):d=-1,c.length&&_())}function _(){if(!u){var t=a(l);u=!0;for(var e=c.length;e;){for(h=c,c=[];++d<e;)h&&h[d].run();d=-1,e=c.length}h=null,u=!1,function(t){if(i===clearTimeout)return clearTimeout(t);if((i===s||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(t);try{i(t)}catch(e){try{return i.call(null,t)}catch(e){return i.call(this,t)}}}(t)}}function m(t,e){this.fun=t,this.array=e}function w(){}o.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];c.push(new m(t,e)),1!==c.length||u||a(_)},m.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=w,o.addListener=w,o.once=w,o.off=w,o.removeListener=w,o.removeAllListeners=w,o.emit=w,o.prependListener=w,o.prependOnceListener=w,o.listeners=function(t){return[]},o.binding=function(t){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(t){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(t,e){e.endianness=function(){return"LE"},e.hostname=function(){return"undefined"!=typeof location?location.hostname:""},e.loadavg=function(){return[]},e.uptime=function(){return 0},e.freemem=function(){return Number.MAX_VALUE},e.totalmem=function(){return Number.MAX_VALUE},e.cpus=function(){return[]},e.type=function(){return"Browser"},e.release=function(){return"undefined"!=typeof navigator?navigator.appVersion:""},e.networkInterfaces=e.getNetworkInterfaces=function(){return{}},e.arch=function(){return"javascript"},e.platform=function(){return"browser"},e.tmpdir=e.tmpDir=function(){return"/tmp"},e.EOL="\n",e.homedir=function(){return"/"}},function(t,e){t.exports=class{constructor(){this.onJoin=(t,e)=>{},this.onCreate=(t,e)=>{},this._form=document.getElementById("form"),this._createPseudoInput=document.getElementById("create_pseudo"),this._gameTypeInput=document.getElementById("game_type"),this._createButton=document.getElementById("create_button"),this._joinPseudoInput=document.getElementById("join_pseudo"),this._gameIDInput=document.getElementById("game_id"),this._joinButton=document.getElementById("join_button"),this._gameCodeDiv=document.getElementById("game_code"),this._createButton.onclick=()=>{const t=this._createPseudoInput.value,e=this._gameTypeInput.value;""!==e&&""!==t?(localStorage.setItem("pseudo",t),this.onCreate(t,e)):alert("Please fill pseudo and type inputs")},this._joinButton.onclick=()=>{const t=this._joinPseudoInput.value,e=this._gameIDInput.value;""!==e&&""!==t?(localStorage.setItem("pseudo",t),this.onJoin(t,e)):alert("Please fill pseudo and game id inputs")},this.readLocalStorage()}readLocalStorage(){const t=localStorage.getItem("pseudo");void 0!==t&&(this._createPseudoInput.value=t,this._joinPseudoInput.value=t)}showGameCode(t){this.hideForm(),this._gameCodeDiv.innerHTML=`<b>Game code</b>: ${t}`,this.showCodeDiv()}hideForm(){this._form.style.display="none"}hideCodeDiv(){this._gameCodeDiv.style.display="none"}showCodeDiv(){this._gameCodeDiv.style.display="inline-block"}showForm(){this._form.style.display="block"}hideAllForm(){this.hideForm(),this.hideCodeDiv()}}}]);