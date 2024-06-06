import '../css/Square.css';


function Square({index}) {
    return <div className="square">{index}</div>;
}

function Board({amount}) {
    let squares = [];
    for ( let i = 0; i < amount; i++ ) {
        squares.push(<Square key={i} index={i} />);
    }
    return (
      <div id="box">
        {squares}
      </div>
  );
}


export default Board;