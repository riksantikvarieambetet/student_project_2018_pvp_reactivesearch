import React, { Component } from 'react';
import Histoslider from 'histoslider';

class ReactiveHistoslider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: [0, 100]
    };
  }

  onSliderChange = (value) => {
    this.setState({
      value,
    });
  }

  render() {
    console.dir(this.props)
    return (
      <Histoslider
        // An array of objects to create the histogram

        data={[
          {
            x0: 0,    // Start of the bucket
            x: 1,     // End of the bucket
            y: 100    // Value
          },
          {
            x0: 1,    // Start of the bucket
            x: 2,     // End of the bucket
            y: 120    // Value
          }

        ]}
        // How much to pad the slider and histogram by, defaults to 20
        padding={20}
        width={300}

        // The end of the histogram, defaults to the maximum value in the array

        // The extent of the selection, this doesn't have to be sorted (and you shouldn't sort it to store it)
        selection={this.state.value}
        // A function to handle a change in the selection
        onChange={this.onSliderChange}
      />
    )

  }
}

/* &&
  this.props.aggregations.labels.score.buckets.length > 0 &&
  this.props.aggregations.labels.labels.buckets.length > 0 */

export default ReactiveHistoslider;