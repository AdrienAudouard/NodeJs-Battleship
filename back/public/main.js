!function(t){var e={};function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=2)}([function(t,e){t.exports={PLAYER_BOAT:"player_boat",KILLED_BOAT:"killed_boat",TARGET_HIT:"TARGET_HIT",TARGET_NO_HIT:"TARGET_NO_HIT"}},function(t,e){t.exports=new class{constructor(){this.assets={}}load(t,e){const i=t.length;let n=0;return t.forEach(t=>{const o=new Image;o.onload=()=>{this.assets[t.id]=o,n+=1,n===i&&e(this.assets)},o.src=t.url}),e}get(t){return this.assets[t]}unload(t){delete this.assets[t]}}},function(t,e,i){const n=i(3),o=i(4),s=i(1),r=i(6),a=i(9),h=i(11),d=i(0);let c,l,_,u,m,w;window.onload=()=>{s.load([{id:d.TARGET_NO_HIT,url:"/assets/black-circe.png"},{id:d.TARGET_HIT,url:"/assets/red-cross.png"},{id:d.PLAYER_BOAT,url:"/assets/square-ship.png"},{id:d.KILLED_BOAT,url:"/assets/red-square-ship.png"}],()=>{m=new a,w=new h,c=new n,m.onError=t=>{alert(t)},m.onJoinableGames=t=>{w.setGameList(t)},w.onCreate=(t,e)=>{m.createGame(t,e)},w.onJoin=(t,e)=>{m.joinGame(t,e)},w.onReplay=t=>{m.replay(t)},m.onGamecreated=t=>{w.showGameCode(t)},m.onGameStart=(t,e)=>{w.hideAllForm(),p(e),u.setPlayerBoats(t)}})};const p=t=>{g(t),y(t),u=new r(l,_,m),u.onEndGame=t=>{c.clear(),w.showEndGameForm(t)}},g=t=>{const e=.7*window.innerHeight,i=.7*window.innerHeight,n=window.innerWidth/2-e/2,s=window.innerHeight/2-i/2;l=new o(c.ctx,e,i,n,s,t)},y=t=>{const e=.25*window.innerHeight,i=.25*window.innerHeight,n=.75*window.innerWidth,s=window.innerHeight/2-i/2;_=new o(c.ctx,e,i,n,s,t)}},function(t,e){t.exports=class{constructor(){this._canvas=document.getElementById("paper"),this.ctx=this._canvas.getContext("2d"),this._initCanvasSize()}clear(){this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)}_initCanvasSize(){this._canvas.width=window.innerWidth,this._canvas.height=window.innerHeight}}},function(t,e,i){const n=i(5),o=i(1),s=i(0);t.exports=class{constructor(t,e,i,n,o,s){this._ctx=t,this._width=e,this._heigth=i,this._x=n,this._y=o,this._boardSize=s,this.markers=[],this.boats=[],this.draw(),this.onClick=(t,e)=>{},this._onClickListener=t=>{this._onClick(t)},window.addEventListener("click",this._onClickListener)}addMarker(t){this.markers.push(t)}_onClick(t){const e=t.clientX-(window.innerWidth/2-this._width/2),i=t.clientY-(window.innerHeight/2-this._heigth/2);if(e<0||i<0||e>this._width||i>this._heigth)return;const n=Math.trunc(e/this._width*this._boardSize),o=Math.trunc(i/this._heigth*this._boardSize);for(let t=0;t<this.markers.length;t++){const e=this.markers[t];if(e.x===n&&e.y===o)return}this.onClick(n,o)}draw(){this._ctx.save(),this._ctx.translate(this._x,this._y),this._ctx.clearRect(0,0,this._width,this._heigth),this._drawBackground(),this._drawLines(),this._drawBoats(),this._drawMarkers(),this._ctx.restore()}_drawBoats(){this.boats.forEach(t=>{const e=o.get(s.PLAYER_BOAT),i=this._width/this._boardSize;t.points.forEach(t=>{this._ctx.drawImage(e,t.x*i,t.y*i,i,i)})})}_drawMarkers(){this.markers.forEach(t=>{const e=this._width/this._boardSize*.7,i=t.x*(this._width/this._boardSize)+this._width/this._boardSize*.3/2,n=t.y*(this._heigth/this._boardSize)+this._width/this._boardSize*.3/2;this._ctx.drawImage(o.get(t.type),i,n,e,e)})}_drawBackground(){this._ctx.beginPath(),this._ctx.fillStyle=n.GAME_VIEW_BACKGROUND,this._ctx.rect(0,0,this._width,this._heigth),this._ctx.fill()}_drawLines(){this._ctx.strokeStyle=n.GAME_VIEW_LINE;for(let t=1;t<this._boardSize;t++){const e=t*(this._width/this._boardSize),i=t*(this._heigth/this._boardSize);this._ctx.beginPath(),this._ctx.moveTo(e,0),this._ctx.lineTo(e,this._heigth),this._ctx.stroke(),this._ctx.beginPath(),this._ctx.moveTo(0,i),this._ctx.lineTo(this._width,i),this._ctx.stroke()}}onDestroy(){window.removeEventListener("click",this._onClickListener)}}},function(t,e){t.exports={GAME_VIEW_BACKGROUND:"#11513f",GAME_VIEW_LINE:"white"}},function(t,e,i){const n=i(7),o=i(0),s=i(8);t.exports=class{constructor(t,e,i){this.gameView=t,this.playerGameView=e,this.socketController=i,this.infoView=new s(this.playerGameView._ctx,this.gameView._y),this._isPlayerTurn=!1,this.onEndGame=t=>{},this.gameView.onClick=(t,e)=>{this._isPlayerTurn&&this.socketController.addNewMarker(t,e)},this.socketController.onNewMarker=(t,e,i,n,o)=>{this.onNewMarker(t,e,i,n,o)},this.socketController.onBoardHited=(t,e,i,n,o)=>{this.onBoardHited(t,e,i,n,o)},this.socketController.onWin=()=>{this._endGame("You win !")},this.socketController.onLoose=()=>{this._endGame("You loose !")},this.socketController.onStartTurn=()=>{this._isPlayerTurn=!0,this.infoView.drawInfo("It's your turn")},this.socketController.onEndTurn=()=>{this._isPlayerTurn=!1,this.infoView.drawInfo("it's the enemy's turn")}}_endGame(t){this.gameView.onDestroy(),this.playerGameView.onDestroy(),this.onEndGame(t)}setPlayerBoats(t){this.boats=t,this.playerGameView.boats=t,this.playerGameView.draw()}onBoardHited(t,e,i,s,r){const a=i?s?o.KILLED_BOAT:o.TARGET_HIT:o.TARGET_NO_HIT,h=new n(t,e,a);i&&(h.tag=r),s&&this.playerGameView.markers.filter(t=>t.tag===r).forEach(t=>t.type=o.KILLED_BOAT),this.playerGameView.addMarker(h),this.playerGameView.draw()}onNewMarker(t,e,i,s,r){const a=i?s?o.KILLED_BOAT:o.TARGET_HIT:o.TARGET_NO_HIT,h=new n(t,e,a);i&&(h.tag=r),s&&this.gameView.markers.filter(t=>t.tag===r).forEach(t=>t.type=o.KILLED_BOAT),this.gameView.addMarker(h),this.gameView.draw()}}},function(t,e){t.exports=class{constructor(t,e,i){this.x=t,this.y=e,this.type=i,this.tag=null}}},function(t,e){t.exports=class{constructor(t,e){this._ctx=t,this._h=e}drawInfo(t){this._ctx.save(),this._ctx.clearRect(0,0,window.innerWidth,this._h),this._ctx.textAlign="center",this._ctx.fillStyle="white",this._ctx.font="30px Arial",this._ctx.fillText(t,window.innerWidth/2,this._h/2),this._ctx.restore()}}},function(t,e,i){i(10);t.exports=class{constructor(){this._socket=io(),this.onNewMarker=(t,e,i,n,o)=>{},this.onGamecreated=t=>{},this.onError=t=>{},this.onGameStart=(t,e)=>{},this.onEndTurn=()=>{},this.onStartTurn=()=>{},this.onBoardHited=(t,e,i,n,o)=>{},this.onWin=()=>{},this.onLoose=()=>{},this.onJoinableGames=t=>{},this._socket.on("joinable_games",t=>{console.log(t),this.onJoinableGames(t)}),this._socket.on("player_turn",()=>{this.onStartTurn()}),this._socket.on("win",()=>{this.onWin()}),this._socket.on("loose",()=>{this.onLoose()}),this._socket.on("player_end_turn",()=>{this.onEndTurn()}),this._socket.on("new_marker",({x:t,y:e,touched:i,killed:n,lastBoatTouched:o})=>{this.onNewMarker(t,e,i,n,o)}),this._socket.on("board_hited",({x:t,y:e,touched:i,killed:n,lastBoatTouched:o})=>{this.onBoardHited(t,e,i,n,o)}),this._socket.on("game_code",t=>{this.onGamecreated(t)}),this._socket.on("join_error",()=>{this.onError("The game do not exists")}),this._socket.on("game_start",({board:t,boardSize:e})=>{console.log(t),this.onGameStart(t,e)})}replay(t){this._socket.emit("replay",t)}joinGame(t,e){this._socket.emit("join_game",{pseudo:t,id:e})}createGame(t,e){this._socket.emit("create_game",{pseudo:t,type:e})}addNewMarker(t,e){this._socket.emit("new_marker",{x:t,y:e})}}},function(t,e){e.endianness=function(){return"LE"},e.hostname=function(){return"undefined"!=typeof location?location.hostname:""},e.loadavg=function(){return[]},e.uptime=function(){return 0},e.freemem=function(){return Number.MAX_VALUE},e.totalmem=function(){return Number.MAX_VALUE},e.cpus=function(){return[]},e.type=function(){return"Browser"},e.release=function(){return"undefined"!=typeof navigator?navigator.appVersion:""},e.networkInterfaces=e.getNetworkInterfaces=function(){return{}},e.arch=function(){return"javascript"},e.platform=function(){return"browser"},e.tmpdir=e.tmpDir=function(){return"/tmp"},e.EOL="\n",e.homedir=function(){return"/"}},function(t,e){t.exports=class{constructor(){this.onJoin=(t,e)=>{},this.onCreate=(t,e)=>{},this.onReplay=t=>{},this._form=document.getElementById("form"),this._createPseudoInput=document.getElementById("create_pseudo"),this._gameTypeInput=document.getElementById("game_type"),this._createButton=document.getElementById("create_button"),this._joinPseudoInput=document.getElementById("join_pseudo"),this._gameIDInput=document.getElementById("game_id"),this._joinButton=document.getElementById("join_button"),this._gameCodeDiv=document.getElementById("game_code"),this._endGameDiv=document.getElementById("end-game"),this._endGameTitle=document.getElementById("end-game-title"),this._endGameReplayButton=document.getElementById("replay_button"),this._endGameQuitButton=document.getElementById("quit_button"),this._boatCannotTouch=document.getElementById("boat-cannot-touch"),this._boardSizeInput=document.getElementById("board-size"),this._gameList=document.getElementById("game-list"),this._endGameReplayButton.onclick=()=>{const t=localStorage.getItem("pseudo");this._endGameReplayButton.disabled=!0,this._endGameQuitButton.disabled=!0,this.onReplay(t)},this._endGameQuitButton.onclick=()=>{this.hideEndGameForm(),this.showForm()},this._createButton.onclick=()=>{const t=this._createPseudoInput.value,e=this._boardSizeInput.value,i=this._boatCannotTouch.checked;let n=this._gameTypeInput.value;const o=n.split("-").length-1,s=i?2*o:o;""!==n&&""!==t?e<s?alert(`The board is to small, it must be at last ${s}x${s}`):(n=`${n}-${i}-${e}`,localStorage.setItem("pseudo",t),this.onCreate(t,n)):alert("Please fill pseudo and type inputs")},this._joinButton.onclick=()=>{const t=this._joinPseudoInput.value,e=this._gameIDInput.value;""!==e&&""!==t?(localStorage.setItem("pseudo",t),this.onJoin(t,e)):alert("Please fill pseudo and game id inputs")},this.readLocalStorage()}readLocalStorage(){const t=localStorage.getItem("pseudo");void 0!==t&&(this._createPseudoInput.value=t,this._joinPseudoInput.value=t)}setGameList(t){this._gameList.innerHTML="",t.forEach(t=>{const e=document.createElement("li");e.innerHTML=`${t.host} <button class="join-button">Join</button>`,e.addEventListener("click",()=>{this.onJoin(this.getPseudo(),t.code)}),this._gameList.appendChild(e)})}getPseudo(){return this._joinPseudoInput.value}showGameCode(t){this.hideForm(),this._gameCodeDiv.innerHTML=`<b>Game code</b>: ${t}`,this.showCodeDiv()}hideEndGameForm(){this._endGameDiv.style.display="none"}showEndGameForm(t){this._endGameReplayButton.disabled=!1,this._endGameQuitButton.disabled=!1,this._endGameTitle.innerText=t,this._endGameDiv.style.display="block"}hideForm(){this._form.style.display="none"}hideCodeDiv(){this._gameCodeDiv.style.display="none"}showCodeDiv(){this._gameCodeDiv.style.display="inline-block"}showForm(){this._form.style.display="block"}hideAllForm(){this.hideForm(),this.hideCodeDiv(),this.hideEndGameForm()}}}]);