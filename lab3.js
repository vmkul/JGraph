const matrix = [
  [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
  [0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
];

const test = [
  [0, 1, 0, 1, 0],
  [0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0],
  [0, 0, 1, 0, 1],
  [0, 1, 0, 0, 0],
];

const draw = () => {
  const canvas1 = document.getElementById('graph1');
  if (canvas1.getContext) {
    const container1 = document.getElementById('graph1_info');
    const container2 = document.getElementById('graph1_trans_info');
    const ctx = canvas1.getContext('2d');
    const graph1 = new Graph(ctx, test, true, 20);

    graph1.circle(400, 500, 500);
    graph1.info(container1);
    graph1.trans_info(container2);

    const reachM = trans_closure(test);
    const strongM = product_m(reachM, transpose(reachM));

    const pool = new Array(test.length).fill(0);
    strongM.forEach((a1, index1) => {
      strongM.forEach((a2, index2) => {
        if (arraysEqual(a1, a2) && index1 > index2) {
          pool.push([index1, index2]);
        }
      })
    });

    console.log(pool);
    console.log('Reachability matrix');
    console.table(reachM);
    console.log('Strong reachability matrix');
    console.table(strongM);
  }
};
