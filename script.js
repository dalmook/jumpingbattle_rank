let data = [];

// 필터 버튼 및 검색창, 컬럼, 현재 필터 표시 엘리먼트 참조
const diffBtns    = document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns    = document.querySelectorAll('#roomButtons .filter-btn');
const searchInput = document.getElementById('teamSearch');
const colL        = document.getElementById('colLeft');
const colR        = document.getElementById('colRight');
const curr        = document.getElementById('currentFilter');

// 초기 선택 상태
let selectedDiff = 'normal';
let selectedRoom = 'small';

// 랭킹 카드 렌더링 함수
function render() {
  // 헤더에 현재 필터 텍스트 표시
  const roomText = selectedRoom === 'small' ? '소형'
                 : selectedRoom === 'medium' ? '중형'
                 : '대형';
  curr.textContent = `${selectedDiff.toUpperCase()} ${roomText}`;

  // 데이터 필터링 후 점수 기준 내림차순 정렬
  const arr = data
    .filter(x => x.difficulty === selectedDiff && x.roomSize === selectedRoom)
    .sort((a,b) => b.allscore - a.allscore);

  // 좌/우 컬럼으로 분할
  const half = Math.ceil(arr.length / 2);
  const left  = arr.slice(0, half);
  const right = arr.slice(half);

  colL.innerHTML = '';
  colR.innerHTML = '';

  [left, right].forEach((list, ci) => {
    const container = ci === 0 ? colL : colR;
    list.forEach((item, i) => {
      const rankOverall = ci * half + i + 1;

      // 카드 요소
      const card = document.createElement('div');
      card.className = 'card';
      if (rankOverall === 1) card.classList.add('first');

      // 순위 원
      const rank = document.createElement('div');
      rank.className = 'rank';
      rank.textContent = rankOverall;
      card.appendChild(rank);

      // 정보 영역
      const info = document.createElement('div');
      info.className = 'info';
      info.innerHTML = `
        <div class="team">
          ${item.team}
          <span class="score-large">${item.allscore}</span>
        </div>
        <div class="meta">
          <span class="timestamp">${new Date(item.start_time).toLocaleString()}</span>
          <span class="map">Map: ${item.map}</span>
        </div>
      `;
      card.appendChild(info);

      container.appendChild(card);
    });
  });
}

// 난이도 버튼 클릭 이벤트
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    diffBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDiff = btn.dataset.filter;
    render();
  });
});

// 방 크기 버튼 클릭 이벤트
roomBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    roomBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRoom = btn.dataset.filter;
    render();
  });
});

// 팀명 검색 (부분 일치, 엔터 시 실행, 검색창 클리어)
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim().toLowerCase();
    const match = data.find(x => x.team.toLowerCase().includes(query));
    if (match) {
      diffBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === match.difficulty));
      roomBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === match.roomSize));
      selectedDiff = match.difficulty;
      selectedRoom = match.roomSize;
      render();
    } else {
      alert('해당 팀명을 찾을 수 없습니다.');
    }
    searchInput.value = '';
  }
});

// 페이지 로드 시 JSON 데이터 읽어와 렌더링
window.addEventListener('load', () => {
  fetch('data.json')
    .then(res => res.json())
    .then(json => {
      data = json;
      render();
    })
    .catch(err => console.error('데이터 로딩 실패', err));
});
