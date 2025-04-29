// ranking data will be loaded from data.json
let data = [];

// 버튼과 DOM 엘리먼트 참조
const diffBtns = document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns = document.querySelectorAll('#roomButtons .filter-btn');
const searchInput = document.getElementById('teamSearch');
const colL = document.getElementById('colLeft');
const colR = document.getElementById('colRight');
const curr = document.getElementById('currentFilter');

// 현재 선택된 필터 상태
let selectedDiff = 'normal';
let selectedRoom = 'small';

// 랭킹 렌더링 함수
function render() {
  // 헤더 필터 상태 표시
  const roomText = selectedRoom === 'small' ? '소형' : selectedRoom === 'medium' ? '중형' : '대형';
  curr.textContent = `${selectedDiff.toUpperCase()} ${roomText}`;

  // 데이터 필터링·정렬
  const arr = data
    .filter(x => x.difficulty === selectedDiff && x.roomSize === selectedRoom)
    .sort((a,b) => b.score - a.score);

  // 좌우 컬럼 분할
  const half = Math.ceil(arr.length / 2);
  const left = arr.slice(0, half), right = arr.slice(half);

  colL.innerHTML = '';
  colR.innerHTML = '';

  [left, right].forEach((list, ci) => {
    const container = ci === 0 ? colL : colR;
    list.forEach((item, i) => {
      const rankOverall = ci * half + i + 1;
      const card = document.createElement('div');
      card.className = 'card';
      if (rankOverall === 1) card.classList.add('first');

      // 순위 원
      const rank = document.createElement('div');
      rank.className = 'rank';
      rank.textContent = rankOverall;
      card.appendChild(rank);

      // 팀명·점수·타임스탬프
      const info = document.createElement('div');
      info.className = 'info';
      info.innerHTML = `
        <div class="team">
          ${item.team}
          ${item.isNew ? '<span class="ribbon">NEW</span>' : ''}
          <span class="score-large">${item.score}</span>
        </div>
        <div class="timestamp">${new Date(item.timestamp).toLocaleString()}</div>
      `;
      card.appendChild(info);

      container.appendChild(card);
    });
  });
}

// 난이도 버튼 클릭 처리
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    diffBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDiff = btn.dataset.filter;
    render();
  });
});

// 방크기 버튼 클릭 처리
roomBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    roomBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRoom = btn.dataset.filter;
    render();
  });
});

// 팀명 검색 처리 (부분 일치, 가장 첫 매치)
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim().toLowerCase();
    const match = data.find(x => x.team.toLowerCase().includes(query));
    if (match) {
      // 해당 난이도 버튼 활성화
      diffBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === match.difficulty));
      selectedDiff = match.difficulty;
      // 해당 방크기 버튼 활성화
      roomBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === match.roomSize));
      selectedRoom = match.roomSize;
      render();
    } else {
      alert('해당 팀명을 찾을 수 없습니다.');
    }
  }
});

// 페이지 로드 시 JSON 데이터 불러오기
window.addEventListener('load', () => {
  fetch('data.json')
    .then(res => res.json())
    .then(json => {
      data = json;
      render();
    })
    .catch(err => console.error('데이터 로딩 실패', err));
});
