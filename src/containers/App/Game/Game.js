import React, { Component } from "react";

import "./Game.css";
import Check from "./check";
import wood from "../../../assets/images/wood.jpg";

class Game extends Component {
  //TODOs
  //ADD POINTS DISPLAY
  //UPDATE DESIGN
  state = {
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    turn: 1,
    focus: { x: -1, y: -1 },
    points: { "1": 0, "-1": 0 }
  };

  focusHandler = (mX, mY) => {
    this.setState({ focus: { x: mX, y: mY } });
  };

  unFocusHandler = () => {
    this.setState({ focus: { x: -1, y: -1 } });
  };

  selectHandler = (mX, mY) => {
    //Copy Values
    let mGrid = [...this.state.grid];
    let mTurn = this.state.turn;
    let mPoints = { ...this.state.points };

    if (mGrid[mX][mY] === 0) {
      //Creat Check Class and launch Calculation
      let check = new Check(mGrid, mX, mY, mTurn);
      const res = check.calc();

      //Process Results
      if (!res.selfCap) {
        mPoints[mTurn] = mPoints[mTurn] + res.points;
        mGrid = res.grid;
        mTurn = mTurn === 1 ? -1 : 1;
      }
      this.setState({ grid: mGrid, turn: mTurn, points: mPoints });
    }
  };

  render() {
    const space = 100 / this.state.grid.length;
    const horRec = this.state.grid.map((v, i) => {
      const count = space / 2 - 0.5 + i * space;
      return (
        <rect x={space / 2 - 0.45} y={count} width="89.5" height="1" key={i} />
      );
    });

    const verRec = this.state.grid.map((v, i) => {
      const count = space / 2 - 0.5 + i * space;
      return (
        <rect x={count} y={space / 2 - 0.45} width="1" height="89.5" key={i} />
      );
    });

    const circles = this.state.grid.map((v, x) => {
      return v.map((value, y) => {
        let fill = "transparent";
        let opacity = 1;

        if (value === 1) {
          fill = "black";
        } else if (value === -1) {
          fill = "white";
        } else if (this.state.focus.x === x && this.state.focus.y === y) {
          fill = this.state.turn === 1 ? "black" : "white";
          opacity = 0.75;
        }

        return (
          <circle
            cx={space / 2 + x * space}
            cy={space / 2 + y * space}
            r={(space / 2) * 0.75}
            fill={fill}
            key={x.toString() + y.toString()}
            opacity={opacity}
            onMouseOver={() => this.focusHandler(x, y)}
            onMouseLeave={this.unFocusHandler}
            onClick={() => this.selectHandler(x, y)}
          />
        );
      });
    });

    return (
      <div className="Game">
        <svg height="100%" width="100%" viewBox="0 0 100 100">
          <image href={wood} height="100%" width="100%" />
          {horRec}
          {verRec}
          {circles}
        </svg>
      </div>
    );
  }
}

export default Game;
