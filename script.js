let data=[];
const diffBtns=document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns=document.querySelectorAll('#roomButtons .filter-btn');
const searchInput=document.getElementById('teamSearch');
const listDiv=document.getElementById('list');
const curr=document.getElementById('currentFilter');
let selectedDiff='normal',selectedRoom='small';
function render(){
  const roomText=selectedRoom==='small'?'소형':selectedRoom==='medium'?'중형':'대형';
  curr.textContent=`${selectedDiff.toUpperCase()} ${roomText}`;
  const arr=data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom).sort((a,b)=>b.allscore-a.allscore);
  listDiv.innerHTML='';
  arr.forEach((item,i)=>{
    const rank=i+1;
    const card=document.createElement('div');card.className='card';if(rank===1)card.classList.add('first');
    const r=document.createElement('div');r.className='rank';r.textContent=rank;card.appendChild(r);
    const info=document.createElement('div');info.className='info';info.innerHTML=`<div class="team">${item.team}<span class="score-large">${item.allscore}</span></div><div class="meta"><span class="timestamp">${new Date(item.start_time).toLocaleString()}</span><span class="map">Map: ${item.map}</span></div>`;
    card.appendChild(info);
    listDiv.appendChild(card);
  });
}
diffBtns.forEach(btn=>btn.addEventListener('click',()=>{diffBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');selectedDiff=btn.dataset.filter;render();}));
roomBtns.forEach(btn=>btn.addEventListener('click',()=>{roomBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');selectedRoom=btn.dataset.filter;render();}));
searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){const q=searchInput.value.trim().toLowerCase();const m=data.find(x=>x.team.toLowerCase().includes(q));if(m){diffBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter===m.difficulty));roomBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter===m.roomSize));selectedDiff=m.difficulty;selectedRoom=m.roomSize;render();}else alert('해당 팀명을 찾을 수 없습니다.');searchInput.value='';}});
window.addEventListener('load',()=>{fetch('data.json').then(r=>r.json()).then(j=>{data=j;render();}).catch(e=>console.error(e));});
