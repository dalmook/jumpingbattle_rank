let data=[];
const diffBtns=document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns=document.querySelectorAll('#roomButtons .filter-btn');
const searchInput=document.getElementById('teamSearch');
const list=document.getElementById('list');
const curr=document.getElementById('currentFilter');
let selectedDiff='normal',selectedRoom='small';

function render(){
  curr.textContent=`${selectedDiff.toUpperCase()} ${selectedRoom==='small'?'소형':selectedRoom==='medium'?'중형':'대형'}`;
  list.innerHTML='';
  data.filter(x=>x.difficulty===selectedDiff&&x.roomSize===selectedRoom)
      .sort((a,b)=>b.allscore-a.allscore)
      .forEach((item,i)=>{
        const card=document.createElement('div');card.className='card';
        if(i===0)card.classList.add('first');
        const rank=document.createElement('div');rank.className='rank';rank.textContent=i+1;card.appendChild(rank);
        const info=document.createElement('div');info.className='info';
        const mapDisp=item.map.startsWith('level-')?`Lv${item.map.split('-')[1]}`:item.map;
        info.innerHTML=`<div class="team">${item.team}<span class="score-large">${item.allscore}</span></div>
          <div class="meta"><span class="timestamp">${new Date(item.start_time).toLocaleString()}</span>
          <span class="map">${mapDisp}</span></div>`;
        card.appendChild(info);
        list.appendChild(card);
      });
}

diffBtns.forEach(b=>b.addEventListener('click',()=>{diffBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedDiff=b.dataset.filter;render();}));
roomBtns.forEach(b=>b.addEventListener('click',()=>{roomBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedRoom=b.dataset.filter;render();}));

searchInput.addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    const q=searchInput.value.trim().toLowerCase();
    // 필터 이동
    const matches=data.filter(x=>x.team.toLowerCase().includes(q));
    if(matches.length){
      const m=matches[0];
      diffBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter===m.difficulty));
      roomBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter===m.roomSize));
      selectedDiff=m.difficulty;selectedRoom=m.roomSize;render();
      // 강조 & 스크롤
      setTimeout(()=>{
        document.querySelectorAll('.team').forEach(div=>{
          const txt=div.textContent;
          const regex=new RegExp(`(${q})`,'gi');
          if(regex.test(txt)){
            div.innerHTML=txt.replace(regex,'<span class="highlight">$1</span>')+div.querySelector('.score-large').outerHTML;
          }
        });
        const first=document.querySelector('.highlight');
        if(first)first.closest('.card').scrollIntoView({behavior:'smooth',block:'center'});
      },100);
    } else alert('해당 팀명을 찾을 수 없습니다.');
    searchInput.value='';
  }
});

window.addEventListener('load',()=>{fetch('data.json').then(r=>r.json()).then(j=>{data=j;render();});});
