let data = [];
const diffBtns    = document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns    = document.querySelectorAll('#roomButtons .filter-btn');
const searchInput = document.getElementById('teamSearch');
const list        = document.getElementById('list');
const curr        = document.getElementById('currentFilter');
let selectedDiff  = 'normal', selectedRoom = 'small';

function render(arr=null) {
  curr.textContent = `${selectedDiff.toUpperCase()} ${selectedRoom==='small'?'소형':selectedRoom==='medium'?'중형':'대형'}`;
  const source = arr || data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom);
  list.innerHTML = '';
  source.sort((a,b)=>b.allscore-a.allscore)
        .forEach((item,i)=>{
    const card = document.createElement('div'); card.className='card';
    if(!arr && i===0) card.classList.add('first');
    const rank = document.createElement('div'); rank.className='rank';
    rank.textContent = arr ? item.rank : i+1;
    card.appendChild(rank);
    const info = document.createElement('div'); info.className='info';
    const mapDisp = item.map.startsWith('level-')? 'Lv'+item.map.split('-')[1] : item.map;
    info.innerHTML = `
      <div class="team">${item.team}<span class="score-large">${item.allscore}</span></div>
      <div class="meta"><span class="timestamp">${new Date(item.start_time).toLocaleString()}</span>
      <span class="map">${mapDisp}</span></div>`;
    card.appendChild(info);
    list.appendChild(card);
  });
}

diffBtns.forEach(b=>b.addEventListener('click',()=>{
  diffBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active');
  selectedDiff=b.dataset.filter; render();
}));
roomBtns.forEach(b=>b.addEventListener('click',()=>{
  roomBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active');
  selectedRoom=b.dataset.filter; render();
}));

searchInput.addEventListener('keydown',e=>{
  if(e.key!=='Enter') return;
  const q=searchInput.value.trim().toLowerCase(); searchInput.value='';
  if(!q) { render(); return; }
  const base = data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom)
                   .sort((a,b)=>b.allscore-a.allscore);
  const matches = base.filter(x=>x.team.toLowerCase().includes(q));
  render(matches);
  // 하이라이트 모든 매치
  document.querySelectorAll('.team').forEach(el=>{
    const txt=el.textContent;
    const regex=new RegExp(`(${q})`,'ig');
    el.innerHTML=txt.replace(regex,'<span class="highlight">$1</span>')+el.querySelector('.score-large').outerHTML;
  });
});

window.addEventListener('load',()=>{
  fetch('data.json').then(r=>r.json()).then(j=>{ data=j; render(); });
});
