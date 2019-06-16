import React, { Component , useState, memo, useRef, useReducer, useCallback} from 'react'
import { Route, Link } from "react-router-dom";
import classNames from "classnames";
import './app.scss' 

const Square = memo(({ value, onClick, index }) => {
  const renders = useRef(0);
  console.log(`rendering ${index} ${++renders.current}`)
  return (
    <button className="Square" onClick={() => onClick(index)}>
      {value}
    </button>
  );
})

const TestMemo = memo(({text, count}) => {
      console.log('render --- testMemo');
      return <div>
          {text} {count}
      </div>
}, (prevProps, nextProps) => {
      console.log('now is comparing');
      return prevProps.text == nextProps.text
})

function calculateWinner(squares) {
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
  let winner = lines.reduce((memod, [a, b, c]) => {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      memod = squares[a];
    }
    return memod;
  }, "");
  if (!winner && squares.every(s => s)) {
    console.log("win");
    winner = "tie";
  }
  return winner;
}

function Board({ squares, onClick }) {
  return (
    <div className="Board">
      {squares.map((square, i) => (
        <Square key={i} index={i} value={square} onClick={onClick} />
      ))}
    </div>
  );
}

function Announcement({ winner, onStart }) {
  return (
    <div className="Announcement">
      {winner === "tie" ? (
        <div>Tie Game</div>
      ) : (
        <div>
          <div>Congrats</div>
          <h1>{winner}</h1>
        </div>
      )}
      <button className="Button" onClick={onStart}>
        Start
      </button>
    </div>
  );
}

function Message({ hasStarted, isXNext }) {
  return (
    <div className="Message">
      {hasStarted
        ? isXNext
          ? "It's Xs turn"
          : "It's Os turn"
        : "Click to start game"}
    </div>
  );
}

const defaultState = {
  squares: Array(9).fill(null),
  isXNext: true,
  winner: ""
}

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return defaultState;
    case "handleClick":
      const moves = [...state.squares];
      moves[action.idx] = state.isXNext ? "X" : "O";
      return {
        squares: moves,
        isXNext: !state.isXNext,
        winner: calculateWinner(moves)
      };
    default:
      return state;
  }
}

function Game() {
  console.log('re-render Game');
  const [{ squares, isXNext, winner }, dispatch] = useReducer(
    reducer,
    defaultState
  );
  // const [squares, setSquares] = useState(Array(9).fill(null));
  // const [isXNext, setIsXNext] = useState(true);
  // const [winner, setWinner] = useState("");

  const handleClick = useCallback(
    i => {
      dispatch({ type: "handleClick", idx: i });
    },
    [dispatch]
  );
  const handleStart = useCallback(() => {
    dispatch({ type: "start" });
  }, [dispatch]);


  // function handleClick(i) {
  //   /* When memo is used on line 8 squares is always an array of 9 nulls */
  //   const moves = [...squares];
  //   moves[i] = isXNext ? "X" : "O";
  //   setSquares(moves);
  //   setIsXNext(!isXNext);
  //   const winner = calculateWinner(moves);
  //   if (winner) {
  //     setWinner(winner);
  //   }
  // }
  // function handleStart() {
  //   setSquares(Array(9).fill(null));
  //   setWinner(null);
  // }

  return (
    <div className={classNames("Game", { "Game--winner": !!winner })}>
      <Board squares={squares} onClick={handleClick} />
      <Message hasStarted={squares.some(s => s)} isXNext={isXNext} />
      {!!winner && <Announcement winner={winner} onStart={handleStart} />}
    </div>
  );
}


class App extends Component {
  constructor(props){
      super(props);
      this.state = {
          text: 'hello',
          count: 0
      }
  }
  
  componentDidMount() {
     setTimeout(() => {
        this.setState({count: ++this.state.count})
     }, 1000);
  }
  
  render() {
    return (
       <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
          <li>{this.state.count}</li>
        </ul>
        <hr />

        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
        <Game/>
        <TestMemo text={this.state.text} count={this.state.count}/>
      </div>
    )
  }
}

export default App

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Topics({ match }) {
    console.log(match);
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.url}/:topicId`} component={Topic} />
      <Route
        exact
        path={match.url}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function Topic({ match }) {
    console.log(match);
  return (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  );
}
