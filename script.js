const data = [
  { team:"시시케틀", score:4379, difficulty:"normal", roomSize:"small", isNew:false },
  { team:"앙큼별", score:4155, difficulty:"normal", roomSize:"small", isNew:true  },
  { team:"똘봉즈", score:3330, difficulty:"normal", roomSize:"small", isNew:false },
  { team:"헌지선우콜잘죽", score:4300, difficulty:"normal", roomSize:"small", isNew:false },
  { team:"똘봉즈1", score:3630, difficulty:"normal", roomSize:"small", isNew:false },
  { team:"헌지선우", score:3800, difficulty:"normal", roomSize:"small", isNew:false },
  { team:"똘즈", score:230, difficulty:"normal", roomSize:"small", isNew:false },
  { team:"우콜잘죽", score:1300, difficulty:"normal", roomSize:"small", isNew:false },
  { team:"즈", score:630, difficulty:"normal", roomSize:"small", isNew:false },
  { team:"헌지", score:9300, difficulty:"normal", roomSize:"small", isNew:false }
  // … 기타 데이터
];

const diffSel = document.getElementById('difficulty');
const roomSel = document.getElementById('roomSize');
const colL = document.getElementById('colLeft');
const colR = document.getElementById('colRight');
const curr = document.getElementById('currentFilter');

function render() {
  const diff = diffSel.value;
  const room = roomSel.value;
  const diffText = diff==='all'? 'ALL' : diff.toUpperCase();
  const roomText = room==='all'? '전체' : room==='small'? '소형' : room==='medium'? '중형' : '대형';
  curr.textContent = `${diffText} ${roomText}`;

  const arr = data
    .filter(x=> (diff==='all'||x.difficulty===diff) && (room==='all'||x.roomSize===room))
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

      // 순위
      const rank = document.createElement('div');
      rank.className = 'rank';
      rank.textContent = rankOverall;
      card.appendChild(rank);

      // 팀·점수 정보 + NEW 배너
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

diffSel.addEventListener('change', render);
roomSel.addEventListener('change', render);
window.addEventListener('load', render);
