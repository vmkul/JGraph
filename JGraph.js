const Graph = function(ctx, adjM, directed = false, radius = 10) {
  this.directed = directed;
  this.adjM = adjM;
  this.vertices = [];
  this.ctx = ctx;
  this.radius = radius;
};

Graph.prototype.connect = function(v1, v2, directed = false, double = false) {
  this.ctx.beginPath()
  if (v1 === v2) {
    this.ctx.arc(v1.x, v1.y - 2 * this.radius, this.radius + 1, 0, 2 * Math.PI);
    this.ctx.stroke();
    return;
  }
  const xr = v2.x - v1.x;
  const yr = v2.y - v1.y;
  const k = yr / xr;
  const xinter = Math.sqrt((this.radius ** 2)/(1 + k ** 2));
  const yinter = k * xinter; 
  if (directed) {
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
    if (v1.x > v2.x) return;
    const d = Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
    const k = (v2.y - v1.y) / (v2.x - v1.x);
    const phi = Math.atan(k);
    this.ctx.save();
    this.ctx.translate(v1.x, v1.y);
    this.ctx.rotate(phi);
    this.ctx.moveTo(this.radius, 0);
    canvas_arrow(this.ctx, d / 2, d / 8, this.radius, 0)
    this.ctx.moveTo(d / 2, d / 8);
    this.ctx.lineTo(d - this.radius, 0);
    this.ctx.restore();
  }
  this.ctx.stroke();
};

Graph.prototype.vertex = function(x, y, n) {
  const v = {x: x, y: y, num: n};
  this.vertices[n - 1] = v;
};

Graph.prototype.draw = function() {
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
  for (const vert of this.vertices) {
    this.ctx.beginPath();
    this.ctx.arc(vert.x, vert.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fillText(vert.num, vert.x, vert.y);
    this.ctx.stroke();
  }
  if (!this.directed){
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
        else if (this.adjM[i][j] === 1 && this.adjM[j][i] === 1) {
          const v1 = this.vertices[i];
          const v2 = this.vertices[j];
          this.connect(v1, v2, true, true);
        }
      }
    }
  }
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
}