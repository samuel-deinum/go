import React from "react";
import "./App.css";
import Game from "./Game/Game";

import stone from "../../assets/images/stone.jpg";

function App() {
  return (
    <div
      className="App"
      style={{ backgroundImage: "url(" + stone + ")", backgroundSize: "100%" }}
    >
      <div>NAVBAR</div>
      <Game />
    </div>
  );
}

export default App;
