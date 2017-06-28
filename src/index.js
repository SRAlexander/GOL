import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Game from './gol-base';
import GameRules from './gol-rules';
import './index.css';

class Registration extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
      var res = this.props.state.ActiveComponent(this.props.gridWidth, this.props.gridHeight);
    return (
        <div>
      {res}
      </div>
    )
  }
}

let versions = [
  {"Title": "Basic", "ActiveComponent": (width, height) => <Game gridWidth={width} gridHeight={height}/>},
  {"Title": "Rule Exploration", "ActiveComponent": (width, height) => <GameRules gridWidth={width} gridHeight={height}/>}
]

let state = versions[0];

// ========================================

ReactDOM.render(
    <Registration state={state} gridWidth={40} gridHeight={40}/>,
    document.getElementById('root')
);
