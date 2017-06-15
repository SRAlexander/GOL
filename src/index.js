import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
var classNames = require( 'classnames' );

function Square(props) {

    return (
        <button className={props.class} onClick={props.onClick} >
        </button>
    );
}

class Board extends React.Component {

    renderSquare(x,y) {
        var btnClass = classNames({
            'square': true,
            'alive': this.props.squares[x][y] === 1
        });
        return <Square key={y} class={btnClass} onClick={() => this.props.onClick(x,y)} />;
    }

    render() {

        return (
            <div>
                {this.props.squares.map( function(rowItem, rowIndex)
                {
                     return (<div className="board-row" key={ rowIndex }>
                        {rowItem.map(function(square, columnIndex)
                        {
                             {return (this.renderSquare(rowIndex, columnIndex))}
                        },this)}
                        </div>)
                  },this)}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{squares:Array(60).fill(new Array(60).fill(0))}],
            stepNumber: 0,
            interval: null,
            intervalTime: 10,
            running: false,
        }
        this.step = this.step.bind(this)
    }

    handleClick(x,y) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice().map( function(row){ return row.slice(); });
        
        console.log("Setting" + x + " " + y)
        squares[x][y] = squares[x][y] === 0 ? 1: 0;
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
        stepNumber: step,
        });
    }

    // Randomly fill the squares array with 0's and 1's
    random() {
        // No nice way of filling a 2d array with duplicating rows so far... weird!
        const repeat = (fn, n) => Array(n).fill(0).map(fn);
        const rand = () => Math.round((Math.random() * 1));
        const squaresCreation = n => repeat(() => repeat(rand, n), n);

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares =  squaresCreation(60);
        this.setState({
            history: history.concat([{squares : squares}]),
            stepNumber: history.length,

        })
    }

    step() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice().map( function(row){ return row.slice(); });
        var neighbours = this.neighbourCount(squares);
        var res = this.lifeCheck(neighbours);
        this.setState({
            history: history.concat([{squares:res}]),
            stepNumber: history.length
        })
    }

    // core function, count all the alive cell neighbours
    neighbourCount(squares){
        const repeat = (fn, n) => Array(n).fill(0).map(fn);
        const emptyObject = () => ({neighbours: 0, alive: false});
        const neighboursCreation = n => repeat(() => repeat(emptyObject, n), n);

        var neighbours = neighboursCreation(60);
        var width = neighbours.length;
        for (var x =0; x < width; x++){
            var height = neighbours[x].length
            for(var y = 0; y < height; y++){
                var neighbourCount = 0;
                for(var searchX = -1; searchX < 2; searchX++){
                    for(var searchY = -1; searchY < 2; searchY++){
                        // Don't count the cell we are on
                        if (searchX === 0 && searchY === 0){continue;} 

                        var xPos = x + searchX;
                        var yPos = y + searchY;
                        
                        // Looking at the condition where x is before 0, look at the end column (corner cases included)
                        if ((xPos < 0)){
                            // |-  Corner Case
                            if ((yPos) < 0){
                                if (squares[width-1][height-1] === 1){
                                    neighbourCount ++;
                                }
                            }else{
                                // |_ Corner Case
                                if ((yPos) > height-1){
                                    if (squares[width-1][0] === 1){
                                        neighbourCount ++;
                                    }
                                }else{
                                    // <| edge case
                                    if (squares[width-1][yPos] === 1){
                                        neighbourCount++;
                                    }
                                }
                            }
                        } else {
                            // If x is greater than the width of the table look in the first column (corner cases included)
                            if (xPos > width-1){
                                // -| Corner case
                                if ((yPos) < 0){
                                    if (squares[0][height-1] === 1){
                                        neighbourCount ++;
                                    }
                                }else{
                                    // _| Corner case
                                    if ((yPos) > height-1){
                                        if (squares[0][0] === 1){
                                            neighbourCount ++;
                                        }
                                    }else{
                                        // |> Edge case
                                        if (squares[0][yPos] === 1){
                                            neighbourCount++;
                                        }
                                    }
                                }
                            }else{
                                // Top case _^
                                if ((yPos) < 0){
                                    if (squares[xPos][height-1] === 1){
                                            neighbourCount++;
                                        }            
                                } else{
                                    // Bottom case -
                                    if ((yPos> height-1)){
                                        if (squares[xPos][0] === 1){
                                                neighbourCount++;
                                            }
                                    }else{
                                        // Normal case
                                        if (squares[xPos][yPos] === 1){
                                            neighbourCount++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }  
                // counted now add it to the results array
                neighbours[x][y] = {neighbours : neighbourCount, alive: squares[x][y]};
            }
        }
        return neighbours;
    }

    lifeCheck(cells){
        const repeat = (fn, n) => Array(n).fill(0).map(fn);
        const emptyObject = () => (0);
        const lifeCreation = n => repeat(() => repeat(emptyObject, n), n);
        var res = lifeCreation(60);
        for (var x = 0; x < cells.length; x++) {
            for (var y = 0; y < cells[x].length; y++){
                var currentCell = cells[x][y]
                if (currentCell.neighbours > 1 && currentCell.neighbours < 4 && currentCell.alive === 1){
                    res[x][y] = 1;
                } else{
                    if (currentCell.alive === 0 && currentCell.neighbours == 3){
                        res[x][y] = 1;
                    }
                }
            }
        }
        return res
    }

    start() {
        if (!this.state.running) {
            var interval = setInterval(this.step, this.state.intervaltime);
            this.setState({
                interval: interval,
                running: !this.state.running
            })
        }
    }

    stop() {
        if (this.state.running) {
            clearInterval(this.state.interval);
            this.setState({
                running : !this.state.running
            })
        }
    }

    // Just add a new empty array to history (only when !running)
    clear() {     
        if (!this.state.running){
            const history = this.state.history.slice(0, this.state.stepNumber + 1);
            const squares = new Array(60).fill(new Array(60).fill(0));
            this.setState({
                history : history.concat([{squares: squares}]),
                stepNumber: history.length
            })
        }

    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        /*const moves = history.map((step, move) => {
        const desc = move ?
            'Move #' + move :
            'Game start';
        return (
                <li key={move}>
                <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });*/


        return (

            <div className="game">
                <div className="button row">
                    <button onClick={() => this.random()}>Random</button>
                    <button onClick={() => this.step(this)}>Step</button>
                    <button onClick={() => this.start()}>Run</button>
                    <button onClick={() => this.stop()}>Stop</button>
                    <button onClick={() => this.clear()}>Clear</button>
                </div>

                <div className="game-board">
                    <Board squares=
                        {current.squares} onClick={(x,y) => this.handleClick(x,y)} />
                </div>
                {/*<div className="game-info">
                    <ol>{moves}</ol>
                </div>*/}
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
