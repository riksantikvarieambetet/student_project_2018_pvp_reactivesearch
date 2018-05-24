import React, { Component } from 'react';
import Histoslider from 'histoslider';


class ReactiveHistoslider extends Component {

  setValueRange = (newValue) => {
    if (!newValue) return;
    // this prevents the slider handles from over extending their range (overlapping).
    if (newValue[0] >= newValue[1]) {
      let temp = newValue[0];
      newValue[0] = newValue[1];
      newValue[1] = temp;
    }
    newValue[0] = Math.floor(newValue[0])
    newValue[1] = Math.floor(newValue[1])
    this.props.setParentValueRange(newValue);
  }

  render() {
    let histosliderData = [];
    let mappedHistosliderData = [];
    if (this.props.aggregations) {
      histosliderData = this.props.aggregations.labelAnnotations.inner ?
        this.props.aggregations.labelAnnotations.inner.score.buckets
        : this.props.aggregations.labelAnnotations.score.buckets;

      mappedHistosliderData = histosliderData.map((item) => {
        return ({ x0: item.key, x: item.key + 5, y: item.doc_count })
      })
      return (
        <div
          onMouseUp={this.props.updateQuery}
          style={{ "marginBottom": "40px" }}
        >
          <h2 className="headings">Label Confidence</h2>
          <Histoslider
            style={{ margin: "auto" }}
            data={mappedHistosliderData}
            padding={20}
            width={290}
            height={120}
            selection={this.props.rangeValue}
            onChange={this.setValueRange}
          />
        </div>
      )
    }
    return null;
  }
}

export default ReactiveHistoslider;