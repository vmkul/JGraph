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

let check_w = weights.map(arr => [...arr]);

for (let i = 0; i < matrix.length; i++)
  for (let j = 0; j < matrix.length; j++) {
    if (matrix[i][i] === 1) matrix[i][i] = 0;
    if (matrix[i][j] === 1 && matrix[j][i] !== 1) matrix[j][i] = 1;
  }

let vertices = [0], ctx2, alert, skel = [[0]], skel_len = 1;

const draw = () => {
  const canvas1 = document.getElementById('graph1');
  const canvas2 = document.getElementById('skeleton');
  alert = document.getElementById('alert');

  if (canvas1.getContext && canvas2.getContext) {
    const container1 = document.getElementById('graph1_info');
    const ctx = canvas1.getContext('2d');
    ctx2 = canvas2.getContext('2d');
    graph1 = new Graph(ctx, matrix, false, 20, weights);

    graph1.circle(400, 500, 500);

    weights.forEach(arr => arr[0] = 0);
    step();
  }
};

const step = () => {
  if (matrix.length === skel_len) {
    alert.style.display = 'block';
    for (let i = 0; i < matrix.length; i++)
      for (let j = 0; j < matrix.length; j++) {
        if (skel[i][j] !== 1) skel[i][j] = 0;
      }
    console.table(skel);
    return;
  }

  const vi = vertices.reduce((prev, cur) => {
    const val1 = arr_min(weights[prev]);
    const val2 = arr_min(weights[cur]);
    if (val1 === 0 & val2 === 0) return Infinity;
    if (val1 === 0) return cur;
    if (val2 === 0) return prev;
    return val1 < val2 ? prev : cur;
  });

  const min_d = arr_min(weights[vi]);
  const vj = weights[vi].indexOf(min_d);
  vertices.push(vj);
  weights.forEach(arr => arr[vj] = 0);
  skel[vj] = [];
  skel[vi][vj] = 1;
  skel[vj][vi] = 1;
  ctx2.clearRect(0, 0, 700, 700);
  const graph2 = new Graph(ctx2, skel, false, 10, check_w);
  graph2.circle(300, 350, 350);
  skel_len++;
};

const reset = () => {
  alert.style.display = 'none';
  skel_len = 1;
  vertices = [0];
  skel = [[0]];
  ctx2.clearRect(0, 0, 700, 700);
  weights = check_w.map(arr => [...arr]);
  weights.forEach(arr => arr[0] = 0);

  step();
};