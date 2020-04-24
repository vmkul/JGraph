const Graph = function (ctx, adjM, directed = false, radius = 10, weights = false, fontSize = 24) {
  this.directed = directed;
  this.adjM = adjM;
  this.vertices = [];
  this.ctx = ctx;
  this.radius = radius;
  this.weights = weights;
  this.fontSize = fontSize;
};

Graph.prototype.connect = function (v1, v2, directed = false, double = false) {
  this.ctx.beginPath()
  if (v1 === v2) {
    this.ctx.arc(v1.x, v1.y - 2 * this.radius, this.radius + 1, 0, 2 * Math.PI);
    this.ctx.stroke();
    if (directed) {
      v1.out++;
      v1.in++;
    } else {
      v1.deg += 2;
    }
    return;
  }
  const xr = v2.x - v1.x;
  const yr = v2.y - v1.y;
  const k = yr / xr;
  const xinter = Math.sqrt((this.radius ** 2) / (1 + k ** 2));
  const yinter = k * xinter;
  if (directed) {
    v1.out++;
    v2.in++;

    if (v1.x === v2.x) {
      if (v2.y > v1.y) {
        canvas_arrow(this.ctx, v1.x, v1.y + this.radius, v2.x, v2.y - this.radius);
      } else {
        canvas_arrow(this.ctx, v1.x, v1.y - this.radius, v2.x, v2.y + this.radius);
      }
    } else {
      if (v2.x < v1.x) {
        canvas_arrow(this.ctx, v1.x - xinter, v1.y - yinter, v2.x + xinter, v2.y + yinter);
      } else {
        canvas_arrow(this.ctx, v1.x + xinter, v1.y + yinter, v2.x - xinter, v2.y - yinter);
      }
    }
  } else {

    v1.deg++;
    v2.deg++;

    if (this.weights) this.drawWeights(v1, v2);

    if (v1.x === v2.x) {
      if (v2.y > v1.y) {
        this.ctx.moveTo(v1.x, v1.y + this.radius);
        this.ctx.lineTo(v2.x, v2.y - this.radius);
      } else {
        this.ctx.moveTo(v1.x, v1.y - this.radius);
        this.ctx.lineTo(v2.x, v2.y + this.radius);
      }
    } else {
      if (v2.x < v1.x) {
        this.ctx.moveTo(v1.x - xinter, v1.y - yinter);
        this.ctx.lineTo(v2.x + xinter, v2.y + yinter);
      } else {
        this.ctx.moveTo(v1.x + xinter, v1.y + yinter);
        this.ctx.lineTo(v2.x - xinter, v2.y - yinter);
      }
    }

  }
  if (double) {
    v1.in++;
    v2.out++;
    const d = Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
    let k = (v2.y - v1.y) / (v2.x - v1.x);
    let phi = Math.atan(k);
    this.ctx.save();

    if (v2.x >= v1.x) {
      this.ctx.translate(v1.x, v1.y);
      this.ctx.rotate(phi);
      canvas_arrow(this.ctx, d / 2, d / 8, this.radius, 0);
      this.ctx.moveTo(d / 2, d / 8);
      this.ctx.lineTo(d - this.radius, 0);
    } else {
      this.ctx.translate(v2.x, v2.y);
      this.ctx.rotate(phi);
      canvas_arrow(this.ctx, d / 2, d / 8, d - this.radius, 0);
      this.ctx.moveTo(d / 2, d / 8);
      this.ctx.lineTo(this.radius, 0);
    }

    this.ctx.restore();
  }

  this.ctx.stroke();
};

Graph.prototype.vertex = function (x, y, n) {
  const v = {
    x: x,
    y: y,
    num: n,
    deg: 0,
    in: 0,
    out: 0,
  };
  this.vertices[n - 1] = v;
};

Graph.prototype.draw = function () {
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
  for (const vert of this.vertices) {
    if (vert) {
      this.ctx.beginPath();
      this.ctx.arc(vert.x, vert.y, this.radius, 0, 2 * Math.PI);
      this.ctx.fillText(vert.num, vert.x, vert.y);
      this.ctx.stroke();
    }
  }
  if (!this.directed) {
    for (const i in this.adjM) {
      for (const j in this.adjM[i]) {
        if (this.adjM[i][j] === 1 && i > j) {
          const v1 = this.vertices[i];
          const v2 = this.vertices[j];
          this.connect(v1, v2);
        } else if (i === j && this.adjM[i][j] === 1) {
          const v1 = this.vertices[i];
          this.connect(v1, v1);
        }
      }
    }
  } else {
    for (const i in this.adjM) {
      for (const j in this.adjM[i]) {
        if (this.adjM[i][j] === 1 && this.adjM[j][i] !== 1) {
          const v1 = this.vertices[i];
          const v2 = this.vertices[j];
          this.connect(v1, v2, true);
        }
        else if (this.adjM[i][j] === 1 && this.adjM[j][i] === 1 && i >= j) {
          const v1 = this.vertices[i];
          const v2 = this.vertices[j];
          this.connect(v1, v2, true, true);
        }
      }
    }
  }
};

Graph.prototype.circle = function (radius, xc, yc) {
  for (let i = 1; i <= this.adjM.length; i++) {
    const delta = 2 * Math.PI / this.adjM.length;
    const x = radius * Math.cos(i * delta) + xc;
    const y = radius * Math.sin(i * delta) + yc;
    if (typeof(this.adjM[i - 1]) === 'undefined') continue;
    this.vertex(x, y, i);
  }
  this.draw();
};

