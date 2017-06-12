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
        }
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
