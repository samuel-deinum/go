class Check {
  constructor(grid, sX, sY, turn) {
    this.grid = grid.map(arr => {
      return arr.slice();
    });
    this.sX = sX;
    this.sY = sY;
    this.l = grid.length;
    this.turn = turn;
    this.dx = [-1, -1, -1, 0, 1, 1, 1, 0];
    this.dy = [1, 0, -1, -1, -1, 0, 1, 1];
    this.last = {};
    this.points = 0;
  }

  calc() {
    //Add Piece to Board
    this.grid[this.sX][this.sY] = this.turn;

    //Set up and Lauch Deep recursion
    const id = this.sX * 100 + this.sY;
    let ht = {};
    ht[id] = Object.keys(ht).length;
    this.deep(this.sX, this.sY, ht, "");

    //Lauch Self Capture Check
    const selfCapture = this.selfCap();

    if (selfCapture) {
      return { selfCap: true };
    } else {
      return { selfCap: false, grid: this.grid, points: this.points };
    }
  }

  deep(x, y, ht, prev) {
    for (let i = 0; i < this.dx.length; i++) {
      const mX = x + this.dx[i];
      const mY = y + this.dy[i];
      const cHt = { ...ht };
      //If within Boundaries
      if (mX > -1 && mX < this.l && mY > -1 && mY < this.l) {
        //Your player, not previous, and not a previous cycle
        if (
          this.grid[mX][mY] === this.turn &&
          mX * 100 + mY !== prev &&
          this.last[x * 100 + y] !== mX * 100 + mY
        ) {
          if (mX * 100 + mY in cHt) {
            this.fill(cHt, mX * 100 + mY, x * 100 + y);
          } else {
            cHt[mX * 100 + mY] = Object.keys(cHt).length;
            this.deep(mX, mY, cHt, x * 100 + y);
          }
          //On the edge, pointing to enemy on the edge
        } else if (
          (x === 0 || x === this.l - 1 || y === 0 || y === this.l - 1) &&
          (mX === 0 || mX === this.l - 1 || mY === 0 || mY === this.l - 1) &&
          (x === mX || y === mY) &&
          this.grid[mX][mY] !== 0 &&
          mX * 100 + mY !== prev
        ) {
          this.edgeDeep(mX, mY, cHt, x, y);
        }
      }
    }
  }

  edgeDeep(x, y, ht, prevX, prevY) {
    //Useful Vars
    const enemy = this.turn === 1 ? -1 : 1;
    const cHt = { ...ht };

    //Add Fake boundaries
    //For X
    if (x === 0) {
      const id = -((this.l + 1) * 100 + y);
      cHt[id] = Object.keys(cHt).length;
    } else if (x === this.l - 1) {
      const id = this.l * 100 + y;
      cHt[id] = Object.keys(cHt).length;
    }
    //For Y
    if (y === 0) {
      const id = x * 100 + (this.l + 1);
      cHt[id] = Object.keys(cHt).length;
    } else if (y === this.l - 1) {
      const id = x * 100 + this.l;
      cHt[id] = Object.keys(cHt).length;
    }

    //Find Next Spaces
    const dirX = x - prevX;
    const dirY = y - prevY;
    let newX = x + dirX;
    let newY = y + dirY;

    //Next Space Corner Cases
    if (newX < 0 && newY === 0) {
      newX = 0;
      newY = newY + 1;
    } else if (newX < 0 && newY === this.l - 1) {
      newX = 0;
      newY = newY - 1;
    } else if (newX > this.l - 1 && newY === 0) {
      newX = this.l - 1;
      newY = newY + 1;
    } else if (newX > this.l - 1 && newY === this.l - 1) {
      newX = this.l - 1;
      newY = newY - 1;
    } else if (newX === 0 && newY < 0) {
      newX = newX + 1;
      newY = 0;
    } else if (newX === this.l - 1 && newY < 0) {
      newX = newX - 1;
      newY = 0;
    } else if (newX === 0 && newY > this.l - 1) {
      newX = newX + 1;
      newY = this.l - 1;
    } else if (newX === this.l - 1 && newY > this.l - 1) {
      newX = newX - 1;
      newY = this.l - 1;
    }

    //Check next Space
    if (this.grid[newX][newY] === enemy) {
      this.edgeDeep(newX, newY, cHt, x, y);
    } else if (this.grid[newX][newY] === this.turn) {
      if (newX * 100 + newY in cHt) {
        this.fill(cHt, newX * 100 + newY, x * 100 + y);
      } else {
        cHt[newX * 100 + newY] = Object.keys(cHt).length;
        this.deep(newX, newY, cHt, x * 100 + y);
      }
    }
  }

  fill(ht, trig, last) {
    //Add value to last object
    this.last[trig] = last;

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
    let firstY = 0;
    k.forEach((e, i) => {
      if (i !== 0) {
        //Get values from keys
        let x = null;
        let y = null;
        let prevX = null;
        let prevY = null;

        //Neg X Current
        if (e < 0) {
          x = -1;
          y = (e * -1) % 100;
        } else {
          x = (e - (e % 100)) / 100;
          y = e % 100;
        }
        //Neg X Prev
        if (k[i - 1] < 0) {
          prevX = -1;
          prevY = (k[i - 1] * -1) % 100;
        } else {
          prevX = (k[i - 1] - (k[i - 1] % 100)) / 100;
          prevY = k[i - 1] % 100;
        }
        //Neg Y in Current
        if (y === this.l + 1) {
          prevX = x;
          prevY = -1;
          x = (k[firstY] - (k[firstY] % 100)) / 100;
          y = k[firstY] % 100;
        }

        if (x === prevX) {
          //Check Space Between Ys
          for (let i = prevY + 1; i < y; i++) {
            if (this.grid[x][i] === 0) {
              full = false;
            } else if (this.grid[x][i] !== this.turn) {
              del.push([x, i]);
            }
          }
        } else {
          //Update firstY
          firstY = i;
        }
      }
    });

    //Delete if Full
    if (full) {
      //Delete Enemies from Grid
      del.forEach(e => {
        this.grid[e[0]][e[1]] = 0;
      });
      //Add Points
      this.points = this.points + del.length;
    }
  }

  selfCap() {
    let capture = false;

    //Search Vars
    const dx = [1, -1, 0, 0];
    const dy = [0, 0, 1, -1];
    let found = false;
    let zero = false;
    const turn = this.turn;
    const enemy = this.turn === 1 ? -1 : 1;
    let x = this.sX;
    let y = this.sY;
    //Search for Enemy
    for (let i = 0; i < dx.length; i++) {
      x = this.sX;
      y = this.sY;
      let stop = false;
      while (!stop && !found && !zero) {
        x = x + dx[i];
        y = y + dy[i];
        if (x > this.l - 1 || x < 0 || y > this.l - 1 || y < 0) {
          stop = true;
        } else if (this.grid[x][y] === enemy) {
          found = true;
        } else if (this.grid[x][y] === 0) {
          zero = true;
        }
      }
    }

    if (found) {
      //Set up and Lauch Deep recursion
      this.turn = enemy;
      const id = x * 100 + y;
      let ht = {};
      ht[id] = Object.keys(ht).length;
      this.deep(x, y, ht, "");
      this.turn = turn;

      if (this.grid[this.sX][this.sY] === 0) {
        capture = true;
      }
    }

    return capture;
  }
}

//FOR TESTING
// const grid = [
//   [0, 0, 0, 0, 0, 0, 0, -1, 1],
//   [0, 0, 0, 0, 0, 0, -1, 1, 1],
//   [0, 0, 0, 0, 0, -1, 1, 1, -1],
//   [0, 0, 0, 0, 0, -1, -1, -1, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0]
// ];

// let check = new Check(grid, 0, 7, -1);
// const res = check.calc();
// console.log(res);

export default Check;
