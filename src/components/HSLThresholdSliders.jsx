import React, { Component } from 'react';
import Flex from '@appbaseio/reactivesearch/lib/styles/Flex';


class ColorStrip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      h_Threshold: 15,
      s_Threshold: 25,
      l_Threshold: 15,
    };
  }

  handleHChange = (event) => {
    this.setState({ h_Threshold: event.target.value })
  }

  handleSChange = (event) => {
    this.setState({ s_Threshold: event.target.value })
  }

  handleLChange = (event) => {
    this.setState({ l_Threshold: event.target.value })
  }

  render() {

    return (
      <div className="slidecontainer" style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
        <div>
          <input className="slider" style={{ float: "left", width: "75%" }} type="range" value={this.state.h_Threshold} max="359" onChange={this.handleHChange} onMouseUp={() => this.props.setH(this.state.h_Threshold)} />
          <div style={{ float: "right" }}>{this.state.h_Threshold} H</div>
        </div>
        <div>
          <input className="slider" style={{ float: "left", width: "75%" }} type="range" value={this.state.s_Threshold} max="100" onChange={this.handleSChange} onMouseUp={() => this.props.setS(this.state.s_Threshold)} />
          <div style={{ float: "right" }}>{this.state.s_Threshold} S</div>
        </div>
        <div>
          <input className="slider" style={{ float: "left", width: "75%" }} type="range" value={this.state.l_Threshold} max="100" onChange={this.handleLChange} onMouseUp={() => this.props.setL(this.state.l_Threshold)} />
          <div style={{ float: "right" }}>{this.state.l_Threshold} L</div>
        </div>
      </div>
    );
  }
}

export default ColorStrip;