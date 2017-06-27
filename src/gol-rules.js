import Game from './gol-base'

export class GameRules extends Game {
    random = () => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares =  new Array(this.state.width*this.state.height).fill(1);
        this.setState({
            history: history.concat([{squares : squares}]),
            stepNumber: history.length,

        })
    }
}

export default GameRules;
