let data=[];
const diffBtns=document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns=document.querySelectorAll('#roomButtons .filter-btn');
const searchInput=document.getElementById('teamSearch');
const list=document.getElementById('list');
const curr=document.getElementById('currentFilter');
let selectedDiff='normal', selectedRoom='small';

function createCard(item,index,highlightQ){
  const card=document.createElement('div');card.className='card';
  if(index===0)card.classList.add('first');
  card.addEventListener('click',()=>card.classList.toggle('selected'));
  const rank=document.createElement('div');rank.className='rank';rank.textContent=index+1;card.appendChild(rank);
  const info=document.createElement('div');info.className='info';
  let teamTxt=item.team;
  if(highlightQ){
    const regex=new RegExp(`(${highlightQ})`,'ig');
    teamTxt=teamTxt.replace(regex,'<span class="highlight">$1</span>');
  }
  const mapDisp=item.map.startsWith('level-')? 'Lv'+item.map.split('-')[1]:item.map;
  info.innerHTML=`<div class="team">${teamTxt}<span class="score-large">${item.allscore}</span></div>
    <div class="meta"><span class="timestamp">${new Date(item.start_time).toLocaleString()}</span>
    <span class="map">${mapDisp}</span></div>`;
  card.appendChild(info);
  return card;
}

function render(filtered,highlightQ){
  curr.textContent=`${selectedDiff.toUpperCase()} ${selectedRoom==='small'?'소형':selectedRoom==='medium'?'중형':'대형'}`;
  list.innerHTML='';
  const arr=filtered.sort((a,b)=>b.allscore-a.allscore);
  arr.forEach((item,i)=>list.appendChild(createCard(item,i,highlightQ)));
}

diffBtns.forEach(b=>b.addEventListener('click',()=>{
  diffBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');
  selectedDiff=b.dataset.filter; render(data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom));
}));
roomBtns.forEach(b=>b.addEventListener('click',()=>{
  roomBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');
  selectedRoom=b.dataset.filter; render(data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom));
}));

searchInput.addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    const q=searchInput.value.trim();
    searchInput.value='';
    if(!q){ render(data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom));return; }
    const matches=data.filter(x=>x.team.toLowerCase().includes(q.toLowerCase()));
    render(matches,q);
  }
});

window.addEventListener('load',()=>{
  fetch('data.json').then(r=>r.json()).then(j=>{data=j; render(data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom));});
});
