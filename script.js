// script.js

let data = [];

const diffBtns    = document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns    = document.querySelectorAll('#roomButtons .filter-btn');
const searchInput = document.getElementById('teamSearch');
const list        = document.getElementById('list');
const curr        = document.getElementById('currentFilter');

let selectedDiff = 'normal';
let selectedRoom = 'small';

// 한글 매핑
const DIFF_KOR = { basic: '베이직', easy: '이지', normal: '노말', hard: '하드' };
const ROOM_KOR = { small: '소형', medium: '중형', large: '대형' };

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
  const mapDisp = item.map.startsWith('level-')
    ? 'Lv' + item.map.split('-')[1]
    : item.map;

  info.innerHTML = `
    <div class="team">${item.team}<span class="score-large">${item.allscore}</span></div>
    <div class="search-meta">난이도: ${DIFF_KOR[item.difficulty]} | 방크기: ${ROOM_KOR[item.roomSize]}</div>
    <div class="meta"><span class="timestamp">${new Date(item.start_time).toLocaleString()}</span>
    <span class="map">${mapDisp}</span></div>
  `;
  card.appendChild(info);
  return card;
}

function render() {
  const diffLabel = DIFF_KOR[selectedDiff] || selectedDiff;
  const roomLabel = ROOM_KOR[selectedRoom] || selectedRoom;
  curr.textContent = `${diffLabel} ${roomLabel}`;

  list.innerHTML = '';
  const base = data
    .filter(x => x.difficulty === selectedDiff && x.roomSize === selectedRoom)
    .sort((a,b) => b.allscore - a.allscore);

  base.forEach((item, i) => list.appendChild(createCard(item, i+1)));
}

// 버튼 이벤트
diffBtns.forEach(b => b.addEventListener('click', () => {
  diffBtns.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  selectedDiff = b.dataset.filter;
  render();
}));
roomBtns.forEach(b => b.addEventListener('click', () => {
  roomBtns.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  selectedRoom = b.dataset.filter;
  render();
}));

// 검색
searchInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const q = searchInput.value.trim().toLowerCase();
  searchInput.value = '';
  if (!q) { render(); return; }

  list.innerHTML = '';
  const matches = data.filter(x => x.team.toLowerCase().includes(q));
  matches.forEach(item => {
    const group = data
      .filter(x => x.difficulty === item.difficulty && x.roomSize === item.roomSize)
      .sort((a,b) => b.allscore - a.allscore);
    const rank = group.findIndex(x => x === item) + 1;
    const card = createCard(item, rank);

    const teamDiv = card.querySelector('.team');
    const regex = new RegExp(q, 'gi');
    teamDiv.innerHTML = teamDiv.textContent.replace(regex, m => `<span class="highlight">${m}</span>`) + teamDiv.querySelector('.score-large').outerHTML;
    list.appendChild(card);
  });
});

// 초기
window.addEventListener('load', () => {
  fetch('data.json')
    .then(r => r.json())
    .then(j => { data = j; render(); })
    .catch(err => console.error('데이터 로딩 실패', err));
});
