const data = [
  { team:"시시케틀", score:4379, difficulty:"normal", roomSize:"small" },
  { team:"앙큼별", score:4155, difficulty:"normal", roomSize:"small" },
  { team:"똘봉즈", score:3330, difficulty:"normal", roomSize:"small" },
  { team:"헌지선우콜잘죽", score:3300, difficulty:"normal", roomSize:"small" },
  { team:"오랄파의우물터", score:3297, difficulty:"normal", roomSize:"small" },
  { team:"매니저의콜명", score:2655, difficulty:"normal", roomSize:"small" },
  { team:"탱크워커", score:2575, difficulty:"normal", roomSize:"small" },
  { team:"편집시누비", score:2537, difficulty:"normal", roomSize:"small" },
  { team:"집순이삼남매", score:2517, difficulty:"normal", roomSize:"small" },
  { team:"수영이형", score:2481, difficulty:"normal", roomSize:"small" },
  // … 다른 난이도/방크기 데이터도 포함
];

const diffSel = document.getElementById('difficulty');
const roomSel = document.getElementById('roomSize');
const colL = document.getElementById('colLeft');
const colR = document.getElementById('colRight');
const curr = document.getElementById('currentFilter');

function render() {
  const diff = diffSel.value;
  const room = roomSel.value;
  // 헤더 필터 텍스트 업데이트
  const diffText = diff==='all'? 'ALL' : diff.toUpperCase();
  const roomText = room==='all'? '전체' : (room==='small'? '소형' : room==='medium'? '중형' : '대형');
  curr.textContent = `${diffText} ${roomText}`;

  // 필터·정렬
  const arr = data
    .filter(x=> (diff==='all'||x.difficulty===diff) && (room==='all'||x.roomSize===room))
    .sort((a,b)=>b.score-a.score);

  // 좌우 컬럼에 반씩 분배
  const half = Math.ceil(arr.length/2);
  const left = arr.slice(0, half), right = arr.slice(half);

  colL.innerHTML=''; colR.innerHTML='';
  [left, right].forEach((list, ci)=>{
    const container = ci===0? colL : colR;
    list.forEach((item, i)=>{
      const card = document.createElement('div');
      card.className = 'card';
      const rank = document.createElement('div');
      rank.className = 'rank';
      rank.textContent = (ci*half + i +1);
      const info = document.createElement('div');
      info.className = 'info';
      info.innerHTML = `<div class="team">${item.team}</div>
                        <div class="score">Score: ${item.score}</div>`;
      card.append(rank, info);
      container.appendChild(card);
    });
  });
}

diffSel.addEventListener('change', render);
roomSel.addEventListener('change', render);
window.addEventListener('load', render);
