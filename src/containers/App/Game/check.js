class Check {
  constructor(grid, sX, sY, turn) {
    this.grid = grid;
    this.sX = sX;
    this.sY = sY;
    this.l = grid.length;
    this.turn = turn;
    this.dx = [-1, -1, -1, 0, 1, 1, 1, 0];
    this.dy = [1, 0, -1, -1, -1, 0, 1, 1];
    this.last = null;
  }

  calc() {
    const id = this.sX.toString() + this.sY.toString();
    let ht = {};
    ht[id] = [this.sX, this.sY];
    this.deep(this.sX, this.sY, ht, "");
  }

  deep(x, y, ht, prev) {
    for (let i = 0; i < this.dx.length; i++) {
      const mX = x + this.dx[i];
      const mY = y + this.dy[i];
      const cHt = { ...ht };
      //console.log("DEEP", mX, mY, prev);
      //console.log(cHt);
      if (
        this.grid[mX][mY] === this.turn &&
        mX.toString() + mY.toString() != prev &&
        mX.toString() + mY.toString() != this.last
      ) {
        if (mX.toString() + mY.toString() in cHt) {
          this.fill(cHt);
        } else {
          cHt[mX.toString() + mY.toString()] = [mX, mY];
          this.deep(mX, mY, cHt, x.toString() + y.toString());
        }
      }
    }
  }

  fill(ht) {
    //console.log("FIIIIIIIIIIIIIIIIIIILL");
    const k = Object.keys(ht);
    let full = true;
    const del = [];

    this.last = k[k.length - 1];
    for (let i = 1; i < k.length; i++) {
      if (ht[k[i]][0] == ht[k[i - 1]][0]) {
        let max = null;
        let min = null;
        if (ht[k[i]][1] >= ht[k[i - 1]][1]) {
          max = ht[k[i]][1];
          min = ht[k[i - 1]][1];
        } else {
          max = ht[k[i]][i - 1];
          min = ht[k[i]][1];
        }
        for (let j = min + 1; j < max; j++) {
          if (this.grid[ht[k[i]][0]][j] == 0) {
            full = false;
          } else if (this.grid[ht[k[i]][0]][j] != this.turn) {
            del.push({ x: ht[k[i]][0], y: j });
          }
        }
        if (full) {
          for (let j = 0; j < del.length; j++) {
            this.grid[del[j].x][del[j].y] = 0;
          }
        }
      }
    }
  }
}

//FOR TESTING
//   const grid = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 1, 1, 0, 0, 0, 0],
//     [0, 0, 1, -1, -1, 1, 0, 0, 0],
//     [0, 0, 0, 1, -1, 1, 0, 0, 0],
//     [0, 0, 0, 0, 1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0]
//   ];

//   let check = new Check(grid, 3, 5, 1);
//   check.calc();
//   console.log(check.grid);

export default Check;
