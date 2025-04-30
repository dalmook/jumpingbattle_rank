let data=[],
 diffBtns=document.querySelectorAll('#difficultyButtons .filter-btn'),
 roomBtns=document.querySelectorAll('#roomButtons .filter-btn'),
 searchInput=document.getElementById('teamSearch'),
 list=document.getElementById('list'),
 curr=document.getElementById('currentFilter'),
 selectedDiff='normal', selectedRoom='small';

function render(){
  curr.textContent=`${selectedDiff.toUpperCase()} ${selectedRoom==='small'?'소형':selectedRoom==='medium'?'중형':'대형'}`;
  list.innerHTML='';
  let arr=data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom)
              .sort((a,b)=>b.allscore-a.allscore);
  arr.forEach((item,i)=>{
    let card=document.createElement('div');card.className='card'; 
    if(i===0)card.classList.add('first');
    let rank=document.createElement('div');rank.className='rank';rank.textContent=i+1;card.appendChild(rank);
    let info=document.createElement('div');info.className='info';
    let mapDisp=item.map.startsWith('level-')? 'Lv'+item.map.split('-')[1]:item.map;
    info.innerHTML=`
      <div class="team">${item.team}<span class="score-large">${item.allscore}</span></div>
      <div class="meta"><span class="timestamp">${new Date(item.start_time).toLocaleString()}</span>
      <span class="map">${mapDisp}</span></div>`;
    card.appendChild(info); list.appendChild(card);
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
  if(e.key==='Enter'){
    let q=searchInput.value.trim().toLowerCase(),
        m=data.find(x=>x.team.toLowerCase().includes(q));
    if(m){
      diffBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter===m.difficulty));
      roomBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter===m.roomSize));
      selectedDiff=m.difficulty; selectedRoom=m.roomSize; render();
    } else alert('해당 팀명을 찾을 수 없습니다.');
    searchInput.value='';
  }
});
window.addEventListener('load',()=>{
  fetch('data.json').then(r=>r.json()).then(j=>{data=j;render();});
});
