class Check {
  // TODO: WALL Function
  // TODO: WORKS but repeats same loop twice

  constructor(grid, sX, sY, turn) {
    this.grid = grid;
    this.sX = sX;
    this.sY = sY;
    this.l = grid.length;
    this.turn = turn;
    this.dx = [-1, -1, -1, 0, 1, 1, 1, 0];
    this.dy = [1, 0, -1, -1, -1, 0, 1, 1];
    this.last = {};
  }

  calc() {
    const id = this.sX * 10 + this.sY;
    let ht = {};
    ht[id] = Object.keys(ht).length;
    this.deep(this.sX, this.sY, ht, "");
  }

  deep(x, y, ht, prev) {
    for (let i = 0; i < this.dx.length; i++) {
      const mX = x + this.dx[i];
      const mY = y + this.dy[i];
      const cHt = { ...ht };
      if (
        this.grid[mX][mY] === this.turn &&
        mX * 10 + mY != prev //&&
        //!(mX * 10 + mY in this.last)
      ) {
        if (mX * 10 + mY in cHt) {
          this.fill(cHt, mX * 10 + mY, x * 10 + y);
        } else {
          cHt[mX * 10 + mY] = Object.keys(cHt).length;
          this.deep(mX, mY, cHt, x * 10 + y);
        }
      }
    }
  }

  fill(ht, trig, last) {
    //Usefull Var
    const nHt = {};
    let full = true;
    const del = [];

    //Filter ht
    for (let x in ht) {
      if (ht[x] >= ht[trig]) {
        nHt[x] = ht[x];
      }
    }

    //Check if full on inside and fill del arr
    const k = Object.keys(nHt);
    k.forEach((e, i) => {
      if (i != 0) {
        //Get values from keys
        let x = (e - (e % 10)) / 10;
        let y = e % 10;
        let prevX = (k[i - 1] - (k[i - 1] % 10)) / 10;
        let prevY = k[i - 1] % 10;

        if (x === prevX) {
          for (let i = prevY + 1; i < y; i++) {
            if (this.grid[x][i] == 0) {
              full = false;
            } else if (this.grid[x][i] !== this.turn) {
              del.push([x, i]);
            }
          }
        }
      }
    });

    if (full) {
      del.forEach(e => {
        this.grid[e[0]][e[1]] = 0;
      });
    }
  }
}

//FOR TESTING
// const grid = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 1, -1, 0, 0, 0, 0],
//   [0, 0, 1, -1, 1, -1, 0, 0, 0],
//   [0, 0, 0, 1, -1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0]
// ];

// let check = new Check(grid, 4, 3, -1);
// check.calc();
// console.log(check.grid);

export default Check;
