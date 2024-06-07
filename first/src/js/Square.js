import '../css/Square.css';
import React, { useState, useEffect } from 'react';


function Square({index, handleClick}) {
  const [value, setValue] = useState(null);

  // function handleClick() {
  //   setValue(value === null ? index : null);
  // }

  return <div className="square" onClick={handleClick}>{index}</div>;
}

function Board({amount}) {
  const [squares, setSquares] = useState(Array(amount).fill(null));
  const [vis, setVis] = useState(false);
  const [player, setPlayer] = useState(true);
  const [winner, setWinner] = useState(null);

  function win() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    console.log(squares);
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return player;
      }
    }

    return null;
  }

  useEffect(() => {
    const winner = win();
    if (winner !== null) {
      setWinner(winner);
      setVis(true);
      return;
    }
  }, [squares]);

  function handleClick(index) {
    if (squares[index] !== null || winner !== null) return;

    const new_squares = squares.slice();
    new_squares[index] = player ? 'X' : 'O';
    
    setSquares(new_squares);
    
    // setWinner(win());
    setPlayer(!player);
    setVis(new_squares.every((v) => v !== null));
  }

  let squares_comp = [];
  for ( let i = 0; i < amount; i++ ) {
      squares_comp.push(<Square key={i} index={squares[i]} handleClick={() => {handleClick(i)}} />);
  };

  function reset() {
    setSquares(Array(amount).fill(null));
    setWinner(null);
    setPlayer(true);
    setVis(!vis);
  }

  return (
    <div id="box">
      {squares_comp}
      {vis && <button id="reset" onClick={reset}>Reset</button>}
    </div>
  );
}


export default Board;