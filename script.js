const DISCORD_ID = "826362723792977950";

const el = id => document.getElementById(id);

const DOM = {
avatar: el("discord-avatar"),
cardAvatar: el("card-avatar"),
decoration: el("discord-decoration"),
name: el("display-name"),
cardName: el("card-name"),
username: el("card-username"),
note: el("discord-note"),
noteSection: el("note-section"),
status: el("status-dot"),

spotifyBar: el("spotify-bar"),
spotifySong: el("spotify-song"),
spotifyArtist: el("spotify-artist"),
spotifyCover: el("spotify-cover"),
spotifyProgress: el("spotify-progress"),

views: el("view-count"),
music: el("bg-music"),
overlay: el("overlay")
};

// ENTER
function enterSite(){
DOM.overlay.classList.add("hidden");
playMusic();
connectLanyard();
particles();
}

// MUSIC
function playMusic(){
DOM.music.volume = 0;
DOM.music.play().catch(()=>{});
let v=0;
let i=setInterval(()=>{
v+=0.02;
DOM.music.volume=v;
if(v>=0.2) clearInterval(i);
},100);
}

// UPDATE UI
function updateUI(d){
if(!d || !d.discord_user) return;
const u = d.discord_user;

// AVATAR
if(u.avatar){
const avatar = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${u.avatar}.${u.avatar.startsWith("a_")?"gif":"png"}`;
DOM.avatar.src = avatar;
DOM.cardAvatar.src = avatar;
}

// NAME
const name = u.global_name || u.username || "dwep";
DOM.name.innerText = name;
DOM.cardName.innerText = name;
DOM.username.innerText = "@"+(u.username||"dwep");

// STATUS
DOM.status.className = "status-dot "+(d.discord_status || "offline");

// DECORATION FIX
if(u.avatar_decoration_data){
const asset = u.avatar_decoration_data.asset;
const url1 = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?${Date.now()}`;
const url2 = `https://cdn.discordapp.com/avatar-decorations/${asset}.png?${Date.now()}`;

DOM.decoration.onerror=()=>DOM.decoration.src=url2;
DOM.decoration.src=url1;
DOM.decoration.style.display="block";
}else{
DOM.decoration.style.display="none";
}

// CUSTOM STATUS
const custom = d.activities?.find(a=>a.type===4);
if(custom){
DOM.note.innerText = custom.state;
DOM.noteSection.style.display="block";
}else{
DOM.noteSection.style.display="none";
}

// 🎧 SPOTIFY LIVE
if(d.spotify){
DOM.spotifyBar.style.display="flex";
DOM.spotifySong.innerText = d.spotify.song;
DOM.spotifyArtist.innerText = d.spotify.artist;
DOM.spotifyCover.src = d.spotify.album_art_url;

// progress
const start = d.spotify.timestamps.start;
const end = d.spotify.timestamps.end;

const updateProgress = ()=>{
const now = Date.now();
const percent = ((now-start)/(end-start))*100;
DOM.spotifyProgress.style.width = percent+"%";
};
setInterval(updateProgress,1000);

}else{
DOM.spotifyBar.style.display="none";
}
}

// REALTIME
function connectLanyard(){
const ws = new WebSocket("wss://api.lanyard.rest/socket");

ws.onopen=()=>{
ws.send(JSON.stringify({
op:2,
d:{subscribe_to_id:DISCORD_ID}
}));
};

ws.onmessage=(e)=>{
const msg = JSON.parse(e.data);
if(msg.t==="INIT_STATE"||msg.t==="PRESENCE_UPDATE"){
updateUI(msg.d);
}
};

ws.onclose=()=>setTimeout(connectLanyard,5000);
}

// VIEWS
fetch(`https://api.counterapi.dev/v1/dre_${DISCORD_ID}/visits`)
.then(r=>r.json())
.then(d=>DOM.views.innerText=d.value);

// PARTICLES
function particles(){
const c = document.getElementById("particles");
const ctx = c.getContext("2d");
c.width=innerWidth;c.height=innerHeight;

let p=[];
for(let i=0;i<100;i++){
p.push({x:Math.random()*c.width,y:Math.random()*c.height,v:Math.random()*1});
}

function draw(){
ctx.clearRect(0,0,c.width,c.height);
p.forEach(pt=>{
pt.y+=pt.v;
if(pt.y>c.height) pt.y=0;
ctx.fillStyle="white";
ctx.fillRect(pt.x,pt.y,2,2);
});
requestAnimationFrame(draw);
}
draw();
}
