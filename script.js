let data = [];

const diffBtns = document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns = document.querySelectorAll('#roomButtons .filter-btn');
const colL = document.getElementById('colLeft');
const colR = document.getElementById('colRight');
const curr = document.getElementById('currentFilter');
const teamSearch = document.getElementById('teamSearch');

let selectedDiff = 'normal';
let selectedRoom = 'small';

function updateButtons(filterType, value) {
  const btns = filterType === 'difficulty' ? diffBtns : roomBtns;
  btns.forEach(b => {
    if (b.dataset.filter === value) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
}

function render() {
  curr.textContent = `${selectedDiff.toUpperCase()} ${selectedRoom === 'small' ? '소형' : selectedRoom === 'medium' ? '중형' : '대형'}`;

  const arr = data
    .filter(x => x.difficulty === selectedDiff && x.roomSize === selectedRoom)
    .sort((a,b) => b.score - a.score);

  const half = Math.ceil(arr.length/2);
  const left = arr.slice(0, half), right = arr.slice(half);
  colL.innerHTML = '';
  colR.innerHTML = '';

  [left, right].forEach((list, ci) => {
    const container = ci === 0 ? colL : colR;
    list.forEach((item, i) => {
      const rankOverall = ci*half + i + 1;
      const card = document.createElement('div');
      card.className = 'card';
      if (rankOverall === 1) card.classList.add('first');

      const rank = document.createElement('div');
      rank.className = 'rank';
      rank.textContent = rankOverall;
      card.appendChild(rank);

      const info = document.createElement('div');
      info.className = 'info';
      info.innerHTML = `
        <div class="team">${item.team}</div>
        <div class="score-large">${item.score}</div>
        <div class="score">${new Date(item.timestamp).toLocaleString()}</div>
      `;
      card.appendChild(info);

      container.appendChild(card);
    });
  });
}

diffBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedDiff = btn.dataset.filter;
    updateButtons('difficulty', selectedDiff);
    render();
  });
});
roomBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedRoom = btn.dataset.filter;
    updateButtons('room', selectedRoom);
    render();
  });
});

teamSearch.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const name = teamSearch.value.trim();
    const found = data.find(x => x.team === name);
    if (found) {
      selectedDiff = found.difficulty;
      selectedRoom = found.roomSize;
      updateButtons('difficulty', selectedDiff);
      updateButtons('room', selectedRoom);
      render();
      // 검색된 팀 카드로 스크롤
      setTimeout(() => {
        const cards = document.querySelectorAll('.card .team');
        cards.forEach(el => {
          if (el.textContent === name) el.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }, 100);
    }
  }
});

window.addEventListener('load', () => {
  fetch('data.json')
    .then(res => res.json())
    .then(json => { data = json; render(); })
    .catch(err => console.error('데이터 로딩 실패', err));
});
