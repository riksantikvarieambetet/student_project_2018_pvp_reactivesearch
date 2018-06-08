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
    let bucketAggregate = [];
    let HistosliderFormat = [];
    let sumOfYAxis = 0;
    if (this.props.aggregations) {
      // The query returns a inner score due to filtering based on selected labels 
      // that are not present if no labels are selected.
      // In other words the structure of the aggregate depends on the query (ReactiveHistosliderQueries default query).
      bucketAggregate = this.props.aggregations.labelAnnotations.inner ?
        this.props.aggregations.labelAnnotations.inner.score.buckets
        : this.props.aggregations.labelAnnotations.score.buckets;

      bucketAggregate.forEach(element => {
        HistosliderFormat.push({ x0: element.key, x: element.key + 5, y: element.doc_count });
        sumOfYAxis += element.doc_count;
      });

      // Histoslider contains a quirk where the sum of the Y axis can’t be zero, so we return null in such cases.
      // The sum is sometimes zero because of searches via text that returns zero hits.
      if (sumOfYAxis === 0) {
        return null;
      }

      return (
        <div
          onMouseUp={this.props.updateQuery}
          style={{ "marginBottom": "40px" }}
        >
          <h2 className="headings">Label Confidence</h2>
          <Histoslider
            style={{ margin: "auto" }}
            data={HistosliderFormat}
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