Graph.prototype.info = function (container) {
  let result = '';
  let data = '';
  let homo = true;
  let Degree = this.directed ? this.vertices[0].in + this.vertices[0].out : this.vertices[0].deg;

  for (let vert of this.vertices) {
    if (this.directed && (vert.in + vert.out !== Degree)) homo = false;
    if (!this.directed && vert.deg !== Degree) homo = false;

    if (!this.directed) {
      data = `Vertex: ${vert.num}, deg: ${vert.deg}<br>`;
    } else {
      data = `Vertex: ${vert.num}, In: ${vert.in}, Out: ${vert.out}<br>`;
    }
    result += data;
  }

  for (let vert of this.vertices) {
    if (vert.deg === 0 && (vert.in === 0 && vert.out === 0)) {
      result += `<font color="red">Isolated vertex ${vert.num}</font><br>`;
    } else if (vert.deg === 1) {
      result += `<font color="green">Leaf vertex ${vert.num}</font><br>`;
    } else if (vert.in === 1 && vert.out === 0) {
      result += `<font color="green">Leaf vertex ${vert.num}</font><br>`;
    } else if (vert.out === 1 && vert.in === 0) {
      result += `<font color="green">Leaf vertex ${vert.num}</font><br>`;
    }

  }
  if (homo) result += 'Graph is <strong>homogeneous</strong> ' + Degree;
  container.innerHTML = result;
};

Graph.prototype.trans_info = function (container) {
  let routes2 = 'Routes with length 2<br>';
  let routes3 = 'Routes with length 3<br>';
  const deg2 = closure(this.adjM, this.adjM);

  for (let from = 0; from < deg2.length; from++) {
    for (let to = 0; to < deg2.length; to++) {
      if (deg2[from][to] !== 0) {
        this.adjM[from].forEach((val1, index1) => {
          if (val1 !== 0 && this.adjM[index1][to] !== 0) {
            routes2 += `v${from + 1} v${index1 + 1} v${to + 1}<br>`;
            for (let index2 = 0; index2 < this.adjM.length; index2++) {
              if (this.adjM[to][index2] !== 0) routes3 += `v${from + 1} v${index1 + 1} v${to + 1} v${index2 + 1}<br>`;
            }
          }
        })
      }
    }
  }
  container.innerHTML += routes2;
  container.innerHTML += routes3;
};

Graph.prototype.drawWeights = function (v1, v2) {
  let a, b;
  if (v1.x > v2.x)
    [b, a] = [v1, v2];
  else
    [a, b] = [v1, v2];

  const d = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
  let k = (b.y - a.y) / (b.x - a.x);
  let phi = Math.atan(k);
  this.ctx.save();

  this.ctx.font = this.fontSize + 'px serif';
  this.ctx.textAlign = 'center';
  this.ctx.translate(a.x, a.y);
  this.ctx.rotate(phi);
  this.ctx.fillText(this.weights[v1.num - 1][v2.num - 1], d / 2, -10);

  this.ctx.restore();
};

const canvas_arrow = (context, fromx, fromy, tox, toy) => {
  const headlen = 10; // length of head in pixels
  const dx = tox - fromx;
  const dy = toy - fromy;
  const angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
};

const closure = (matrix1, matrix2) => {
  let res = matrix1.map(arr => [...arr]);
  res.forEach(val => val.fill(0));

  for (const i in matrix1) {
    for (const j in matrix1) {
      if (matrix1[i][j] !== 0) {
        for (const vert in matrix2[j]) {
          if (matrix2[j][vert] !== 0) res[i][vert] = 1;//matrix2[j][vert];
        }
      }
    }
  }

  return res;
};

const arraysEqual = (a1, a2) => {
  return JSON.stringify(a1) === JSON.stringify(a2);
};

const trans_closure = m1 => {
  let m2 = m1;
  let temp = [];
  while (!arraysEqual(m2, temp)) {
    temp = m2;
    m2 = closure(m1, m2);
    for (let i = 0; i < m2.length; i++)
      for (let j = 0; j < m2.length; j++) {
        if (temp[i][j] === 1 && m2[i][j] !== 1) m2[i][j] = 1;
        if (m2[i][i] !== 1) m2[i][i] = 1;
      }
  }
  return m2;
};

const transpose = m => {
  let res = m.map(arr => [...arr]);
  let temp = 0;
  for (let i = 0; i < m.length; i++)
    for (let j = 0; j < m.length; j++) {
      if (i > j) {
        temp = res[j][i];
        res[j][i] = res[i][j];
        res[i][j] = temp;
      }
    }
  return res;
};

const product_m = (m1, m2) => {
  let res = m1.map(arr => [...arr]);
  for (let i = 0; i < m1.length; i++)
    for (let j = 0; j < m1.length; j++)
      res[i][j] = m1[i][j] && m2[i][j];
  return res;
};

const BFS = (G, a) => {
  const BFS_arr = new Array(G.adjM.length).fill(0);
  const BFS_tree = [];
  const queue = [];
  let v, k = 1;

  BFS_arr[--a] = 1;
  queue.push(a);
  while (queue.length !== 0) {
    v = queue.shift();
    BFS_tree[v] = [];
    for (let i = 0; i < G.adjM.length; i++) {
      if (G.adjM[v][i] === 1 && BFS_arr[i] === 0) {
        BFS_tree[v][i] = 1;
        k++;
        BFS_arr[i] = k;
        queue.push(i);
      }
    }
  }
  return {
    tree: BFS_tree,
    arr: BFS_arr,
  };
};

const arr_min = arr => {
  const min = arr.reduce((prev, cur) => {
    if (prev === 0) return cur;
    if (cur === 0) return prev;
    return cur >= prev ? prev : cur;
  });
  return min;
}