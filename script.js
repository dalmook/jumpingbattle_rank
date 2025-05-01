// script.js

let data = [];

// DOM 참조
const diffBtns    = document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns    = document.querySelectorAll('#roomButtons .filter-btn');
const searchInput = document.getElementById('teamSearch');
const list        = document.getElementById('list');
const curr        = document.getElementById('currentFilter');

let selectedDiff = 'normal';
let selectedRoom = 'small';

// 카드 생성 함수 (item, rank)
function createCard(item, rank) {
  const card = document.createElement('div');
  card.className = 'card';

  // 선택된 카드이면 확대 유지
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
  });

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

// 렌더 (필터된 전체 랭킹)
function render() {
  curr.textContent = `${selectedDiff.toUpperCase()} ${selectedRoom==='small'?'소형':selectedRoom==='medium'?'중형':'대형'}`;
  list.innerHTML = '';

  // 필터+정렬
  const base = data
    .filter(x => x.difficulty === selectedDiff && x.roomSize === selectedRoom)
    .sort((a,b) => b.allscore - a.allscore);

  // 1열로 순차 렌더
  base.forEach((item,i) => {
    const card = createCard(item, i+1);
    list.appendChild(card);
  });
}

// 난이도/방크기 버튼 이벤트
diffBtns.forEach(b => b.addEventListener('click', () => {
  diffBtns.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  selectedDiff = b.dataset.filter;
  render();
}));
roomBtns.forEach(b => b.addEventListener('click', () => {
  roomBtns.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  selectedRoom = b.dataset.filter;
  render();
}));

// 검색 기능 (Enter)
searchInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const q = searchInput.value.trim().toLowerCase();
  searchInput.value = '';

  // 빈 검색어면 전체 렌더
  if (!q) {
    render();
    return;
  }

  // 원본 필터+정렬 배열
  const base = data
    .filter(x => x.difficulty === selectedDiff && x.roomSize === selectedRoom)
    .sort((a,b) => b.allscore - a.allscore);

  // 검색어 포함된 항목만
  const matches = base.filter(x => x.team.toLowerCase().includes(q));

  list.innerHTML = '';
  matches.forEach(item => {
    // 원본 순위 계산
    const rank = base.findIndex(x => x === item) + 1;
    const card = createCard(item, rank);

    // 팀명 하이라이트 (모든 매치 부분)
    const teamDiv = card.querySelector('.team');
    const regex = new RegExp(q, 'gi');
    teamDiv.innerHTML = teamDiv.textContent
      .replace(regex, match => `<span class="highlight">${match}</span>`)
      + teamDiv.querySelector('.score-large').outerHTML;

    list.appendChild(card);
  });
});

// 초기 로드
window.addEventListener('load', () => {
  fetch('data.json')
    .then(r => r.json())
    .then(j => { data = j; render(); })
    .catch(err => console.error('데이터 로딩 실패', err));
});
