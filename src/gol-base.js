import React from 'react';
var classNames = require( 'classnames' );


class Game extends React.Component {
    constructor(dimensions) {
        super(dimensions);
        this.state = {
            height:dimensions.gridHeight,
            width:dimensions.gridWidth,
            history: [{squares:Array(dimensions.gridWidth*dimensions.gridHeight).fill(0)}],
            stepNumber: 0,
            interval: null,
            intervalTime: 10,
            running: false,
        }
        this.step = this.step.bind(this)
    }

    handleClick = (x) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        
        console.log("Setting" + x )
        squares[x] = squares[x] === 0 ? 1: 0;
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
        });
    }

    jumpTo = (step) => {
        this.setState({
        stepNumber: step,
        });
    }

    // Randomly fill the squares array with 0's and 1's
    random = () => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares =  Array.from({length: this.state.width*this.state.height}, () => Math.round(Math.random() * 1));
        this.setState({
            history: history.concat([{squares : squares}]),
            stepNumber: history.length,

        })
    }

    step = () =>  {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice()
        var neighbours = this.neighbourCount(squares);
        var res = this.lifeCheck(neighbours);
        this.setState({
            history: history.concat([{squares:res}]),
            stepNumber: history.length
        })
    }

    // core function, count all the alive cell neighbours
    neighbourCount = (squares) => {

        var width = this.state.width;
        var height = this.state.height;
        var neighboursArray = new Array(width*height).fill({neighbours: 0, alive: false});
        for (var i = 0; i < squares.length; i++) {
            var neighbours = 0;
            var ypos = Math.floor(i / width) + 1;
            var xpos = (i - ((ypos - 1) * width)) + 1;

            for (var j = -1; j < 2; j++) {
                var searchy = ypos + j;
                for (var k = -1; k < 2; k++) {
                    var searchx = xpos + k;

                    if (searchx === xpos && searchy === ypos) continue;
                    if (searchx > 0 && searchx < (width + 1) && searchy > 0 && searchy < (height + 1)) {
                        if (squares[(searchx + (((searchy - 1) * width)) - 1)]) {
                            neighbours++;
                        }
                    } else {

                        if (searchx < 1) {
                            if (searchy < 1) {
                                if (squares[(height * width) - 1]) {
                                    neighbours++;
                                }
                            } else {

                                if (searchy > height) {
                                    if (squares[width - 1]) {
                                        neighbours++;
                                    }
                                }
                                else {
                                    if (squares[(searchy * width) - 1]) {
                                        neighbours++;
                                    }
                                }
                            }
                        } else {
                            if (searchx > width) {
                                if (searchy < 1) {
                                    if (squares[((height * width)) - width]) {
                                        neighbours++;
                                    }
                                } else {
                                    if (searchy > height) {
                                        if (squares[0]) {
                                            neighbours++;
                                        }
                                    }
                                    else {
                                        if (squares[(searchy - 1) * width]) {
                                            neighbours++;
                                        }
                                    }
                                }
                            } else {
                                if (searchy < 1) {
                                    if (squares[(((width * height) - 1) - width) + searchx]) {
                                        neighbours++;
                                    }
                                } else {
                                    if (searchy > height) {
                                        if (squares[searchx - 1]) {
                                            neighbours++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            neighboursArray[i] = {neighbours : neighbours, alive: squares[i]};
        }

        return neighboursArray;
    }

    lifeCheck = (cells) => { 
        var width = this.state.width;
        var height = this.state.height;
        var res = new Array(width*height).fill(0);
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++){
                var currentCell = cells[(x + ((y) * width))];
                if (currentCell.neighbours > 1 && currentCell.neighbours < 4 && currentCell.alive === 1){
                    res[(x + ((y) * width))] = 1;
                } else{
                    if (currentCell.alive === 0 && currentCell.neighbours === 3){
                        res[(x + ((y) * width))] = 1;
                    }
                }
            }
        }
        return res
    }

    start = () => {
        if (!this.state.running) {
            var interval = setInterval(this.step, this.state.intervaltime);
            this.setState({
                interval: interval,
                running: !this.state.running
            })
        }
    }

    stop = () => {
        if (this.state.running) {
            clearInterval(this.state.interval);
            this.setState({
                running : !this.state.running
            })
        }
    }

    // Just add a new empty array to history (only when !running)
    clear = () =>  {     
        if (!this.state.running){
            const history = this.state.history.slice(0, this.state.stepNumber + 1);
            const squares = new Array(this.state.height*this.state.width).fill(0);
            this.setState({
                history : history.concat([{squares: squares}]),
                stepNumber: history.length
            })
        }

    }

    render = () => {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        return (
            <div className="game container-fluid">
                <div className="button row">
                    <button onClick={() => this.random()}>Random</button>
                    <button onClick={() => this.step(this)}>Step</button>
                    <button onClick={() => this.start()}>Run</button>
                    <button onClick={() => this.stop()}>Stop</button>
                    <button onClick={() => this.clear()}>Clear</button>
                </div>

                    <div className="game-board ">
                        <Board squares=
                            {current.squares} width={this.state.width} onClick={(x) => this.handleClick(x)} />
                    </div>
                </div>
                



        );
    }
}

class Board extends React.Component {

    renderSquare = (x) =>  {
        var btnClass = classNames({
            'square': true,
            'alive': this.props.squares[x] === 1
        });
        return <Square key={x} class={btnClass} onClick={() => this.props.onClick(x)} />;
    }

    renderRow = (index) => {
        var squares = [];
        for (var i = index; i < index+this.props.width; i++) {
            squares.push(this.renderSquare(i))
        }
        return (<div className="board-row row" key={ index/this.props.width }>  
            {squares}            
        </div>)
    }

    render = () => {
        return (
            <div>
                {this.props.squares.filter( function(rowItem, squareIndex)
                {
                    if (squareIndex % this.props.width === 0){
                        return true; 
                    }
                  },this).map(function(rowItem, squareIndex){
                      return(this.renderRow(squareIndex*this.props.width))
                  },this) }
            </div>
        )
    }
}

function Square(props) {
    return (
        <button className={props.class} title={props.key} key={props.key} onClick={props.onClick} >
        </button>
    );
}


export default Game;
