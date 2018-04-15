import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LabelListItem from './LabelListItem'

import { ReactiveList } from '@appbaseio/reactivesearch';


class LabelAnnotationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedLabels: new Set()
    };
  }

  setSelectedLabels = (label) => {
    if (this.state.selectedLabels.has(label)) {
      this.state.selectedLabels.delete(label);
    } else {
      this.state.selectedLabels.add(label);
    }
    let query = this.buildQuery()
    this.props.setAppstateQuery(query)
    this.updateQuery(query)
  }

  buildQuery = () => {
    let labels = Array.from(this.state.selectedLabels)
    let queryMusts = [];
    labels.map((label) => {
      queryMusts.push(
        {
          "nested": {
            "path": "googleVision.responses.labelAnnotations",
            "query": {
              "bool": {
                "must": [
                  {
                    "range": {
                      "googleVision.responses.labelAnnotations.score": {
                        "lte": 100,
                        "gte": 0
                      }
                    }
                  },
                  {
                    "term": {
                      "googleVision.responses.labelAnnotations.description.keyword": label
                    }
                  }
                ]
              }
            }
          }
        });
    });
    return queryMusts;
  }

  updateQuery = (musts) => {
    this.props.setQuery(
      {
        "query": {
          "bool": {
            "must": musts
          }
        },
        value: Array.from(this.state.selectedLabels)
      }
    );
  }

  createLabelListItems = (buckets) => {
    return (buckets.map(item =>
      <LabelListItem
        key={item.key}
        handleItemChange={this.setSelectedLabels}
        label={item.key}
        count={item.doc_count}
        onChange={this.setSelectedLabels}
        initialState={this.state.selectedLabels.has(item.key) ? true : false}
      />
    ));
  }

  render() {
    if (this.props.aggregations) {
      return (
        this.createLabelListItems(this.props.aggregations.labels.labels.buckets)
      )
    }
    return null;
  }
}

export default LabelAnnotationList;