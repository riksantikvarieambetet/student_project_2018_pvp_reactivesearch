import React, { Component } from 'react';
import Histoslider from 'histoslider';

class ReactiveHistoslider extends Component {

  // warning it might be temting to pase state from parent. DONT it will make Histoslider chrach! 
  constructor(props) {
    super(props);
    this.state = {
      value: [0, 100] // testing sliders
    };
  }

  setValueRange = (newValue) => {
    this.setState({ value: newValue });
    this.updateQuery()
    // this.props.setParentValueRange(newValue); // TODO remove not needed because we set the range in this scope 
  }

  updateQuery = () => {
    this.props.setQuery(
      {
        "nested": {
          "path": "googleVision.responses.labelAnnotations",
          "query": {
            "bool": {
              "must": {
                "range": {
                  "googleVision.responses.labelAnnotations.score": {
                    "lte": this.state.value[1],
                    "gte": this.state.value[0]
                  }
                }
              }
            }
          }
        }
      }
    );
  }

  render() {
    let histosliderData = [];
    let mappedHistosliderData = [];
    if (this.props.aggregations) {
      histosliderData = this.props.aggregations.labelAnnotations.inner ?
        this.props.aggregations.labelAnnotations.inner.score.buckets
        : this.props.aggregations.labelAnnotations.score.buckets;

      histosliderData.map((item) => {
        mappedHistosliderData.push({ x0: item.key, x: item.key + 5, y: item.doc_count })
      })
      // console.log(mappedHistosliderData)
      return (
        <div>
          <Histoslider
            data={mappedHistosliderData}
            padding={20}
            width={200}
            height={100}
            selection={this.state.value}
            onChange={this.setValueRange}
          />
        </div>

      )
    }
    return null;
  }
}

/* &&
  this.props.aggregations.labels.score.buckets.length > 0 &&
  this.props.aggregations.labels.labels.buckets.length > 0 */

export default ReactiveHistoslider;