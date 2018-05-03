import React, { Component } from 'react';
import Flex from '@appbaseio/reactivesearch/lib/styles/Flex';


class HSLThresholdSliders extends Component {

  render() {
    return (
      <div className="slidecontainer" style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
        <div>
          <input className="slider" style={{ float: "left", width: "75%" }} type="range" value={this.props.h} max="359" onChange={this.props.setH} onMouseUp={this.props.updateQuery}
          />
          <div style={{ float: "right" }}>{this.props.h} H</div>
        </div>
        <div>
          <input className="slider" style={{ float: "left", width: "75%" }} type="range" value={this.props.s} max="100" onChange={this.props.setS} onMouseUp={this.props.updateQuery} />
          <div style={{ float: "right" }}>{this.props.s} S</div>
        </div>
        <div>
          <input className="slider" style={{ float: "left", width: "75%" }} type="range" value={this.props.l} max="100" onChange={this.props.setL} onMouseUp={this.props.updateQuery} />
          <div style={{ float: "right" }}>{this.props.l} L</div>
        </div>
      </div>
    );
  }
}

export default HSLThresholdSliders;