let data=[];
const diffBtns=document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns=document.querySelectorAll('#roomButtons .filter-btn');
const searchInput=document.getElementById('teamSearch');
const list=document.getElementById('list');
const curr=document.getElementById('currentFilter');
let selectedDiff='normal', selectedRoom='small';

function render(){
  curr.textContent=`${selectedDiff.toUpperCase()} ${selectedRoom==='small'?'소형':selectedRoom==='medium'?'중형':'대형'}`;
  list.innerHTML='';
  const arr=data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom)
               .sort((a,b)=>b.allscore-a.allscore);
  arr.forEach((item,i)=>{
    const card=document.createElement('div');card.className='card';
    if(i===0)card.classList.add('first');
    card.addEventListener('click',()=>card.classList.toggle('selected'));
    const rank=document.createElement('div');rank.className='rank';rank.textContent=i+1;card.appendChild(rank);
    const info=document.createElement('div');info.className='info';
    const mapDisp=item.map.startsWith('level-')?`Lv${item.map.split('-')[1]}`:item.map;
    info.innerHTML=`<div class="team">${item.team}<span class="score-large">${item.allscore}</span></div>
      <div class="meta"><span class="timestamp">${new Date(item.start_time).toLocaleString()}</span>
      <span class="map">${mapDisp}</span></div>`;
    card.appendChild(info); list.appendChild(card);
  });
}

diffBtns.forEach(b=>b.addEventListener('click',()=>{diffBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedDiff=b.dataset.filter;render();}));
roomBtns.forEach(b=>b.addEventListener('click',()=>{roomBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedRoom=b.dataset.filter;render();}));
searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){const q=searchInput.value.trim().toLowerCase();const matches=data.filter(x=>x.team.toLowerCase().includes(q));if(matches.length){diffBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter===matches[0].difficulty));roomBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter===matches[0].roomSize));selectedDiff=matches[0].difficulty;selectedRoom=matches[0].roomSize;render();setTimeout(()=>{document.querySelectorAll('.card').forEach(c=>{const txt=c.querySelector('.team').textContent.toLowerCase();if(txt.includes(q)){c.scrollIntoView({behavior:'smooth',block:'center'});c.querySelector('.team').innerHTML=c.querySelector('.team').textContent.replace(new RegExp(q,'gi'),m=>`<span class="highlight">${m}</span>`);}});},100);}else alert('해당 팀명을 찾을 수 없습니다.');searchInput.value='';}});
window.addEventListener('load',()=>{fetch('data.json').then(r=>r.json()).then(j=>{data=j;render();}).catch(console.error);});
