// script.js
let data = [];
const diffBtns    = document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns    = document.querySelectorAll('#roomButtons .filter-btn');
const searchInput = document.getElementById('teamSearch');
const list        = document.getElementById('list');
const curr        = document.getElementById('currentFilter');
let selectedDiff  = 'normal';
let selectedRoom  = 'small';

function createCard(item, rank) {
  const card = document.createElement('div');
  card.className = 'card';
  card.addEventListener('click', () => card.classList.toggle('selected'));

  const r = document.createElement('div');
  r.className = 'rank';
  r.textContent = rank;
  card.appendChild(r);

  const info = document.createElement('div');
  info.className = 'info';
  const mapDisp = item.map.startsWith('level-') ? 'Lv'+item.map.split('-')[1] : item.map;
  info.innerHTML = `
    <div class="team">${item.team}<span class="score-large">${item.allscore}</span></div>
    <div class="search-meta">난이도: ${item.difficultyMap} | 방크기: ${item.roomSizeMap}</div>
    <div class="meta"><span class="timestamp">${new Date(item.start_time).toLocaleString()}</span>
    <span class="map">${mapDisp}</span></div>
  `;
  card.appendChild(info);
  return card;
}

function render(base) {
  list.innerHTML = '';
  base.forEach((item, i) => list.appendChild(createCard(item, i+1)));
}

// 필터 함수로 묶기
function getFiltered() {
  return data
    .filter(x => x.difficulty === selectedDiff && x.roomSize === selectedRoom)
    .sort((a,b) => b.allscore - a.allscore)
    .map(x => ({
      ...x,
      difficultyMap: { basic:'베이직', easy:'이지', normal:'노말', hard:'하드' }[x.difficulty],
      roomSizeMap:   { small:'소형', medium:'중형', large:'대형' }[x.roomSize]
    }));
}

diffBtns.forEach(b => b.addEventListener('click', () => {
  diffBtns.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  selectedDiff = b.dataset.filter;
  curr.textContent = b.textContent + ' ' + curr.textContent.split(' ')[1];
  render(getFiltered());
}));
roomBtns.forEach(b => b.addEventListener('click', () => {
  roomBtns.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  selectedRoom = b.dataset.filter;
  curr.textContent = curr.textContent.split(' ')[0] + ' ' + b.textContent;
  render(getFiltered());
}));

searchInput.addEventListener('keydown', e => {
  if(e.key !== 'Enter') return;
  const q = searchInput.value.trim().toLowerCase();
  searchInput.value = '';
  if(!q) return render(getFiltered());

  // 전체 데이터에서 검색
  const matches = data.filter(x => x.team.toLowerCase().includes(q))
    .map(x => ({
      ...x,
      difficultyMap: { basic:'베이직', easy:'이지', normal:'노말', hard:'하드' }[x.difficulty],
      roomSizeMap:   { small:'소형', medium:'중형', large:'대형' }[x.roomSize]
    }));

  list.innerHTML = '';
  matches.forEach(item => {
    // 그룹 내 순위 유지
    const group = data.filter(x=>x.difficulty===item.difficulty && x.roomSize===item.roomSize)
                      .sort((a,b)=>b.allscore-a.allscore);
    const rank = group.findIndex(x=>x.team===item.team && x.start_time===item.start_time)+1;
    const card = createCard(item, rank);
    const teamDiv = card.querySelector('.team');
    teamDiv.innerHTML = teamDiv.textContent.replace(new RegExp(q,'gi'), m=>`<span class="highlight">${m}</span>`) + teamDiv.querySelector('.score-large').outerHTML;
    list.appendChild(card);
  });
});

// 초기 로드: Firebase에서 데이터 가져오기
window.addEventListener('load', () => {
  firebase.database().ref('/').once('value').then(snap => {
    data = Object.values(snap.val() || {});
    render(getFiltered());
  });
});
