const matrix1 = [
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
];

const matrix2 = matrix1.map(arr => [...arr]);
for (let i = 0; i < matrix2.length; i++) {
  for (let j = 0; j < matrix2.length; j++) {
    if (matrix2[i][j] === 1 && matrix2[j][i] !== 1) {
      matrix2[j][i] = 1;
    } 
  }
}

const draw = () => {
  const canvas1 = document.getElementById('graph1');
  if (canvas1.getContext) {
    const ctx = canvas1.getContext('2d');
    const graph1 = new Graph(ctx, matrix1, true, 10);
    graph1.circle();
  }
  
  const canvas2 = document.getElementById('graph2');
  if (canvas2.getContext) {
    const ctx = canvas2.getContext('2d');
    const graph2 = new Graph(ctx, matrix2, false, 10);
    graph2.circle();
  }
};
