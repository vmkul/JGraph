const matrix = [
  [1, 1, 1],
  [1, 1, 1],
  [0, 1, 1],
];

const draw = () => {
  const canvas = document.getElementById('graph');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const graph1 = new Graph(ctx, matrix, true, 10);
    graph1.vertex(220, 120, 1);
    graph1.vertex(20, 150, 2);
    graph1.vertex(120, 60, 3);
    graph1.draw(); 
  }
};
