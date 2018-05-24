import React, { Component } from 'react';


class HSLThresholdSliders extends Component {

  slider = (value, onChange, max, text) => {
    return (
      <div>
        <input className="slider" style={{ float: "left", width: "75%" }} type="range" value={value} max={max} onChange={onChange} onMouseUp={this.props.updateQuery} />
        <div style={{ float: "right" }}>{this.props.h} {text}</div>
      </div>
    )
  }
  render() {
    return (
      <div className="slidecontainer" style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
        {this.slider(this.props.h, this.props.setH, "359", "H")}
        {this.slider(this.props.s, this.props.setS, "359", "S")}
        {this.slider(this.props.l, this.props.setL, "359", "L")}
      </div>
    );
  }
}

export default HSLThresholdSliders;