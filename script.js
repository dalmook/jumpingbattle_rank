const data = [
  { team:"팀A", score:1200, difficulty:"basic", roomSize:"small" },
  { team:"팀B", score:980, difficulty:"easy", roomSize:"medium" },
  { team:"팀C", score:1500, difficulty:"hard", roomSize:"large" },
  // … 실제 데이터로 교체
];

const board = document.getElementById('leaderboard');
const diffSel = document.getElementById('difficulty');
const roomSel = document.getElementById('roomSize');

function render() {
  const diff = diffSel.value;
  const room = roomSel.value;
  board.innerHTML = '';
  data
    .filter(item => (diff==='all'||item.difficulty===diff) && (room==='all'||item.roomSize===room))
    .sort((a,b)=>b.score-a.score)
    .forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h2>#${idx+1} ${item.team}</h2>
                        <p>Score: ${item.score}</p>`;
      board.appendChild(card);
    });
}

diffSel.addEventListener('change', render);
roomSel.addEventListener('change', render);
window.addEventListener('load', render);
