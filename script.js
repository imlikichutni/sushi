const tracks=[
["Iktara","Wake Up Sid"],
["Agar Tum Saath Ho","Tamasha"],
["Apna Bana Le","Bhediya"],
["Chaleya","Jawan"],
["Kesariya","Brahmāstra"],
["Tum Se Hi","Jab We Met"],
["Ilahi","Yeh Jawaani Hai Deewani"],
["Heeriye","Jasleen Royal"]
];

const audio=document.getElementById("audio");
const title=document.getElementById("title");
const artist=document.getElementById("artist");
const play=document.getElementById("play");
const progress=document.getElementById("progress");
const volume=document.getElementById("volume");
const currentTime=document.getElementById("currentTime");
const duration=document.getElementById("duration");
const playlist=document.getElementById("playlist");

let current=0;
let shuffle=false;
let repeat=false;

function formatTime(s){
  if(!Number.isFinite(s)) return "0:00";
  return Math.floor(s/60)+":"+Math.floor(s%60).toString().padStart(2,"0");
}

function render(){
  playlist.innerHTML="";
  tracks.forEach((t,i)=>{
    const el=document.createElement("div");
    el.className="track "+(i===current?"active":"");
    el.innerHTML=`<div class="track-title">${t[0]}</div>
                  <div class="track-artist">${t[1]}</div>`;
    el.onclick=()=>select(i);
    playlist.appendChild(el);
  });
}

function select(i){
  current=i;
  title.textContent=tracks[i][0];
  artist.textContent=tracks[i][1]+" · add audio file to play";
  update();
}

function update(){
  document.querySelectorAll(".track").forEach((e,i)=>{
    e.classList.toggle("active",i===current);
  });
}

play.onclick=()=>{
  if(!audio.src){
    alert("Add your audio file to this project first 🎵");
    return;
  }
  audio.paused?audio.play():audio.pause();
};

document.getElementById("next").onclick=()=>{
  current=shuffle?Math.floor(Math.random()*tracks.length):(current+1)%tracks.length;
  select(current);
  if(audio.src) audio.play();
};

document.getElementById("prev").onclick=()=>{
  if(audio.currentTime>3) audio.currentTime=0;
  else{
    current=(current-1+tracks.length)%tracks.length;
    select(current);
    if(audio.src) audio.play();
  }
};

document.getElementById("forward10").onclick=()=>{
  if(audio.src) audio.currentTime=Math.min(audio.duration,audio.currentTime+10);
};

document.getElementById("back10").onclick=()=>{
  if(audio.src) audio.currentTime=Math.max(0,audio.currentTime-10);
};

document.getElementById("shuffle").onclick=()=>{
  shuffle=!shuffle;
  document.getElementById("shuffle").style.opacity=shuffle?"1":".45";
};

document.getElementById("repeat").onclick=()=>{
  repeat=!repeat;
  document.getElementById("repeat").style.opacity=repeat?"1":".45";
};

volume.oninput=()=>audio.volume=volume.value;

audio.ontimeupdate=()=>{
  if(audio.duration) progress.value=audio.currentTime/audio.duration*100;
  currentTime.textContent=formatTime(audio.currentTime);
};

audio.onloadedmetadata=()=>{
  duration.textContent=formatTime(audio.duration);
};

progress.oninput=()=>{
  if(audio.duration) audio.currentTime=progress.value/100*audio.duration;
};

audio.onplay=()=>play.textContent="Ⅱ";
audio.onpause=()=>play.textContent="▶";

audio.onended=()=>{
  if(repeat){
    audio.currentTime=0;
    audio.play();
  }else{
    document.getElementById("next").click();
  }
};

render();
select(0);
audio.volume=.8;