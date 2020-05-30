const matrix = [
  [0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
  [0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
];

const test = [
  [0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 0],
  [1, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
];

let arr, ctx, graph1, last, alert, k = 1;

const draw = () => {
  const canvas1 = document.getElementById('graph1');
  const canvas2 = document.getElementById('tree');
  alert = document.getElementById('alert');

  if (canvas1.getContext && canvas2.getContext) {
    const container1 = document.getElementById('graph1_info');
    ctx = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    graph1 = new Graph(ctx, matrix, true, 20);
    const data = BFS(graph1, 1);
    const tree = data.tree;
    arr = data.arr;
    const graph2 = new Graph(ctx2, tree, true, 10);

    graph1.circle(400, 500, 500);
    graph2.circle(150, 200, 200);
    step();

    let result = '';
    arr.forEach((val, index) => {
      result += `Vertex: ${index + 1}, index: ${val}<br>`;
    });
    container1.innerHTML = result;
  }
};

let BFS_arr = new Array(matrix.length).fill(0);
let queue = [ 0 ];
BFS_arr[0] = 1;

const step = () => {
  if (k > matrix.length || queue.length === 0) {
    alert.style.display = 'block';
    return;
  }

  if (typeof(last) == 'number') {
    ctx.restore();
    ctx.clearRect(0, 0, 1000, 1000);
    graph1.circle(400, 500, 500);
  }

  const curr = arr.indexOf(k);
  ctx.save();
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(graph1.vertices[curr].x, graph1.vertices[curr].y, 40, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.globalAlpha = 0.5;
  BFS_arr.forEach((status, index) => {
    ctx.beginPath();
    if (status === 0) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = 'green';
    }
    ctx.arc(graph1.vertices[index].x, graph1.vertices[index].y, 20, 0, 2 * Math.PI);
    ctx.fill();
  });
  last = curr;

  const v = queue.shift();
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[v][i] === 1 && BFS_arr[i] === 0) {
      BFS_arr[i] = k;
      queue.push(i);
    }
  }
  k++;
};

const reset = () => {
  BFS_arr = new Array(matrix.length).fill(0);
  queue = [ 0 ];
  BFS_arr[0] = 1;
  alert.style.display = 'none';
  k = 1;
  step();
};

