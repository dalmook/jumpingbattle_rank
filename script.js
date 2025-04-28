let data = [];

const diffBtns = document.querySelectorAll('#difficultyButtons .filter-btn');
const roomBtns = document.querySelectorAll('#roomButtons .filter-btn');
const colL = document.getElementById('colLeft');
const colR = document.getElementById('colRight');
const curr = document.getElementById('currentFilter');

let selectedDiff = 'normal';
let selectedRoom = 'small';

function render() {
  curr.textContent = `${selectedDiff.toUpperCase()} ${selectedRoom === 'small' ? '소형' : selectedRoom === 'medium' ? '중형' : '대형'}`;

  const arr = data
    .filter(x=> x.difficulty === selectedDiff && x.roomSize === selectedRoom)
    .sort((a,b)=>b.score-a.score);

  const half = Math.ceil(arr.length/2);
  const left = arr.slice(0, half), right = arr.slice(half);
  colL.innerHTML=''; colR.innerHTML='';

  [left, right].forEach((list, ci)=>{
    const container = ci===0? colL : colR;
    list.forEach((item, i)=>{
      const rankOverall = ci*half + i +1;
      const card = document.createElement('div');
      card.className = 'card';
      if(rankOverall === 1) card.classList.add('first');

      const rank = document.createElement('div');
      rank.className = 'rank';
      rank.textContent = rankOverall;
      card.appendChild(rank);

      const info = document.createElement('div');
      info.className = 'info';
      info.innerHTML = `
        <div class="team">
          ${item.team}
          ${item.isNew ? '<span class="ribbon">NEW</span>' : ''}
        </div>
        <div class="score">Score: ${item.score}</div>`;
      card.appendChild(info);

      container.appendChild(card);
    });
  });
}

diffBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    diffBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedDiff = btn.dataset.filter;
    render();
  });
});
roomBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    roomBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedRoom = btn.dataset.filter;
    render();
  });
});

window.addEventListener('load', ()=>{
  fetch('data.json')
    .then(res=>res.json())
    .then(json=>{
      data = json;
      render();
    })
    .catch(err=>console.error('데이터 로딩 실패', err));
});
