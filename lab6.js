const matrix = [
  [0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
  [0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
  [0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
];

let weights = [
  [0, 20, 63, 21, 41, 79, 75, 71, 0, 81, 26],
  [20, 0, 0, 54, 68, 23, 0, 66, 34, 98, 40],
  [63, 0, 0, 98, 0, 65, 6, 16, 0, 1, 0],
  [21, 54, 98, 0, 0, 72, 0, 72, 0, 89, 0],
  [41, 68, 0, 0, 0, 89, 98, 0, 73, 61, 15],
  [79, 23, 65, 72, 89, 0, 25, 48, 0, 91, 54],
  [75, 0, 6, 0, 98, 25, 0, 51, 39, 0, 28],
  [71, 66, 16, 72, 0, 48, 51, 0, 76, 0, 87],
  [0, 34, 0, 0, 73, 0, 39, 76, 0, 67, 93],
  [81, 98, 1, 89, 61, 91, 0, 0, 67, 0, 0],
  [26, 40, 0, 0, 15, 54, 28, 87, 93, 0, 0],
];

for (let i = 0; i < matrix.length; i++)
  for (let j = 0; j < matrix.length; j++) {
    if (matrix[i][i] === 1) matrix[i][i] = 0;
    if (matrix[i][j] === 1 && matrix[j][i] !== 1) matrix[j][i] = 1;
  }

let alert, status = [], ctx, graph1;

const draw = () => {
  const canvas1 = document.getElementById('graph1');
  alert = document.getElementById('alert');

  if (canvas1.getContext) {
    ctx = canvas1.getContext('2d');
    graph1 = new Graph(ctx, matrix, false, 20, weights);
    graph1.circle(400, 500, 500);

    reset();
  }
};

const step = () => {
  const filtered = status.filter(obj => obj.temp);
  if (!filtered.length) {
    const routes = document.getElementById('graph1_info');
    let content = '';
    alert.style.display = 'block';
    status.forEach(obj => {
      let line = `Route to vertex ${obj.num + 1}: `;
      let vert = obj;
      const preds = [];
      while (vert.predecessor) {
        vert = vert.predecessor;
        preds.push(vert);
      }
      preds.reverse().forEach(obj => {
        line += `${obj.num + 1} --> `;
      });
      content += line + `${obj.num + 1}; <br>distance: ${obj.distance}<br>`;
    });
    routes.innerHTML = content;
    return;
  }

  const active = filtered.reduce((prev, cur) => prev.distance > cur.distance ? cur : prev);
  active.temp = false;
  matrix[active.num].forEach((i, index) => {
    if (i) {
      const dist = active.distance + weights[active.num][index];
      if (dist < status[index].distance) {
        status[index].distance = dist;
        status[index].predecessor = active;
      }
    }
  });

  ctx.restore();
  ctx.clearRect(0, 0, 1000, 1000);
  graph1.circle(400, 500, 500);
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = 'red';
  status.filter(obj => obj.temp).forEach(obj => {
    const { x, y } = graph1.vertices[obj.num];
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.fillStyle = 'green';
  const perm = status.filter(obj => !obj.temp);
  if (perm.length) {
    perm.forEach(obj => {
      const { x, y } = graph1.vertices[obj.num];
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
};

const reset = () => {
  alert.style.display = 'none';
  const routes = document.getElementById('graph1_info');
  ctx.clearRect(0, 0, 1000, 1000);
  graph1.circle(400, 500, 500);
  status = [];
  matrix.forEach((v, index) => {
    const vert = {
      num: index,
      distance: Infinity,
      temp: true,
      predecessor: null
    }
    status.push(vert);
  });
  status[0].distance = 0;
  step();
};

