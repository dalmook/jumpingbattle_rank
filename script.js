// script.js

let data = [];

// DOM elements
const diffBtns    = document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns    = document.querySelectorAll('#roomButtons .filter-btn');
const searchInput = document.getElementById('teamSearch');
const list        = document.getElementById('list');
const curr        = document.getElementById('currentFilter');

let selectedDiff = 'normal';
let selectedRoom = 'small';

// 카드 생성 함수
function createCard(item, rank) {
  const card = document.createElement('div');
  card.className = 'card';
  card.addEventListener('click', () => card.classList.toggle('selected'));

  // 랭크
  const r = document.createElement('div');
  r.className = 'rank';
  r.textContent = rank;
  card.appendChild(r);

  // 정보
  const info = document.createElement('div');
  info.className = 'info';
  const mapDisp = item.map.startsWith('level-')
    ? 'Lv' + item.map.split('-')[1]
    : item.map;
  info.innerHTML = `
    <div class="team">${item.team}<span class="score-large">${item.allscore}</span></div>
    <div class="search-meta">난이도: ${item.difficulty.toUpperCase()} | 방크기: ${item.roomSize}</div>
    <div class="meta"><span class="timestamp">${new Date(item.start_time).toLocaleString()}</span>
    <span class="map">${mapDisp}</span></div>
  `;
  card.appendChild(info);

  return card;
}

// 전체 렌더 (필터 기준)
function render() {
  curr.textContent = `${selectedDiff.toUpperCase()} ${selectedRoom==='small'?'소형':selectedRoom==='medium'?'중형':'대형'}`;
  list.innerHTML = '';
  const base = data
    .filter(x => x.difficulty===selectedDiff && x.roomSize===selectedRoom)
    .sort((a,b)=>b.allscore - a.allscore);
  base.forEach((item,i) => list.appendChild(createCard(item, i+1)));
}

// 필터 버튼 이벤트
diffBtns.forEach(b=>b.addEventListener('click', ()=>{
  diffBtns.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  selectedDiff = b.dataset.filter;
  render();
}));
roomBtns.forEach(b=>b.addEventListener('click', ()=>{
  roomBtns.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  selectedRoom = b.dataset.filter;
  render();
}));

// 검색 (전체 데이터 기반)
searchInput.addEventListener('keydown', e=>{
  if(e.key!=='Enter') return;
  const q = searchInput.value.trim().toLowerCase();
  searchInput.value = '';
  if(!q) { render(); return; }

  // 전체 데이터 전역 정렬
  const global = data.slice().sort((a,b)=>b.allscore - a.allscore);
  const matches = global.filter(x=>x.team.toLowerCase().includes(q));
  list.innerHTML = '';
  matches.forEach(item=>{
    const rank = global.findIndex(x=>x===item)+1;
    const card = createCard(item, rank);
    // 팀명 하이라이트 (모든 매치)
    const teamDiv = card.querySelector('.team');
    teamDiv.innerHTML = teamDiv.textContent.replace(new RegExp(q,'gi'), m=>`<span class="highlight">${m}</span>`)
      + teamDiv.querySelector('.score-large').outerHTML;
    list.appendChild(card);
  });
});

// 초기 로드
window.addEventListener('load', ()=>{
  fetch('data.json').then(r=>r.json()).then(j=>{ data=j; render(); });
});
